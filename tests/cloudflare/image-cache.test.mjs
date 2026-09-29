import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = await mkdtemp(join(tmpdir(), 'fb-image-cache-'));
await build({ entryPoints: ['cloudflare/image-cache.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'cache.mjs') });
const { persistentImageResponse } = await import(pathToFileURL(join(dir, 'cache.mjs')));
const sourceUrl = 'https://backend.finalboss.io/wp-content/uploads/2026/09/test.webp';
function request({ method = 'GET', accept = 'image/avif,image/webp', width = '640', quality = '75', src = sourceUrl } = {}) {
  return new Request(`https://finalboss.io/_next/image?${new URLSearchParams({ url: src, w: width, q: quality })}`, { method, headers: { accept } });
}
function fixture({ edge = false } = {}) {
  let now = 1_000_000, content = 'original-v1', etag = '"v1"';
  const objects = new Map(), edgeObjects = new Map();
  const count = { transforms: 0, fetches: 0, reads: 0, writes: 0 };
  const bucket = {
    async get(key) {
      count.reads++;
      const item = objects.get(key);
      return item ? { body: new Response(item.value).body, json: async () => JSON.parse(item.value), httpMetadata: item.httpMetadata } : null;
    },
    async put(key, value, options) { count.writes++; objects.set(key, { value, ...options }); },
  };
  const env = { NEXT_INC_CACHE_R2_BUCKET: bucket, NEXT_PUBLIC_WORDPRESS_URL: 'https://backend.finalboss.io', IMAGES: {
    input(stream) { return { transform({ width }) { return { async output({ quality, format }) {
      count.transforms++;
      const input = await new Response(stream).text();
      return { image: () => new Response(`${input}:${width}:${quality}:${format}`).body };
    } }; } }; },
  } };
  const deps = {
    now: () => now,
    async fetch(url, options) {
      count.fetches++;
      assert.equal(url, sourceUrl);
      assert.equal(options.redirect, 'manual');
      if (options.headers?.get('If-None-Match') === etag) return new Response(null, { status: 304 });
      return new Response(content, { headers: { 'content-type': 'image/webp', etag } });
    },
    ...(edge ? { cache: {
      async match(key) { const v = edgeObjects.get(key); return v && now < v.expiry ? new Response(v.bytes, { headers: v.headers }) : undefined; },
      async put(key, value) { edgeObjects.set(key, { bytes: await value.arrayBuffer(), headers: new Headers(value.headers), expiry: now + 86400_000 }); },
    } } : {}),
  };
  return { env, deps, count, objects, bucket, advance: ms => { now += ms; }, change: () => { content = 'original-v2'; etag = '"v2"'; } };
}

test('100 identical requests transform once; outputs persist across request lifetimes', async () => {
  const f = fixture();
  for (let i = 0; i < 100; i++) {
    const r = await persistentImageResponse(request(), f.env, f.deps);
    assert.equal(r.status, 200); assert.equal(await r.text(), 'original-v1:640:75:image/avif');
  }
  assert.equal(f.count.transforms, 1); assert.equal(f.count.fetches, 1);
});

test('edge hits avoid R2 and encoding; AVIF/WebP and widths never collide', async () => {
  const f = fixture({ edge: true });
  await (await persistentImageResponse(request(), f.env, f.deps)).text();
  const reads = f.count.reads;
  for (let i = 0; i < 10; i++) await (await persistentImageResponse(request(), f.env, f.deps)).text();
  assert.equal(f.count.reads, reads);
  const webp = await persistentImageResponse(request({ accept: 'image/webp' }), f.env, f.deps);
  assert.equal(webp.headers.get('content-type'), 'image/webp'); assert.match(await webp.text(), /image\/webp$/);
  const smaller = await persistentImageResponse(request({ width: '320' }), f.env, f.deps);
  assert.match(await smaller.text(), /:320:/); assert.equal(f.count.transforms, 3);
});

test('next month: unchanged original is rechecked, derivative is not re-encoded', async () => {
  const f = fixture({ edge: true });
  await (await persistentImageResponse(request(), f.env, f.deps)).text();
  f.advance(32 * 86400_000);
  assert.match(await (await persistentImageResponse(request(), f.env, f.deps)).text(), /original-v1/);
  assert.equal(f.count.fetches, 2); assert.equal(f.count.transforms, 1);
});

test('replaced source at the same URL changes the digest and regenerates the variant', async () => {
  const f = fixture({ edge: true });
  await (await persistentImageResponse(request(), f.env, f.deps)).text();
  f.advance(86400_001); f.change();
  const r = await persistentImageResponse(request(), f.env, f.deps);
  assert.match(await r.text(), /original-v2/); assert.equal(f.count.transforms, 2);
});

test('HEAD returns no body and reuses a persisted GET variant', async () => {
  const f = fixture({ edge: true });
  const head = await persistentImageResponse(request({ method: 'HEAD' }), f.env, f.deps);
  assert.equal(await head.text(), '');
  const get = await persistentImageResponse(request(), f.env, f.deps);
  assert.match(await get.text(), /original-v1/); assert.equal(f.count.transforms, 1);
});

test('ineligible sources and parameters retain OpenNext validation with no R2 work', async () => {
  const f = fixture();
  for (const options of [{ src: 'https://evil.example/test.webp' }, { src: 'https://backend.finalboss.io/private/test.webp' },
    { src: 'https://backend.finalboss.io/wp-content/uploads/2026/09/test.gif' }, { width: '777' }, { width: '6.4e2' }, { quality: '90' }, { method: 'POST' }]) {
    assert.equal(await persistentImageResponse(request(options), f.env, f.deps), null);
  }
  const duplicate = new Request(request().url + '&w=320');
  assert.equal(await persistentImageResponse(duplicate, f.env, f.deps), null);
  assert.equal(f.count.reads, 0); assert.equal(f.count.fetches, 0);
});

test('cache write failures preserve image delivery; cache read failures allow fallback', async () => {
  const f = fixture();
  f.bucket.put = async () => { throw Error('unavailable'); };
  assert.match(await (await persistentImageResponse(request(), f.env, f.deps)).text(), /original-v1/);
  f.bucket.get = async () => { throw Error('unavailable'); };
  assert.equal(await persistentImageResponse(request(), f.env, f.deps), null);
});

test('source errors/redirects and non-images are not persisted or transformed', async () => {
  for (const response of [new Response(null, { status: 404 }), new Response(null, { status: 302, headers: { location: 'https://evil.example' } }), new Response('<html>', { headers: { 'content-type': 'text/html' } })]) {
    const f = fixture(); f.deps.fetch = async () => response;
    assert.equal(await persistentImageResponse(request(), f.env, f.deps), null);
    assert.equal(f.count.transforms, 0); assert.equal(f.count.writes, 0);
  }
});


test('failed edge writes do not hang HEAD or break GET', { timeout: 2000 }, async () => {
  const f = fixture({ edge: true });
  f.deps.cache.put = async () => { throw Error('cache unavailable'); };
  const head = await persistentImageResponse(request({ method: 'HEAD' }), f.env, f.deps);
  assert.equal(await head.text(), '');
  assert.match(await (await persistentImageResponse(request(), f.env, f.deps)).text(), /original-v1/);
  assert.equal(f.count.transforms, 1);
});

test('persistent optimizer accepts every configured width and matches format priority', async () => {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const config = require('../../next.config.js');
  assert.deepEqual(config.images.formats, ['image/avif', 'image/webp']);
  const f = fixture();
  for (const width of [...config.images.deviceSizes, ...config.images.imageSizes]) {
    const response = await persistentImageResponse(request({ width: String(width) }), f.env, f.deps);
    assert.equal(response.status, 200);
    await response.arrayBuffer();
  }
});
