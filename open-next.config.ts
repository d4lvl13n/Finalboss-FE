import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';

// ISR setup mirroring the Vercel behavior this site depends on:
// - R2 holds the incremental cache (1h `revalidate` on all content routes),
//   with a regional Cache API layer in front so article reads stay fast.
// - The DO queue handles time-based revalidation.
// - The sharded DO tag cache is what makes `revalidatePath()` work — the
//   5-minute revalidate-recent cron depends on it.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: 'long-lived' }),
  queue: doQueue,
  tagCache: doShardedTagCache(),
  enableCacheInterception: true,
});
