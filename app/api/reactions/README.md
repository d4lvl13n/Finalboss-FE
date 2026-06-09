# Article Reactions + Email Capture

"Was this guide helpful?" widget under every article (`ArticleReactions.tsx`).
Goal: engagement + return-visit hook + a content-quality signal, without the
empty-state problem of threaded comments at current traffic.

## Flow
- **👍 Helpful** → records the vote, then offers an email opt-in: *"Get new {game} guides in your inbox."*
- **👎 Not helpful** → records the vote, then asks *"What was missing?"* (Outdated / Incomplete / Wrong). No email ask — this is the quality signal for GPBot.
- One vote per reader per article (anonymous `fb_client_id` in localStorage). The "done" state always shows the tally, so it never looks dead.

## Endpoints (`app/api/reactions/`)
| Route | Method | Body / Query | Notes |
|---|---|---|---|
| `/api/reactions` | GET | `?slug=` | → `{ up, down }` live counts |
| `/api/reactions` | POST | `{ slug, postId?, kind: 'up'\|'down', clientId }` | upsert vote, → counts |
| `/api/reactions/feedback` | POST | `{ slug, reason: 'outdated'\|'incomplete'\|'wrong' }` | 👎 reason |
| `/api/reactions/email` | POST | `{ email, slug?, game?, reaction? }` | stores in Neon **and** Kit |

## Storage — Neon (Vercel Postgres), tables auto-migrated in `app/lib/db.ts`
- `article_reactions (slug, post_id, kind, client_id, …)` — unique on `(slug, client_id)`
- `article_reaction_feedback (slug, reason, …)` — 👎 reasons; query for weak guides to refresh via GPBot
- `article_reaction_emails (email, slug, game, reaction, …)` — captured opt-ins

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
