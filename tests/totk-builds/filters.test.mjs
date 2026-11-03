import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const bundled = await build({
  entryPoints: [new URL('../../app/lib/totk-builds/filters.ts', import.meta.url).pathname],
  bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22',
});
const { filterBuilds, readBuildFilters, buildFilterParams } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const defaults = readBuildFilters(new URLSearchParams());
const make = (id, extra) => ({ id, name: `Build ${id}`, description: '', tags: [], categories: ['flying'], type: 'Flying machine', zonaite: null, score: 0, views: 0, tested: false, ...extra });
const builds = [
  make(1, { name: 'Éclair Hoverbike', description: 'Balanced two-fan bike', tags: ['bike'], zonaite: 9, score: 10, views: 100 }),
  make(2, { name: 'Battle Bike', categories: ['flying', 'combat'], tags: ['bike'], zonaite: 30, score: 8, views: 300, tested: true }),
  make(3, { name: 'Unknown Cost Bike', tags: ['bike'], score: 20, views: 500 }),
  make(4, { name: 'Free Platform', categories: ['utility'], zonaite: 0, score: 5, views: 50 }),
];

test('search is accent-insensitive and combines words, category, budget and test filters', () => {
  assert.deepEqual(filterBuilds(builds, { ...defaults, q: 'eclair FAN', category: 'flying', budget: '9' }).map((b) => b.id), [1]);
  assert.deepEqual(filterBuilds(builds, { ...defaults, q: 'bike', category: 'combat', tested: true, budget: '30', tag: 'bike' }).map((b) => b.id), [2]);
  assert.deepEqual(filterBuilds(builds, { ...defaults, q: 'bike', category: 'combat', tested: true, budget: '9' }), []);
});

test('unknown costs never pass a budget and sort after known costs including zero', () => {
  assert.deepEqual(filterBuilds(builds, { ...defaults, budget: '9' }).map((b) => b.id), [1, 4]);
  assert.deepEqual(filterBuilds(builds, { ...defaults, sort: 'cost' }).map((b) => b.id), [4, 1, 2, 3]);
});

test('recommended, ratings and views give different deterministic rankings without mutating data', () => {
  assert.deepEqual(filterBuilds(builds, defaults).map((b) => b.id), [2, 3, 1, 4]);
  assert.deepEqual(filterBuilds(builds, { ...defaults, sort: 'rating' }).map((b) => b.id), [3, 1, 2, 4]);
  assert.deepEqual(filterBuilds(builds, { ...defaults, sort: 'popular' }).map((b) => b.id), [3, 2, 1, 4]);
  assert.deepEqual(builds.map((b) => b.id), [1, 2, 3, 4]);
});

test('shareable URLs round-trip all filters and discard invalid filter values', () => {
  const valid = { q: 'air bike', category: 'combat', budget: '30', tested: true, tag: 'laser', sort: 'cost', page: 2 };
  assert.deepEqual(readBuildFilters(buildFilterParams(valid)), valid);
  assert.equal(buildFilterParams(defaults).toString(), '');
  const invalid = readBuildFilters(new URLSearchParams('category=bad&budget=-1&sort=bad&page=-2&tested=maybe'));
  assert.deepEqual(invalid, defaults);
  assert.equal(readBuildFilters(new URLSearchParams('page=Infinity')).page, 1);
});
