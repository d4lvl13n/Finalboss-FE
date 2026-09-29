# FinalBoss Cloudflare cost audit — 2026-09-29

## Scope and evidence

User confirms the usage screenshot covers FinalBoss.io only. Visible usage costs: $83.66, including Images $47.50, Durable Objects $18.80, R2 $15.60 and Workers CPU $1.76. The screenshot itself does not show the billing dates or base subscription. No monthly attribution by URL is available.

Read the deployed Worker via Cloudflare API (version observed in logs: `06210ba3-af62-41cd-9f16-3b4b291f5ed5`), not only the local repository. It contains the same long-lived regional R2 cache, uncached Durable Object queue and default four-shard tag cache as local `open-next.config.ts` before this patch. The deployed Images binding handles `/_next/image`.

A bounded live tail captured 285 events spanning 35.012 seconds. It included 59 external HTTP requests, 29 explicitly marked Next router prefetch requests, 63 internal ISR HTTP requests and 153 `hasBeenRevalidated` RPCs. Thirteen external requests used `GPBot-HealthCheck/1.0`; seven requested image optimization via HEAD. Other events included queue RPCs/alarms and the cron. This is a short current sample, not a monthly traffic estimate; unrelated in-flight work can finish during the sample. All tail processes were stopped.

## Reproduced cost mechanisms

1. With no automatic global cache purge configured, OpenNext 1.15.1 long-lived regional caching defaults to re-reading R2 in the background on every regional hit. Tag checks also remain enabled. A harness using the installed adapter, mock R2/DO bindings and a warm in-memory Cache API produced 100 R2 reads and 300 tag RPCs for 100 identical page requests (four example Next tags mapped to three shards). This is a reproducible adapter/configuration mechanism, not a production monthly multiplier.
2. Next Link prefetch is enabled by default. Navigation, cards and related links can fetch routes which readers never open; stale prefetched routes can trigger full ISR regeneration and cache writes. The live sample explicitly contains those prefetch headers.
3. `/articles` uses 60-second ISR despite already being invalidated by the five-minute publish/update cron.
4. Image optimization runs on HEAD as well as GET, with no transformed-response cache in the deployed image handler. The GPBot health checker source confirms it checks up to 20 image `src` URLs per article with HEAD and `Accept: */*`. Its daily selection is capped at 100 articles, plus post-publication/manual checks. This establishes a consumer, not responsibility for last month's whole image bill.
5. Images are billed as unique monthly transformations according to current Cloudflare documentation. Repeat execution alone does not prove repeat billing. The displayed 99.54k total transformations still needs breakdown by source/width to quantify avoidable variants. No claimed image savings from this patch.

## Local corrective patch (NOT deployed)

- Disable automatic prefetch on 23 Link declarations in Header, Footer, ArticleCard, LatestArticles, LatestSidebar, RelatedArticles and InlineRelatedLinks. Navigation still works on click, with possible additional click-to-navigation latency. Existing user changes in those files were preserved.
- Use short-lived regional cache: 60-second regional entries and no lazy R2 refresh on hits. Keep tag checks enabled to preserve on-demand invalidation; this does NOT remove all tag-cache RPCs. Cross-region refresh behavior still needs live verification.
- Wrap the revalidation queue with the adapter's five-second queue cache, waiting for acknowledgement before remembering a submission. A new content version has a distinct deduplication key; failed submissions remain retryable.
- Set `/articles` fallback ISR to one hour; keep cron-driven invalidation.

## Verification

- Installed-adapter harness: 100 identical page reads changed from 100 to 1 R2 read. Tag checks remained at 300 by design. Invalidation remained observable and simulated cache eviction caused a new R2 read.
- Queue harness: 100 identical submissions resulted in one underlying queue call; new versions and failed submissions were retried.
- Targeted Next lint passed for all eight changed TSX files.
- OpenNext configuration bundled and loaded; standalone TypeScript check passed.
- `git diff --check` passed.
- No full application build, deployment or measured production savings. No Cloudflare settings or GPBot code changed. The historic $13.50 R2 Class A line is not fully attributed by these tests; the demonstrated read reduction concerns Class B, while fewer prefetch-triggered regenerations should reduce writes but the magnitude remains unmeasured.

## Image correction added after the first patch (local only)

`cloudflare/image-cache.ts`, called by `worker.ts`, persists derivatives of dated JPEG/PNG/WebP/AVIF WordPress uploads in the existing R2 bucket under `image-derivatives/v1/`. Keys include the source content digest, width, quality and output format. An edge Cache API layer avoids R2 reads for warm variants. A daily source check uses HTTP validators when available; changed source bytes get a new digest and derivative. Unchanged derivatives survive month boundaries and deployments. The implementation retains AVIF/WebP negotiation, all existing widths and quality 75. Unsupported sources/formats/parameters and storage failures fall back to the existing OpenNext handler. Source bodies and outputs are limited to 20 MiB. No new Cloudflare resource or credentials are needed. Browser/edge TTL is one day; source replacement propagation is bounded by cache/check windows rather than immediate. Concurrent cold misses may encode more than once; this is not an exactly-once transaction. Old content versions are retained in R2, so storage usage must be observed. Existing global bucket lifecycle policies, if any, may shorten persistence.

This specifically targets recurring transformations of unchanged uploads, not all new-image costs. Other origins (IGDB, YouTube), local assets, GIFs and legacy non-dated uploads continue through OpenNext. The sampled homepage contained 52 backend images, 6 YouTube images, 3 IGDB images and 2 local images; this is not a monthly transformation mix. R2 operations/storage remain billable.

Validation: ten focused tests pass (`node --test tests/cloudflare/image-cache.test.mjs`). A local workerd/Miniflare integration with actual emulated R2 and Images bindings resized a real 1280x720 WebP to 320x180, reused identical output after a simulated 32-day interval without another encoder call, and regenerated after source replacement (`node tests/cloudflare/image-cache.integration.mjs`). Targeted lint and TypeScript checks pass. Wrangler dry-run bundles the new wrapper successfully using the existing `.open-next` build; this is NOT a full rebuild of all frontend changes or a deployment.

## Remaining major work

Remaining tag-cache overhead is not eliminated by these patches. A further option is the D1 tag cache recommended by OpenNext for smaller sites. Switching tag stores requires an explicit cache-state migration; simply reducing the shard count would change tag locations and risk losing invalidations. Do not promise near-zero billing from these local changes.
