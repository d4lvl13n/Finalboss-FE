'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../lib/queries/getAllPosts';
import client from '../../lib/apolloClient';

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
}

interface AllArticlesPageContentProps {
  initialArticles: Article[];
  initialHasNextPage: boolean;
}

export default function AllArticlesPageContent({ initialArticles, initialHasNextPage }: AllArticlesPageContentProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { fetchMore } = useQuery(GET_ALL_POSTS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: true,
  });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: { after: afterCursor },
      }).then((fetchMoreResult) => {
        setArticles([...articles, ...fetchMoreResult.data.posts.nodes]);
        setHasNextPage(fetchMoreResult.data.posts.pageInfo.hasNextPage);
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  const renderArticle = (article: Article, index: number) => (
    <motion.div
      key={article.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group h-64 overflow-hidden rounded-lg"
    >
      <Link href={`/${article.slug}`} className="block h-full">
        <Image
          src={article.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {article.title}
          </h3>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {article.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
            Read Article
          </span>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">All Articles</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => renderArticle(article, index))}
        </div>
        
        {hasNextPage && (
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
    </section>
  );
}
