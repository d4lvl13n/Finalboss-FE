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

## Corrections deployed

1. `cloudflare/revalidation-queue.ts` wraps the generated OpenNext DO class and deletes a retry's SQL row when the upstream implementation has finished/abandoned it. Pending retries remain durable. Build IDs and preview tokens remain those of the generated class; no namespace or schema migration is needed.
2. `cloudflare/image-access.ts` rejects identified ImageBot/img2dataset requests to the paid optimizer before source fetches, R2 or Images binding calls. It does not reject Googlebot-Image, Bingbot, GPBot health checks or generic browser user agents. Blocking this self-declared collector is limited protection: user agents are spoofable and WordPress originals remain public. A broader defence needs rate limiting at the edge or a media pipeline serving pre-generated WordPress sizes rather than exposing arbitrary paid transformations.
3. Already deployed: persistent WordPress derivatives, fewer Next route prefetches, short-lived regional reads and queue submission deduplication. These address additional amplification but do not repair persistent retry resurrection or stop a crawler requesting new variants.

Validation: 5 SQLite queue regression tests, 3 collector-filter tests, actual workerd + SQLite integration, targeted lint, and Wrangler dry-run all pass. The fixed queue performs only 2 calls through the same failure/success/10-restart scenario, preserves pending work, and does not resurrect terminal/exhausted tasks.

## Deployment and live verification

- Implementation commit: `cdd2765`, pushed to `origin/main`.
- Cloudflare Worker version: `25ae675d-285f-497d-8c29-3c420749cd10`, deployed on 29 September 2026 to both production domains. Existing Next.js assets, bindings, cron and DO namespaces were retained.
- The normal Wrangler command delegated to OpenNext and began an unnecessary R2 cache repopulation. That local command was stopped before Worker deployment. The final wrapper-only release used `OPEN_NEXT_DEPLOY=true npx wrangler deploy` against the already deployed build, with no changed static assets.
- Live checks of the same known WordPress image: ImageBot and img2dataset received **403**; a browser, Googlebot-Image and Bingbot each received **200 image/webp**, 3,424 bytes.
- Homepage and `/articles` returned **200** after deployment.
- Queue cleanup is proven by the adapter/SQLite regression and actual workerd integration tests. Post-deployment monthly savings and reduction in production queue metrics have not yet been measured. The bot filter is not an identity guarantee or a block on direct access to WordPress originals.

## First production comparison after all deployed corrections

Rechecked the active deployment on 29 September at approximately 10:34 UTC: version `25ae675d-285f-497d-8c29-3c420749cd10` receives 100% of production traffic. Repeated public probes again returned 403 for ImageBot/img2dataset and 200 for browser/Googlebot-Image/Bingbot, homepage and articles.

Authenticated GraphQL comparison: 08:00–08:30 UTC (before these releases) versus 09:45–10:15 UTC (after both releases) on 29 September. These are two equal, short observational windows, not a controlled experiment or a monthly forecast. Adaptive estimates and traffic mix can differ.

| Metric | Before, 30 min | After, 30 min | Change |
|---|---:|---:|---:|
| Worker invocations | 2,331 | 1,846 | -20.8% |
| Queue retry alarms | 1,797 | 2 | -99.9% |
| Queue RPCs | 2,211 | 123 | -94.4% |
| Tag-cache RPCs | 37,369 | 2,378 | -93.6% |
| Total measured DO duration (GB-seconds) | 1,145.26 | 103.20 | -91.0% |
| R2 PutObject | 4,189 | 1,393 | -66.7% |
| R2 GetObject | 13,533 | 2,807 | -79.3% |

The DO duration reduction is approximately 88.6% even when normalized by Worker invocation count (0.491 to 0.056 GB-seconds per invocation). The simultaneous traffic reduction alone is therefore insufficient to explain the observed improvement, although invocation mix and deployment cache resets prevent isolating each individual fix's contribution. Initial image-derivative population and deployment cache activity may affect R2 writes.

The image binding was invoked 257 versus 205 times; this is an invocation measure, **not** the number of new, unique monthly billed transformations. It does not yet establish the image-bill saving. Historical charges are unaffected. Costs remaining in later windows must be measured rather than extrapolating this short observation to a zero-dollar bill.

## Sources

- https://developers.cloudflare.com/changelog/post/2026-07-01-binding-unique-transformations/
- https://developers.cloudflare.com/images/pricing/
- https://developers.cloudflare.com/images/optimization/binding/
- https://opennext.js.org/cloudflare/caching
- Installed implementation: `node_modules/@opennextjs/cloudflare/dist/api/durable-objects/queue.js` and `overrides/tag-cache/do-sharded-tag-cache.js`.
