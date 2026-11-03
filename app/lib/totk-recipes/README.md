# Tears of the Kingdom recipes

Static catalogue of the 228 numbered recipes, 251 simulator materials, 19 effect collections and a client-side cooking simulator. The generic 229th Elixir lookup entry is not published as an extra recipe.

## Import

1. `python3 scripts/import-totk-recipes.py` (Pillow required): imports the public cooking tables and simulator, downloads images with three rate-limited workers, and converts images to local WebP files with descriptive `zelda-totk-…` names.
2. `node scripts/prepare-totk-recipes.cjs`: normalizes names/card numbers and searches the cooking rules for ingredient combinations. Every published cooking-pot/elixir example must resolve to the expected recipe number and effect in the calculator, or generation fails.

The import manifest in `docs/research/totk-recipes-import.json` records original URLs, checksums, dimensions and local filenames. Download caches live in `/tmp/finalboss-totk-recipes-cache`. There are no source-site requests at runtime.

The 433 available images comprise 227 meal icons and 206 ingredient icons, totaling 2,759,108 bytes after conversion. Recipe #201 has no meal icon in the source mapping: its page/card shows the raw ingredient image and labels it as such. The 45 simulator materials without source icons use a small neutral symbol and their visible name. Source image #200 has an inconsistent filename; its local filename follows its actual numbered recipe identity. Warm Milk likewise receives its normal recipe name rather than the generic source table label.

## Routes and SEO

- `/game/the-legend-of-zelda-tears-of-the-kingdom/recipes`
- `…/recipes/page/2` (24 recipes per page)
- `…/recipes/effect/attack-up` and effect pagination
- `…/recipes/apple-pie` (one canonical page per numbered dish)
- `…/recipes/cooking-simulator`

All catalogue pages, category pages and details render useful content on the server and appear in `/game/sitemap.xml`. Search/method/ingredient queries are `noindex, follow`; canonical collections use paths. Page-one pagination aliases redirect via `next.config.js` with a real HTTP Location header. Selected effect combinations use URL fragments on detail links, so they share the dish's canonical URL. JSON-LD uses CollectionPage/ItemList, CreativeWork and BreadcrumbList; fictional game dishes are not marked up as recipes for human consumption.

The larger simulator data/engine chunks load only when the user first calculates a result on the simulator. The calculator has five slots, supports repeated materials, and rejects invalid preset query values. Normal values and conditional bonus outcomes are displayed separately. A mobile cooking bar appears when the main Cook button is outside the viewport.

## Data limits

The examples are reproducible combinations, not an exhaustive enumeration or a claim of optimal inventory cost. Ingredient filtering explicitly matches the default shown examples. The 51 roasted foods, 16 frozen foods and hot-spring egg have separate preparation instructions; the cooking-pot engine cannot produce them. Their pot-specific statistics are therefore not invented.

Calculator results were checked against 84 independently generated fixtures from the upstream Python implementation; its commit is stored with the fixtures. That comparison does not constitute in-game testing.

## Advertising

Catalogue pages reuse the verified Journey content-marker registration used by builds. Two full-width islands after cards 8 and 16 on a full page; shorter collections have at most one, and short results have none. No additional loader or placeholder ads are added. Real ad fill remains a production/provider check.

## Validation

- `node --test tests/totk-recipes/*.test.mjs`
- `npx tsc --noEmit`
- Scoped Next ESLint for the new components, library and routes
- `TOTK_TEST_PRODUCTION=1 TOTK_TEST_BASE_URL=http://127.0.0.1:3188 /tmp/finalboss-totk-browser-env/bin/python tests/totk-recipes/browser.py`
- `npm run build`

Browser checks block third-party traffic. They cover desktop/mobile/tablet layouts, search, methods, ingredients, effect deep links, simulator presets and duplicate inputs, image responses, all 228 items reachable without JavaScript, canonical/schema pagination, noindex queries, sitemap membership and invalid routes.
