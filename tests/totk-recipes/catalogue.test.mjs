import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import sharp from 'sharp';
const root = new URL('../../', import.meta.url).pathname;
const load = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const { recipes, ingredients } = load('app/lib/totk-recipes/catalogue.json');
const data = load('app/lib/totk-recipes/engine-data.json');
const report = load('docs/research/totk-recipes-import.json');
const source = readFileSync(
  resolve(root, 'app/lib/totk-recipes/engine.js'),
  'utf8'
).replace('export default TotKCookSim;', 'globalThis.Sim = TotKCookSim;');
const context = vm.createContext({});
vm.runInContext(source, context);

test('the numbered catalogue is complete, unique and all inputs resolve', () => {
  assert.equal(recipes.length, 228);
  assert.equal(ingredients.length, 251);
  assert.equal(new Set(recipes.map((r) => r.slug)).size, 228);
  assert.deepEqual(
    recipes.map((r) => r.number),
    Array.from({ length: 228 }, (_, i) => i + 1)
  );
  const ids = new Set(ingredients.map((i) => i.id));
  for (const recipe of recipes) {
    assert.match(recipe.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(recipe.description, recipe.slug);
    assert.ok(recipe.ingredients.length >= 1 && recipe.ingredients.length <= 5);
    assert.ok(recipe.ingredients.every((id) => ids.has(id)));
    assert.equal(
      recipe.variants.length > 0,
      ['pot', 'elixir'].includes(recipe.method)
    );
    assert.equal(recipe.image === null, recipe.number === 201);
  }
});

test('all advertised combinations create the correct dish and effect', () => {
  const sim = new context.Sim(data);
  for (const recipe of recipes)
    for (const variant of recipe.variants) {
      const result = sim.cook(variant.ingredients);
      assert.equal(result.recipeNumber, recipe.number, recipe.slug);
      for (const key of [
        'healthRecovery',
        'effectType',
        'effectDuration',
        'effectLevel',
        'criticalRate',
        'sellPrice',
        'isFailure',
      ])
        assert.equal(
          result[key],
          variant.result[key],
          `${recipe.slug}: ${key}`
        );
      assert.ok(variant.ingredients.length <= 5);
    }
});

test('simulator handles duplicates, invalid combinations and state reset', () => {
  const sim = new context.Sim(data);
  const bananas = sim.cook(Array(5).fill('Mighty Bananas'));
  assert.equal(bananas.recipeNumber, 47);
  assert.equal(bananas.effectType, 'AttackUp');
  assert.equal(bananas.effectDuration, '04:10');
  assert.equal(sim.cook(['Apple']).healthRecovery, '1 Heart');
  assert.equal(
    sim.cook(['Raw Meat', 'Hylian Rice', 'Rock Salt']).recipeNumber,
    94
  );
  assert.equal(sim.cook(['Apple', 'Bokoblin Horn']).isFailure, true);
  assert.throws(() => sim.cook([]));
  assert.throws(() => sim.cook(['NOT_AN_INGREDIENT']));
});

test('calculator matches independently generated Python reference results', () => {
  const fixtures = load('tests/totk-recipes/reference-fixtures.json');
  for (const row of fixtures.cases) {
    const result = new context.Sim(data).cook(row.ingredients);
    const actual = {
      recipeNumber: result.recipeNumber,
      hearts: result.raw.hitPointRecover,
      effectType: result.effectType,
      effectLevel: result.raw.effectLevelValue,
      duration: result.raw.effectTimeValue,
      price: result.sellPrice,
      criticalRate: result.criticalRate,
    };
    assert.deepEqual(
      JSON.parse(JSON.stringify(actual)),
      row.expected,
      row.ingredients.join(', ')
    );
  }
});

test('all imported images are local, renamed, decodable WebP files', async () => {
  assert.equal(report.images.length, 433);
  for (const item of report.images) {
    assert.match(item.path, /^\/totk-recipes\/zelda-totk-[a-z0-9-]+\.webp$/);
    assert.notEqual(item.path.split('/').at(-1), item.source.split('/').at(-1));
    const file = resolve(root, `public${item.path}`);
    assert.ok(existsSync(file));
    const meta = await sharp(file).metadata();
    assert.equal(meta.format, 'webp');
    assert.ok(meta.width > 0 && meta.width <= 256);
  }
  for (const image of [
    ...recipes.flatMap((r) => [r.image, r.ingredientImage]),
    ...ingredients.map((i) => i.image),
  ].filter(Boolean))
    assert.ok(existsSync(resolve(root, `public${image}`)), image);
});
