# Guide discovery correction — 4 November 2026

Production version: `e3bbe64c-e4f0-49b2-a204-22cd53050809`. Source commits: `82bf82c` and `f1648b8`. Previous production version: `316b2c9b-70fd-4bbc-b624-08742438cfe0`.

## Cause and resulting behavior

- `/guides` was a build-time snapshot with a year-long shared-cache lifetime. It now has one-hour ISR plus publication-driven invalidation.
- Its load-more query omitted the cursor argument and the client discarded the SSR cursor. Pagination now advances from the rendered page, deduplicates results, guards concurrent clicks and supports retries without losing articles.
- The blanket `/guides/:slug` redirect intercepted all real guide categories. Category lookup now preserves real archives and permanently redirects only legacy article URLs. Category metadata and headings use the actual WordPress name.
- Normal game hubs fetched only 12 posts and offered no pagination. They now expose subsequent pages. The TOTK hub also links directly to its guide archive and full index, alongside the existing builds and recipes.
- The publication cron previously refreshed only 50 posts and only their article URLs, home and `/articles`. It now reads the full bounded window, resolves affected guide categories and game hubs, and refreshes those archives too. Authenticated operators can backfill with `lookbackMinutes`.
- The TOTK WordPress game term pointed to IGDB Collector’s Edition 237289. Only its IGDB metadata was corrected to the base game 119388; the term, slug and all 96 article associations were preserved.

## Validation

- Full Next/OpenNext production build: 2,622 routes.
- Targeted lint and build type checks pass.
- 22 focused cache-invalidation and existing Cloudflare policy/compatibility tests pass.
- Browser checks on the production build reach all 90 published guides from the general guide list, the real Zelda archive and the game hub; pagination terminates correctly.
- Browser checks cover a failed page request followed by retry, rapid clicks, legacy permanent HTTP redirects, correct game identity, mobile navigation, no horizontal overflow and no JavaScript errors.
- A previously hidden invalid paragraph wrapper around HTML excerpts was corrected to prevent hydration errors when the category route became reachable.
- The Next 14 compatibility script accepts the exact upstream safe manifest loader when the adapter has already patched it, while continuing to reject unsupported output. Existing image-transform and robots protections remain in place.

The existing local workspace’s unrelated modifications were preserved.

## Production verification

- Live desktop/mobile browser checks pass for all three discovery paths and find all 90 published guides. The hub expands through 36, 60, 84 and 96 articles, including the entire new collection.
- The real Zelda archive returns 200 at its own URL, reaches 90 guides, and stops paginating.
- The publication backfill checked 98 posts and refreshed 104 unique paths, including `/guides`, the Zelda archive and its game hub, with no failed invalidations.
- HTTP checks confirm the home page, general guides, Zelda archive, hub, builds and recipes return 200 with their expected canonical URLs. `/guides` no longer carries the former year-long cache lifetime. An unknown article returns 404.
- A live check reproduced OpenNext dropping `Location` from an already-cached legacy 308. A narrow Worker wrapper now restores that header only for those guide/article redirects; warm production responses are verified. Real archives and other redirects are unchanged. The wrapper reused the fully seeded build cache.
- Existing Cloudflare cache/queue bindings, image-transform restrictions and robots protections were retained.

Evidence: `live-verification.json`, `backfill-verification.json`, `browser-verification-local.txt`, `browser-verification-live.txt`, screenshots and the before/after game metadata snapshots.
