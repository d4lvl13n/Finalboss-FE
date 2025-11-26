// components/LatestArticles.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_POSTS } from '../lib/queries/getLatestPosts';
import client from '../lib/apolloClient';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LatestSidebar, { formatTimeAgo } from './LatestSidebar';

// Define the Article interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date?: string;
  categories?: {
    nodes?: {
      name: string;
      slug?: string;
    }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  author?: {
    node?: {
      name?: string;
    };
  };
}

// Featured article card (smaller than before)
const FeaturedArticle = ({ article }: { article: Article }) => (
  <Link href={`/${article.slug}`} className="group block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Image - Reduced height */}
      <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-xl overflow-hidden">
        <Image
          src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category badge */}
        {article.categories?.nodes?.[0] && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded">
            {article.categories.nodes[0].name}
          </span>
        )}
      </div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight mb-2">
          {article.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          {article.date && (
            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
          {article.author?.node?.name && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-yellow-500">{article.author.node.name}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
);

// Secondary article cards (below featured)
const SecondaryArticle = ({ article, index }: { article: Article; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
  >
    <Link href={`/${article.slug}`} className="group block">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
        <Image
          src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 50vw, 18vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category badge */}
        {article.categories?.nodes?.[0] && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
            {article.categories.nodes[0].name}
          </span>
        )}
      </div>
      <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
    </Link>
  </motion.div>
);

// Compact card for mobile
const CompactArticle = ({ article }: { article: Article }) => (
  <Link 
    href={`/${article.slug}`}
    className="flex gap-3 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
  >
    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
      <Image
        src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
        alt={article.title}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0 py-1">
      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
        {article.title}
      </h3>
      <p className="text-xs text-gray-400 mt-1">
        {article.date ? formatTimeAgo(article.date) : ''}
      </p>
    </div>
  </Link>
);

const LatestArticles = () => {
  const { loading, error, data } = useQuery(GET_LATEST_POSTS, {
    variables: { first: 20 }, // Load more articles for fuller sidebar
    client,
  });
  
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (data) {
      setArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="container mx-auto px-3 md:px-4">
          <div className="h-8 w-48 bg-gray-800 animate-pulse mb-6" />
          {/* Desktop skeleton */}
          <div className="hidden md:flex gap-8">
            <div className="flex-1">
              <div className="aspect-[16/10] bg-gray-800 rounded-xl animate-pulse mb-6" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx}>
                    <div className="aspect-[16/9] bg-gray-800 rounded-lg animate-pulse mb-3" />
                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-96 space-y-3">
              <div className="h-6 bg-gray-800 rounded w-24 mb-4" />
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="flex gap-3 py-3 border-b border-gray-800">
                  <div className="w-16 h-4 bg-gray-800 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile skeleton */}
          <div className="md:hidden space-y-2">
            <div className="aspect-[16/10] bg-gray-800 rounded-xl animate-pulse" />
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 p-2 bg-gray-800/30 rounded-lg animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) return <p className="text-center py-8 text-red-400">Error loading latest articles...</p>;

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4); // 3 secondary articles below featured
  const sidebarArticles = articles.slice(4); // Rest for sidebar

  return (
    <section className="py-10 md:py-16 bg-gray-900">
      <div className="container mx-auto px-3 md:px-4">
        {/* Section Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mr-3 md:mr-4">Latest Articles</h2>
          <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
          <Link
            href="/gaming"
            className="ml-3 md:ml-4 bg-yellow-400 text-black p-1.5 md:p-2 rounded-full hover:bg-yellow-300 transition-colors"
            aria-label="Browse all articles"
            title="Browse all articles"
          >
            <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
          <div className="space-y-2 mt-4">
            {articles.slice(1, 6).map((article) => (
              <CompactArticle key={article.id} article={article} />
            ))}
          </div>
        </div>
        
        {/* Desktop Layout - Kotaku style */}
        <div className="hidden md:flex gap-8">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Featured article */}
            {featuredArticle && <FeaturedArticle article={featuredArticle} />}
            
            {/* Secondary articles grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {secondaryArticles.map((article, index) => (
                <SecondaryArticle key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>
          
          {/* Sidebar - Latest feed with timestamps */}
          <div className="w-80 lg:w-96 flex-shrink-0">
            <LatestSidebar 
              articles={sidebarArticles}
              title="Latest"
              showAllLink="/gaming"
              showAllText="Show All"
              maxItems={20}
              accentColor="yellow"
              maxHeight="800px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
