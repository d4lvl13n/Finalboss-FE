'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import Loader from '../components/Loader';

export default function TechnologyPage() {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [allArticles, setAllArticles] = useState<any[]>([]);

  const { data, loading, error, fetchMore } = useQuery(GET_TECH_ARTICLES, {
    variables: { limit: 24, after: afterCursor },
    client,
    onCompleted: (data) => {
      setAllArticles((prevArticles) => [...prevArticles, ...data.posts.nodes]);
    },
  });

  useEffect(() => {
    if (data) {
      setAllArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading && allArticles.length === 0) {
    return <Loader />;
  }

  if (error) {
    console.error('Error fetching technology articles:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Failed to Load Technology Articles</h1>
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
    <div className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8 text-yellow-400">Technology</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <Link key={article.id} href={`/technology/${article.slug}`}>
              <div className="relative h-48">
                {article.featuredImage && (
                  <Image
                    src={article.featuredImage.node.sourceUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={article.title}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
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
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
