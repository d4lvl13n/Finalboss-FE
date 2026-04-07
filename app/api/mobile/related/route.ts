import { NextRequest, NextResponse } from 'next/server';
import { MOBILE_POST_FIELDS, queryWordPress } from '@/app/lib/mobileBackend';

const RELATED_QUERY = `
  query MobileRelated($first: Int = 48) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ${MOBILE_POST_FIELDS}
      }
    }
  }
`;

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  modified?: string;
  categories?: {
    nodes: { name: string; slug: string }[];
  };
  author?: {
    node: { name: string; slug?: string };
  };
  gameTags?: {
    nodes: { name: string; slug: string; igdbId?: string; igdbData?: string }[];
  };
}

interface RelatedQueryResponse {
  posts: { nodes: RelatedPost[] };
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.trim() || '';
  const categorySlugs = request.nextUrl.searchParams
    .get('categories')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) || [];
  const gameTagSlugs = request.nextUrl.searchParams
    .get('gameTags')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) || [];
  const authorSlug = request.nextUrl.searchParams.get('author')?.trim() || '';

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  try {
    const data = await queryWordPress<RelatedQueryResponse>(RELATED_QUERY, { first: 48 });

    const posts = data.posts.nodes
      .filter((post) => post.slug !== slug)
      .map((post) => {
        const postGameSlugs = post.gameTags?.nodes?.map((item) => item.slug) ?? [];
        const postCategorySlugs = post.categories?.nodes?.map((item) => item.slug) ?? [];
        const sharedGameCount = postGameSlugs.filter((item) => gameTagSlugs.includes(item)).length;
        const sharedCategoryCount = postCategorySlugs.filter((item) =>
          categorySlugs.includes(item)
        ).length;
        const sameAuthor =
          authorSlug.length > 0 && post.author?.node?.slug === authorSlug;
        const hoursOld =
          (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60);
        const recencyBoost = Math.max(0, 36 - hoursOld);
        const score =
          sharedGameCount * 100 +
          sharedCategoryCount * 30 +
          (sameAuthor ? 12 : 0) +
          recencyBoost;

        return {
          post,
          score,
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 6)
      .map((entry) => entry.post);

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error('[mobile/related] failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch related posts' },
      { status: 500 }
    );
  }
}
