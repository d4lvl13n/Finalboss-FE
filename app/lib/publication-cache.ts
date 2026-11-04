export interface ModifiedPost {
  slug: string;
  categories?: number[];
  game?: number[];
}

interface Term { id: number; slug: string; parent?: number }
type Fetcher = typeof fetch;
const PAGE_SIZE = 50;
const MAX_PAGES = 10;

/** Resolve affected archives from the actual post taxonomies, not title matches. */
export async function publicationPaths(
  wordpressUrl: string,
  posts: ModifiedPost[],
  fetcher: Fetcher = fetch,
  signal?: AbortSignal,
): Promise<string[]> {
  if (!posts.length) return [];
  const api = `${wordpressUrl.replace(/\/$/, '')}/wp-json/wp/v2`;
  async function terms(taxonomy: string, ids: number[]): Promise<Term[]> {
    const all: Term[] = [];
    const unique = Array.from(new Set(ids));
    for (let start = 0; start < unique.length; start += 100) {
      const response = await fetcher(`${api}/${taxonomy}?include=${unique.slice(start, start + 100).join(',')}&per_page=100&_fields=id,slug,parent`, { cache: 'no-store', signal });
      if (!response.ok) throw new Error(`WordPress ${taxonomy} lookup failed: ${response.status}`);
      all.push(...await response.json());
    }
    return all;
  }
  const [categories, games] = await Promise.all([
    terms('categories', posts.flatMap((post) => post.categories || [])),
    terms('game', posts.flatMap((post) => post.game || [])),
  ]);
  const categoryIds = new Set(categories.map((term) => term.id));
  const missingParents = categories.map((term) => term.parent || 0).filter((id) => id && !categoryIds.has(id));
  const parents = await terms('categories', missingParents);
  const guideRoots = new Set([...categories, ...parents].filter((term) => term.slug === 'gaming-guide').map((term) => term.id));
  const paths = new Set(['/', '/articles', '/guides', ...posts.map((post) => `/${post.slug}`)]);
  for (const term of categories) {
    if (term.parent && guideRoots.has(term.parent)) paths.add(`/guides/${term.slug}`);
  }
  for (const term of games) paths.add(`/game/${term.slug}`);
  return Array.from(paths);
}

/** Read the whole bounded publication window, including batches larger than 50. */
export async function discoverPublicationPaths(
  wordpressUrl: string,
  since: string,
  fetcher: Fetcher = fetch,
  signal?: AbortSignal,
) {
  const posts: ModifiedPost[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const query = new URLSearchParams({ modified_after: since, per_page: String(PAGE_SIZE), page: String(page), orderby: 'modified', order: 'desc', _fields: 'slug,modified,categories,game', status: 'publish' });
    const response = await fetcher(`${wordpressUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts?${query}`, { cache: 'no-store', signal });
    if (!response.ok) throw new Error(`WordPress post lookup failed: ${response.status}`);
    const batch: ModifiedPost[] = await response.json();
    posts.push(...batch);
    const totalPages = Number(response.headers.get('x-wp-totalpages'));
    if (batch.length < PAGE_SIZE || (totalPages > 0 && page >= totalPages)) break;
    if (page === MAX_PAGES) throw new Error('Publication window exceeds 500 posts; narrow the lookback and retry.');
  }
  return { postsChecked: new Set(posts.map((post) => post.slug)).size, paths: await publicationPaths(wordpressUrl, posts, fetcher, signal) };
}
