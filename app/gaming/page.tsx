'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient'; 
import { GET_GAMING_POSTS } from '../lib/queries/getGamingPosts'; 
import Link from 'next/link';
import Image from 'next/image';

export default function GamingPage() {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [gamingArticles, setGamingArticles] = useState<any[]>([]);

  const { data, loading, error, fetchMore } = useQuery(GET_GAMING_POSTS, {
    variables: { first: 24, after: afterCursor },
    client,
    onCompleted: (data) => {
      setGamingArticles((prevArticles) => [...prevArticles, ...data.posts.nodes]);
    },
  });

  if (loading && gamingArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading Gaming Articles...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Failed to Load Gaming Articles</h1>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (data?.posts.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
      }).then((fetchMoreResult) => {
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">Gaming</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gamingArticles.map((article) => (
            <Link key={article.id} href={`/gaming/${article.slug}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage.node.sourceUrl}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {data?.posts.pageInfo.hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Load More Gaming Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
