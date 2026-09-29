import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
const result = await build({
  stdin: { contents: `
    import { DOQueueHandler as Base } from '@opennextjs/cloudflare/durable-objects/queue';
    import { withPersistentRetryCleanup } from ${JSON.stringify(resolve('cloudflare/revalidation-queue.ts'))};
    export class TestQueue extends withPersistentRetryCleanup(Base) {
      async scenario() {
        let calls = 0, status = 500;
        this.service = { fetch: async () => { calls++; return new Response(null, { status, headers: {'x-nextjs-cache':'REVALIDATED'} }); } };
        const msg = {MessageGroupId:'g',MessageDeduplicationId:'version-1',MessageBody:{host:'finalboss.io',url:'/test',lastModified:1}};
        await this.executeRevalidation(msg);
        const pending = this.sql.exec('SELECT COUNT(*) AS n FROM failed_state').toArray()[0].n;
        status = 200;
        await this.executeRevalidation(msg);
        const completed = this.sql.exec('SELECT COUNT(*) AS n FROM failed_state').toArray()[0].n;
        this.routeInFailedState.clear();
        await this.initState();
        await this.alarm();
        await this.ctx.storage.deleteAlarm();
        return {pending, completed, restored:this.routeInFailedState.size, calls};
      }
    }
    export default {async fetch(request, env) { return Response.json(await env.QUEUE.get(env.QUEUE.idFromName('test')).scenario()); }};
  `, resolveDir: process.cwd(), loader: 'ts', sourcefile: 'queue-integration.ts' },
  bundle: true, format: 'esm', platform: 'node', write: false, external: ['cloudflare:workers'],
  define: { 'process.env.__NEXT_BUILD_ID': '"test-build"', 'process.env.__NEXT_PREVIEW_MODE_ID': '"test-preview"' },
});
const mf = new Miniflare({modules:true,script:result.outputFiles[0].text,compatibilityDate:'2026-06-05',compatibilityFlags:['nodejs_compat'],durableObjects:{QUEUE:{className:'TestQueue',useSQLite:true}},serviceBindings:{WORKER_SELF_REFERENCE: async () => new Response(null,{status:200})}});
try {
  const response = await mf.dispatchFetch('https://test/'); const result = await response.json();
  assert.deepEqual(result,{pending:1,completed:0,restored:0,calls:2});
  console.log('PASS actual workerd + SQLite: failed retry persisted, successful retry removed, restart restores nothing and does not regenerate.');
} finally { await mf.dispose(); }
