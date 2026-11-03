# TOTK cooking inventory — 2026-11-03

Read-only inspection of the public cooking section on totk.wism.fr. No recipe pages or calculator have been added to FinalBoss by this investigation.

## Public sources

- Simulator: https://totk.wism.fr/cooking.html
- Overview: https://totk.wism.fr/totk-best-recipes.html
- Calculator data: https://totk.wism.fr/js/cookdata.json
- Public simulator scripts referenced by the cooking page, downloaded locally for inspection.
- English sitemap: 16 cooking URLs (simulator, overview, 14 guides by effect).

## Verified data inventory

- 251 selectable ingredients/materials, also present as 251 material records.
- 206 ingredient records contain an image filename; the remaining records use another UI fallback.
- Groups: 20 critters, 19 fish, 17 fruits, 6 meats, 93 monster materials, 14 mushrooms, 13 ores, 1 other, 18 plants, 36 spices, 14 Zonai materials. These are simulator categories, not necessarily edible ingredients.
- 158 multi-material cooking rules and 17 single-material rules, yielding 148 distinct result actor identifiers. Rule count is not a count of distinct recipe-book dishes.
- 229 unique entries in the recipe-card lookup: numbered entries 1–228, then a generic Elixir entry. The last entry must not become a separate numbered recipe page.
- 227 meal image mappings. Image counts do not prove full recipe coverage.
- 22 internal effect definitions; 14 public guides by effect.
- Localized names/descriptions, cooking tags, health/effect values, durations, prices, critical-success settings, and recipe conditions are present in the data.

## Local execution check

Loaded the public JavaScript calculator with the downloaded JSON in Node and ran three inputs successfully:

| Input | Calculated result | Recipe number | Hearts | Effect / duration | Sell price |
| --- | --- | --- | --- | --- | --- |
| Apple | Simmered Fruit | 47 | 1 | None | 3 |
| 5 × Mighty Bananas | Mighty Simmered Fruit | 47 | 5 | Attack Up / 04:10 | 44 |
| Raw Meat + Hylian Rice + Rock Salt | Meat and Rice Bowl | 94 | 4 | None | 18 |

This confirms that the exposed data and engine can run independently of the source UI. It does not establish in-game accuracy or exhaustive coverage of roasted/frozen dishes by cooking-pot rules.

## Integration shape

Use the full finite recipe-book inventory, rather than the half-selection used for builds. Normalize the recipe-card lookup and resolve names/effect-specific elixirs before publishing a dish count. Keep a single page per dish and handle ingredient combinations in the calculator, avoiding near-duplicate pages for every possible combination.

Potential section: `/game/the-legend-of-zelda-tears-of-the-kingdom/recipes`, retaining FinalBoss components and colors, with search, effect/ingredient filters, individual recipe pages, ingredient quantities, hearts, duration, and a calculator accepting up to five materials. Existing build descriptions remain unchanged.

## Implementation follow-up

The user subsequently authorized the complete section and requested recovered, renamed images with the existing FinalBoss UI. This is now implemented locally at the proposed path with 228 recipe pages, 19 effect collections, pagination, search, example-ingredient/method filters, and a five-slot simulator. There are 1,754 verified cooking-pot/elixir combinations after normalization. Environment-prepared foods have separate instructions and do not receive invented pot-calculator statistics.

433 source images have been downloaded, renamed and converted to local WebP assets (2,759,108 bytes total). The missing meal image for #201 is handled with an explicitly labeled raw-ingredient image. Materials without public icons retain visible names and a neutral icon. No runtime image requests go back to totk.wism.fr.

Production build: successful, 2,622 generated pages across the full application. The 315 canonical recipe-section URLs each have a unique title and meta description, a self-referencing canonical, one H1 and no unintended noindex. Twenty page-one aliases redirect to their canonical collection. The section is in the game sitemap, header/mobile menu, footer, games index, Zelda page and builds navigation. The larger calculator chunks are loaded only on the first calculation.

Five focused Node tests validate the complete inventory, every advertised combination, duplicate/invalid/state-reset behavior, 84 independent Python reference fixtures, and every imported image. Existing build Node/Python regression checks also pass. Browser tests cover desktop, mobile, tablet and no-JavaScript discovery; no live ad-fill result is claimed. Full implementation notes are in `app/lib/totk-recipes/README.md`.

This work is local only; no production deployment was performed.
