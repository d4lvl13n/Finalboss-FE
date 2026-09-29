import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = await mkdtemp(join(tmpdir(), 'fb-queue-test-'));
const compiled = await build({
  stdin: { contents: `export { DOQueueHandler as Original } from '@opennextjs/cloudflare/durable-objects/queue';
    export { withPersistentRetryCleanup } from ${JSON.stringify(resolve('cloudflare/revalidation-queue.ts'))};`,
    resolveDir: process.cwd(), sourcefile: 'queue-test.ts', loader: 'ts' },
  bundle: true, format: 'esm', platform: 'node', write: false,
  plugins: [{ name: 'workers-base', setup(b) {
    b.onResolve({ filter: /^cloudflare:workers$/ }, () => ({ path: 'workers', namespace: 'test' }));
    b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }' }));
  } }],
});
const file = join(dir, 'queue.mjs');
await writeFile(file, compiled.outputFiles[0].text);
const { Original, withPersistentRetryCleanup } = await import(pathToFileURL(file));
const Fixed = withPersistentRetryCleanup(Original);
process.env.__NEXT_BUILD_ID = 'retry-regression';
process.env.__NEXT_PREVIEW_MODE_ID = 'test';
const msg = { MessageGroupId: 'g', MessageDeduplicationId: 'version-1', MessageBody: { host: 'finalboss.io', url: '/test', lastModified: 1 } };

function harness(Class) {
  const db = new DatabaseSync(':memory:');
  let status = 500, calls = 0, ready, alarm;
  const sql = { exec(query, ...args) { const rows = db.prepare(query).all(...args); return { toArray: () => rows, [Symbol.iterator]: () => rows[Symbol.iterator]() }; } };
  const ctx = { storage: { sql, getAlarm: async () => alarm, setAlarm: async n => { alarm = n; } },
    blockConcurrencyWhile(fn) { ready = fn(); }, waitUntil() {} };
  const env = { WORKER_SELF_REFERENCE: { fetch: async () => { calls++; return new Response(null, { status, headers: { 'x-nextjs-cache': 'REVALIDATED' } }); } } };
  return {
    async restart() { alarm = null; const q = new Class(ctx, env); await ready; return q; },
    status(n) { status = n; }, calls: () => calls,
    rows: () => db.prepare('SELECT COUNT(*) AS n FROM failed_state').get().n,
    close: () => db.close(),
  };
}

test('reproduces upstream bug: completed retries regenerate again after every restart', async () => {
  const h = harness(Original);
  try {
    let q = await h.restart(); await q.executeRevalidation(msg);
    h.status(200); await q.executeRevalidation(msg);
    assert.equal(q.routeInFailedState.size, 0); assert.equal(h.rows(), 1);
    for (let i = 0; i < 10; i++) { q = await h.restart(); await q.alarm(); }
    assert.equal(h.calls(), 12);
  } finally { h.close(); }
});

test('successful retry removes durable state and survives ten restarts without regenerating', async () => {
  const h = harness(Fixed);
  try {
    let q = await h.restart(); await q.executeRevalidation(msg);
    assert.equal(h.rows(), 1);
    h.status(200); await q.executeRevalidation(msg); assert.equal(h.rows(), 0);
    for (let i = 0; i < 10; i++) { q = await h.restart(); await q.alarm(); }
    assert.equal(h.calls(), 2);
  } finally { h.close(); }
});

test('pending failures remain durable and are retried after restart', async () => {
  const h = harness(Fixed);
  try {
    let q = await h.restart(); await q.executeRevalidation(msg);
    q = await h.restart(); assert.equal(q.routeInFailedState.size, 1);
    h.status(200); await q.alarm(); assert.equal(h.calls(), 2); assert.equal(h.rows(), 0);
  } finally { h.close(); }
});

test('404 terminal failure clears durable retry state', async () => {
  const h = harness(Fixed);
  try {
    let q = await h.restart(); await q.executeRevalidation(msg);
    h.status(404); await q.executeRevalidation(msg); assert.equal(h.rows(), 0);
    q = await h.restart(); await q.alarm(); assert.equal(h.calls(), 2);
  } finally { h.close(); }
});

test('exhausted retries cannot resurrect on the next restart', async () => {
  const h = harness(Fixed);
  try {
    let q = await h.restart();
    for (let i = 0; i < 7; i++) await q.executeRevalidation(msg);
    assert.equal(h.rows(), 0);
    q = await h.restart(); await q.alarm(); assert.equal(h.calls(), 7);
  } finally { h.close(); }
});

test.after(async () => { await rm(dir, { recursive: true, force: true }); });
