'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../lib/queries/getAllPosts';
import client from '../../lib/apolloClient';
import Header from '../Header';
import Footer from '../Footer';
import PageHeader from '../PageHeader';
import ResponsiveArticleGrid from '../ResponsiveArticleGrid';

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

interface AllArticlesPageContentProps {
  initialArticles: Article[];
  initialHasNextPage: boolean;
  initialEndCursor?: string;
}

export default function AllArticlesPageContent({ initialArticles, initialHasNextPage, initialEndCursor }: AllArticlesPageContentProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(initialEndCursor || null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(initialArticles.length === 0);

  // Fetch data on mount if initial data is empty (fallback for SSR issues)
  const { data, loading, fetchMore } = useQuery(GET_ALL_POSTS, {
    variables: { first: 24, after: null },
    client,
    skip: initialArticles.length > 0,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.posts?.nodes && articles.length === 0) {
      setArticles(data.posts.nodes);
      setHasNextPage(data.posts.pageInfo?.hasNextPage || false);
      setAfterCursor(data.posts.pageInfo?.endCursor || null);
      setIsLoading(false);
    }
  }, [data, articles.length]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setIsLoadingMore(true);
      fetchMore({
        variables: { after: afterCursor },
      }).then((fetchMoreResult) => {
        setArticles([...articles, ...fetchMoreResult.data.posts.nodes]);
        setHasNextPage(fetchMoreResult.data.posts.pageInfo.hasNextPage);
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
        setIsLoadingMore(false);
      }).catch(error => {
        console.error('Error loading more articles:', error);
        setIsLoadingMore(false);
      });
    }
  };

  return (
    <>
      <Header />
      <PageHeader 
        title="All Articles" 
        description="Browse our complete collection of gaming news, features, and stories"
        accentColor="yellow"
      />
      
      <section className="pb-8 md:pb-16 bg-gray-900">
        <div className="container mx-auto px-3 md:px-4">
          {isLoading ? (
            <div className="space-y-3">
              {/* Mobile skeleton */}
              <div className="md:hidden space-y-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-gray-800/30 rounded-lg animate-pulse">
                    <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop skeleton */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-64 bg-gray-800 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          ) : articles.length > 0 ? (
            <ResponsiveArticleGrid 
              articles={articles} 
              showFeatured={true}
              featuredCount={1}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-white mb-4">No articles to display</h3>
              <p className="text-gray-400">Check back later for new content</p>
            </div>
          )}
        
          {hasNextPage && !isLoading && (
            <div className="text-center mt-8 md:mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-block bg-yellow-400 text-black font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full hover:bg-yellow-300 transition-colors text-sm md:text-base"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
