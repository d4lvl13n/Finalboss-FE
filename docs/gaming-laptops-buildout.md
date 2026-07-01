# Gaming Laptops — Full Build-Out Spec

Implementation plan to take the `/gaming-laptops` section from "live product/brand/category pages" to
a complete, SEO-strong property. Scope-by-scope; scopes are mostly independent/parallelizable after
Scope 0. Verification matches how the section was already built (tsc + dev-server render-check + sitemap).

**Active build (this round):** Scope 0, 1, 2, 4, 5, 7.
**Deferred (with triggers):** Scope 3 (comparisons), Scope 6 (finder), Scope 8 (benchmarks/AI) — see end.

---

## Current state (already shipped — do not rebuild)

- **Data layer** `app/lib/laptops/`: `types.ts`, `validate.ts` (build-time invariants), `queries.ts`,
  `categories.ts`, `format.ts`, `affiliate.ts`, `images.ts`, `data/*` (53 families / 77 configs, all
  `completeness: 'full'`), `data/images.generated.ts` (52 self-hosted images under `/public/laptops`).
- **Components** `app/components/laptops/`: `AmazonBox.tsx`, `LaptopCard.tsx`.
- **Pages** `app/gaming-laptops/`: `page.tsx` (index), `[slug]/page.tsx` (product), `best/[slug]/page.tsx`
  (categories), `brands/[brand]/page.tsx` (brand hubs), `sitemap.ts`. `robots.ts` registers the sitemap;
  header nav has "Laptops" (en/fr). Product/AggregateOffer/Breadcrumb/FAQ/ItemList JSON-LD in place.

### Key existing symbols (reuse, don't reinvent)

- `queries.ts`: `getAllFamilies`, `getFamily`, `getFamiliesByGpuTier`, `getFamiliesByPanel`,
  `getFamiliesByBrand`, `allBrands`, `gpuTiersWithCounts`, `familyGpuTiers`, `comparableFamilies`, `brandSlug`.
- `categories.ts`: `CATEGORIES`, `getCategory`, `categoryFamilies`, `listCategories`.
- `format.ts`: `gpuTierLabel`, `panelLabel`, `priceAsOf`, `startingPrice`, `startingPriceLabel`,
  `formatPrice`, `formatVerifiedDate`, `DATASET_DATE`.
- `images.ts`: `getLaptopImage(slug)`. `affiliate.ts`: `amazonLinkForConfig`, `GENERIC_AMAZON_LAPTOPS_URL`.
- `seo.ts`: `buildPageMetadata`, `absoluteUrl`.

### Conventions every scope must follow

- Server components + `export const revalidate = 3600` (ISR); `generateStaticParams` for dynamic routes.
- Pages read **only** through `queries.ts` / `categories.ts` / new registries — never the raw data arrays.
- Tailwind dark theme (`bg-gray-950`, amber accents). Page container starts with `pt-24` (clears fixed header).
- Each list/landing page: `BreadcrumbList` + `ItemList` JSON-LD. Content pages: appropriate schema.
- Per-scope verification: `node_modules/.bin/tsc --noEmit` clean for touched paths + dev-server render-check
  (HTTP 200 + key content; 404 on bad slug) + new URLs in the sitemap.
- Unknown-data policy: never invent specs; omit unknown fields.

---

## Scope 0 — Shared foundations (DO FIRST — unblocks 1, 4, 5)

### 0.1 Derived facets layer
- New `app/lib/laptops/facets.ts` deriving typed numeric/boolean signals from existing string fields:
  - `weightKg(family): number | null` (parse `build.weightKg`, "~2.65 kg (5.85 lb)" → 2.65)
  - `noiseGamingDb(family): number | null` (parse `thermals.noiseGamingDb`, "~57 dB(A)" → 57)
  - `batteryWh(family): number | null` (from `battery.capacityWh`)
  - `maxTgpW(family): number | null` (max `config.gpu.tgpWatts`)
  - booleans: `isOled`, `isMiniLed`, `ramUpgradeable` (`memory.upgradeable && !soldered`),
    `hasTwoSsdSlots` (`memory.ssdSlots >= 2`), `hasThunderbolt`, `hasMux` (MUX/Advanced-Optimus mention),
    `hasVaporChamber`, `noCoilWhine` (no reliability entry mentioning coil whine).
- Pure functions; return `null`/`false` when unparseable (callers filter/sort with nulls last).
- **Acceptance:** a node script prints non-null counts per facet over the 53 families with no exceptions; tsc clean.

### 0.2 Pros / cons data
- Add `pros?: string[]` and `cons?: string[]` (2–4 each) to `LaptopFamily` (types.ts).
- Populate for all 53 families — short scannable bullets synthesized from the existing `summary` +
  `reliability` + specs (e.g. "Full 175 W RTX 5090" / "Hot CPU under load (~100 °C)"). Delegate per data
  file (subagents add only the two arrays, preserving everything else). Validator already allows optional arrays.
- **Acceptance:** all 53 families have `pros` and `cons`; validator + tsc clean.

**Depends on:** none. **Blocks:** 1.4 (pros/cons display), 4 (facets).

---

## Scope 1 — SEO foundation upgrades (existing pages) — highest ROI/hour

### 1.1 `next/image` migration (CWV / LCP)
- Files: `LaptopCard.tsx`, `[slug]/page.tsx`. Replace `<img>` with `next/image`. Images are local
  (`/laptops/*`) ⇒ **no `next.config` remotePatterns needed.** Use `fill` + `sizes` inside the existing
  aspect/sized containers; `priority` on the product-page hero (LCP), lazy elsewhere. Keep the
  brand-label fallback when `getLaptopImage` is null.
- **Acceptance:** product-page CLS ≈ 0; hero served via `/_next/image` as AVIF/WebP.

### 1.2 Per-product OG image + Product `image` schema
- `[slug]` `generateMetadata`: `image: getLaptopImage(slug)?.url` (absoluteUrl ⇒ full https URL). Brand +
  category pages: OG image = first family's image. Add `image: absoluteUrl(img.url)` to the `Product` JSON-LD.
- **Acceptance:** Rich Results Test shows Product with image; social card uses the product shot.

### 1.3 Hub-and-spoke internal linking
- New `queries.ts` helper `categoriesForFamily(family)` → `CATEGORIES` whose filter matches (tiers, panel,
  size). Product page: an **"Also in"** row linking the brand hub + each matching category (+ glossary
  terms once Scope 2 ships). Brand/category pages: a small "Related" block.
- **Acceptance:** every product page links to brand + ≥2 categories; no orphans (all sitemap URLs reachable).

### 1.4 Pros / cons block + schema (needs 0.2)
- New `app/components/laptops/ProsCons.tsx`; render on product pages. Extend `Product` JSON-LD with
  Google's `positiveNotes` / `negativeNotes` (`ItemList`).
- **Acceptance:** pros/cons visible + in structured data.

### 1.5 Author / publisher E-E-A-T
- New `app/gaming-laptops/methodology/page.tsx` (sourcing, conflict register, "last verified" process).
- New `app/components/laptops/Byline.tsx` — "By FinalBoss Hardware · Last verified {date}" linking to
  methodology; render on product pages and from the existing Sources block. Add `publisher` (Organization
  + logo) and `author` to the page graph; consider a sitewide `Organization` node.
- **Acceptance:** byline + methodology live; publisher/author in schema; methodology linked from every product page.

### 1.6 Thin-content + breadcrumb schema + offers polish
- Extend the `Category` type with `intro` (2–3 unique sentences) + optional `buyingNote`; render on
  `best/[slug]` and a data-driven intro on brand hubs. Add `BreadcrumbList` JSON-LD to `best/[slug]` and
  `brands/[brand]`. `Product` offers: add `priceValidUntil` (lastVerified + 30d); drop `availability` if unverifiable.
- **Acceptance:** category/brand pages have unique copy + breadcrumb schema; offers validate.

**Depends on:** 0.2 (for 1.4).

---

## Scope 2 — Glossary / feature pages (Layer 7)

**Goal:** informational pages that are also the internal-link targets strengthening every product page.

- New `app/lib/laptops/glossary.ts` — registry `{ slug, term, aliases[], short, body, related[],
  relatedCategorySlug? }`. ~18–22 terms: MUX Switch, Advanced Optimus, DLSS 4, Multi Frame Generation,
  GPU TGP, Dynamic Boost, OLED, Mini LED, IPS, OLED vs Mini LED, Vapor Chamber, Liquid Metal, Coil Whine,
  G-SYNC, Arrow Lake-HX, Panther Lake, Wi-Fi 7, Thunderbolt 5, Soldered vs SO-DIMM RAM, RTX 5080 vs 5090.
- Routes: `glossary/page.tsx` (A–Z index) + `glossary/[slug]/page.tsx`. Each term page: definition, "why
  it matters when buying", and where `relatedCategorySlug` is set a live "Laptops with this" list
  (e.g. OLED → `categoryFamilies(getCategory('oled'))`).
- New `app/components/laptops/TermLinker.tsx` — auto-links the FIRST occurrence of each known term in
  product-page prose (`summary`, `tgpNote`, reliability) to the glossary; never inside headings/links.
- Schema: `DefinedTermSet` (index) + `DefinedTerm`/`Article` per page; `FAQPage` where the body has Q&A.
- Update `sitemap.ts` with glossary URLs.
- **Acceptance:** ~18–22 glossary pages; product pages link to ≥1–2 terms; tsc + render clean.

**Depends on:** none (coordinate the product-page edit with Scope 1.3 — one owner for the product page).

---

## Scope 4 — Problem / "best-for" collections (Layer 5, facet-driven)

**Goal:** intent pages driven by data fields competitors don't expose cleanly.

- Extend `CATEGORIES` (or add a parallel `COLLECTIONS` registry with the same `{ slug, title,
  description, filter, sort, intro }` shape) for facet pages (all sorts from `facets.ts`):
  best cooling (vaporChamber + low noise), quietest (noiseDb asc), most upgradeable (ramUpgradeable +
  hasTwoSsdSlots), best battery (batteryWh desc), best for Blender/Unreal (tier ≥ 5080 + RAM ≥ 32 +
  VRAM ≥ 16), no coil whine, two SSD slots, RAM upgradeable, Thunderbolt 5, MUX switch.
- Reuse the `best/[slug]` route + `LaptopCard`. Each needs a `sort` and a short unique `intro`; show the
  ranking metric on the card or a one-line "why it's here". Include in `listCategories()`/sitemap.
- **Acceptance:** ~10–15 collection pages, sensible rankings, unique intros, non-empty filter sets; tsc + render clean.

**Depends on:** 0.1 (facets). **Reuses:** 1.6 intro field.

---

## Scope 5 — Buying guides (Markdown-authored, live prices)

**Goal:** "best for / under $X" editorial rankings — **authored in markdown so they're easy to edit**,
but the prices/CTAs render live from the dataset so they never go stale.

- **Content:** `content/laptop-guides/*.md`, one file per guide, with frontmatter:
  ```md
  ---
  slug: best-gaming-laptops-under-1500
  title: Best Gaming Laptops Under $1,500 (2026)
  description: ...
  updated: 2026-06-29
  picks:
    - slug: lenovo-loq-15-2026
      note: Best overall value — RTX 5060 often under $1,000 on sale.
    - slug: msi-katana-15-hx
      note: ...
  faq:
    - q: ...
      a: ...
  ---
  (editorial markdown body: intro, how we chose, what to watch for, verdict)
  ```
- **Loader:** `app/lib/laptops/guides.ts` reads the `.md` files at build time, parses frontmatter + body,
  and **validates every `picks[].slug` exists in the dataset (fail the build on a bad slug)** — same
  fail-loud philosophy as `validate.ts`. Guides: Best Gaming Laptops 2026; under $1000 / $1500 / $2000;
  for College; for AAA Gaming; for Programming; for Streamers; for Content Creators.
- **Routes:** `guides/page.tsx` (hub) + `guides/[slug]/page.tsx`; `generateStaticParams` from the `.md`
  files. Render: title + description + body (markdown→HTML) + `picks` as ranked **live** rows
  (rank badge + image + current `startingPriceLabel` + `AmazonBox` + the editorial `note`). Prices come
  from `queries.ts`, so editing prose never touches pricing.
- **Editing workflow:** update a guide = edit its `.md` (prose) or `picks` list; new guide = drop a new
  `.md` file. No code change. Prices refresh from data on ISR revalidate.
- **Dependency (decision):** add `gray-matter` (frontmatter) + a markdown renderer (`react-markdown`,
  with `rehype-sanitize`). This is the one new dependency this round — justified vs hand-rolling YAML/markdown.
- Schema: `ItemList` (ranked picks) + `BreadcrumbList` + `FAQPage` (from frontmatter `faq`). Sitemap: add guide slugs.
- **Acceptance:** ~8–10 guides; bad pick slug fails the build; prices render live; tsc + render clean.

**Depends on:** 0.1 (for facet-aware picks, optional), the markdown dependency.

---

## Scope 7 — Cross-cutting sweep (DO LAST)

- **Sitemap:** extend `app/gaming-laptops/sitemap.ts` to also iterate glossary, guides, and the new
  collections + methodology.
- **Navigation:** add a "Laptops" mega-menu sub-section (Laptops / Buying Guides / Glossary) in
  `Header.tsx`; add en/fr strings.
- **Schema QA:** run every page type through the Rich Results Test; one canonical per page; valid
  `BreadcrumbList` everywhere; no duplicate `@type` collisions.
- **Internal-link audit:** no orphans; every family reachable index → category/brand → product → glossary/guides.
- **Perf budget:** Lighthouse ≥ 90 (mobile) on a product page; LCP < 2.5s; CLS < 0.1.

---

## Deferred / future (with the trigger that unblocks each)

- **Scope 3 — Comparison pages (X vs Y).** TRIGGER: real search-demand data. Ship Scopes 1–7, let
  Search Console accumulate impressions, then pull comparison-intent queries via the search-console MCP
  and build only the pairs with demand (canonical alphabetical slug, reverse → redirect). Avoids
  guessing 100 thin doorway pages.
- **Scope 6 — Finder tool.** TRIGGER: after the static collection pages (Scope 4) prove which filters
  users want; build the interactive client filter on `facets.ts` then.
- **Scope 8 — Benchmark explorer / AI reco.** Benchmarks BLOCKED (no per-game FPS in the dataset — needs
  a benchmark source). AI reco needs the Claude API + budget/guardrails.

---

## Execution order & parallelism

```
Scope 0 (facets + pros/cons) ──┬─> Scope 1 (SEO upgrades)
                               ├─> Scope 2 (glossary)
                               ├─> Scope 4 (collections)
                               └─> Scope 5 (md guides)
                                         └─> Scope 7 (sweep) ── last
```

Recommended: **Scope 0 → Scope 1**, then fan out 2 / 4 / 5 in parallel, then Scope 7. Scope 1.3
(internal links) and Scope 2 (TermLinker) both edit the product page — give one agent ownership of that file.

Net new pages this round: glossary ~20 + collections ~12 + guides ~10 + methodology 1 ≈ **~43**, on top of
the existing ~100, plus the SEO upgrades applied across all of them.

## Definition of done (per scope)

1. `tsc --noEmit` clean for touched paths.
2. New routes 200 with expected content; 404 on bad slug.
3. New URLs present in `/gaming-laptops/sitemap.xml`.
4. Required JSON-LD present and valid (Rich Results Test).
5. Reads go through `queries.ts`/registries; Unknown fields omitted; dark-theme + `pt-24` layout.
6. No orphan pages introduced.
