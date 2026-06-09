# Article Reactions + Email Capture

"Was this guide helpful?" widget under every article (`ArticleReactions.tsx`).
Goal: engagement + return-visit hook + a content-quality signal, without the
empty-state problem of threaded comments at current traffic.

## Flow
- The headline is **category-aware** (`detectContentType` in `ArticleContent.tsx`): a review asks "Was this review useful?", a guide "Was this guide helpful?", news "Was this worth your time?", etc. The "Gaming" category is the news/opinion catch-all.
- **👍 Helpful** → records the vote, then offers an email opt-in (*"Get new {game} {reviews|guides|news} in your inbox"*) **+ an optional free-text note** ("Tell us what you liked").
- **👎 Not helpful** → records the vote, then asks *"What was missing?"* — selectable chips (Outdated / Incomplete / Wrong) **+ an optional note**. No email ask. This is the quality signal for GPBot.
- One vote per reader per article (anonymous `fb_client_id` in localStorage). The "done" state always shows the tally, so it never looks dead.

## Endpoints (`app/api/reactions/`)
| Route | Method | Body / Query | Notes |
|---|---|---|---|
| `/api/reactions` | GET | `?slug=` | → `{ up, down }` live counts |
| `/api/reactions` | POST | `{ slug, postId?, kind: 'up'\|'down', clientId }` | upsert vote, → counts |
| `/api/reactions/feedback` | POST | `{ slug, reason?, notes? }` | 👎 signal; reason (chip) and notes both optional, ≥1 required |
| `/api/reactions/email` | POST | `{ email, slug?, game?, reaction?, notes? }` | stores in Neon **and** Kit |

## Storage — Neon (Vercel Postgres), tables auto-migrated in `app/lib/db.ts`
- `article_reactions (slug, post_id, kind, client_id, …)` — unique on `(slug, client_id)`
- `article_reaction_feedback (slug, reason, notes, …)` — 👎 reasons + free-text; query for weak guides to refresh via GPBot
- `article_reaction_emails (email, slug, game, reaction, notes, …)` — captured opt-ins + what they liked

## Kit
Reuses `app/lib/kit.ts` `createSubscriber`. Email opt-ins are tagged with custom
fields `source=article_reaction` and `game=<name>` so you can segment per-game
digests. Falls back to source-only, then bare, if a custom field isn't defined
in the Kit account (so it never hard-fails).

## Querying the quality signal (example)
```sql
-- guides readers flagged as weak, worst first
select slug, count(*) filter (where true) as flags,
       array_agg(distinct reason) as reasons
from article_reaction_feedback
group by slug order by flags desc limit 50;
```
