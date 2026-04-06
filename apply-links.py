#!/usr/bin/env python3
"""
WordPress Smart Link Applier — v2
==================================
Reads a link-plan.json (curated by Claude AI) and applies the planned
internal links to WordPress posts via the REST API.

Unlike linker-template.py (v1) which does blind keyword matching,
this script applies pre-analyzed, contextually relevant links with
custom anchor text chosen by the AI.

Usage:
  python3 apply-links.py                      # Apply all planned links
  python3 apply-links.py --dry-run            # Preview without updating
  python3 apply-links.py --post=123           # Apply to single post
  python3 apply-links.py --dry-run --post=123 # Preview single post

Requires:
  - wp-linking-config.json (credentials + settings)
  - link-plan.json (AI-curated link plan)
"""

import json
import os
import re
import sys
import time

import requests

# ── Load configuration ────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CWD = os.getcwd()


def find_file(name):
    """Find a config file in CWD or script directory."""
    for path in [os.path.join(CWD, name), os.path.join(SCRIPT_DIR, name)]:
        if os.path.exists(path):
            return path
    return None


def load_config():
    """Load WordPress API credentials."""
    path = os.environ.get("WP_LINKING_CONFIG", find_file("wp-linking-config.json"))
    if not path or not os.path.exists(path):
        print("ERROR: wp-linking-config.json not found")
        sys.exit(1)
    with open(path) as f:
        config = json.load(f)
    for key in ["wp_api_url", "wp_username", "wp_app_password"]:
        if key not in config:
            print(f"ERROR: Missing required config key: {key}")
            sys.exit(1)
    return config


def load_link_plan():
    """Load the AI-curated link plan."""
    path = os.environ.get("LINK_PLAN", find_file("link-plan.json"))
    if not path or not os.path.exists(path):
        print("ERROR: link-plan.json not found")
        print("Run the Smart Link Analysis phase first to generate the plan.")
        sys.exit(1)
    with open(path) as f:
        return json.load(f)


# ── HTML protection ───────────────────────────────────────────────────


def get_protected_ranges(html):
    """Identify ranges in HTML where links must NOT be inserted.

    Protected zones:
    - Existing <a>...</a> tags
    - Headings <h1>...</h6>
    - Script, style, code, pre blocks
    - Figure captions
    - All HTML tags themselves (prevents matching inside attributes)
    """
    protected = []

    # Existing links
    for m in re.finditer(r"<a\b[^>]*>.*?</a>", html, re.DOTALL | re.IGNORECASE):
        protected.append((m.start(), m.end()))

    # Headings
    for m in re.finditer(
        r"<h[1-6]\b[^>]*>.*?</h[1-6]>", html, re.DOTALL | re.IGNORECASE
    ):
        protected.append((m.start(), m.end()))

    # HTML tags (attributes, tag names)
    for m in re.finditer(r"<[^>]+>", html):
        protected.append((m.start(), m.end()))

    # Block-level protected elements
    for tag in ("script", "style", "code", "pre", "figcaption"):
        for m in re.finditer(
            rf"<{tag}\b[^>]*>.*?</{tag}>", html, re.DOTALL | re.IGNORECASE
        ):
            protected.append((m.start(), m.end()))

    # Sort and merge overlapping
    protected.sort()
    merged = []
    for start, end in protected:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def is_in_protected(pos, length, protected_ranges):
    """Check if a character range overlaps any protected zone."""
    end = pos + length
    for ps, pe in protected_ranges:
        if pos < pe and end > ps:
            return True
        if ps > end:
            break
    return False


# ── Link insertion ────────────────────────────────────────────────────


def insert_link(html, search_term, anchor_text, url, protected_ranges, linked_urls):
    """Insert <a href> around the first unprotected occurrence of search_term.

    The anchor_text may differ from search_term if the AI chose an extended
    phrase. In that case, we try anchor_text first, then fall back to search_term.

    Returns (new_html, was_linked, updated_protected_ranges).
    """
    if url in linked_urls:
        return html, False, protected_ranges

    # Try anchor_text first (may be longer/better), then search_term
    terms_to_try = [anchor_text]
    if anchor_text != search_term:
        terms_to_try.append(search_term)

    for term in terms_to_try:
        # Build regex pattern
        if len(term) <= 3 and term.isupper():
            pattern = rf"(?<![A-Za-z/\-]){re.escape(term)}(?![A-Za-z\-])"
            flags = 0
        else:
            pattern = rf"(?<![A-Za-zÀ-ÿ]){re.escape(term)}(?![A-Za-zÀ-ÿ])"
            flags = re.IGNORECASE

        for m in re.finditer(pattern, html, flags):
            pos = m.start()
            length = m.end() - m.start()

            if is_in_protected(pos, length, protected_ranges):
                continue

            matched_text = m.group(0)
            link = f'<a href="{url}">{matched_text}</a>'
            new_html = html[:pos] + link + html[pos + length:]

            # Shift protected ranges after the insertion point
            shift = len(link) - length
            new_protected = []
            for ps, pe in protected_ranges:
                if ps >= pos + length:
                    new_protected.append((ps + shift, pe + shift))
                elif pe <= pos:
                    new_protected.append((ps, pe))
                else:
                    new_protected.append((ps, pe))

            # Mark the new link as protected
            new_protected.append((pos, pos + len(link)))
            new_protected.sort()

            # Merge overlapping
            merged = []
            for s, e in new_protected:
                if merged and s <= merged[-1][1]:
                    merged[-1] = (merged[-1][0], max(merged[-1][1], e))
                else:
                    merged.append((s, e))

            linked_urls.add(url)
            return new_html, True, merged

    return html, False, protected_ranges


# ── WordPress API ─────────────────────────────────────────────────────


def fetch_post_content(config, post_id):
    """Fetch a single post's content from WordPress."""
    resp = requests.get(
        f"{config['wp_api_url']}/posts/{post_id}",
        params={"_fields": "id,slug,content"},
        auth=(config["wp_username"], config["wp_app_password"]),
    )
    if resp.status_code != 200:
        return None
    data = resp.json()
    return data.get("content", {}).get("rendered", "")


def update_post(config, post_id, new_content):
    """Update a post's content via WP REST API."""
    resp = requests.post(
        f"{config['wp_api_url']}/posts/{post_id}",
        json={"content": new_content},
        auth=(config["wp_username"], config["wp_app_password"]),
    )
    return resp.status_code == 200, resp.status_code


# ── Main ──────────────────────────────────────────────────────────────


def main():
    dry_run = "--dry-run" in sys.argv
    single_post = None
    for arg in sys.argv[1:]:
        if arg.startswith("--post="):
            single_post = int(arg.split("=")[1])

    config = load_config()
    plan = load_link_plan()

    if single_post:
        plan = [p for p in plan if p["post_id"] == single_post]
        if not plan:
            print(f"Post {single_post} not found in link plan!")
            return

    total_posts = len(plan)
    total_links_planned = sum(len(p.get("links", [])) for p in plan)

    print(f"Link plan loaded: {total_posts} posts, {total_links_planned} planned links")
    print(f"API: {config['wp_api_url']}")
    if dry_run:
        print("MODE: DRY RUN (no changes will be made)\n")
    else:
        print("MODE: LIVE (posts will be updated)\n")

    results = []
    total_updated = 0
    total_links_applied = 0
    total_links_skipped = 0
    link_target_counts = {}
    category_counts = {"entity": 0, "pillar": 0, "category": 0}

    for entry in plan:
        post_id = entry["post_id"]
        slug = entry.get("post_slug", "unknown")
        title = entry.get("post_title", slug)[:60]
        planned_links = entry.get("links", [])

        if not planned_links:
            print(f"[SKIP]    Post {post_id} ({slug}): no links planned")
            continue

        # Fetch current content
        content = fetch_post_content(config, post_id)
        if content is None:
            print(f"[ERROR]   Post {post_id} ({slug}): could not fetch content")
            continue

        if not content.strip():
            print(f"[SKIP]    Post {post_id} ({slug}): empty content")
            continue

        # Apply planned links
        protected_ranges = get_protected_ranges(content)
        linked_urls = set()
        links_applied = 0
        links_skipped = 0
        link_details = []

        # Sort by relevance (highest first)
        sorted_links = sorted(
            planned_links, key=lambda x: x.get("relevance", 0), reverse=True
        )

        max_links = entry.get("max_links", 50)

        for link_entry in sorted_links:
            if links_applied >= max_links:
                break

            target_url = link_entry["target_url"]
            search_term = link_entry["search_term"]
            anchor_text = link_entry.get("anchor_text", search_term)
            category = link_entry.get("category", "unknown")
            relevance = link_entry.get("relevance", 1.0)

            content, was_linked, protected_ranges = insert_link(
                content, search_term, anchor_text, target_url, protected_ranges, linked_urls
            )

            if was_linked:
                links_applied += 1
                total_links_applied += 1
                category_counts[category] = category_counts.get(category, 0) + 1
                link_target_counts[target_url] = link_target_counts.get(target_url, 0) + 1
                link_details.append(
                    {
                        "term": search_term,
                        "anchor": anchor_text,
                        "url": target_url,
                        "category": category,
                        "relevance": relevance,
                    }
                )
            else:
                links_skipped += 1
                total_links_skipped += 1

        if links_applied > 0:
            results.append(
                {
                    "id": post_id,
                    "slug": slug,
                    "title": title,
                    "links_applied": links_applied,
                    "links_skipped": links_skipped,
                    "details": link_details,
                }
            )

            if dry_run:
                print(f"[DRY RUN] Post {post_id} ({slug}): +{links_applied} links")
                for d in link_details:
                    anchor_info = (
                        f" (anchor: \"{d['anchor']}\")"
                        if d["anchor"] != d["term"]
                        else ""
                    )
                    url_short = "/".join(d["url"].split("/")[-2:])
                    print(
                        f'          "{d["term"]}"{anchor_info} -> {url_short} '
                        f'[{d["category"]}] (rel: {d["relevance"]:.1f})'
                    )
            else:
                success, status = update_post(config, post_id, content)
                if success:
                    print(f"[UPDATED] Post {post_id} ({slug}): +{links_applied} links")
                    total_updated += 1
                else:
                    print(f"[FAILED]  Post {post_id} ({slug}): HTTP {status}")
                time.sleep(0.5)  # Rate limiting
        else:
            if links_skipped > 0:
                print(
                    f"[SKIP]    Post {post_id} ({slug}): {links_skipped} planned links "
                    f"already present or not found"
                )
            else:
                print(f"[SKIP]    Post {post_id} ({slug}): no links applied")

    # ── Summary ───────────────────────────────────────────────────────
    print(f"\n{'=' * 60}")
    print("SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Posts in plan:         {total_posts}")
    print(f"  Posts with new links:  {len(results)}")
    if not dry_run:
        print(f"  Posts updated (API):   {total_updated}")
    print(f"  Links applied:         {total_links_applied}")
    print(f"  Links skipped:         {total_links_skipped}")
    print(f"    - Entity links:      {category_counts.get('entity', 0)}")
    print(f"    - Pillar links:      {category_counts.get('pillar', 0)}")
    print(f"    - Category links:    {category_counts.get('category', 0)}")

    if results:
        print(f"\nTop 10 posts by links applied:")
        for r in sorted(results, key=lambda x: -x["links_applied"])[:10]:
            print(f"  {r['id']:>5} | +{r['links_applied']:>2} | {r['title']}")

    if link_target_counts:
        print(f"\nTop 10 most-linked targets:")
        for url, count in sorted(
            link_target_counts.items(), key=lambda x: -x[1]
        )[:10]:
            short = "/".join(url.split("/")[-2:])
            print(f"  {count:>3}x | {short}")

    if total_links_skipped > 0:
        print(
            f"\nNote: {total_links_skipped} planned links were skipped (already present, "
            f"inside protected zones, or search term not found in content)."
        )


if __name__ == "__main__":
    main()
