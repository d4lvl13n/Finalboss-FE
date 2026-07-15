# FinalBoss.io - Gaming News Platform

## Overview

FinalBoss.io is a gaming news and reviews website built with Next.js 14 (App Router) that fetches content from a headless WordPress backend via GraphQL. It integrates with IGDB (Internet Game Database) for comprehensive game data.

## Tech Stack

- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS 3, Framer Motion for animations
- **Data**: Apollo Client (GraphQL) for WordPress, REST API for IGDB
- **Deployment**: Vercel
- **Backend**: Headless WordPress at `backend.finalboss.io`

## Project Structure

```
/app
├── api/                    # Next.js API routes
│   ├── extension/          # Chrome extension API endpoints
│   │   ├── search/         # GET /api/extension/search?q={query}
│   │   └── game/[id]/      # GET /api/extension/game/{id}
│   ├── games/create/       # Create game tags in WordPress
│   └── wordpress-proxy/    # WordPress proxy
├── components/             # React components
├── lib/                    # Utilities and clients
│   ├── apolloClient.ts     # GraphQL client config
│   ├── igdb-client.ts      # IGDB API wrapper
│   ├── queries/            # GraphQL queries
│   └── seo.ts              # SEO utilities
├── types/                  # TypeScript types
│   └── igdb.ts             # IGDB data types
├── game/[slug]/            # Dynamic game detail pages
├── games/                  # Games listing page
└── ...                     # Other pages (gaming, guides, reviews, etc.)

/chrome-extension           # Browser extension (see below)
/public                     # Static assets
```

## Key Integrations

### IGDB API
- Proxied through WordPress at `backend.finalboss.io/wp-json/igdb/v1/*`
- Client: `app/lib/igdb-client.ts`
- Endpoints: `/search`, `/game/{id}`, `/popular`
- Rate limit: 4 req/s (handled by WordPress proxy)

### WordPress (Headless CMS)
- GraphQL endpoint: `backend.finalboss.io/graphql`
- Content types: Posts, Game Tags, Authors, Categories
- Game metadata stored as JSON in `igdbData` field

## Chrome Extension

Located in `/chrome-extension/`. A browser extension that lets users look up game information from any webpage.

### Features
- Right-click any selected text → "Search on FinalBoss.io"
- Popup with game details: cover, rating, platforms, genres, screenshots
- Search history (last 5 searches)
- Share to Twitter/Reddit or copy link
- Keyboard shortcut: Ctrl+Shift+G (Cmd+Shift+G on Mac)

### Extension Files
```
/chrome-extension
├── manifest.json           # Manifest V3 config
├── background.js           # Service worker
├── popup.html/js/css       # Popup UI
├── icons/                  # Extension icons (16, 48, 128 PNG)
└── README.md               # Installation instructions
```

### Extension API Endpoints
The extension uses these Next.js API routes:
- `GET /api/extension/search?q={query}&limit=5` - Search games
- `GET /api/extension/game/{id}` - Get game details with finalboss.io URL

### Publishing
ZIP file for Chrome Web Store: `chrome-extension/finalboss-extension.zip`
Privacy policy: `/privacy-policy#chrome-extension`

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run codegen   # Generate GraphQL types
```

## Environment Variables

```
NEXT_PUBLIC_WORDPRESS_URL=https://backend.finalboss.io
NEXT_PUBLIC_BASE_URL=https://finalboss.io
```

## URL Structure

- `/` - Homepage
- `/game/{slug}` - Game detail page (accepts slug or IGDB ID)
- `/games` - All games listing
- `/gaming` - Gaming news category
- `/guides` - Guides section
- `/reviews` - Reviews section
- `/{slug}` - Individual article pages

## Game Hub Slug Policy (one game = one `/game/*` URL)

**Hard rule when adding a local game hub to `app/lib/game-hub/registry.ts`.** A game
must have exactly ONE indexable `/game/{slug}` URL. Never mint a new slug for a game
that already has a page — that splits SEO equity across duplicate URLs (this bit us
with GTA VI `grand-theft-auto-vi` vs the ranked `gta-6`, and Diablo IV `diablo-iv` vs
`diablo-4`; both fixed in `21421f7`).

Before choosing a slug:
1. **Check Search Console** for existing `/game/*` pages for that game — IGDB
   auto-creates a slug whenever someone searches it in the site's game bar, so a page
   may already exist and rank. Query GSC by page-regex on the game's name.
2. **Use the slug that already holds equity** (clicks/impressions) as the URL slug —
   set both `game.slug` and the `registry.ts` key to it. Do NOT default to the
   IGDB-canonical name just because it's "correct."
3. **If the Knowledge-API entity is keyed on a different slug**, set
   `GameData.knowledgeSlug` to the KG key. URL identity (SEO) is decoupled from
   Knowledge-API identity — never bend the URL to match the KG.
4. **When superseding an old slug**, add a permanent redirect in `next.config.js` for
   both `/game/<old>` and `/game/<old>/:path*` → the canonical. This also intercepts
   the IGDB search-bar auto-create path so the duplicate can't respawn.

## Caching Strategy

- ISR (Incremental Static Regeneration): 1-hour revalidate
- GraphQL: cache-first policy
- IGDB responses: 1-hour server-side cache
- Images: 24-hour minimum cache TTL

## Code Patterns

### IGDB Data Flow
1. Raw IGDB response from WordPress proxy
2. Transform via `IGDBClient.transformGameData()`
3. Normalized `IGDBGame` interface
4. Stored in WordPress as JSON (for persistence)

### Game Page Logic (`app/game/[slug]/page.tsx`)
1. Try WordPress game tag lookup by slug
2. If not found and slug is numeric, fetch from IGDB
3. Auto-create WordPress game tag if needed
4. Redirect to canonical slug URL

### SEO
- Dynamic metadata generation per page
- JSON-LD structured data (VideoGame schema)
- Canonical URLs
- Open Graph tags
