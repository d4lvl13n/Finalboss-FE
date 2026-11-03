import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync(new URL('../../cloudflare/totk-robots.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { withTotkRobots } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const base = 'https://finalboss.io/game/the-legend-of-zelda-tears-of-the-kingdom';

test('a cached facet header never makes a canonical collection or detail noindex', async () => {
  for (const path of ['/builds', '/builds/category/flying', '/recipes', '/recipes/apple-pie']) {
    const cached = new Response('page', { headers: { 'X-Robots-Tag': 'noindex, follow', 'Content-Type': 'text/html' } });
    const result = withTotkRobots(new Request(base + path), cached);
    assert.equal(result.headers.get('X-Robots-Tag'), null);
    assert.equal(result.headers.get('Content-Type'), 'text/html');
    assert.equal(await result.text(), 'page');
    assert.equal(cached.headers.get('X-Robots-Tag'), 'noindex, follow');
  }
});

test('search, filters and simulator presets remain noindex and do not enter shared response caches', () => {
  for (const path of ['/builds?q=bike', '/builds/category/flying?budget=30', '/recipes?method=freeze', '/recipes/cooking-simulator?ingredients=Item_Fruit_A']) {
    const result = withTotkRobots(new Request(base + path), new Response('page', { headers: { 'Cache-Control': 'public, max-age=3600' } }));
    assert.equal(result.headers.get('X-Robots-Tag'), 'noindex, follow');
    assert.match(result.headers.get('Cache-Control'), /private.*no-store/);
  }
});

test('errors, redirects, other pages and image assets keep their existing response policy', () => {
  for (const [url, status] of [[base+'/recipes/missing',404], [base+'/recipes/page/1',308], ['https://finalboss.io/gaming',200], ['https://finalboss.io/totk-recipes/apple.webp',200]]) {
    const response = new Response('unchanged', { status, headers: { 'X-Robots-Tag': 'noindex' } });
    assert.equal(withTotkRobots(new Request(url), response), response);
  }
});
