import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../../app/lib/totk-guides/types.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports, Set });
const { guideTypes, searchGuides, TOTK_GUIDE_INDEX } = exports;
const article = (id, title, types, extra = {}) => ({ id: String(id), slug: `guide-${id}`, title, tags: { nodes: types.map(type => ({ slug: `totk-guide-${type}` })) }, ...extra });
const ids = results => Array.from(results, item => item.id);

test('search reaches the final guide in a complete 90-guide collection', () => {
  const all = Array.from({ length: 89 }, (_, i) => article(i, 'A quest', ['quests']));
  all.push(article(89, 'All Skyview Towers', ['exploration']));
  assert.deepEqual(ids(searchGuides(all, 'skyview towers', 'exploration')), ['89']);
  assert.equal(searchGuides(all, '').length, 90);
});

test('published types take precedence and a multi-type guide matches either filter', () => {
  const guide = article(1, 'Fire Temple and Marbled Gohma', ['temples', 'bosses']);
  assert.equal(searchGuides([guide], '', 'temples').length, 1);
  assert.equal(searchGuides([guide], '', 'bosses').length, 1);
  assert.equal(searchGuides([guide], '', 'quests').length, 0);
  assert.deepEqual(Array.from(guideTypes(article(2, 'Armor in a cave', ['quests']))), ['quests']);
});

test('keywords combine with the selected type, including type labels and excerpts', () => {
  const all = [article(1, 'Hylian Shield', ['weapons'], { excerpt: '<p>Found below Hyrule Castle.</p>' }), article(2, 'Hyrule Castle', ['exploration'])];
  assert.deepEqual(ids(searchGuides(all, 'weapons castle', 'weapons')), ['1']);
  assert.equal(searchGuides(all, 'shield', 'armor').length, 0);
  assert.equal(searchGuides(all, 'nonexistent').length, 0);
});

test('search normalizes case, accents, HTML and British armour spelling', () => {
  const guide = article(1, 'Zélda’s Barbarian Armor', ['armor'], { excerpt: '<p>Cece &amp; Link</p>' });
  assert.deepEqual(ids(searchGuides([guide], "ZELDA'S armour cece")), ['1']);
  assert.deepEqual(ids(searchGuides([guide], '   ')), ['1']);
});

test('the index remains in All guides and future untagged guides have a fallback', () => {
  const index = article(1, 'Temples, bosses and armor', ['armor'], { slug: TOTK_GUIDE_INDEX });
  assert.equal(searchGuides([index], '').length, 1);
  assert.equal(searchGuides([index], '', 'armor').length, 0);
  assert.deepEqual(Array.from(guideTypes({ id: '2', slug: 'new', title: 'Royal Broadsword locations' })), ['weapons']);
});
