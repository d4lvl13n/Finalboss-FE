'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import Header from './Header';
import Footer from './Footer';
import PageHeader from './PageHeader';
import ResponsiveArticleGrid from './ResponsiveArticleGrid';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
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
      <PageHeader 
        title="Gaming Technology" 
        description="Hardware reviews, tech news, and the latest innovations in gaming"
        accentColor="orange"
      />
      
      <div className="min-h-screen bg-gray-900 text-white pb-8 md:pb-16">
        <div className="container mx-auto px-3 md:px-4">
          <ResponsiveArticleGrid 
            articles={articles} 
            basePath="/technology"
            showFeatured={true}
            featuredCount={1}
          />

          {hasNextPage && (
            <div className="text-center mt-8 md:mt-12">
              <button
                onClick={handleLoadMore}
                className="inline-block bg-yellow-400 text-black font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full hover:bg-yellow-300 transition-colors text-sm md:text-base"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
