import siteConfig from './siteConfig'

export interface WordPressPost {
  id: string
  slug: string
  modified?: string
  date?: string
}

interface FetchAllPostsResult {
  posts: WordPressPost[]
  total: number
}

interface WpRestPost {
  id: number
  slug: string
  modified?: string
  modified_gmt?: string
  date?: string
  date_gmt?: string
}

const DEFAULT_BATCH_SIZE = 100 // WP REST hard-caps per_page at 100
const MAX_PAGES = 1000 // safety guard (~100k posts)
const MAX_RETRIES = 3

// Normalize a WP "_gmt" timestamp (UTC but lacking the trailing Z) to a real ISO string.
function toIso(gmt?: string, local?: string): string | undefined {
  if (gmt) return `${gmt}Z`
  return local
}

async function fetchPage(
  base: string,
  perPage: number,
  page: number
): Promise<{ rows: WpRestPost[]; totalPages: number; total: number } | null> {
  const url =
    `${base}/wp-json/wp/v2/posts?status=publish&per_page=${perPage}&page=${page}` +
    `&orderby=date&order=desc&_fields=id,slug,modified,modified_gmt,date,date_gmt`

  let lastError: unknown = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Cache in line with the route's daily ISR revalidation.
      const res = await fetch(url, { next: { revalidate: 86400 } })
      if (!res.ok) {
        // Past the last page WP returns 400 (rest_post_invalid_page_number) — that's the end, not an error.
        if (res.status === 400) return { rows: [], totalPages: page - 1, total: 0 }
        throw new Error(`WP REST HTTP ${res.status}`)
      }
      const rows = (await res.json()) as WpRestPost[]
      return {
        rows,
        totalPages: Number(res.headers.get('x-wp-totalpages') || '0'),
        total: Number(res.headers.get('x-wp-total') || '0'),
      }
    } catch (error) {
      lastError = error
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt)) // linear backoff
      }
    }
  }
  // A single failed page must NOT silently truncate the whole sitemap (the old GraphQL bug).
  // Log and let the caller skip just this page.
  console.error(`fetchAllPosts: page ${page} failed after ${MAX_RETRIES} retries:`, lastError)
  return null
}

/**
 * Fetch every published post via the WordPress REST API.
 *
 * Replaces the previous WPGraphQL cursor-pagination version, which silently
 * truncated the sitemap: deep GraphQL pagination 504s on large datasets and the
 * `catch { break }` returned a partial list (~2.5k of ~11k posts). REST
 * page-number pagination is reliable at scale, and the per-page retry means a
 * transient failure skips one page rather than dropping the rest of the site.
 */
export async function fetchAllPosts(batchSize = DEFAULT_BATCH_SIZE): Promise<FetchAllPostsResult> {
  const base = siteConfig.wordpressUrl
  const perPage = Math.min(Math.max(batchSize, 1), 100)
  const posts: WordPressPost[] = []
  const seenSlugs = new Set<string>()

  const first = await fetchPage(base, perPage, 1)
  if (!first) {
    return { posts, total: 0 }
  }

  const totalPages = Math.min(first.totalPages || 1, MAX_PAGES)
  const total = first.total || 0

  const collect = (rows: WpRestPost[]) => {
    for (const row of rows) {
      if (!row?.slug || seenSlugs.has(row.slug)) continue
      seenSlugs.add(row.slug)
      posts.push({
        id: String(row.id),
        slug: row.slug,
        modified: toIso(row.modified_gmt, row.modified),
        date: toIso(row.date_gmt, row.date),
      })
    }
  }

  collect(first.rows)

  for (let page = 2; page <= totalPages; page++) {
    const result = await fetchPage(base, perPage, page)
    if (!result) continue // skip just this page; keep the rest of the sitemap intact
    collect(result.rows)
  }

  return { posts, total: total || posts.length }
}
