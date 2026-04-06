#!/usr/bin/env python3
"""
Batch entity linker for finalboss.io
Links first mention of game names to their /game/ entity pages.
Also cross-links to pillar reviews when game names are mentioned.
"""
import json
import re
import sys
import time
import requests

CONFIG = {
    "api": "https://backend.finalboss.io/wp-json/wp/v2",
    "user": "Gaia",
    "pass": "3z4W 3J1w b9gU R0GZ SshT bDNp",
    "base": "https://finalboss.io"
}

# Game entities: term -> URL path
ENTITIES = {
    "Resident Evil Requiem": "/game/resident-evil-requiem",
    "Resident Evil: Requiem": "/game/resident-evil-requiem",
    "Arc Raiders": "/game/arc-raiders",
    "ARC Raiders": "/game/arc-raiders",
    "Marathon": "/game/marathon",
    "Pokemon Pokopia": "/game/pokemon-pokopia",
    "Pokémon Pokopia": "/game/pokemon-pokopia",
    "Slay the Spire 2": "/game/slay-the-spire-2",
    "Monster Hunter Stories 3": "/game/monster-hunter-stories-3",
    "Monster Hunter Wilds": "/game/monster-hunter-wilds",
    "Diablo 4": "/game/diablo-4",
    "Diablo IV": "/game/diablo-4",
    "Cyberpunk 2077": "/game/cyberpunk-2077",
    "Dragon's Dogma 2": "/game/dragons-dogma-2",
    "Blue Prince": "/game/blue-prince",
    "Helldivers 2": "/game/helldivers-2",
    "Counter-Strike 2": "/game/counter-strike-2",
    "Fortnite": "/game/fortnite",
    "Overwatch 2": "/game/overwatch-2",
    "Path of Exile 2": "/game/path-of-exile-2",
    "Dune Awakening": "/game/dune-awakening",
    "Dune: Awakening": "/game/dune-awakening",
    "Silent Hill f": "/game/silent-hill-f",
    "Genshin Impact": "/game/genshin-impact",
    "Ghost of Yotei": "/game/ghost-of-yotei",
    "Ghost of Tsushima": "/game/ghost-of-tsushima",
    "GTA 6": "/game/gta-vi",
    "GTA VI": "/game/gta-vi",
    "WWE 2K26": "/game/wwe-2k26",
    "Crimson Desert": "/game/crimson-desert",
    "Fatal Frame II": "/game/fatal-frame-ii-crimson-butterfly",
    "Elden Ring": "/game/elden-ring",
    "Stardew Valley": "/game/stardew-valley",
    "Valorant": "/game/valorant",
    "Minecraft": "/game/minecraft",
    "Baldur's Gate 3": "/game/baldurs-gate-3",
    "Palworld": "/game/palworld",
    "Star Citizen": "/game/star-citizen",
    "Lost Ark": "/game/lost-ark",
    "Destiny 2": "/game/destiny-2",
    "Nioh 3": "/game/nioh-3",
    "Hollow Knight: Silksong": "/game/hollow-knight-silksong",
    "Battlefield 6": "/game/battlefield-6",
    "Death Stranding 2": "/game/death-stranding-2",
    "Assassin's Creed Shadows": "/game/assassins-creed-shadows",
    "Pokémon Legends Z-A": "/game/pokemon-legends-z-a",
    "Pokemon Legends Z-A": "/game/pokemon-legends-z-a",
    "Disney Dreamlight Valley": "/game/disney-dreamlight-valley",
    "World of Warcraft": "/game/world-of-warcraft",
    "League of Legends": "/game/league-of-legends",
    "Monopoly Go": "/game/monopoly-go",
    "Monopoly GO": "/game/monopoly-go",
    "Roblox": "/game/roblox",
    "EA FC 26": "/game/ea-fc-26",
    "EA Sports FC 26": "/game/ea-fc-26",
}

# Sort by length (longest first) to match longer terms before shorter ones
SORTED_ENTITIES = sorted(ENTITIES.items(), key=lambda x: -len(x[0]))


def get_protected_ranges(html):
    protected = []
    for m in re.finditer(r"<a\b[^>]*>.*?</a>", html, re.DOTALL | re.IGNORECASE):
        protected.append((m.start(), m.end()))
    for m in re.finditer(r"<h[1-6]\b[^>]*>.*?</h[1-6]>", html, re.DOTALL | re.IGNORECASE):
        protected.append((m.start(), m.end()))
    for m in re.finditer(r"<[^>]+>", html):
        protected.append((m.start(), m.end()))
    for tag in ("script", "style", "code", "pre", "figcaption"):
        for m in re.finditer(rf"<{tag}\b[^>]*>.*?</{tag}>", html, re.DOTALL | re.IGNORECASE):
            protected.append((m.start(), m.end()))
    protected.sort()
    merged = []
    for start, end in protected:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def is_protected(pos, length, ranges):
    end = pos + length
    for ps, pe in ranges:
        if pos < pe and end > ps:
            return True
        if ps > end:
            break
    return False


def insert_link(html, term, url, protected, linked_urls):
    if url in linked_urls:
        return html, False, protected

    if len(term) <= 3 and term.isupper():
        pattern = rf"(?<![A-Za-z/\-]){re.escape(term)}(?![A-Za-z\-])"
        flags = 0
    else:
        pattern = rf"(?<![A-Za-zÀ-ÿ]){re.escape(term)}(?![A-Za-zÀ-ÿ])"
        flags = re.IGNORECASE

    for m in re.finditer(pattern, html, flags):
        pos, length = m.start(), m.end() - m.start()
        if is_protected(pos, length, protected):
            continue

        matched = m.group(0)
        link = f'<a href="{url}">{matched}</a>'
        new_html = html[:pos] + link + html[pos + length:]

        shift = len(link) - length
        new_protected = []
        for ps, pe in protected:
            if ps >= pos + length:
                new_protected.append((ps + shift, pe + shift))
            else:
                new_protected.append((ps, pe))
        new_protected.append((pos, pos + len(link)))
        new_protected.sort()

        merged = []
        for s, e in new_protected:
            if merged and s <= merged[-1][1]:
                merged[-1] = (merged[-1][0], max(merged[-1][1], e))
            else:
                merged.append((s, e))

        linked_urls.add(url)
        return new_html, True, merged

    return html, False, protected


def process_post(post_id, slug):
    auth = (CONFIG["user"], CONFIG["pass"])

    try:
        resp = requests.get(
            f"{CONFIG['api']}/posts/{post_id}",
            params={"_fields": "id,slug,content"},
            auth=auth,
            timeout=30
        )
        if resp.status_code != 200:
            return 0, f"fetch_error_{resp.status_code}"
        content = resp.json().get("content", {}).get("rendered", "")
    except Exception as e:
        return 0, f"fetch_exception"
    if not content.strip():
        return 0, "empty"

    protected = get_protected_ranges(content)
    linked_urls = set()
    links_added = 0

    # Try each entity (longest first)
    for term, path in SORTED_ENTITIES:
        url = CONFIG["base"] + path
        # Don't link if the post is about this game (slug contains game slug)
        game_slug = path.split("/")[-1]
        if game_slug in slug:
            continue

        content, was_linked, protected = insert_link(content, term, url, protected, linked_urls)
        if was_linked:
            links_added += 1

    if links_added > 0:
        try:
            resp = requests.post(
                f"{CONFIG['api']}/posts/{post_id}",
                json={"content": content},
                auth=auth,
                timeout=30
            )
            if resp.status_code == 200:
                return links_added, "ok"
            elif resp.status_code == 503:
                time.sleep(3)  # Back off on rate limit
                resp2 = requests.post(
                    f"{CONFIG['api']}/posts/{post_id}",
                    json={"content": content},
                    auth=auth,
                    timeout=30
                )
                if resp2.status_code == 200:
                    return links_added, "ok"
                return links_added, f"update_error_{resp2.status_code}"
            else:
                return links_added, f"update_error_{resp.status_code}"
        except Exception:
            return links_added, "update_exception"

    return 0, "no_matches"


def main():
    # Load all remaining article IDs
    all_posts = []
    for fname in ["/tmp/remaining-guides.json", "/tmp/remaining-reviews.json",
                  "/tmp/remaining-other.json", "/tmp/remaining-news.json"]:
        try:
            with open(fname) as f:
                posts = json.load(f)
                all_posts.extend(posts)
        except:
            pass

    # Optional: filter to specific file
    if len(sys.argv) > 1:
        fname = sys.argv[1]
        with open(fname) as f:
            all_posts = json.load(f)

    print(f"Processing {len(all_posts)} posts for entity linking...")

    ok = 0
    updated = 0
    total_links = 0
    errors = 0

    for i, post in enumerate(all_posts):
        pid = post["id"]
        slug = post["slug"]

        links, status = process_post(pid, slug)

        if status == "ok":
            updated += 1
            total_links += links
            print(f"[{i+1}/{len(all_posts)}] {pid} +{links} links")
        elif links == 0 and status == "no_matches":
            pass  # Silent skip
        else:
            if "error" in status:
                errors += 1
                print(f"[{i+1}/{len(all_posts)}] {pid} ERROR: {status}")

        ok += 1

        # Rate limit: 2 req/sec
        if updated > 0 and updated % 5 == 0:
            time.sleep(1)

    print(f"\n{'='*50}")
    print(f"DONE: {ok} processed, {updated} updated, {total_links} links added, {errors} errors")


if __name__ == "__main__":
    main()
