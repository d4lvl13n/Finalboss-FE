# Structured Game Hubs — Architecture & Product Spec

**Status:** Draft for review (not yet approved for build)
**Flagship:** GTA VI
**Author:** grounded in the actual FinalBoss (`~/gaming-news`) and GPBot (`~/gpbot`) codebases as of 2026-07-14.

---

## 0. TL;DR / the reframing

The brief asks to "evolve FinalBoss into a reusable structured gaming platform." After inspecting both repos, the honest finding is:

> **The reusable platform's hardest layer already exists — it is just underfilled and single-typed.**

GPBot already runs a CQRS knowledge system: a **generic, vertical-agnostic canonical entity store** (`k_*` tables) served by a **read-only Knowledge API** that FinalBoss already consumes to render `/games/[slug]` "intelligence" pages. That layer already models exactly what the brief describes as the goal: **typed entities, per-type versioned attribute schemas, a typed relationship graph, coverage/topic/timeline intelligence, SEO/indexability gating, canonical-redirect dedup, and quality scoring.** It is protected by a guard test that forbids any vertical- or "game"-specific literal from leaking into the serve layer.

So this is **not a greenfield platform build**. The real, much narrower work is:

1. **Grow the entity model from one type (`game`) to a small set of gameplay types** (character, location, vehicle, mission, collectible…), produced by new/extended **Projectors** — the one place type-specific logic is allowed to live.
2. **Add a curated-entity ingestion path** so confirmed facts (which, for an unreleased game, is *all* we have) can flow through the same canonical store as machine-extracted ones.
3. **Give FinalBoss typed page templates + light interactive tools**, borrowing the proven handhelds/laptops engine skeleton as the rendering pattern.
4. **Consolidate the two overlapping game URLs** into one canonical hub so we don't cannibalize ourselves.

And the single most important product judgment:

> **GTA VI is the right traffic target but the wrong target to harden gameplay-entity extraction on — because it has no gameplay data yet.** Pre-launch, the flagship is a *news-intelligence + curated-facts + light-tools* hub (huge demand: "GTA 6 map / characters / release date / everything we know"). The gameplay-entity *extraction pipeline* should be validated on an **already-released** game with rich data (Elden Ring, BG3, or something FinalBoss already covers) so the schema is battle-tested before GTA VI ships. Then both halves are proven on launch day.

The rest of this doc is the grounded detail behind that.

---

## 1. What already exists (grounded inventory)

### 1.1 GPBot — the intelligence + canonical data layer

**Architecture:** CQRS. Operational write-side tables → per-vertical **Projector** (batch, atomic swap) → generic `k_*` read store → Flask **Knowledge API** (port 5003, consumer-key auth, CDN-frontable, read-only).

**The canonical store (`worker/gpbot/knowledge/models.py`, `k_*` tables) — already generic and reusable:**

| Table | What it already gives us |
|---|---|
| `k_entity` | Typed entity: `entity_type` (free string), `slug`, `canonical_name`, `attributes` (JSONB, governed), `attributes_profile` + `attributes_schema_version`, `external_ids`, `quality_score`, `indexability_status`, `canonical_entity_id` (variant collapse), provenance. `UNIQUE(vertical, entity_type, slug)`. |
| `k_entity_relationship` | **The graph edge.** `(from, to, relationship_type)` + `confidence` + `evidence`. Type is a free string; taxonomy anticipated in the spec. |
| `k_entity_slug_alias` | old_slug → entity for 301s / SEO continuity. |
| `k_entity_coverage_daily` | mentions, sentiment, source concentration, velocity vs prev-day / 7d-avg. |
| `k_entity_topic_snapshot` | top / emerging / fading keywords, clusters, narrative summary. |
| `k_entity_timeline_event` | `media_signal | factual_event | editorial_event` + confidence + verification + sources. |
| `k_entity_content` | rights-aware linked content (`owned/external/youtube/social`, `summary_policy`). |
| `k_entity_trending_snapshot` | rising / most_covered / sentiment_drop segments. |
| `k_projection_run` | build bookkeeping / freshness. |

**Knowledge API (`worker/gpbot/knowledge_api/`) — genuinely generic (guard-tested):** `GET /v1/<vertical>/entities`, `.../entities/<type>/<slug>` + `/coverage /topics /content /timeline /relationships /page`, `.../sitemap?entity_type=`, `/v1/projections/status`, `/v1/health`. Serializer is an opaque pass-through of `attributes` — consumers branch on `attributes_profile`.

**Policies (strong, already gaming-tuned):**
- **Canonicalization** (`knowledge/canonicalization.py`, `gaming_canon_v1`): base-vs-variant with an explicit **anti-merge bias** and a **franchise guard** — *GTA V ≠ GTA VI, FF7 Remake ≠ Rebirth are already protected.* Variants get `canonical_redirect` → base.
- **Quality/indexability** (`knowledge/quality.py`, `gaming_entity_quality_v1`): `hidden → public_noindex → public_index` from linked-content ≥10, unique-sources ≥3, confidence ≥0.85 (or volume ≥50). 0–100 quality score with full audit trail.

**Ingestion / intelligence (upstream of the store):**
- Sources: RSS adapters (`gamespress`, `pcgamesn`, `jvcom`, `actugaming`), **YouTube Data API**, generic RSS / `wordpress_site` / `crawl_site` / `url_list` via `SourceRegistry`, and **Perplexity research** folded back into the pool. **No Reddit/Steam/social collectors exist** (enum placeholders only).
- Pipeline: `global_extract` (Diffbot + BS4, no LLM) → `global_summarise` (**OpenAI Batch, structured tool schema**: `game, franchise, platforms, keywords, topic_clusters, sentiment, mentioned_games, non_game_entities…`) → `global_embed_batch` (pgvector, `text-embedding-3-small`) → `global_rank`.
- Entity resolution (`tasks/global_game_entity_resolver.py`): free-text title → **IGDB → RAWG → local** waterfall → `GameEntity`. Non-game concepts → `CoverageAnchor` (service/event/company/person/platform).
- Trends (`tasks/trend_radar.py`): breakout_radar + shorts_brief from `mi_entity_daily_*` aggregates.
- Scheduling: Celery + Redis + RedBeat + fan-out. `run_knowledge_projection` daily 02:00 → `GamingProjector.run_full()` full atomic swap.

**The hard limits, stated plainly:**
- **Only one entity type is ever produced: `entity_type="game"`.** No character/location/mission/vehicle/weapon/studio/franchise projector exists.
- **`attributes` for a game = IGDB metadata only:** `{platforms, genres, developer, publisher, release_date, franchise, cover_image_id}` (profile `gaming.game.v1`).
- **"Blueprints" are Python constants + a build function**, not a declarative schema registry. No admin UI, no JSON-Schema validation.
- **Relationships, timeline (beyond media_signal), and trending are staged-but-empty** in the gaming projector. The **trending API endpoint is spec'd but not implemented**, though the table + `read_store.trending()` exist.
- **No gameplay sub-entities are produced anywhere.** Everything downstream of ingestion is news/coverage/trend/sentiment — never characters, missions, or items.

### 1.2 FinalBoss — the publication layer

**Two deliberately-separate game surfaces (code comments say "do not merge"):**
- `/games/[slug]` (`app/games/[slug]/page.tsx`) — **Knowledge-API-driven intelligence**. Server-rendered, zero client JS. Renders `GameHero`, `IntelligenceSnapshot`, `CoverageTrend` (inline-SVG), `TopicsPanel`, `GameTimeline`, `LatestNews`. Robots gated on `indexabilityStatus`; canonical redirect; `VideoGame` JSON-LD. Dedicated `/games/sitemap.xml`.
- `/game/[slug]` (`app/game/[slug]/page.tsx`) — **IGDB catalog + WordPress articles**. WordPress game-tag lookup → IGDB fallback → auto-create tag → canonical redirect. Client component `GameDetails.tsx`. In the root sitemap.
- These **overlap and compete** (both are "the GTA VI page"). They previously fought soft-404s and duplicate-content redirects — cannibalization is a known, cared-about problem.

**The reusable structured-hub blueprint that already works — handhelds / gaming-laptops:**
Proven, copyable engine (already cloned laptops→handhelds). Pattern:
```
static TS data + validate-at-import  →  queries/registries (categories, comparisons, glossary, guides, facets)
                                     →  App-Router templates (index / [slug] / best / brands / compare / glossary / guides / methodology)
                                     →  dedicated sitemap  →  robots
```
100% server-rendered, SSG + ISR (`revalidate=3600`), dense derived internal linking, self-hosted images, `Product/BreadcrumbList/FAQPage` JSON-LD. **This is the template/registry/sitemap skeleton to reuse for game hubs** — but note it is *file-based hand-authored data*, which does **not** scale to "many games" and would duplicate the entity model if copied literally.

**Gaps in FinalBoss:**
- **No interactive tools anywhere.** No map, tracker, checklist, calculator, quiz, or finder in the entire `app/`. Even the comparison and the coverage chart are static server-rendered. Any player-facing utility is net-new.
- **No central JSON-LD helper** — every surface hand-rolls its structured data (`app/lib/seo.ts` only does metadata).
- Knowledge client is the only fetch using Next cache **tags** (enables targeted revalidation) — good pattern to extend.

---

## 2. Reuse / extend / missing / avoid

| Capability | Verdict | Where |
|---|---|---|
| Generic typed-entity store + relationships + attribute profiles | **Reuse as-is** | GPBot `k_*` + Knowledge API |
| Canonicalization + quality + indexability policies | **Reuse as-is** | GPBot `knowledge/{canonicalization,quality}.py` |
| Ingestion → extract → summarise → embed → rank | **Reuse as-is** | GPBot `tasks/global_*` |
| News/coverage/topic/timeline intelligence per game | **Reuse; fill the empty bits** | GPBot projector + FinalBoss intelligence components |
| Handhelds/laptops template + registry + sitemap skeleton | **Extend (copy the *pattern*, not the data model)** | FinalBoss `app/lib/handhelds/*`, `app/handhelds/*` |
| Next cache-tag revalidation, multi-sitemap, robots | **Reuse/extend** | FinalBoss `app/lib/knowledge/client.ts`, `app/*/sitemap.ts` |
| **Gameplay entity types (character/location/vehicle/mission/…)** | **Missing — build (as Projectors)** | GPBot `knowledge/projectors/` |
| **Curated / editorial entity ingestion** (confirmed facts, pre-launch) | **Missing — build** | GPBot new task + operational table |
| **Declarative blueprint/registry** (entity-type → schema → template → tools) | **Missing — build *lightweight***; a DB/CMS version is **premature** | Shared config, versioned in code |
| **Interactive tools** (map, tracker, checklist, countdown) | **Missing — build FinalBoss-side, client + localStorage** | FinalBoss new components |
| **Trending endpoint** | **Missing — implement (already spec'd, cheap)** | GPBot `knowledge_api/blueprints/trending.py` |
| **Centralized JSON-LD builder** | **Missing — build (overdue)** | FinalBoss `app/lib/jsonld.ts` |
| Reddit/Steam/social ingestion | **Missing; defer** | GPBot (schema placeholders exist) |
| Native app / public API / subscription | **Out of scope** (brief) | — |

---

## 3. System boundaries & responsibilities

Keep the **single contract that already exists**: the Knowledge API is the *only* seam between the two systems. Do not add a second integration path.

```
┌──────────────────────────── GPBot (the brain) ────────────────────────────┐
│  Owns the CANONICAL truth about entities:                                  │
│   • ingestion, extraction, normalization, embedding                        │
│   • entity detection + resolution + dedup/canonicalization                 │
│   • gameplay-entity projection (NEW) + curated-entity intake (NEW)         │
│   • attributes (versioned profiles), typed relationships                   │
│   • coverage / topics / timeline / trending intelligence                   │
│   • quality score + indexability + canonical slug                          │
│  Exposes: read-only Knowledge API (/v1/<vertical>/…)                        │
└────────────────────────────────────────────────────────────────────────────┘
                                   │  Knowledge API (only contract)
                                   ▼
┌──────────────────────────── FinalBoss (the face) ─────────────────────────┐
│  Owns PRESENTATION, EDITORIAL, TOOLS, MONETIZATION:                         │
│   • the game HUB + typed sub-pages (template per entity_type)              │
│   • editorial prose (WordPress) layered over canonical data                │
│   • interactive tools (map/tracker/checklist/countdown) — client + local   │
│   • internal linking, JSON-LD, sitemaps, robots, ISR/cache-tags            │
│   • ad placement + affiliate money-path                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

**Rule of thumb for "where does X live?":** if it is *a fact about the game world* (a character exists, a vehicle appears in a mission, GTA VI belongs to the GTA franchise), it is **canonical → GPBot**. If it is *how a human sees or interacts with that fact* (a map pin, a checklist checkbox, a comparison table, a paragraph of opinion, an ad slot), it is **presentation → FinalBoss**. Editorial prose is FinalBoss/WordPress; the *entity it is about* is GPBot.

---

## 4. Data flow (annotated: real vs new)

```
                         ┌─ RSS / YouTube / crawl / Perplexity  [EXISTS]
 raw sources ────────────┤
                         └─ CURATED editorial facts (confirmed roster,       [NEW]
                            locations, vehicles, features) via operator UI/CLI
        │
        ▼
 GlobalContentItem  →  extract → summarise → embed → rank            [EXISTS]
        │                     │
        │                     └─ entity detection/resolution (game grain)  [EXISTS]
        │                     └─ gameplay-entity extraction (char/loc/…)    [NEW, released-game first]
        ▼
 operational write side:  GameEntity, CoverageAnchor, mi_entity_daily_*     [EXISTS]
        + new: GameplayEntity + EntityRelationship (curated + extracted)     [NEW]
        │
        ▼
 Projectors  →  GamingProjector.run_full()  (atomic swap)            [EXISTS; EXTEND]
        │        + CharacterProjector / LocationProjector / … OR              [NEW]
        │          one multi-type GamingProjector emitting many entity_types
        ▼
 k_* read store (typed entities, relationships, coverage, timeline, trending) [EXISTS; FILL]
        │
        ▼
 Knowledge API  /v1/gaming/entities/<type>/<slug>/page  + /relationships     [EXISTS]
        + /v1/gaming/trending?segment=rising                                  [NEW, spec'd]
        │
        ▼
 FinalBoss game HUB:                                                          [NEW templates]
   /games/<game-slug>                      → hub landing (overview + modules)
   /games/<game-slug>/characters/<slug>    → typed sub-page (from entity_type)
   /games/<game-slug>/map                  → interactive tool  [NEW, at launch]
   /games/<game-slug>/checklist            → tracker tool      [NEW]
        │
        ▼
 traffic + performance signals (GA4 / GSC / AdSense)  ──feedback──▶ topic selection,
        entity prioritization, CTR-title rewrites (existing GPBot + SEO loop)
```

---

## 5. Core domain model

### 5.1 Base entity contract (all types — already in `k_*`)
`uid, entity_type, slug, canonical_name, description, image_url, external_ids, attributes(+profile+version), relationships[], coverage[], topics, timeline[], content[], quality_score, indexability_status, canonical_entity_id`.

### 5.2 Gaming entity types, layered (the answer to "don't force one schema, don't build GTA-only")

**Layer 1 — Shared concepts (apply to ~every game):**
`game`, `studio`, `publisher`, `franchise`, `platform`.
(`studio/publisher/platform` already exist as `CoverageAnchor` on the write side — they need *promoting* into `k_entity` rows so they get pages + relationships. `franchise` is currently just a string attribute — promote to an entity so "GTA franchise" is a hub.)

**Layer 2 — Family blueprints (reusable across a genre):**
- **Open-world** (GTA VI, Cyberpunk, RDR): `character`, `location/region`, `vehicle`, `mission`, `activity`, `collectible`, `weapon`.
- **RPG / soulslike** (Elden Ring, BG3): `character/NPC`, `class/build`, `item`, `boss`, `quest`, `area`, `spell/ability`.
- **Survival / strategy**: their own sets.
A "family blueprint" = **a named set of entity types + their attribute profiles + the FinalBoss templates + tools + the relationship types that connect them.** Nothing more exotic than that.

**Layer 3 — Game-specific extensions (only where a game genuinely needs it):**
GTA VI: `radio_station`, `business/property`, `heist`. Elden Ring: `great_rune`. Kept as extra entity types with their own profile; never forced onto other games.

### 5.3 Relationship taxonomy (fills the empty `k_entity_relationship`)
`developed_by`, `published_by`, `part_of_franchise`, `sequel_of` / `precedes`, `similar_to`, `appears_in` (character→game), `located_in` (location→game/region), `drives`/`features` (character→vehicle, mission→location), `unlocks`, `rival_of`. Confidence + evidence already supported.

### 5.4 Blueprint definition (lightweight, declarative, versioned in code — NOT a CMS)
One definition object per entity type, e.g.:
```
{
  entityType: "character",
  vertical: "gaming",
  extends: "base",
  attributesProfile: "gaming.character.v1",
  attributes: { role, affiliation, firstAppearance, voiceActor, status, ... },
  finalbossTemplate: "CharacterPage",
  tools: [],                       // e.g. "relationship-map"
  relationships: ["appears_in", "drives", "rival_of"],
  indexableWhen: "public_index"
}
```
Lives as versioned config consumed by (a) the GPBot projector (to stamp profile + validate attribute keys) and (b) FinalBoss (to pick a template + tools). **Grow it entity-type-by-entity-type as real games demand — do not pre-build all genres.** A DB-backed/admin-UI blueprint system is explicitly deferred as overengineering until there are enough entity types and non-engineer authors to justify it.

---

## 6. Ingestion & publication workflow

**Two intake modes into the same canonical store:**
1. **Machine-extracted** (existing path, extended): for released games, run gameplay-entity extraction over ingested guides/wikis/community content → operational rows → projector → `k_*`. Rights-aware; quality-gated.
2. **Curated/editorial** (new, essential for pre-launch): an operator path (CLI first, thin UI later) to assert confirmed entities + relationships (e.g. "Lucia — protagonist", "Vice City — setting", "confirmed vehicle X"). These enter as `resolver_source="manual"`, get `confidence=1.0`, flow through the *same* projector → `k_*` → API. This is how an **unreleased** game gets a real structured hub without fabricating gameplay data.

**Validation / review:** reuse the existing `MANUAL_REVIEW` state + quality gating. Curated entities are pre-verified (human-asserted); extracted entities must clear the quality thresholds before `public_index`. Anti-fabrication rule stands: no invented characters/missions — machine extraction must cite linked content; curated intake is human-verified only.

**Publication:** FinalBoss reads the Knowledge API, renders the hub + typed sub-pages, layers WordPress editorial + tools + ads, and emits per-hub sitemaps. ISR + cache-tags (`game:<slug>`, entity tags) drive freshness; a projection run bumps `lastBuiltAt` and FinalBoss revalidates by tag.

---

## 7. GTA VI as validation — and the challenge to the premise

**Where the brief is right:** GTA VI has generational pre-launch search demand and a huge community — the perfect flagship for *traffic*.

**Where the brief needs adjusting:** you cannot harden a *gameplay-entity extraction pipeline* on a game with **no gameplay data**. As of now GTA VI has: two trailers, a Vice City setting, two protagonists (Lucia + Jason), and speculation. Missions, weapons, vehicles, collectibles, map coordinates **do not exist yet**. Building the extraction pipeline against GTA VI now means testing against fixtures, not reality — the schema would be validated on nothing.

**Recommended split:**
- **GTA VI (now, pre-launch):** validate the **hub + curated-facts + news-intelligence + light-tools** path. This is what actually ranks pre-launch ("GTA 6 map", "GTA 6 characters", "GTA 6 release date", "everything we know", "confirmed features"). Populated by GPBot news intelligence + human-curated confirmed entities. Monetizable immediately.
- **A released game (parallel, now):** validate the **gameplay-entity extraction pipeline** on Elden Ring / BG3 / or a game FinalBoss already covers — real characters, bosses, items, quests to extract and dedup. Harden `attributes` profiles + relationship extraction + quality gating against *real* data.
- **GTA VI launch day:** flip on gameplay-entity extraction for GTA VI — the pipeline is already proven, the hub already ranks, the curated scaffold is already there. Both halves land proven.

This de-risks the whole program and means we're never blocked waiting on Rockstar.

---

## 8. Phased implementation plan

### Phase 0 — Consolidation & foundation (now; small; unblocks everything)
- **Decide the canonical game URL** and stop the two-surface cannibalization (see §9). Recommended: `/games/<slug>` becomes the hub; `/game/<slug>` 301s into it.
- **Centralize JSON-LD** (`app/lib/jsonld.ts`): `VideoGame`, `BreadcrumbList`, `ItemList`, `FAQPage`, `VideoObject`. Overdue regardless.
- **Implement the trending endpoint** in the Knowledge API (table + `read_store.trending()` already exist).
- **Promote `franchise` (and studio/publisher/platform) to `k_entity` rows** so they get hubs + relationships. Fill `k_entity_relationship` in the gaming projector (developed_by / published_by / part_of_franchise / sequel_of).

### Phase 1 — GTA VI flagship hub, curated + intelligence (now; the money surface)
- **Curated-entity intake** in GPBot (CLI + operational table) → projector emits `character`, `location`, `vehicle` entity types with `gaming.<type>.v1` profiles.
- **FinalBoss hub skeleton** (borrow handhelds engine pattern): `/games/<game>` hub landing with modules (overview, confirmed roster, locations, "everything we know" timeline, latest news, trending), + typed sub-pages `/games/<game>/characters/<slug>` etc., + dedicated hub sitemap + dense internal linking.
- **Light tools (client + localStorage, no accounts):** countdown, "confirmed features" checklist/tracker, character roster. These are cheap, ship pre-launch, and travel well socially (ties into the existing video/Postiz loop).
- **Blueprint registry v1** (declarative config) wired into both projector and templates — seeded with base + game/character/location/vehicle only.

### Phase 2 — Gameplay-entity extraction, hardened on a released game (parallel with Phase 1)
- **Extraction projector(s)** for a released title: missions/quests/items/bosses from ingested guides/wikis/community content, quality-gated, rights-aware.
- Harden attribute profiles + relationship extraction + dedup against real data. Add the RPG/soulslike family blueprint if the guinea-pig game is one.

### Phase 3 — GTA VI launch turn-on + tools that need real data (at/after launch)
- Enable gameplay-entity extraction for GTA VI; merge curated + extracted (curated wins on conflict).
- **Interactive map** with real coordinates; builds/calculators if stats exist; collectible trackers auto-generated from collectible entities.

### Explicitly premature / do NOT build now
- A DB-backed or admin-UI **blueprint CMS** / JSON-Schema validation engine.
- A generic "any game auto-gets a full gameplay DB" scraper before extraction is proven on one released game.
- **Cloning the file-based static handhelds engine per game** (re-introduces manual authoring + a *second* entity model competing with `k_*`). Reuse the *pattern*, source the *data* from the Knowledge API.
- Reddit/Steam/social collectors, native app, public API, subscriptions (out of scope / no demand signal yet).
- Per-game bespoke page code (defeats the whole reusability goal).

---

## 9. Migration path (avoid duplication & debt)

**The one real landmine is the two overlapping surfaces.** Today `/game/<slug>` (IGDB + WP articles) and `/games/<slug>` (Knowledge intelligence) are both "the game page" and compete in search. Do **not** add a third.

**Recommended consolidation:**
1. Make `/games/<slug>` the **canonical game HUB.** Add an "Articles" module that pulls the same WordPress game-tag posts the IGDB page uses (via existing GraphQL) so nothing is lost.
2. Fold IGDB catalog facts into the hub via the entity `attributes` (already partly there) — no separate IGDB page needed for the *canonical* view.
3. **301 `/game/<slug>` → `/games/<slug>`** (they already run permanent redirects in `next.config.js`; add this class). Update the root sitemap to drop `/game/*` hubs; the hub sitemap owns games.
4. Keep IGDB live-search (`/api/igdb/*`, the `/games` listing widgets) — that's discovery UX, not a competing canonical page.

**Reuse, don't reinvent:** copy the handhelds engine's registry/template/sitemap *skeleton* for the hub; keep the Knowledge client's cache-tag pattern; extend the existing projector rather than forking a parallel pipeline. One canonical store, one API contract, one hub URL per game.

---

## 10. Specific code areas that would change

**GPBot:**
- `worker/gpbot/knowledge/projectors/gaming.py` — emit multiple `entity_type`s; fill relationships + timeline; add per-type attribute builders + profile constants. (Or split into `projectors/gaming/{game,character,location,…}.py` behind the existing `for_vertical` registry.)
- `worker/gpbot/knowledge/` — new **blueprint registry** module (declarative entity-type → profile → relationship-types).
- `worker/gpbot/models.py` (+ migration) — new operational table(s) for **curated/extracted gameplay entities** + relationships; extend the resolver or add a curated-intake task.
- `worker/gpbot/knowledge_api/blueprints/trending.py` (+ register in `app.py`) — implement the spec'd endpoint.
- New operator CLI verbs for curated-entity intake (mirrors the existing `topics`/`pool` CLI ergonomics).

**FinalBoss:**
- `app/lib/knowledge/client.ts` + `types.ts` — add typed fetchers per entity type + relationships + trending; add profile-aware attribute typing.
- `app/lib/game-hub/` (new) — registries/queries mirroring `app/lib/handhelds/*` but sourced from the Knowledge API (blueprint → template map, related-entity link builders).
- `app/games/[slug]/` — evolve into the hub landing; add `app/games/[slug]/characters/[slug]/` etc. typed sub-routes + hub sitemap.
- `app/lib/jsonld.ts` (new) — centralized structured-data builders.
- `app/components/tools/` (new) — client tools (Countdown, Checklist/Tracker, Roster; later InteractiveMap).
- `next.config.js` — `/game/<slug>` → `/games/<slug>` redirect class; `app/sitemap.ts` / `app/robots.ts` updates.

---

## 11. Major risks

| Risk | Mitigation |
|---|---|
| **Cannibalization** from the two game surfaces | Consolidate to one canonical hub URL + 301 (Phase 0). |
| **Fabricated gameplay data** pre-launch (LLM inventing GTA VI missions) | Pre-launch = curated/human-verified entities only; extraction stays off until launch; anti-fabrication cite-or-drop rule. |
| **Thin/duplicate pages** hurting the whole domain (past soft-404 pain) | Keep `indexability_status` gating; `public_noindex` until an entity clears quality thresholds; hub-level ItemList only when children are indexable. |
| **Rights** on scraped guide/wiki content | Reuse existing `summary_policy` rights-aware model; link out, don't reproduce; owned prose in WordPress. |
| **Building blueprints too abstractly** (genre framework nobody needs yet) | Grow entity-type-by-entity-type; only GTA VI's types in Phase 1; no CMS. |
| **Projector full-swap cost** as entity count grows | Incremental projection is already a noted V1 deferral; revisit when `k_entity` volume warrants. |
| **Traffic-quality optics** (recent bot-flood context) | New hub pages are indexable, content-bearing, ad-safe — the opposite of the 404/no-content pages we paused ads on. |

---

## 12. Open decisions for the user

1. **Canonical URL:** confirm `/games/<slug>` as the hub and 301 `/game/<slug>` into it? (Recommended.)
2. **Curated-entity authoring surface:** operator CLI first (fast) vs a thin admin UI (slower, nicer for non-engineers)? (Recommended: CLI first.)
3. **The released-game guinea pig** for hardening extraction — Elden Ring, BG3, or a specific title FinalBoss already ranks for?
4. **Projector shape:** one multi-type `GamingProjector` vs one projector per entity type behind the registry? (Lean multi-type first; split if it gets unwieldy.)
5. **Second opinion:** want an independent architecture review (GPT/Architect) of this spec before we commit to Phase 0?
