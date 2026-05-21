import { NextRequest, NextResponse } from 'next/server';
import {
  MOBILE_POST_FIELDS,
  parseGameRating,
  queryWordPress,
} from '@/app/lib/mobileBackend';

const SEARCH_QUERY = `
  query MobileSearch($searchTerm: String!, $postsFirst: Int = 24, $gamesFirst: Int = 500, $latestPostsFirst: Int = 180) {
    posts(
      first: $postsFirst
      where: { search: $searchTerm, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        ${MOBILE_POST_FIELDS}
      }
    }
    latestPosts: posts(
      first: $latestPostsFirst
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        ${MOBILE_POST_FIELDS}
      }
    }
    gameTags(first: $gamesFirst) {
      nodes {
        name
        slug
        description
        igdbId
        igdbData
      }
    }
  }
`;

interface SearchResponse {
  posts: { nodes: Record<string, unknown>[] };
  latestPosts: { nodes: Record<string, unknown>[] };
  gameTags: {
    nodes: {
      name: string;
      slug: string;
      description?: string;
      igdbId?: string;
      igdbData?: string;
    }[];
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';

  if (query.length < 2) {
    return NextResponse.json({
      articles: [],
      games: [],
    });
  }

  try {
    const data = await queryWordPress<SearchResponse>(SEARCH_QUERY, {
      searchTerm: query,
      postsFirst: 24,
      gamesFirst: 500,
      latestPostsFirst: 180,
    });

    const normalizedQuery = query.toLowerCase();
    const articleMap = new Map<string, Record<string, unknown>>();

    for (const post of data.posts.nodes) {
      const slug = typeof post.slug === 'string' ? post.slug : null;
      if (slug) {
        articleMap.set(slug, post);
      }
    }

    for (const post of data.latestPosts.nodes) {
      const slug = typeof post.slug === 'string' ? post.slug : null;
      if (!slug || articleMap.has(slug)) {
        continue;
      }

      const title = typeof post.title === 'string' ? post.title : '';
      const excerpt = typeof post.excerpt === 'string' ? post.excerpt : '';
      const categories = Array.isArray((post as { categories?: { nodes?: { name?: string; slug?: string }[] } }).categories?.nodes)
        ? ((post as { categories?: { nodes?: { name?: string; slug?: string }[] } }).categories?.nodes ?? [])
        : [];
      const gameTags = Array.isArray((post as { gameTags?: { nodes?: { name?: string; slug?: string }[] } }).gameTags?.nodes)
        ? ((post as { gameTags?: { nodes?: { name?: string; slug?: string }[] } }).gameTags?.nodes ?? [])
        : [];

      const haystack = [
        title,
        excerpt.replace(/<[^>]*>/g, ' '),
        categories.map((category) => `${category.name ?? ''} ${category.slug ?? ''}`).join(' '),
        gameTags.map((tag) => `${tag.name ?? ''} ${tag.slug ?? ''}`).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      if (haystack.includes(normalizedQuery)) {
        articleMap.set(slug, post);
      }
    }

    const articles = Array.from(articleMap.values())
      .sort((left, right) => {
        const leftDate =
          typeof left.date === 'string' ? new Date(left.date).getTime() : 0;
        const rightDate =
          typeof right.date === 'string' ? new Date(right.date).getTime() : 0;
        return rightDate - leftDate;
      })
      .slice(0, 24);

    const games = data.gameTags.nodes
      .map((game) => {
        const haystack = `${game.name} ${game.slug} ${game.description || ''}`.toLowerCase();
        let score = 0;

        if (game.name.toLowerCase() === normalizedQuery) {
          score += 100;
        } else if (game.name.toLowerCase().startsWith(normalizedQuery)) {
          score += 70;
        } else if (haystack.includes(normalizedQuery)) {
          score += 35;
        }

        const rating = parseGameRating(game.igdbData);

        return {
          ...game,
          rating,
          score,
        };
      })
      .filter((game) => game.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return (right.rating ?? 0) - (left.rating ?? 0);
      })
      .slice(0, 12)
      .map((game) => ({
        name: game.name,
        slug: game.slug,
        description: game.description,
        igdbId: game.igdbId,
        igdbData: game.igdbData,
        rating: game.rating,
      }));

    return NextResponse.json({
      articles,
      games,
    });
  } catch (error) {
    console.error('[mobile/search] failed', error);
    return NextResponse.json(
      { error: 'Failed to search mobile content' },
      { status: 500 }
    );
  }
}
