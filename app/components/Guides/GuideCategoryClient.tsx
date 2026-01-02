'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import client from '@/app/lib/apolloClient';
import { GET_SUBCATEGORY_ARTICLES } from '@/app/lib/queries/getSubcategoryArticles';

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

interface SubcategoryQueryData {
  posts: {
    nodes: GuideArticle[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface GuideCategoryClientProps {
  slug: string;
  initialArticles: GuideArticle[];
  initialHasNextPage: boolean;
  initialEndCursor?: string | null;
}

export default function GuideCategoryClient({
  slug,
  initialArticles,
  initialHasNextPage,
  initialEndCursor = null,
}: GuideCategoryClientProps) {
  const [articles, setArticles] = useState<GuideArticle[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);

  const shouldSkipInitialFetch = initialArticles.length > 0;

  const { loading, error, fetchMore } = useQuery<SubcategoryQueryData>(GET_SUBCATEGORY_ARTICLES, {
    variables: { categorySlug: slug, first: 24, after: null },
    client,
    skip: shouldSkipInitialFetch,
    onCompleted: (result) => {
      setArticles(result.posts.nodes);
      setHasNextPage(result.posts.pageInfo.hasNextPage);
      setEndCursor(result.posts.pageInfo.endCursor);
    },
  });

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading Guides...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Failed to Load Guides</h1>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (!hasNextPage || !endCursor) {
      return;
    }

    fetchMore({
      variables: {
        after: endCursor,
      },
    }).then((fetchMoreResult) => {
      setArticles((prevArticles) => [...prevArticles, ...fetchMoreResult.data.posts.nodes]);
      setHasNextPage(fetchMoreResult.data.posts.pageInfo.hasNextPage);
      setEndCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
    });
  };

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">{slug.replace(/-/g, ' ')} Guides</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/${article.slug}`} className="block h-full">
                <Image
                  src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read Guide
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
            >
              Load More Guides
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
