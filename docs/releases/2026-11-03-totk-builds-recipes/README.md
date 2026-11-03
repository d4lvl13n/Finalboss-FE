# FinalBoss TOTK builds and recipes — 3 November 2026

Production version `316b2c9b-70fd-4bbc-b624-08742438cfe0`, runtime commit `8ccb6a3`, deployed to both finalboss.io and www.finalboss.io. Previous production version: `ba15a5c9-37c4-41bd-8c20-f38935d1e007`.

## Published

- 600 curated Autobuilds with downloadable, offline-verified QR images, search, categories and budget/tested filters.
- All 228 numbered recipes, 19 effect collections, ingredient/method filters and a five-slot cooking simulator.
- 433 renamed, compressed local cooking images; original build QR images remain unchanged.
- Header/mobile menu, footer, games index, Zelda game page and cross-links between both sections.
- 974 canonical section URLs in the public game sitemap: 659 builds URLs and 315 recipe URLs.

## Production checks

The final version passes desktop/mobile/tablet browser checks, no-JavaScript discovery, the simulator and presets, search/filters, pagination, HTTP redirects, canonical URLs, structured data, invalid-route 404s, and exact checksums of sampled production images. The homepage returns 200 and includes both section links. All non-asset bindings match the prior production version; the Images binding remains absent. The existing retry-cleanup wrapper and image protections are retained.

34 Node tests and four importer Python tests pass. The full Next/OpenNext build generated 2,622 pages. Ad checks cover geometry and registration with third-party traffic blocked; real ad fill and revenue are not claimed.

## Runtime corrections found during publication

The first candidate (`0ba8a9e3-ccc5-446d-bcb0-10341c4a6df6`) exposed a Next 14/OpenNext fallback-rendering incompatibility: a dynamic require of the middleware manifest is unavailable in workerd. The previous version was restored immediately while reproducing it in an isolated remote preview. A guarded, repeatable post-build patch applies the upstream adapter's middleware handling for this project, which has no Next middleware or edge-function entries. Preview checks then confirmed homepage 200 and invalid-route 404. The patch is part of npm deploy/preview and has regression tests.

A subsequent production check found that OpenNext could retain a filter's noindex header in a shared cached response. The Worker now applies the robots policy after the shared cache lookup: canonical public pages stay indexable; search/filter/preset URLs remain noindex and use private, non-storing response headers. Tests reproduce a polluted cached response and verify that no unrelated pages, assets, errors or redirects are changed.

The final version was republished using the already seeded build cache and image assets. The source is integrated into main. The original local workspace's unrelated work was retained, and the compatibility/robots/retry fixes were copied back for future local deployments.

## Search Console

The game sitemap was already registered. Its public content now contains all new section URLs. A resubmission was attempted after successful live validation, but the connector returned Permission denied. No successful resubmission or completed Google indexing is claimed.

Evidence: `live-verification.json`, `catalogue-desktop.png`, and `simulator-desktop.png`.
