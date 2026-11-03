import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';

const root = new URL('../../', import.meta.url).pathname;
process.env.NEXT_PUBLIC_BASE_URL = 'https://finalboss.io';
process.env.NEXT_PUBLIC_WORDPRESS_URL = 'https://backend.finalboss.io';
const data = JSON.parse(readFileSync(resolve(root, 'app/lib/totk-builds/catalogue.json'), 'utf8'));
const bundled = await build({
  stdin: {
    contents: `export * from './app/lib/totk-builds/collections'; export * from './app/lib/totk-builds/seo'; export * from './app/lib/totk-builds/ads'; export * from './app/lib/totk-builds/journey';`,
    resolveDir: root,
  },
  bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22',
  define: { 'process.env.NEXT_PUBLIC_BASE_URL': '"https://finalboss.io"', 'process.env.NEXT_PUBLIC_WORDPRESS_URL': '"https://backend.finalboss.io"' },
});
const api = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

test('canonical collection paths round-trip and cover all 600 builds with real pagination', () => {
  const rootBuilds = [];
  for (let page = 1; page <= api.collectionPageCount(data.builds, 'all'); page++) {
    const path = api.cataloguePath('all', page);
    assert.deepEqual(api.catalogueLocation(path), { category: 'all', page });
    const list = api.collectionJsonLd(data.builds, 'all', page).mainEntity.itemListElement;
    rootBuilds.push(...list.map((entry) => entry.item.url));
  }
  assert.equal(rootBuilds.length, 600);
  assert.equal(new Set(rootBuilds).size, 600);
  for (const collection of api.TOTK_COLLECTIONS) {
    const pages = api.collectionPageCount(data.builds, collection.id);
    assert.ok(pages >= 1);
    assert.equal(api.paginatedCollectionParams(data.builds, collection.id).length, pages - 1);
    const last = api.cataloguePath(collection.id, pages);
    assert.deepEqual(api.catalogueLocation(last), { category: collection.id, page: pages });
    const meta = api.collectionSeo(collection.id, pages);
    assert.equal(meta.alternates.canonical, `https://finalboss.io${last}`);
    if (pages > 1) assert.match(meta.title, /Page /);
  }
});

test('collection structured data lists only the visible page, with accurate positions and category membership', () => {
  const page = api.collectionJsonLd(data.builds, 'flying', 2);
  assert.equal(page['@type'], 'CollectionPage');
  assert.equal(page.mainEntity.numberOfItems, 24);
  assert.equal(page.mainEntity.itemListElement[0].position, 25);
  const expected = api.collectionBuilds(data.builds, 'flying').slice(24, 48);
  assert.deepEqual(page.mainEntity.itemListElement.map((entry) => entry.item.name), expected.map((item) => item.name));
});

test('all build metadata is unique and missing costs are not represented as free builds', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const item of data.builds) {
    const meta = api.buildSeo(item);
    assert.ok(meta.title.includes('Zelda TOTK'));
    assert.ok(meta.description.length <= 165);
    assert.ok(!titles.has(meta.title), meta.title);
    assert.ok(!descriptions.has(meta.description), meta.description);
    titles.add(meta.title); descriptions.add(meta.description);
    assert.ok(meta.alternates.canonical.endsWith('/' + item.slug));
    if (item.zonaite === null) {
      assert.doesNotMatch(meta.description, /Listed cost/);
      assert.match(api.buildQuestions(item)[0].answer, /No Zonaite cost was supplied/);
    }
  }
});

test('ad density is capped, no ad precedes content or ends the list, short lists have no breaks', () => {
  assert.deepEqual(api.buildAdPositions(24, true), [8, 16]);
  assert.deepEqual(api.buildAdPositions(24, false), [6, 12, 18]);
  for (let count = 0; count < 12; count++) {
    assert.deepEqual(api.buildAdPositions(count, true), []);
    assert.deepEqual(api.buildAdPositions(count, false), []);
  }
  for (let count = 12; count <= 24; count++) {
    for (const wide of [false, true]) {
      const positions = api.buildAdPositions(count, wide);
      assert.ok(positions.length <= (wide ? 2 : 3));
      assert.ok(positions.every((after) => after >= 6 && after <= count - 4));
      assert.equal(new Set(positions).size, positions.length);
    }
  }
});

test('Journey slot registration batches new targets without extra loaders or polling', () => {
  const previous = globalThis.window;
  const frames = [];
  let scans = 0;
  globalThis.window = { requestAnimationFrame: (callback) => frames.push(callback) };
  api.scheduleJourneySlots();
  assert.equal(frames.length, 0, 'An unavailable SDK should be left to its own initialization');
  globalThis.window.$adManagementConfig = { web: { fillHints: () => scans++ } };
  api.scheduleJourneySlots(); api.scheduleJourneySlots(); api.scheduleJourneySlots();
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(scans, 1);
  api.scheduleJourneySlots(); frames.shift()();
  assert.equal(scans, 2);
  if (previous === undefined) delete globalThis.window;
  else globalThis.window = previous;
});
