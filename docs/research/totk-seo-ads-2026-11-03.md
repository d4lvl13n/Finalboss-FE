# TOTK SEO and advertising — 3 November 2026

The 600 imported build names, descriptions and original QR images are unchanged.
Their descriptions were checked against the cached source HTML. Collection
introductions, metadata and the small cost/import FAQ are written for FinalBoss.
The FinalBoss gray/yellow UI is retained.

## Search architecture

- Eight category collections have descriptive titles, original introductions and
  self-referencing canonical URLs, under `/builds/category/<category>`.
- Root and category listings have static numbered `/page/<page>` routes. Previous,
  next and page-number links are ordinary anchors, so every build is discoverable
  without JavaScript. `/page/1` redirects permanently to its collection root.
- Search, tag, budget, test-status, sort and legacy facet query URLs receive
  `X-Robots-Tag: noindex, follow`. Canonical collection paths remain indexable.
- Each CollectionPage/ItemList describes only the current visible page, with
  accurate item positions. Every detail page uses CreativeWork, ImageObject and
  breadcrumbs; no invented Product offers, ratings, test results or creators.
- The 600 detail titles and meta descriptions are unique, including same-name
  blueprints. A visible blueprint ID distinguishes those variants.
- All canonical collection, pagination and build URLs enter `/game/sitemap.xml`.
- Image previews remain small WebP files; original download files remain unchanged.

## In-grid advertising

Full desktop pages expose two content targets after cards 8 and 16. Narrower
layouts expose up to three after cards 6, 12 and 18. Fewer than 12 cards means no
in-grid target, and at least four cards remain below the final target.

Journey's public 3.89.1 wrapper was inspected. The Journey model disables ordinary
`content_hint` behavior, so those markers are not used. The generic
`.mv_slot_target[data-slot="content"]` registrar is initialized for Journey and
exposes `window.$adManagementConfig.web.fillHints()`. Newly hydrated ad islands
share one animation-frame registration scan. An unavailable SDK is left to its
normal startup scan. There is no second loader, setting override, polling or
AdSense fallback. Existing site-wide advertising settings are unchanged.

Targets activate after React hydration. They live in stable memoized islands so
sorting cards preserves injected ad DOM, and their containers span full grid rows.
Empty targets do not create large blank boxes. Native category/page navigation
starts the normal ad document lifecycle.

## Validation and limits

Tests cover metadata uniqueness, all-build pagination coverage, visible-only
structured data, ad density, registration batching, JavaScript-disabled category
and page rendering, canonicals, noindex headers, redirects, 404s, card sorting,
filter clearing and responsive layout. Ad layout tests use clearly marked
synthetic boxes while blocking third-party requests. They prove geometry and
React isolation, not auction fill or revenue. Live creative delivery remains to
be checked after deployment. No production deployment is included here.

References:
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://journeymv.zendesk.com/hc/en-us/articles/54691462571419-Why-SPAs-flexbox-grid-layouts-and-utility-class-frameworks-can-cause-ad-targeting-issues
- https://scripts.scriptwrapper.com/tags/1fed7165-e8a7-4e1b-903f-79a0bbece5f6.js
- https://scripts.journeymv.com/tags/3.89.1/wrapper.min.js

Inspected Journey wrapper SHA-256: `c641ca640e46cfd7a5b6e89f4538e449cff306d2587d815fd915bb9696823927`.

Final production build: 2,287 static pages generated successfully. The build section contributes 659 canonical sitemap entries: 600 detail pages and 59 listing pages, including 8 category roots. All 659 emitted titles/canonicals and all 600 server-rendered detail links were checked. First-page aliases have explicit HTTP 308 rules in next.config.js to preserve the Location header in static production output.
