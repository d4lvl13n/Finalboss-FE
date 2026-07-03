# Handhelds — Comparison pages + Phase 2 build spec

Shared contract for the four parallel workstreams. Read this fully before writing code.
The handheld engine lives in `app/lib/handhelds/*` and `app/handhelds/*`, cloned from the
laptop engine (`app/lib/laptops/*`, `app/gaming-laptops/*`). Match the laptop patterns exactly.

## Non-negotiable house rules

1. **Never invent specs.** Every number/spec on a page must come from the dataset
   (`app/lib/handhelds/data/*`) or, for boutique data, from the source file
   `/Users/damienlarquey/Downloads/handheld-gaming-pc-database-2026.md`. Unknown → omit the field.
   Do not guess prices, weights, battery, TDP, etc.
2. **Voice = "it's us."** Editorial reads as FinalBoss's own verdicts. Do NOT add any
   "How we picked / How we chose / Our methodology" self-justifying section to guides or
   comparisons — it reads defensive. State verdicts plainly.
3. **No new dependencies.** `gray-matter`, `react-markdown`, `rehype-sanitize` are already
   installed. Everything else is hand-rolled.
4. **Dark theme:** `bg-gray-950`, `text-gray-100`, amber-400 accents. Pages start with
   `<Header />` then a container with `pt-24` (fixed transparent header).
5. **Every page:** `export const revalidate = 3600;`, `generateStaticParams`,
   `generateMetadata` via `buildPageMetadata`/`absoluteUrl` from `@/app/lib/seo`, and
   JSON-LD via `<script type="application/ld+json">`.
6. **Affiliate links:** always `rel="sponsored nofollow noopener noreferrer"` + `target="_blank"`.
   Use `amazonLinkForConfig` / `genericAmazonLink` from `app/lib/handhelds/affiliate.ts`.
7. **Reuse components:** `HandheldCard`, `AmazonBox`, `Byline` from `app/components/handhelds/*`,
   `ProsCons` from `app/components/laptops/ProsCons`.
8. **Do NOT edit shared files** `app/handhelds/sitemap.ts`, `app/components/Header.tsx`,
   `app/robots.ts` — the integrator wires those. Exception: Workstream B edits
   `app/lib/handhelds/data/index.ts` (only that agent touches it).

## Self-verification before you report done

- `cd /Users/damienlarquey/gaming-news && npx tsc --noEmit 2>&1 | grep -E "<one of your files>"` → must be empty.
- Confirm each new route with a production-style check is not required, but your files must
  typecheck cleanly and follow the reference page's imports exactly.
- Report the exact list of files you created/edited.

## The slug contract (authoritative)

### Existing mainstream family slugs (17) — safe to reference anywhere
```
valve-steam-deck-lcd, valve-steam-deck-oled,
asus-rog-ally-2023, asus-rog-ally-x, asus-rog-xbox-ally, asus-rog-xbox-ally-x,
lenovo-legion-go, lenovo-legion-go-s-windows, lenovo-legion-go-s-steamos, lenovo-legion-go-2,
msi-claw-a1m, msi-claw-8-ai-plus, msi-claw-a8,
acer-nitro-blaze-7, acer-nitro-blaze-8, acer-nitro-blaze-11,
zotac-zone
```

### Boutique family slugs (Workstream B creates these EXACT slugs)
Mandatory-core (guides/comparisons may reference these — B MUST include them):
```
ayaneo-3, ayaneo-next-ii, gpd-win-4, gpd-win-mini,
onexplayer-x1, onexfly-f1-pro, aokzoe-a2, ayn-loki
```
Include-if-data-is-solid (B adds when the source has enough; others must NOT hard-reference):
```
ayaneo-kun, ayaneo-flip-ds, ayaneo-air-1s, ayaneo-konkr-fit,
gpd-win-max-2, gpd-win-5, gpd-duo,
onexplayer-x1-mini, onexplayer-x1-pro, onexplayer-g1, onexplayer-super-x, onexplayer-2-pro,
aokzoe-a1-pro
```

### Existing `best/<slug>` category slugs (for glossary relatedCategorySlug)
```
steamos, windows, oled, 7-inch, 8-inch, large-screen,
best-battery, lightest, hall-effect-sticks, with-trackpads, egpu, convertible
```
