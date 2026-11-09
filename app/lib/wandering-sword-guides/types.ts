export const WANDERING_GAME_SLUG = 'wandering-sword';
export const WANDERING_GUIDE_CATEGORY = 'wandering-sword-guide';
export const WANDERING_GUIDE_INDEX = 'wandering-sword-guide-hub';

export const GUIDE_TYPES = [
  { id: 'companions', label: 'Companions' },
  { id: 'builds', label: 'Builds' },
  { id: 'quests', label: 'Quests' },
  { id: 'dlc', label: 'DLC' },
  { id: 'endings', label: 'Endings' },
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
    .replace(/&#(?:0?39|8217);|&apos;/g, '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    // The game name is shared by every title and URL, not a useful keyword.
    .replace(/\bwandering sword\b/g, ' ').replace(/\s+/g, ' ').trim();
}

export function guideTypes(article: GuideSearchArticle): GuideType[] {
  if (article.slug === WANDERING_GUIDE_INDEX) return [];
  const tags = new Set(article.tags?.nodes?.map((tag) => tag.slug) || []);
  const saved = GUIDE_TYPES.filter((type) => tags.has('wandering-guide-' + type.id)).map((type) => type.id);
  if (saved.length) return saved;
  // New untagged articles remain discoverable until an editor classifies them.
  const text = normalize(article.title + ' ' + article.slug);
  const inferred: GuideType[] = [];
  if (/\b(recruit|companion|companions|affinity|sima ling|chen linxi|bai jin|lu xianer|bu weiyue|romance)\b/.test(text)) inferred.push('companions');
  if (/\b(build|builds|cultivation|meridian|martial points?|legacy|legacies|new game plus)\b/.test(text)) inferred.push('builds');
  if (/\b(quest|quests|frozen corpse|alchemy|physician|golden scorpion|qin lie|missable|missables|save bai weiyi)\b/.test(text)) inferred.push('quests');
  if (/\b(dlc|eastern sea|sail|sailing|penglai|nine regions|bu weiyue)\b/.test(text)) inferred.push('dlc');
  if (/\b(ending|endings|romance|new game plus|save bai weiyi)\b/.test(text)) inferred.push('endings');
  return inferred;
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
