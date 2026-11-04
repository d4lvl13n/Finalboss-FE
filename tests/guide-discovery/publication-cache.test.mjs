import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../../app/lib/publication-cache.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText,
  { exports, fetch, URLSearchParams, Set, AbortSignal });
const { discoverPublicationPaths, publicationPaths } = exports;
const respond = (value, total) => new Response(JSON.stringify(value), { headers: total ? { 'x-wp-totalpages': String(total) } : {} });

test('a 90-post publication refreshes both pages of posts and every affected guide/game archive', async () => {
  const posts = Array.from({ length: 90 }, (_, i) => ({ slug: `totk-${i}`, categories: [6194, 6208], game: [7339] }));
  const pages = [];
  const mock = async (url) => {
    const u = new URL(url);
    if (u.pathname.endsWith('/posts')) {
      const page = Number(u.searchParams.get('page'));
      pages.push(page);
      return respond(posts.slice((page - 1) * 50, page * 50), 2);
    }
    if (u.pathname.endsWith('/categories')) return respond([{ id: 6194, slug: 'gaming-guide', parent: 0 }, { id: 6208, slug: 'zelda-tears-of-the-kingdom-guide', parent: 6194 }]);
    return respond([{ id: 7339, slug: 'the-legend-of-zelda-tears-of-the-kingdom' }]);
  };
  const result = await discoverPublicationPaths('https://wp.example', '2026-11-03T00:00:00', mock);
  assert.equal(result.postsChecked, 90);
  assert.deepEqual(pages, [1, 2]);
  const paths = new Set(result.paths);
  for (const post of posts) assert.ok(paths.has('/' + post.slug));
  for (const path of ['/guides', '/guides/zelda-tears-of-the-kingdom-guide', '/game/the-legend-of-zelda-tears-of-the-kingdom']) assert.ok(paths.has(path));
  assert.equal(paths.size, result.paths.length);
  assert.ok(!paths.has('/guides/gaming-guide'));
});

test('a child-only category assignment still resolves its guide parent', async () => {
  const calls = [];
  const mock = async (url) => {
    calls.push(url);
    return new URL(url).searchParams.get('include') === '6208'
      ? respond([{ id: 6208, slug: 'totk', parent: 6194 }])
      : respond([{ id: 6194, slug: 'gaming-guide', parent: 0 }]);
  };
  const paths = await publicationPaths('https://wp.example', [{ slug: 'one', categories: [6208] }], mock);
  assert.ok(paths.includes('/guides/totk'));
  assert.equal(calls.length, 2);
});

test('a quiet publication window performs no archive lookups or invalidations', async () => {
  let calls = 0;
  const result = await discoverPublicationPaths('https://wp.example', '2026-11-03T00:00:00', async () => { calls++; return respond([]); });
  assert.equal(result.postsChecked, 0);
  assert.equal(result.paths.length, 0);
  assert.equal(calls, 1);
});

test('ordinary categories do not become nonexistent guide archive paths', async () => {
  const paths = await publicationPaths('https://wp.example', [{ slug: 'news', categories: [1] }], async () => respond([{ id: 1, slug: 'gaming', parent: 0 }]));
  assert.ok(!paths.includes('/guides/gaming'));
});

test('backend failures fail the sweep instead of claiming successful invalidation', async () => {
  await assert.rejects(discoverPublicationPaths('https://wp.example', '2026-11-03T00:00:00', async () => new Response('', { status: 503 })), /503/);
});

test('oversized backfills are explicit rather than silently dropping articles', async () => {
  await assert.rejects(discoverPublicationPaths('https://wp.example', '2026-11-03T00:00:00', async () => respond(Array.from({ length: 50 }, (_, i) => ({ slug: `post-${i}` })), 11)), /exceeds 500/);
});
