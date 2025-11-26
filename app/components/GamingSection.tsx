'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_GAMING_POSTS } from '../lib/queries/getGamingPosts';
import client from '../lib/apolloClient';
import { FaArrowRight } from 'react-icons/fa';
import ResponsiveArticleGrid from './ResponsiveArticleGrid';

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

const GamingSection = () => {
  const { data, loading, error } = useQuery(GET_GAMING_POSTS, {
    variables: { first: 7 },
    client,
  });
  
  const [gamingArticles, setGamingArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (data) {
      setGamingArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gray-900">
        <div className="container mx-auto px-3 md:px-4">
          <div className="h-8 w-40 bg-gray-800 animate-pulse mb-6" />
          <div className="md:hidden space-y-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-gray-800/30 rounded-lg animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    console.error('Error fetching gaming articles:', error);
    return null;
  }

  return (
    <section className="py-8 md:py-16 bg-gray-900">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-yellow-400 mr-3 md:mr-4">Gaming News</h2>
          <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
          <Link 
            href="/gaming" 
            className="ml-3 md:ml-4 bg-yellow-400 text-black p-1.5 md:p-2 rounded-full hover:bg-yellow-300 transition-colors"
          >
            <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </Link>
        </div>
        
        <ResponsiveArticleGrid 
          articles={gamingArticles} 
          showFeatured={true}
          featuredCount={1}
        />
      </div>
    </section>
  );
};

export default GamingSection;