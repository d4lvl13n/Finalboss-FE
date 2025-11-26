'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { GET_AUTHOR_POSTS, AuthorPost } from '../../lib/queries/getAuthor';
import { formatDate } from '../../utils/formatDate';
import client from '../../lib/apolloClient';

interface AuthorArticlesGridProps {
  authorId: number;
  authorName: string;
}

const POSTS_PER_PAGE = 12;

export default function AuthorArticlesGrid({ authorId, authorName }: AuthorArticlesGridProps) {
  const [allPosts, setAllPosts] = useState<AuthorPost[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const { loading, error, fetchMore } = useQuery(GET_AUTHOR_POSTS, {
    variables: { authorId, first: POSTS_PER_PAGE, after: null },
    client,
    onCompleted: (data) => {
      if (data?.posts?.nodes) {
        setAllPosts(data.posts.nodes);
        setEndCursor(data.posts.pageInfo.endCursor);
      }
    },
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (!endCursor || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const { data } = await fetchMore({
        variables: { authorId, first: POSTS_PER_PAGE, after: endCursor },
      });
      
      if (data?.posts?.nodes) {
        setAllPosts((prev) => [...prev, ...data.posts.nodes]);
        setEndCursor(data.posts.pageInfo.endCursor);
        setHasMore(data.posts.pageInfo.hasNextPage);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && allPosts.length === 0) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Articles by {authorName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 text-center">
        <p className="text-red-400">Error loading articles. Please try again.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Articles by {authorName}
          <span className="text-gray-500 font-normal text-lg ml-2">
            ({allPosts.length}{hasMore ? '+' : ''})
          </span>
        </h2>

        {allPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post: AuthorPost) => (
                <Link 
                  key={post.id} 
                  href={`/${post.slug}`}
                  className="group block bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Categories */}
                    {post.categories?.nodes && post.categories.nodes.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {post.categories.nodes.slice(0, 2).map((cat) => (
                          <span 
                            key={cat.id}
                            className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <time className="text-sm text-gray-500">
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Articles
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No articles found.</p>
        )}
      </div>
    </section>
  );
}

