import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import sharp from 'sharp';
import { resolve } from 'node:path';

let original = await sharp({ create: { width: 1280, height: 720, channels: 3, background: '#445566' } }).webp().toBuffer();
let etag = '"v1"';
let fetches = 0;
const result = await build({
  stdin: { contents: `import { persistentImageResponse } from ${JSON.stringify(resolve('cloudflare/image-cache.ts'))};
    let transforms = 0;
    export default { async fetch(request, env) {
      const images = { input(stream) { transforms++; return env.IMAGES.input(stream); } };
      const response = await persistentImageResponse(request, {...env, IMAGES: images}, {
        fetch: (...args) => env.SOURCE.fetch(...args), now: () => Number(request.headers.get('x-test-time') || 1000000)
      });
      if (!response) return new Response('fallback', {status: 418});
      response.headers.set('x-test-transforms', String(transforms));
      return response;
    }};`, resolveDir: process.cwd(), sourcefile: 'image-cache-integration.ts', loader: 'ts' },
  bundle: true, format: 'esm', platform: 'browser', write: false,
});
const mf = new Miniflare({ modules: true, script: result.outputFiles[0].text, compatibilityDate: '2026-06-05',
  images: { binding: 'IMAGES' }, r2Buckets: ['NEXT_INC_CACHE_R2_BUCKET'],
  bindings: { NEXT_PUBLIC_WORDPRESS_URL: 'https://backend.finalboss.io' },
  serviceBindings: { SOURCE: async request => {
    fetches++;
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304 });
    return new Response(original, { headers: { 'content-type': 'image/webp', etag } });
  } },
});
const url = `https://finalboss.io/_next/image?${new URLSearchParams({url:'https://backend.finalboss.io/wp-content/uploads/2026/09/test.webp',w:'320',q:'75'})}`;
try {
  let response = await mf.dispatchFetch(url, { headers: { accept: 'image/webp' } });
  assert.equal(response.status, 200);
  const first = Buffer.from(await response.arrayBuffer());
  const meta = await sharp(first).metadata();
  assert.equal(meta.width, 320); assert.equal(meta.height, 180); assert.equal(meta.format, 'webp');
  response = await mf.dispatchFetch(url, { headers: { accept: 'image/webp', 'x-test-time': String(1000000 + 32*86400000) } });
  assert.equal(response.headers.get('x-test-transforms'), '1');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), first); assert.equal(fetches, 2);
  original = await sharp({ create: { width: 1280, height: 720, channels: 3, background: '#aa2244' } }).webp().toBuffer();
  etag = '"v2"';
  response = await mf.dispatchFetch(url, { headers: { accept: 'image/webp', 'x-test-time': String(1000000 + 34*86400000) } });
  assert.equal(response.headers.get('x-test-transforms'), '2');
  assert.notDeepEqual(Buffer.from(await response.arrayBuffer()), first);
  const bucket = await mf.getR2Bucket('NEXT_INC_CACHE_R2_BUCKET');
  const keys = (await bucket.list({ prefix: 'image-derivatives/v1/' })).objects;
  assert.equal(keys.length, 3); // one source manifest and two content versions
  console.log('PASS workerd + real R2 + Images binding: 1280x720 -> 320x180 WebP; unchanged source reused after 32 days; replacement regenerated; 3 R2 objects.');
} finally { await mf.dispose(); }
