'use client';

import client from '@/app/lib/apolloClient';
import { GET_GAME_TAG_WITH_POSTS } from '@/app/lib/queries/gameQueries';
import { useCursorPosts, type PostPage } from '@/app/lib/useCursorPosts';
import ResponsiveArticleGrid from './ResponsiveArticleGrid';

export interface GameArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  featuredImage?: { node: { sourceUrl: string } };
  categories?: { nodes?: { name: string; slug?: string }[] };
  tags?: { nodes?: { slug: string }[] };
  author?: { node?: { name?: string; avatar?: { url?: string } } };
}

export default function GameArticles({ slug, title, initial }: {
  slug: string;
  title: string;
  initial: PostPage<GameArticle>;
}) {
  const { posts, hasNextPage, loading, error, loadMore } = useCursorPosts(initial, async (after) => {
    const result = await client.query<{ gameTag: { posts: PostPage<GameArticle> } }>({
      query: GET_GAME_TAG_WITH_POSTS,
      variables: { slug, first: 24, after },
      fetchPolicy: 'network-only',
    });
    if (result.errors?.length || !result.data?.gameTag?.posts) throw new Error('Game query failed');
    return result.data.gameTag.posts;
  });

  if (!posts.length) return null;
  return (
    <section className="bg-gray-900/80 text-white py-10" aria-label={title}>
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mr-4">{title}</h2>
          <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent" />
        </div>
        <div data-game-articles>
          <ResponsiveArticleGrid articles={posts} showFeatured={false} featuredCount={0} />
        </div>
        {error && <p role="alert" className="mt-6 text-center text-red-300">{error}</p>}
        {hasNextPage && (
          <div className="mt-8 text-center">
            <button type="button" onClick={loadMore} disabled={loading} aria-busy={loading}
              className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-gray-900 hover:bg-yellow-300 disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more articles'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
