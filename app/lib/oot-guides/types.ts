export const OOT_GAME_SLUG = 'the-legend-of-zelda-ocarina-of-time-switch-2';
export const OOT_IGDB_ID = 405460;
export const OOT_GUIDE_CATEGORY = 'zelda-ocarina-of-time-switch-2-guide';
export const OOT_GUIDE_INDEX = 'zelda-oot-switch-2-walkthrough-guides';

export const GUIDE_TYPES = [
  { id: 'dungeons', label: 'Dungeons' },
  { id: 'bosses', label: 'Bosses' },
  { id: 'quests', label: 'Quests' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'exploration', label: 'Exploration' },
] as const;
export type GuideType = typeof GUIDE_TYPES[number]['id'];
interface GuideSearchArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags?: { nodes?: { slug: string }[] };
}

function normalize(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|nbsp|quot);/g, ' ')
    .replace(/&#(?:0?39|8217);/g, '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function guideTypes(article: GuideSearchArticle): GuideType[] {
  if (article.slug === OOT_GUIDE_INDEX) return [];
  const tags = new Set(article.tags?.nodes?.map((tag) => tag.slug) || []);
  // Saved editorial classifications, including multiple types, are authoritative.
  const saved = GUIDE_TYPES.filter((type) => tags.has('oot-guide-' + type.id)).map((type) => type.id);
  if (saved.length) return saved;
  const title = normalize(article.title + ' ' + article.slug);
  if (/\b(boss|gohma|dodongo|barinade|phantom ganon|volvagia|dark link|morpha|bongo bongo|twinrova|ganondorf|iron knuckle|dead hand)\b/.test(title) && /\b(beat|boss)\b/.test(title)) return ['bosses'];
  if (/\b(temple|cavern|deku tree|jabu jabus?|bottom of the well|ganons castle)\b/.test(title)) return ['dungeons'];
  if (/\b(skulltula|heart piece|bottle|grotto|completion|collectible)\b/.test(title)) return ['collectibles'];
  if (/\b(equipment|weapon|shield|tunic|boots|hookshot|longshot|sword|quiver|controls|microphone|amiibo)\b/.test(title)) return ['equipment'];
  if (/\b(quest|trading|epona|song|mask|race|fishing|archery|bowling)\b/.test(title)) return ['quests'];
  return ['exploration'];
}

export function searchGuides<T extends GuideSearchArticle>(articles: T[], query: string, type: GuideType | 'all' = 'all'): T[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return articles.filter((article) => {
    const types = guideTypes(article);
    if (type !== 'all' && !types.includes(type)) return false;
    const text = normalize(article.title + ' ' + article.slug + ' ' + (article.excerpt || '') + ' ' + types.join(' '));
    return terms.every((term) => text.includes(term));
  });
}
