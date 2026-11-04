# Ocarina of Time Switch 2 guide preparation and hub

The remake has its own game hub at `/game/the-legend-of-zelda-ocarina-of-time-switch-2`, using IGDB 405460 and WordPress game 8813. The original hub remains tied to IGDB 1029; its incorrect Crystal Clocks 313092 mapping was corrected. The remake's editorial display name includes Switch 2 while retaining the official source name separately.

The guide explorer retains FinalBoss's gray/yellow design, card grid and accessible controls. It filters the complete published game collection before displaying 12 cards, supports six editorial types and searches titles, descriptive URL aliases and excerpts. Cursor pagination loads the entire game-post collection. TOTK's existing 121 guide collection, builds and recipes retain their routes and behavior.

The game-search creation endpoint and numeric 405460 route resolve to the remake hub. The original and remake share their IGDB display title, so deriving both routes from the title alone would send remake searches to the N64 hub. The numeric redirect sits outside the data-error boundary to preserve its permanent redirect response.

## Editorial state

- 61 new WordPress drafts, one existing public comparison refreshed at its existing URL.
- 62 English articles, 43,197 words and 335 links within the authoring corpus.
- Seven genuine IGDB illustrations, renamed and self-hosted as optimized WebP; 1,180,688 bytes total. Their served bytes were verified against the local optimized files.
- New articles retain explicit Switch 2 verification holds. Historical walkthroughs and N64 collectible inventories do not establish unchanged remake routes or totals. In particular, the new Water Temple key route needs direct verification.
- The public comparison links only to public pages. The index link is withheld from the live explorer until its article is published. Draft content was exercised only in a temporary local preview, removed before the production build.

The draft collection's overlapping editorial filter counts are 12 Dungeons, 12 Bosses, 20 Quests, 18 Equipment, 12 Collectibles and 13 Exploration. Those figures describe the full editorial corpus; the live hub initially contains one public guide, the refreshed comparison.

## Validation

- 28 focused unit/regression checks pass, including OOT search, existing guide discovery, Next 14 Cloudflare manifest compatibility and disabled image transformations.
- Lint and OpenNext production build pass. The existing Next 14 compatibility patch and Worker protections are retained.
- Private browser acceptance checks all 62 guides, all six result sets, incremental display, search beyond the first 12 cards, empty/reset behavior and mobile layout.
- 62 private previews generated from exact WordPress readbacks pass mobile checks. Long collectible tables remain scrollable.
- Public HTTP acceptance confirms eight routes, self-canonicals, edition routing, sampled draft privacy and the complete 121-guide TOTK collection. Public browser acceptance passes all six filter states, search, article navigation, visible media, mobile overflow and the existing TOTK Lynel search. No JavaScript errors were observed. Screenshots are in `screenshots/`.

## Production deployment

- Cloudflare Worker version: `12cdfeec-c931-4ac6-ba07-a5f04242599a`.
- Build ID: `TjPDRA6PZMeXd4aoSA8Lw`; runtime source commit: `81106e2`.
- All 5,566 immutable build-cache objects were verified by size and MD5 before activation. An initial bulk-upload 502 was recovered by uploading only the 1,030 missing objects.
- A post-deploy publication backfill refreshed reused CMS snapshots for the original OOT hub and the earlier TOTK guide expansion. Live acceptance confirms the corrected original-game mapping and all 121 TOTK guides.
- Future production builds clear only `.next/cache/fetch-cache` before fetching CMS data, preserving compiler caches. An isolated fixture verifies targeted deletion and safe repeated execution. This build-time prevention does not change the deployed runtime.
- The public comparison belongs to both game editions because it compares them. No new guide drafts have been made public.

Content and source evidence, all 62 WordPress edit links, backups and detailed reports are in the primary workspace's `docs/oot-switch2-2026-11-04/`. No GPBot jobs or external generation APIs were used. No WordPress Pages were created.
