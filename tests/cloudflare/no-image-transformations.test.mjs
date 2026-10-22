import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const calls = { app: 0, transform: 0 };
globalThis.__noImageTransformCalls = calls;
const result = await build({
  entryPoints: [new URL('../../worker.ts', import.meta.url).pathname],
  bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
  plugins: [{ name: 'application-boundary', setup(builder) {
    builder.onResolve({ filter: /^\.\/\.open-next\/worker\.js$/ }, () => ({ path: 'app', namespace: 'test-app' }));
    builder.onLoad({ filter: /.*/, namespace: 'test-app' }, () => ({
      contents: `export class DOQueueHandler {} export class DOShardedTagCache {}
        export default { async fetch() { globalThis.__noImageTransformCalls.app++; return new Response('existing application'); } };`,
      loader: 'js',
    }));
  } }],
});
const worker = (await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)).default;
const env = { NEXT_PUBLIC_BASE_URL: 'https://finalboss.io', NEXT_PUBLIC_WORDPRESS_URL: 'https://backend.finalboss.io',
  IMAGES: { input() { calls.transform++; throw new Error('Forbidden paid transformation'); } },
  NEXT_INC_CACHE_R2_BUCKET: { get() { throw new Error('No image cache dependency permitted'); } },
};
const request = (source, ua = 'Mozilla/5.0', method = 'GET') => new Request(`https://finalboss.io/_next/image?url=${encodeURIComponent(source)}&w=1200&q=75`, { method, headers: { 'User-Agent': ua } });

test('cold images redirect to the source for browsers, search and AI agents without reaching any optimizer', async () => {
  for (const ua of ['Mozilla/5.0', 'Googlebot-Image/1.0', 'bingbot/2.0', 'GPTBot/1.4', 'OAI-SearchBot/1.4', 'ChatGPT-User/1.0', 'PerplexityBot/1.0', 'Perplexity-User/1.0', 'Claude-SearchBot/1.0', 'Claude-User/1.0', 'meta-webindexer/1.1', 'facebookexternalhit/1.1', 'HatchFeed/1.0']) {
    for (const source of ['https://backend.finalboss.io/wp-content/uploads/2026/10/cold.webp', 'https://images.igdb.com/igdb/image/upload/t_cover_big/example.jpg', 'https://i.ytimg.com/vi/example/hqdefault.jpg', '/brand-logo.png']) {
      for (const method of ['GET', 'HEAD']) {
        const before = calls.app;
        const response = await worker.fetch(request(source, ua, method), env, {});
        assert.equal(response.status, 302, `${ua}: ${source}`);
        assert.equal(response.headers.get('location'), new URL(source, 'https://finalboss.io').href);
        assert.equal(calls.app, before);
        assert.equal(calls.transform, 0);
      }
    }
  }
});

test('malformed, recursive and external redirect sources fail closed', async () => {
  for (const source of ['', '//evil.test/a.jpg', 'https://evil.test/a.jpg', 'javascript:alert(1)', 'http://backend.finalboss.io/wp-content/uploads/a.jpg', 'https://user:password@backend.finalboss.io/wp-content/uploads/a.jpg', '/_next/image?url=x', '/cdn-cgi/image/width=1/a.jpg', '/%5fnext/image?url=x', 'https://finalboss.io/%63dn-cgi/image/width=1/a.jpg']) {
    const before = calls.app;
    assert.equal((await worker.fetch(request(source), env, {})).status, 400, source);
    assert.equal(calls.app, before);
  }
  const duplicate = new Request('https://finalboss.io/_next/image?url=/a.jpg&url=/b.jpg');
  assert.equal((await worker.fetch(duplicate, env, {})).status, 400);
  assert.equal((await worker.fetch(request('/a.jpg', 'Mozilla/5.0', 'POST'), env, {})).status, 405);
  assert.equal(calls.transform, 0);
});

test('collectors are refused before either image handling or application execution', async () => {
  for (const ua of ['ImageBot/1.0', 'img2dataset', 'Mozilla/5.0 (compatible; meta-externalagent/1.1)', 'CCBot/2.0', 'Bytespider', 'ClaudeBot/1.0', 'AhrefsBot/7.0', 'SemrushBot/7.0']) {
    const before = calls.app;
    for (const url of ['https://finalboss.io/a-real-article', request('/a.jpg').url]) {
      const response = await worker.fetch(new Request(url, { headers: { 'User-Agent': ua } }), env, {});
      assert.equal(response.status, 403, ua);
    }
    assert.equal(calls.app, before);
  }
  assert.equal(calls.transform, 0);
});

test('search, citation, previews, health checks and ordinary visitors retain application access', async () => {
  for (const ua of ['Mozilla/5.0', 'Googlebot/2.1', 'bingbot/2.0', 'GPTBot/1.4', 'OAI-SearchBot/1.4', 'ChatGPT-User/1.0', 'PerplexityBot/1.0', 'Perplexity-User/1.0', 'Claude-SearchBot/1.0', 'meta-webindexer/1.1', 'meta-externalfetcher/1.1', 'facebookexternalhit/1.1', 'HatchFeed/1.0', 'GPBot-HealthCheck/1.0', 'NotImageBot/1.0']) {
    const before = calls.app;
    assert.equal((await worker.fetch(new Request('https://finalboss.io/article', { headers: { 'User-Agent': ua } }), env, {})).status, 200, ua);
    assert.equal(calls.app, before + 1);
  }
});

test('robots policy remains readable to blocked collectors and advertises the existing sitemaps', async () => {
  const response = await worker.fetch(new Request('https://finalboss.io/robots.txt', { headers: { 'User-Agent': 'Meta-ExternalAgent/1.1' } }), env, {});
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.match(text, /User-agent: Meta-ExternalAgent\nDisallow: \//);
  assert.doesNotMatch(text, /User-agent: (?:GPTBot|OAI-SearchBot|PerplexityBot|meta-webindexer)\nDisallow: \//i);
  assert.match(text, /Sitemap: https:\/\/finalboss.io\/sitemap.xml/);
  assert.equal(calls.transform, 0);
});
