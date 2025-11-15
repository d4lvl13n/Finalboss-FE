'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import Header from './Header';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
}

interface TechnologyPageContentProps {
  initialArticles: Article[];
  initialHasNextPage: boolean;
}

export default function TechnologyPageContent({ initialArticles, initialHasNextPage }: TechnologyPageContentProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { data, loading, fetchMore } = useQuery(GET_TECH_ARTICLES, {
    variables: { limit: 24, after: afterCursor },
    client,
    skip: !afterCursor,
  });

  useEffect(() => {
    if (data) {
      setArticles((prevArticles) => [...prevArticles, ...data.posts.nodes]);
      setHasNextPage(data.posts.pageInfo.hasNextPage);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          after: afterCursor || data?.posts.pageInfo.endCursor,
        },
      }).then((fetchMoreResult) => {
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mr-4">Gaming Technology</h1>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/technology/${article.slug}`} className="block h-full">
                <Image
                  src={article.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute top-4 right-4 z-10">
                  {article.categories?.nodes?.[0] && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      {article.categories.nodes[0].name}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {article.title}
                  </h2>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read More
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Articles'}
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
