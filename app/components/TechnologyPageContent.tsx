'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import Header from './Header';
import Footer from './Footer';
import PageHeader from './PageHeader';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMicrochip, FaBolt } from 'react-icons/fa';
import { t } from '../lib/i18n';

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

// Cyber color schemes - same as TechnologySection
const colorSchemes = [
  { primary: 'cyan', glow: 'cyan-400', gradient: 'from-cyan-500 to-blue-600', border: 'cyan-400/50', text: 'cyan-400' },
  { primary: 'emerald', glow: 'emerald-400', gradient: 'from-emerald-500 to-teal-600', border: 'emerald-400/50', text: 'emerald-400' },
  { primary: 'violet', glow: 'violet-400', gradient: 'from-violet-500 to-purple-600', border: 'violet-400/50', text: 'violet-400' },
  { primary: 'amber', glow: 'amber-400', gradient: 'from-amber-500 to-orange-600', border: 'amber-400/50', text: 'amber-400' },
  { primary: 'rose', glow: 'rose-400', gradient: 'from-rose-500 to-pink-600', border: 'rose-400/50', text: 'rose-400' },
  { primary: 'sky', glow: 'sky-400', gradient: 'from-sky-500 to-indigo-600', border: 'sky-400/50', text: 'sky-400' },
];

// Futuristic Tech Card - same design as TechnologySection
const TechCard = ({ article, index }: { article: Article; index: number }) => {
  const imageUrl = article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = article.categories?.nodes?.[0]?.name || t('tech.categoryDefault');
  const scheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group"
    >
      <Link href={`/${article.slug}`}>
        <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-gray-950">
          {/* Animated border glow */}
          <div className={`absolute -inset-[1px] bg-gradient-to-r ${scheme.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm`} />
          
          {/* Main card container */}
          <div className="absolute inset-[1px] bg-gray-950 rounded-xl overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Lighter overlay for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />
            </div>
            
            {/* Circuit board pattern overlay */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              {/* Horizontal lines */}
              <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute top-[80%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              
              {/* Vertical lines */}
              <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
              <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4 md:p-5">
              {/* Top section */}
              <div className="flex items-center justify-between">
                {/* Category badge with tech style */}
                <div className={`flex items-center gap-2 px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm rounded border border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`}>
                  <FaMicrochip className={`w-3 h-3 text-${scheme.text}`} />
                  <span className={`text-[10px] md:text-xs font-mono font-bold text-${scheme.text} uppercase tracking-wider`}>
                    {category}
                  </span>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className={`w-1.5 h-1.5 bg-${scheme.glow} rounded-full`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`text-[10px] font-mono text-${scheme.text}/70 hidden md:inline`}>LIVE</span>
                </div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-3">
                {/* Data line decoration */}
                <div className="flex items-center gap-2">
                  <div className={`h-[2px] w-6 bg-gradient-to-r from-${scheme.glow} to-transparent`} />
                  <FaBolt className={`w-2.5 h-2.5 text-${scheme.text}`} />
                </div>
                
                {/* Title */}
                <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2">
                  {article.title}
                </h3>
                
                {/* Read more with tech styling */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-${scheme.text} group-hover:text-white transition-colors`}>
                    <span className="text-[10px] md:text-xs font-mono font-semibold uppercase tracking-widest">{t('tech.access')}</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </motion.div>
                  </div>
                  
                  {/* Tech decoration */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-0.5 h-2 bg-${scheme.glow}/50 rounded-full`}
                        animate={{ height: ['8px', '14px', '8px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact Tech Card for mobile
const CompactTechCard = ({ article, index }: { article: Article; index: number }) => {
  const imageUrl = article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const scheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link 
        href={`/${article.slug}`}
        className="flex gap-3 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-cyan-500/20"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-cyan-500/20">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FaMicrochip className={`w-2.5 h-2.5 text-${scheme.text}`} />
            <span className={`text-[10px] font-mono text-${scheme.text} uppercase`}>{t('tech.categoryDefault')}</span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
            {article.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

// Featured Tech Card - Larger for first article
const FeaturedTechCard = ({ article }: { article: Article }) => {
  const imageUrl = article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = article.categories?.nodes?.[0]?.name || t('tech.categoryDefault');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/${article.slug}`}>
        <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-xl overflow-hidden bg-gray-950">
          {/* Animated border glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
          
          {/* Main card container */}
          <div className="absolute inset-[1px] bg-gray-950 rounded-xl overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-5 group-hover:opacity-15 transition-opacity duration-500" />
            </div>
            
            {/* Circuit board pattern */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute left-[33%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
              <div className="absolute left-[66%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-5 md:p-8">
              {/* Top section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded border border-cyan-400/50 group-hover:border-cyan-400 transition-colors">
                  <FaMicrochip className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-mono text-cyan-400/70">{t('tech.featured')}</span>
                </div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-10 bg-gradient-to-r from-cyan-400 to-transparent" />
                  <FaBolt className="w-3 h-3 text-cyan-400" />
                </div>
                
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2">
                  {article.title}
                </h2>
                
                <div className="flex items-center gap-3 text-cyan-400 group-hover:text-white transition-colors">
                  <span className="text-sm font-mono font-semibold uppercase tracking-widest">{t('tech.readFull')}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

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

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <>
      <Header />
      <PageHeader 
        title={t('tech.title')}
        description={t('tech.description')}
        accentColor="cyan"
      />
      
      <div className="min-h-screen bg-gray-900 text-white pb-8 md:pb-16 relative overflow-hidden">
        {/* Background grid pattern - same as TechnologySection */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        
        <div className="container mx-auto px-3 md:px-4 relative">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-6 md:mb-8">
              <FeaturedTechCard article={featuredArticle} />
            </div>
          )}
          
          {/* Mobile: Compact List View */}
          <div className="md:hidden space-y-2">
            {remainingArticles.map((article, index) => (
              <CompactTechCard key={article.id} article={article} index={index} />
            ))}
          </div>
          
          {/* Desktop: Grid View with Tech Cards */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {remainingArticles.map((article, index) => (
              <TechCard key={article.id} article={article} index={index} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center mt-8 md:mt-12">
              <motion.button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 border border-cyan-500/50 text-cyan-400 rounded font-mono text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{loading ? t('common.loadingMore') : t('common.loadMore')}</span>
                <FaArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
