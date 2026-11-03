/* Normalize the imported tables and verify every cooking-pot example against
 * the imported simulator. This is deliberately separate from downloading. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'app/lib/totk-recipes');
const data = JSON.parse(
  fs.readFileSync(path.join(dir, 'engine-data.json'), 'utf8')
);
const source = fs
  .readFileSync(path.join(dir, 'engine.js'), 'utf8')
  .replace('export default TotKCookSim;', 'globalThis.Sim = TotKCookSim;');
const context = vm.createContext({});
vm.runInContext(source, context);
const sim = new context.Sim(data);
const ingredients = data.ingredients.map((i) => ({
  id: i.actor,
  name: i.name,
  slug: i.slug,
  group: i.group,
  effect: i.effect || null,
  image: i.img ? `/totk-recipes/zelda-totk-ingredient-${i.slug}.webp` : null,
}));
const material = Object.fromEntries(
  data.materials.map((i) => [i.ActorName, i])
);
const names = Object.fromEntries(ingredients.map((i) => [i.name, i.id]));
const variants = new Map();
function save(input, result) {
  const number = result.recipeNumber;
  if (number < 1 || number > 228 || (number >= 147 && number <= 214)) return;
  const byEffect = variants.get(number) || new Map();
  const effect = result.effectType || 'none';
  const old = byEffect.get(effect);
  const score =
    result.raw.effectLevelValue * 10000 +
    result.raw.effectTimeValue +
    result.raw.hitPointRecover;
  const cost = input.reduce(
    (sum, id) => sum + (material[id].SellingPrice || 0),
    0
  );
  if (
    !old ||
    input.length < old.ingredients.length ||
    (input.length === old.ingredients.length &&
      (effect === 'none' ? cost < old.cost : score > old.score))
  ) {
    byEffect.set(effect, {
      ingredients: input,
      result: {
        ...result,
        raw: undefined,
        description: undefined,
        actorName: undefined,
      },
      score,
      cost,
    });
  }
  variants.set(number, byEffect);
}
function cook(input) {
  try {
    const result = sim.cook(input);
    save(input, result);
    return result;
  } catch {
    return null;
  }
}
const preferred = [
  'Apple',
  'Hylian Shroom',
  'Hyrule Herb',
  'Hyrule Bass',
  'Raw Meat',
  'Bird Egg',
  'Acorn',
  'Chickaloo Tree Nut',
];
const rank = (a) => {
  const i = preferred.indexOf(a.name);
  return i < 0
    ? 100 + (a.effect ? 20 : 0) + (material[a.id].SellingPrice || 0) / 100
    : i;
};
const ordered = [...ingredients].sort((a, b) => rank(a) - rank(b));
for (const rule of [...data.single, ...data.recipes]) {
  const choices = rule.Recipe.split(' + ').map((term) => {
    const alternatives = term.split(' or ');
    return ordered
      .filter(
        (i) =>
          alternatives.includes(i.id) ||
          alternatives.includes(material[i.id].CookTag)
      )
      .slice(0, 30)
      .map((i) => i.id);
  });
  let attempts = 0;
  function visit(input, part) {
    if (attempts > 10000) return;
    if (part === choices.length) {
      attempts++;
      cook(input);
      return;
    }
    for (const id of choices[part])
      if (!input.includes(id)) visit([...input, id], part + 1);
  }
  visit([], 0);
}
// Add effect ingredients to known valid dishes. No effect is advertised unless
// the resulting combination actually resolves to that numbered dish.
const bases = [...variants].flatMap(([, values]) =>
  [...values.values()].map((v) => v.ingredients)
);
for (const base of bases) {
  if (base.length < 5)
    for (const ingredient of ingredients.filter((i) => i.effect))
      cook([...base, ingredient.id]);
}
// Well-known high-potency, single-material dishes are useful simulator starters.
for (const ingredient of ingredients)
  for (let count = 1; count <= 5; count++)
    cook(Array(count).fill(ingredient.id));

const roastNames = [
  'Apple',
  'Golden Apple',
  'Spicy Pepper',
  'Hylian Tomato',
  'Wildberry',
  'Voltfruit',
  'Hydromelon',
  'Palm Fruit',
  'Mighty Bananas',
  'Fleet-Lotus Seeds',
  'Mighty Thistle',
  'Armoranth',
  'Swift Carrot',
  'Endura Carrot',
  'Fortified Pumpkin',
  'Sun Pumpkin',
  'Hearty Radish',
  'Big Hearty Radish',
  'Skyshroom',
  'Hylian Shroom',
  'Stamella Shroom',
  'Rushroom',
  'Sunshroom',
  'Chillshroom',
  'Zapshroom',
  'Razorshroom',
  'Ironshroom',
  'Silent Shroom',
  'Brightcap',
  'Endura Shroom',
  'Hearty Truffle',
  'Big Hearty Truffle',
  'Raw Meat',
  'Raw Prime Meat',
  'Raw Gourmet Meat',
  'Raw Bird Drumstick',
  'Raw Bird Thigh',
  'Raw Whole Bird',
  'Ancient Arowana',
  'Hyrule Bass',
  'Chillfin Trout',
  'Mighty Carp',
  'Mighty Porgy',
  'Glowing Cave Fish',
  'Hearty Bass',
  'Hearty Salmon',
  'Razorclaw Crab',
  'Sneaky River Snail',
  'Chickaloo Tree Nut',
  'Acorn',
  'Bird Egg',
  'Bird Egg',
  'Raw Meat',
  'Raw Prime Meat',
  'Raw Gourmet Meat',
  'Raw Bird Drumstick',
  'Raw Bird Thigh',
  'Raw Whole Bird',
  'Ancient Arowana',
  'Hyrule Bass',
  'Chillfin Trout',
  'Mighty Carp',
  'Mighty Porgy',
  'Glowing Cave Fish',
  'Hearty Bass',
  'Hearty Salmon',
  'Razorclaw Crab',
  'Sneaky River Snail',
];
if (roastNames.length !== 68 || roastNames.some((n) => !names[n]))
  throw Error('Invalid heated/chilled ingredient map');
const records = data.cards.slice(0, 228).map((actor, index) => {
  const number = index + 1;
  const effect = actor.startsWith('Item_Cook_C_17_')
    ? actor.slice('Item_Cook_C_17_'.length)
    : null;
  const name =
    number === 133
      ? 'Warm Milk'
      : effect
        ? `${data.lang.Effect[effect + '_Name']} Elixir`
        : data.lang.Meal[actor + '_Name'];
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const method =
    number >= 199 && number <= 214
      ? 'freeze'
      : number === 198
        ? 'boil'
        : number >= 147 && number <= 197
          ? 'roast'
          : effect
            ? 'elixir'
            : 'pot';
  const examples = [...(variants.get(number)?.values() || [])]
    .sort(
      (a, b) =>
        (a.result.effectType ? 1 : 0) - (b.result.effectType ? 1 : 0) ||
        a.ingredients.length - b.ingredients.length
    )
    .map(({ score, cost, ...v }) => v);
  if (method === 'pot' || method === 'elixir') {
    if (!examples.length)
      throw Error(`No verified recipe for ${number}: ${name}`);
  }
  const rawName = data.lang.Meal[actor + '_Name'];
  const rawSlug = (rawName || name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return {
    number,
    slug,
    name,
    actor,
    method,
    description: (
      (effect
        ? data.lang.Effect[effect + '_MedicineDesc']
        : data.lang.Meal[actor + '_Caption']) || ''
    )
      .replace(/\s+/g, ' ')
      .trim(),
    image: data.mealIcons[String(number)]
      ? `/totk-recipes/zelda-totk-${rawSlug}-${number}.webp`
      : null,
    ingredientImage:
      number === 201
        ? ingredients.find((i) => i.id === names['Raw Gourmet Meat']).image
        : null,
    effects: examples.map((v) => v.result.effectType).filter(Boolean),
    variants: examples,
    ingredients:
      method === 'roast' || method === 'freeze' || method === 'boil'
        ? [names[roastNames[number - 147]]]
        : examples[0].ingredients,
  };
});
fs.writeFileSync(
  path.join(dir, 'catalogue.json'),
  JSON.stringify({ ingredients, recipes: records }, null, 2) + '\n'
);
console.log(
  `Prepared ${records.length} recipes, ${ingredients.length} materials, ${records.reduce((n, r) => n + r.variants.length, 0)} verified cooking examples.`
);
