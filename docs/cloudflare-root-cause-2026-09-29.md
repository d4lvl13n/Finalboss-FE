# Cloudflare cost root-cause investigation — 29 September 2026

## Evidence and scope

Read-only queries against the authenticated Cloudflare GraphQL Analytics API, the production R2 cache, the exact installed OpenNext 1.15.1 implementation, and the public WordPress REST API. Analytics counts use Cloudflare adaptive estimates; these are not a per-request invoice ledger. The supplied screenshot lacks billing-period dates. Periods below are explicit; they must not be substituted for the invoice period or used to claim an exact counterfactual bill.

## Images: automated catalogue collection, not just 1,000 daily visitors

- WordPress currently contains 48,865 media records and 6,988 published posts.
- Cloudflare reports 14,944 distinct source images transformed during 1–28 September and 96,368 unique transformations accumulated by 28 September (about 6.45 variants per original, across the catalogue).
- From 18 through 21 September, the accumulated unique-transformation counter increased from 50,006 to 91,073: **41,067 new variants in four days**.
- In exactly that window, `ImageBot/1.0`, explicitly identifying itself as an img2dataset research crawler, sent **94,212 requests** to `/_next/image`; **51,558 returned HTTP 200**. Successful responses by day: 11,164 / 16,701 / 16,891 / 6,802. It is the largest identified requester of successful image responses in this window. Collection is directly observed; attributing every new billed variant to this one agent would exceed the available evidence.
- A Firefox/156 user-agent string accounted for 648,278 image requests, but 647,012 were US HTTP 404 responses. This is substantial abnormal traffic, **not evidence of 648,278 paid transformations**. Do not block Firefox users based on this string.
- GPBot health checks produced 1,873 successful image responses in that four-day window, far below ImageBot. Bingbot produced 4,168. Do not attribute the whole spike to our health checks.
- Cloudflare's Images binding has been billed per unique source/parameters per calendar month since July 1, 2026. Missing response caching alone does not explain repeat within-month charges. Durable derivatives help subsequent months, but did not prevent a collector from asking for new catalogue variants.

The account API does not expose individual source URLs for binding transformations. The zone's current plan refuses the `clientRequestQuery` and ASN dimensions. Therefore exact paid variants per crawler cannot be reconstructed from these available aggregates.

## R2 and Durable Objects: excessive cache work and a reproduced retry defect

For 1–28 September (UTC):

| Component | Measured usage |
|---|---:|
| Tag-cache DO (`DOShardedTagCache`) | 31,908,507 RPCs; 260,751 GB-seconds |
| Revalidation queue DO (`DOQueueHandler`) | 1,493,607 RPCs + 1,603,025 alarms; 699,809 GB-seconds |
| R2 cache writes | 3,019,325 PutObject |
| R2 cache reads | 11,641,264 GetObject |
| R2 listings | 1 ListObjects + 1 ListMultipartUploads |

The queue accounts for approximately 73% of measured DO duration, while tag checks account for approximately 91% of DO requests. The bill is not caused by millions of R2 listing calls or a WebSocket application.

On 28 September alone, the Worker had 120,094 invocations, the tag cache had 1,510,740 RPCs, and R2 had 158,356 writes. `/articles` was rewritten 6,846 times. A historical article entry and `/sitemap.xml` were rewritten 1,607 and 1,168 times respectively even though their stored cache entries explicitly contain `revalidate: 86400`. Repeated visitor requests alone should not cause daily cache entries to be rewritten that often.

**Concrete defect in OpenNext 1.15.1:** `addToFailedState()` inserts retries into SQLite `failed_state`. Successful retries, terminal 404s, fatal outcomes and exhausted retry budgets remove entries only from the in-memory map. `initState()` reads all persisted failures after a DO restart and schedules their alarms again. The SQL table is cleaned only for a different build ID. Thus a once-failed task can regenerate a successfully repaired page again after every DO restart. The retry limit is also ineffective across restarts after the in-memory record is discarded.

Reproduction using the actual installed adapter and SQLite: failure -> success leaves one persistent retry row and zero in-memory rows. Ten simulated restarts cause ten additional regenerations (12 calls total instead of 2). This establishes the defect and its cost mechanism. Aggregate production metrics show the queue's large cost and repeated writes; without the historical internal retry table, they do not establish that every alarm/write came from this defect.

The default four-shard tag cache also performs multiple RPCs per cache lookup. The earlier regional-cache change deliberately kept these checks for immediate invalidation, so it does not remove this expense. A further reviewed change can bypass tag checks for the regional cache's 60-second lifetime (with explicitly bounded additional staleness), or move the tag cache to D1 with an invalidation-state migration.

## Prepared corrections

1. `cloudflare/revalidation-queue.ts` wraps the generated OpenNext DO class and deletes a retry's SQL row when the upstream implementation has finished/abandoned it. Pending retries remain durable. Build IDs and preview tokens remain those of the generated class; no namespace or schema migration is needed.
2. `cloudflare/image-access.ts` rejects identified ImageBot/img2dataset requests to the paid optimizer before source fetches, R2 or Images binding calls. It does not reject Googlebot-Image, Bingbot, GPBot health checks or generic browser user agents. Blocking this self-declared collector is limited protection: user agents are spoofable and WordPress originals remain public. A broader defence needs rate limiting at the edge or a media pipeline serving pre-generated WordPress sizes rather than exposing arbitrary paid transformations.
3. Already deployed: persistent WordPress derivatives, fewer Next route prefetches, short-lived regional reads and queue submission deduplication. These address additional amplification but do not repair persistent retry resurrection or stop a crawler requesting new variants.

Validation: 5 SQLite queue regression tests, 3 collector-filter tests, actual workerd + SQLite integration, targeted lint, and Wrangler dry-run all pass. The fixed queue performs only 2 calls through the same failure/success/10-restart scenario, preserves pending work, and does not resurrect terminal/exhausted tasks.

## Sources

- https://developers.cloudflare.com/changelog/post/2026-07-01-binding-unique-transformations/
- https://developers.cloudflare.com/images/pricing/
- https://developers.cloudflare.com/images/optimization/binding/
- https://opennext.js.org/cloudflare/caching
- Installed implementation: `node_modules/@opennextjs/cloudflare/dist/api/durable-objects/queue.js` and `overrides/tag-cache/do-sharded-tag-cache.js`.
