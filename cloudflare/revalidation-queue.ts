import type { DOQueueHandler as OpenNextQueue } from '@opennextjs/cloudflare/durable-objects/queue';
import type { QueueMessage } from '@opennextjs/aws/types/overrides.js';

/** OpenNext 1.15.1 forgets completed retries in memory but leaves them in SQLite.
 * A subsequent DO restart restores those rows and regenerates the pages again.
 * Wrap the generated class so its build ID and preview token stay unchanged.
 */
export function withPersistentRetryCleanup(Base: typeof OpenNextQueue) {
  return class PersistentRetryQueue extends Base {
    async executeRevalidation(msg: QueueMessage): Promise<void> {
      await super.executeRevalidation(msg);
      // Keep actual pending retries durable. Success, terminal failure and
      // exhausted retries all remove the entry from the upstream in-memory map.
      if (!this.disableSQLite && !this.routeInFailedState.has(msg.MessageDeduplicationId)) {
        this.sql.exec('DELETE FROM failed_state WHERE id = ?', msg.MessageDeduplicationId);
      }
    }
  };
}
