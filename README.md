

────────────────────────────────
1. Tech stack & tooling
────────────────────────────────
• Framework    : Next 14 (app-router, React 18, TypeScript, TailwindCSS).  
• State / Data     : Apollo Client 3 against a WordPress GraphQL endpoint, plus a bespoke IGDB REST proxy that lives on the WordPress side (`/wp-json/igdb/v1`).  
• Styling / UI     : Tailwind 3, Framer-motion for animation, Swiper for sliders, Three.js for any 3-D embeds.  
• Quality / Build   : ESLint (+ `eslint-config-next`), Prettier, Vercel bundle analyzer, image optimisation via `next/image`.  
• Hosting target   : Vercel (note `vercel.json` + headers/rewrites in `next.config.js`).

────────────────────────────────
2. Top-level structure
────────────────────────────────
```
.
├── app/                  ⟶ **all route & UI code (Next app-router)**
│   ├── components/       ⟶ shared React components (sliders, sections…)
│   ├── lib/              ⟶ client helpers (Apollo, IGDB, WP image utils)
│   ├── api/              ⟶ Next Route Handlers ‑ currently only games/create
│   ├── (feature folders) ⟶ /gaming /guides /technology /reviews etc.
│   ├── page.tsx         ⟶ Home page
│   └── layout.tsx       ⟶ Global layout
├── skull-and-bones-guides/ (static markdown for a future import)
├── wp-content/           (mirrors WP uploads when developing locally)
└── …config + tooling files
```

────────────────────────────────
3. Data layer
────────────────────────────────
A. WordPress GraphQL
   • `app/lib/apolloClient.ts` creates an `ApolloClient` pointed at `${NEXT_PUBLIC_WORDPRESS_URL}/graphql`.  
   • Example query usage lives in dozens of components & route segments (`GamingSection`, `GuidesPageContent`, `articles/page.tsx`, etc.).  
   • GraphQL typing is **not** generated; most responses are loosely typed as `any` or custom small interfaces.

B. IGDB Proxy API
   • `app/lib/igdb-client.ts` wraps calls to `/wp-json/igdb/v1/*` and post-processes images/rich fields.  
   • Three exposed helpers:
     – `searchGames(query, limit)`  
     – `getGameDetails(id)`  
     – `getPopularGames(limit)`  
   • Used by:
     – `GameSearch.tsx` (client component; autocomplete + click-to-details)  
     – Dynamic route `/game/[slug]/page.tsx` (SSR/ISR)  
     – `GameDatabaseSection.tsx` on the home page.

────────────────────────────────
4. Routing & pages
────────────────────────────────
• **Conventional sections**: `/gaming`, `/technology`, `/guides`, `/reviews`, `/articles` each have an index page and a `[slug]` detail page.  
• **Game database**:
  – `/game/[slug]` tries WP first (in case the slug matches a WP "game" CPT), falls back to IGDB detail by numeric id.  
  – On 404 it surfaces `app/not-found.tsx` – a custom stylised 404.  

• **SEO extras**:
  – `CanonicalUrl`, `SEOMetadata`, OpenGraph/Twitter tags per page.  
  – `app/sitemap.ts` builds a server-side XML sitemap via GraphQL.  
  – `robots.ts` and rich JSON-LD components (`VideoStructuredData`, `TechnologyStructuredData`).

────────────────────────────────
5. UI component highlights
────────────────────────────────
| Component                  | Purpose / Notes |
|-----------------------------|-----------------|
| `FeaturedSlider`           | Hero carousel, Swiper, GraphQL query for "featured" posts |
| `ReviewsSlider`            | Latest reviews w/ rating stars |
| `GameSearch`               | Client component → IGDB search (debounce) |
| `GameDetails`              | Displays IGDB or WP data, uses Next Image w/ domain allow-list |
| `GameCalendar`             | Uses date-fns to generate upcoming releases timeline |
| `Header` / `Footer`        | Responsive navigation, social icons |
| `NewsletterForm`           | MailChimp (or similar) embed |

All major sections are loaded with `<Suspense>` + dynamic imports, tuning SSR/CSR balance.

────────────────────────────────
6. Build & optimisation knobs
────────────────────────────────
• `nextConfig` enables:
  – `reactStrictMode`  
  – Image remote patterns for FinalBoss and IGDB CDNs  
  – Security headers + CSP  
  – Route redirects (old WP style → new Next)  
• `tailwind.config.js` defines dark theme colours used throughout.  
• Bundle analyse via `ANALYZE=true next build`.  

────────────────────────────────
7. Current warnings / gaps
────────────────────────────────
1. 🟠 **TypeScript config error**  
   `Cannot find type definition file for 'google-cloud__tasks'`  
   ⇒ `tsconfig.json` still references a type-library that isn't installed.  
   Fix: `npm i -D @types/google-cloud__tasks` or remove the `types` entry from `tsconfig`.

2. 🟠 **Loose GraphQL typing**  
   Many queries return `any`. Consider code-gen (`@graphql-codegen`) or fragments typed with Zod.

3. ⚠️ **Detached HEAD ancestry**  
   You are now on branch `finalboss2025` forked at 7f0d463. Any pulls from `origin/main` will diverge; merge strategy needs planning.

4. 🟡 **No unit / integration tests**  
   Jest types present but no test files. Worth adding tests around IGDB client and critical GraphQL queries.

5. 🟡 **Env var dependency**  
   Hard-coded fallback URLs in `igdb-client.ts` – ensure `NEXT_PUBLIC_WORDPRESS_URL` is set in all environments.

6. 🟡 **Third-party keys**  
   IGDB integration likely needs Twitch/IGDB API key on the WP side; document this in README.

────────────────────────────────
8. Suggested next steps
────────────────────────────────
• Resolve the `google-cloud__tasks` type error (quick win).  
• Add automatic GraphQL typings generation.  
• Consider moving GraphQL/fragments into `/gql` folder for clarity.  
• Audit bundle size with `ANALYZE=true` – `FeaturedSlider` is 14 KB raw but pulls Swiper & images.  
• Write Cypress/Playwright smoke tests for critical flows (home → article → share buttons; game search → game details).  
• Prepare CI workflow (GitHub Actions) to run `npm run lint`, `npm run build`, maybe Lighthouse.

That should give you a comprehensive picture of what's in the repo, where the moving parts live, and what to tackle next.

## GraphQL Code Generation

1. **Export schema from WPGraphQL**

   In the WP admin, go to **GraphQL ▸ Settings ▸ Tooling** (or install WPGraphQL _GraphiQL_ plugin). Run:

   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"query":"{ __schema { types { name } } }"}' \
     https://backend.finalboss.io/graphql \
     > schema.json
   ```

   Or download from the IDE: _Export SDL_ ➜ save as `schema.graphql` at repo root.

2. **Generate typed hooks & helpers**

   ```bash
   npm run codegen
   ```

   The generated files appear in `gql/` and are automatically formatted by Prettier.
