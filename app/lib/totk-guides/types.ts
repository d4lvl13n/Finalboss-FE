export const TOTK_GUIDE_CATEGORY = 'zelda-tears-of-the-kingdom-guide';
export const TOTK_GUIDE_INDEX = 'zelda-totk-guides-temples-bosses-armor-quests';

export const GUIDE_TYPES = [
  { id: 'temples', label: 'Temples' },
  { id: 'bosses', label: 'Bosses' },
  { id: 'quests', label: 'Quests' },
  { id: 'armor', label: 'Armor' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'exploration', label: 'Exploration' },
] as const;

export type GuideType = typeof GUIDE_TYPES[number]['id'];

export interface GuideSearchArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags?: { nodes?: { slug: string }[] };
}

export function normalizeSearch(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|nbsp|quot);/g, ' ')
    .replace(/&#(?:0?39|8217);/g, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ')
    .replace(/\barmour\b/g, 'armor').trim();
}

/** WordPress types are authoritative; the fallback accommodates new untagged articles. */
export function guideTypes(article: GuideSearchArticle): GuideType[] {
  if (article.slug === TOTK_GUIDE_INDEX) return [];
  const tags = new Set(article.tags?.nodes?.map((tag) => tag.slug) || []);
  const saved = GUIDE_TYPES.filter((type) => tags.has('totk-guide-' + type.id)).map((type) => type.id);
  if (saved.length) return saved;
  const title = normalizeSearch(article.title + ' ' + article.slug);
  const inferred: GuideType[] = [];
  if (/\b(wind|fire|water|lightning|spirit) temple\b/.test(title)) inferred.push('temples');
  if (/\b(boss|bosses|colgera|gohma|mucktorok|gibdo|seized construct|ganondorf|phantom ganon|kohga|flux construct|hinox|stalnox|talus|gleeok|frox|lynel|molduga)\b/.test(title)) inferred.push('bosses');
  if (/\b(quest|quests|serenade|crisis|tulin|yunobo|sidon|riju|fifth sage|princess sightings)\b/.test(title)) inferred.push('quests');
  if (/\b(armor|leathers|great fairy|outfit)\b/.test(title)) inferred.push('armor');
  if (/\b(weapon|weapons|sword|broadsword|claymore|spear|bow|shield|scimitar|halberd|boomerang|octoroks)\b/.test(title)) inferred.push('weapons');
  if (!inferred.length || /\b(caves|wells|skyview|labyrinth|geoglyph|horse|schematic|sundelion)\b/.test(title)) inferred.push('exploration');
  return inferred;
}

export function searchGuides<T extends GuideSearchArticle>(articles: T[], query: string, type: GuideType | 'all' = 'all'): T[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return articles.filter((article) => {
    const types = guideTypes(article);
    if (type !== 'all' && !types.includes(type)) return false;
    const text = normalizeSearch(article.title + ' ' + (article.excerpt || '') + ' ' + types.join(' '));
    return terms.every((term) => text.includes(term));
  });
}
