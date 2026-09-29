import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import withQueueCache from '@opennextjs/cloudflare/overrides/queue/queue-cache';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';

// ISR setup mirroring the Vercel behavior this site depends on:
// - R2 holds the incremental cache (route-specific revalidation windows),
//   with a regional Cache API layer in front so article reads stay fast.
// - The DO queue handles time-based revalidation.
// - The sharded DO tag cache is what makes `revalidatePath()` work — the
//   5-minute revalidate-recent cron depends on it.
export default defineCloudflareConfig({
  // Without global cache purge, long-lived mode reads R2 again on EVERY hit.
  // Short-lived mode reuses the regional entry for 60s without that read.
  // Keep tag checks enabled: edits must still invalidate cached pages/data.
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'short-lived',
    shouldLazilyUpdateOnCacheHit: false,
    bypassTagCacheOnCacheHit: false,
  }),
  // Suppress repeated submissions of the same stale version for five seconds.
  // Cache only after acknowledgement so a failed enqueue remains retryable.
  queue: withQueueCache(doQueue, { waitForQueueAck: true }),
  tagCache: doShardedTagCache(),
  enableCacheInterception: true,
});
