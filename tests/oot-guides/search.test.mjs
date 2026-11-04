import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const ts = createRequire(import.meta.url)('typescript');
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../../app/lib/oot-guides/types.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports, Set });
const { guideTypes, searchGuides, OOT_GUIDE_INDEX } = exports;
const article = (id, title, types, extra = {}) => ({ id: String(id), slug: `guide-${id}`, title, tags: { nodes: types.map(type => ({ slug: `oot-guide-${type}` })) }, ...extra });
const ids = results => Array.from(results, item => item.id);

test('search covers the whole 62-guide collection, including later cards', () => {
  const all = Array.from({ length: 61 }, (_, i) => article(i, 'A dungeon route', ['dungeons']));
  all.push(article(61, 'Hall of Fallen Foes', ['collectibles'], { excerpt: 'Threads of Time tapestry' }));
  assert.deepEqual(ids(searchGuides(all, 'tapestry', 'collectibles')), ['61']);
  assert.equal(searchGuides(all, '').length, 62);
});
test('editorial types override inference and overlapping types remain searchable', () => {
  const guide = article(1, 'Gerudo Training Ground', ['dungeons', 'equipment']);
  assert.equal(searchGuides([guide], '', 'equipment').length, 1);
  assert.equal(searchGuides([guide], '', 'dungeons').length, 1);
  assert.equal(searchGuides([guide], '', 'quests').length, 0);
  assert.deepEqual(Array.from(guideTypes(article(2, 'Water Temple', ['equipment']))), ['equipment']);
});
test('search handles apostrophes, accents, HTML and combined filters', () => {
  const all = [article(1, 'Dampé’s Race', ['quests'], { excerpt: '<p>Get the Hookshot &amp; return.</p>' })];
  assert.deepEqual(ids(searchGuides(all, "DAMPÉ'S hookshot", 'quests')), ['1']);
  assert.equal(searchGuides(all, 'hookshot', 'bosses').length, 0);
  assert.equal(searchGuides(all, 'unknown').length, 0);
});
test('index is in All guides; untagged additions receive a useful fallback', () => {
  const index = article(1, 'Dungeons and Bosses', ['bosses'], { slug: OOT_GUIDE_INDEX });
  assert.equal(searchGuides([index], '').length, 1);
  assert.equal(searchGuides([index], '', 'bosses').length, 0);
  assert.deepEqual(Array.from(guideTypes({ id: '2', slug: 'new', title: 'How to Beat Dark Link' })), ['bosses']);
  assert.deepEqual(Array.from(guideTypes({ id: '3', slug: 'new', title: 'Shadow Temple Walkthrough' })), ['dungeons']);
  assert.deepEqual(Array.from(guideTypes({ id: '4', slug: 'new', title: "Jabu-Jabu’s Belly Walkthrough" })), ['dungeons']);
});

test('descriptive URL aliases remain searchable when a shorter title omits the term', () => {
  const guide = article(62, 'Threads of Time', ['collectibles'], { slug: 'zelda-oot-switch-2-progress-tapestry' });
  assert.deepEqual(ids(searchGuides([guide], 'tapestry', 'collectibles')), ['62']);
});
