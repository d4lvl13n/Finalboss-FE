'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GAMING_POSTS } from '../../lib/queries/getGamingPosts';
import client from '../../lib/apolloClient';
import PageHeader from '../PageHeader';
import ResponsiveArticleGrid from '../ResponsiveArticleGrid';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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

interface GamingPageContentProps {
  initialArticles: Article[];
  initialHasNextPage: boolean;
}

export default function GamingPageContent({ initialArticles, initialHasNextPage }: GamingPageContentProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { data, loading, fetchMore } = useQuery(GET_GAMING_POSTS, {
    variables: { first: 24, after: afterCursor },
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
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader 
        title="Gaming News" 
        description="Breaking news, updates, and stories from the gaming world"
        accentColor="green"
      />
      
      <div className="container mx-auto px-3 md:px-4 pb-8 md:pb-16">
        <ResponsiveArticleGrid 
          articles={articles} 
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
  );
}