import type { DocumentNode } from 'graphql';
import { gql } from '@apollo/client';
import client from './apolloClient';
import { GET_GAME_TAG_WITH_POSTS } from './queries/gameQueries';

export interface ExtraPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  featuredImage?: { node: { sourceUrl: string; thumb?: string | null } };
  categories?: { nodes: { id?: string; name: string }[] };
  author?: { node: { name: string } };
}

export interface ArticleExtras {
  gameArticles: ExtraPost[];
  related: ExtraPost[];
  newer: ExtraPost[];
  older: ExtraPost[];
  authorPosts: ExtraPost[];
}

const CARD_FIELDS = `
  id
  title
  slug
  date
  featuredImage { node { sourceUrl thumb: sourceUrl(size: MEDIUM_LARGE) } }
  categories { nodes { id name } }
`;

// One round trip for everything that only needs core WPGraphQL fields.
//
// The variable TYPES matter. The previous client-side queries declared
// `$categoryId: ID`, `$authorId: ID!` and `$currentDate: String!`, but the
// schema expects Int, Int and DateInput. WordPress rejected all three at
// validation, `errorPolicy: 'ignore'` swallowed the error, and every article
// without a game tag rendered "No related articles found". Keep these as
// Int / DateInput and pass database IDs, not global relay IDs.
const GET_ARTICLE_EXTRAS = gql`
  query GetArticleExtras(
    $excludeId: ID!
    $categoryId: Int
    $hasCategory: Boolean!
    $authorId: Int
    $hasAuthor: Boolean!
    $day: DateInput!
  ) {
    related: posts(first: 5, where: { notIn: [$excludeId], categoryId: $categoryId }) @include(if: $hasCategory) {
      nodes { ${CARD_FIELDS} }
    }
    authorPosts: posts(first: 4, where: { author: $authorId, notIn: [$excludeId] }) @include(if: $hasAuthor) {
      nodes { ${CARD_FIELDS} }
    }
    # DateInput is day-granular, so these return the whole publication day and
    # the exact neighbours are picked in code below, by comparing dates.
    newer: posts(
      first: 30
      where: { notIn: [$excludeId], dateQuery: { after: $day, inclusive: true }, orderby: { field: DATE, order: ASC } }
    ) {
      nodes { id title slug date }
    }
    older: posts(
      first: 30
      where: { notIn: [$excludeId], dateQuery: { before: $day, inclusive: true }, orderby: { field: DATE, order: DESC } }
    ) {
      nodes { id title slug date }
    }
  }
`;

// Supplementary data must never fail or stall the article. Each request gets a
// short budget and degrades to "nothing" — the page still renders, just with
// fewer related links. No AbortSignal on purpose: see withTimeout in
// app/[slug]/page.tsx (a signal makes the fetch uncacheable and breaks ISR).
const BUDGET_MS = 5000;

async function safeQuery(query: DocumentNode, variables: Record<string, unknown>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), BUDGET_MS);
    });
    const result = await Promise.race([client.query({ query, variables }), timeout]);
    return result?.data ?? null;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

interface ExtrasInput {
  id?: string;
  slug?: string;
  /** WordPress local datetime, e.g. "2026-11-13T23:45:14" */
  date: string;
  /** Category DATABASE id (Int), not the global relay id */
  categoryId?: number;
  /** Author DATABASE id (Int), not the global relay id */
  authorId?: number;
  gameSlug?: string;
}

/**
 * Related content for an article, fetched ON THE SERVER during static
 * generation. This used to run in every reader's browser (Apollo hooks), which
 * meant the links were absent from the HTML search engines read, Apollo shipped
 * in the article bundle, and WordPress took the requests once per visitor. Now
 * it is at most two requests per regeneration (once per 24h per article).
 */
export async function getArticleExtras(input: ExtrasInput): Promise<ArticleExtras> {
  const { id, slug, date, categoryId, authorId, gameSlug } = input;
  const empty: ArticleExtras = { gameArticles: [], related: [], newer: [], older: [], authorPosts: [] };
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(date || '');
  if (!id || !dayMatch) return empty;

  const [core, game] = await Promise.all([
    safeQuery(GET_ARTICLE_EXTRAS, {
      excludeId: id,
      categoryId: categoryId ?? null,
      hasCategory: typeof categoryId === 'number',
      authorId: authorId ?? null,
      hasAuthor: typeof authorId === 'number',
      day: { year: Number(dayMatch[1]), month: Number(dayMatch[2]), day: Number(dayMatch[3]) },
    }),
    // Separate request: `gameTag` is a custom taxonomy that not every backend
    // exposes, and a schema error there must not take the core links down.
    gameSlug ? safeQuery(GET_GAME_TAG_WITH_POSTS, { slug: gameSlug, first: 5 }) : null,
  ]);

  const notSelf = (p: ExtraPost) => p.id !== id && p.slug !== slug;
  const nodes = (v: { nodes?: ExtraPost[] } | undefined) => (v?.nodes || []).filter(notSelf);
  // WordPress dates are zone-less local strings with a fixed format, so plain
  // string comparison orders them correctly without any timezone parsing.
  const newer = nodes(core?.newer).filter((p) => p.date > date).slice(0, 1);
  const older = nodes(core?.older).filter((p) => p.date < date).slice(0, 1);

  return {
    gameArticles: nodes(game?.gameTag?.posts),
    related: nodes(core?.related).slice(0, 4),
    newer,
    older,
    authorPosts: nodes(core?.authorPosts).slice(0, 3),
  };
}
