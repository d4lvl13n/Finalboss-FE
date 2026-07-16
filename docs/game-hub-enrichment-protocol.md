# Game-Hub Entity Enrichment Protocol

The repeatable, source-disciplined process for turning thin entity records
(class / character / weapon) into rich, cited hub pages. Runs identically per
game so it can be lifted into a skill. Proven on Diablo IV (commits `0ffe00a`,
`9940cad`).

## Doctrine (non-negotiable)

1. **Research lanes, IN THIS ORDER. GPBot first, Perplexity last (complement).** Never one source.
   | # | Lane | Tool (exact) | Good for | Never |
   |---|---|---|---|---|
   | 1 | **GPBot pool** (first-party) | `gpbot pool entities/items/trends` CLI | Real dated, cited headlines & sources our own system holds — the current-state layer (patch versions, dates) | skipping it for Perplexity |
   | 2 | **Reddit** (sentiment) | `~/codolie-video-studio/scripts/reddit/reddit-search-term.mjs` (real OAuth API) | Honest strengths/weaknesses + overview flavor | a model `site:reddit.com` WebSearch; a build/tier/item FACT |
   | 3 | **Perplexity** (complement) | `pplx_run.py`, model **`sonar-pro`** (never `sonar`) | Filling gaps + a cross-check | the sole source for a fact |
   | — | **Authority** (verify) | game8 / IGN / Prydwen / Maxroll / official (WebFetch) | Confirming hard facts before they ship | — |

   Also: check the KG entity (`.../v1/gaming/entities`) and set `GameData.knowledgeSlug`
   so the hub's News & Buzz panel lights up (dark otherwise).

2. **Cite-or-drop, build-enforced.** Every record needs ≥1 real authoritative
   URL in `sources[]`. `validate.ts` throws at build time on an unsourced record,
   so unsourced data physically cannot ship. If a claim traces only to an
   aggregator (timesaver.gg, d4gold) or YouTube, verify on an authority site or drop it.

3. **No single source trusted blindly.** `sonar` hallucinated that Diablo's
   Necromancer/Warlock "don't exist"; the authority cross-check caught it. Build
   the cross-check into every pass.

4. **Field applicability is per-blueprint. Do NOT force build data where none exists.**

   | Blueprint | overview | coreMechanic | builds | keyItems (heading) | strengths / weaknesses | tierRationale | skills |
   |---|---|---|---|---|---|---|---|
   | `action_rpg` (CoA) | ✅ | ✅ class system | ✅ meta builds | ✅ Key Aspects & Uniques | ✅ | ✅ | ✅ |
   | `gacha` (BD2, ZZZ) | ✅ | ✅ kit/role | ✅ recommended loadouts/teams | ✅ Best Gear (discs/W-engines/gear) | ✅ | ✅ ties to tier axes | ✅ |
   | `looter_shooter` (Arc) | ✅ | ✅ niche/fire mode | ✅ attachment setups | ✅ Best Attachments | ✅ | ✅ | — |
   | `open_world` **pre-launch** (GTA VI, Fable) | ✅ confirmed bio/role only | — | ❌ nothing to source | ❌ | ❌ | ❌ | ❌ |

   Pre-launch open-world = **overview + confirmed facts only**. Fabricating
   builds/tiers for an unreleased game is the cardinal sin. Cite official reveals/trailers.

5. **Depth honestly, not uniformly.** Meta-relevant units get full depth; off-meta
   filler gets a solid overview + role, not invented builds. Padding filler with
   fake builds is the lazy/dishonest move — mirror how Prydwen/game8 treat rosters.

## Pipeline (per game)

- **P0 Recon** — blueprint, unitType, roster list, LIVE vs PRE-LAUNCH, current data state.
- **P1 Research** — run `pplx_research.py` (sonar-pro) with per-game queries → `<slug>_pplx.json`.
- **P2 Synthesis** — one Opus agent per game: reconcile all three lane outputs (GPBot pool JSON for current-state facts + Reddit txt for sentiment + Perplexity JSON to fill gaps) with authority WebFetch, per the field matrix, cite-or-drop.
- **P3 Gate** — `npm run build` must exit 0 (validates all sources); field-coverage grep; spot-check 2-3 pages return 200 and render new sections + sibling nav.
- **P4 Commit** — one commit per game (or per wave), never sweeping unrelated files.

## Authoritative sources per game

| Game | slug | Blueprint | State | Authority sites |
|---|---|---|---|---|
| Crystal of Atlan | `crystal-of-atlan` | action_rpg | LIVE | game8, official site, Fandom |
| Brown Dust 2 | `browndust2` | gacha | LIVE | prydwen.gg/brown-dust-2, game8 |
| Zenless Zone Zero | `zenless-zone-zero` | gacha | LIVE | prydwen.gg/zenless, game8, HoYoLAB |
| Arc Raiders | `arc-raiders` | looter_shooter | LIVE | official arcraiders.com, IGN/community wiki, game8 |
| GTA VI | `gta-6` | open_world | PRE-LAUNCH | Rockstar Newswire, trailers, IGN/GameSpot |
| Fable | `fable` | open_world | PRE-LAUNCH | Xbox/Playground official, reveals, IGN |

## Reusable tooling

- `pplx_research.py` — Perplexity runner, **default model `sonar-pro`**. Key `PERPLEXITY_API_KEY`
  from `~/gpbot/worker/.env`. Direct API — NOT GPBot `topics submit` (that publishes articles).
- The depth schema (`BuildRef`/`KeyItem` + fields on `ClassRecord`/`ClassAttributes`), the
  render (`ClassDetail`, `SiblingNav`, `keyItemsHeading` per blueprint), and `validate.ts`
  enforcement are already in the engine — enrichment is data-only from here.

## Anti-patterns (the YOLO list)

- Leading with Perplexity / skipping the GPBot pool (it holds the real current-state facts).
- A model `site:reddit.com` WebSearch instead of the `reddit-search-term.mjs` script.
- Not checking the KG entity / not wiring `knowledgeSlug` (leaves the News & Buzz panel dark).
- Using `sonar` instead of `sonar-pro`.
- Sourcing a build/tier/item from a Reddit comment.
- Forcing builds/tiers onto a pre-launch open-world roster.
- Padding off-meta filler units with invented builds to look complete.
- One giant build at the end with no per-game gate.
- `git add -A` sweeping unrelated untracked docs into a commit.
