import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const ts = createRequire(import.meta.url)('typescript');
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../../app/lib/wandering-sword-guides/types.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports, Set });
const { guideTypes, searchGuides, WANDERING_GUIDE_INDEX } = exports;
const published = JSON.parse(readFileSync(new URL('./published-guides.json', import.meta.url), 'utf8'));
const guides = published.map(p => ({ ...p, id: String(p.id), tags: { nodes: p.types.map(t => ({ slug: 'wandering-guide-' + t })) } }));
const slugs = rows => Array.from(rows, p => p.slug);

test('search reaches a pilot beyond the first twelve cards in the complete collection', () => {
  assert.equal(guides.length, 33);
  assert.equal(searchGuides(guides, '').length, 33);
  assert.deepEqual(slugs(searchGuides(guides, 'Bai Jin', 'companions')), ['wandering-sword-how-to-recruit-bai-jin']);
  assert.deepEqual(slugs(searchGuides(guides, 'Qin Lie', 'quests')), ['wandering-sword-save-qin-lie-choice']);
  assert.equal(searchGuides(guides, 'Qin Lie', 'companions').length, 0);
});

test('common game-name prefix does not make every guide match sword', () => {
  assert.deepEqual(slugs(searchGuides(guides, 'sword')), ['wandering-sword-best-sword-build-wudang-tai-chi']);
  assert.deepEqual(slugs(searchGuides(guides, 'Wandering Sword Bai Jin')), ['wandering-sword-how-to-recruit-bai-jin']);
});

test('DLC companions and quest outcomes match each relevant editorial filter', () => {
  const bu = guides.find(g => g.slug.endsWith('recruit-bu-weiyue'));
  assert.equal(searchGuides([bu], '', 'companions').length, 1);
  assert.equal(searchGuides([bu], '', 'dlc').length, 1);
  assert.equal(searchGuides([bu], '', 'builds').length, 0);
  const survival = guides.find(g => g.slug.endsWith('save-bai-weiyi'));
  for (const type of ['quests', 'dlc', 'endings']) assert.equal(searchGuides([survival], 'Bai Weiyi', type).length, 1);
  assert.equal(searchGuides([survival], '', 'companions').length, 0);
});

test('apostrophes, accents, excerpts and an active type combine without losing results', () => {
  assert.deepEqual(slugs(searchGuides(guides, 'LU XIÁN’ER', 'companions')), ['wandering-sword-how-to-recruit-lu-xianer']);
  const custom = { id: 'new', slug: 'a-new-guide', title: 'New technique', excerpt: '<p>Unlock the &quot;Nine Regions&quot; method.</p>', tags: { nodes: [{ slug: 'wandering-guide-builds' }] } };
  assert.equal(searchGuides([custom], 'NINE regions', 'builds').length, 1);
  assert.equal(searchGuides([custom], 'NINE regions', 'dlc').length, 0);
  assert.equal(searchGuides(guides, 'not-a-real-guide').length, 0);
  assert.equal(searchGuides(guides, '   ').length, 33);
});

test('the index stays in All guides and editorial types take priority over title inference', () => {
  const index = guides.find(g => g.slug === WANDERING_GUIDE_INDEX);
  assert.equal(searchGuides([index], '').length, 1);
  for (const type of ['companions', 'builds', 'quests', 'dlc', 'endings']) assert.equal(searchGuides([index], '', type).length, 0);
  const tagged = { id: 'new', slug: 'new-dlc-build', title: 'DLC build', tags: { nodes: [{ slug: 'wandering-guide-quests' }] } };
  assert.deepEqual(Array.from(guideTypes(tagged)), ['quests']);
  assert.deepEqual(Array.from(guideTypes({ id: 'new', slug: 'new', title: 'Wandering Sword: A New Cultivation Build' })), ['builds']);
});
