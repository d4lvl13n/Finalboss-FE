'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_GUIDE_CATEGORIES_AND_POSTS } from '../../lib/queries/getGuideCategories';
import client from '../../lib/apolloClient';
import Header from '../Header';
import Footer from '../Footer';
import PageHeader from '../PageHeader';
import { FaArrowRight, FaBookOpen, FaGamepad } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { t } from '../../lib/i18n';

interface Category {
  id: string;
  name: string;
  slug: string;
  posts: {
    nodes: {
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

interface Guide {
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

// Gradient colors based on index for variety - same as GuidesSection
const gradients = [
  'from-violet-600/90 via-purple-600/80 to-fuchsia-600/90',
  'from-cyan-600/90 via-blue-600/80 to-indigo-600/90',
  'from-emerald-600/90 via-teal-600/80 to-cyan-600/90',
  'from-orange-600/90 via-amber-600/80 to-yellow-600/90',
  'from-rose-600/90 via-pink-600/80 to-fuchsia-600/90',
  'from-indigo-600/90 via-violet-600/80 to-purple-600/90',
];

const borderGradients = [
  'from-violet-400 via-purple-400 to-fuchsia-400',
  'from-cyan-400 via-blue-400 to-indigo-400',
  'from-emerald-400 via-teal-400 to-cyan-400',
  'from-orange-400 via-amber-400 to-yellow-400',
  'from-rose-400 via-pink-400 to-fuchsia-400',
  'from-indigo-400 via-violet-400 to-purple-400',
];

// Modern Guide Card with glassmorphism - same design as GuidesSection
const GuideCard = ({ guide, index }: { guide: Guide; index: number }) => {
  const imageUrl = guide.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = guide.categories?.nodes?.[0]?.name || t('guide.categoryDefault');
  const gradient = gradients[index % gradients.length];
  const borderGradient = borderGradients[index % borderGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group"
    >
      <Link href={`/${guide.slug}`}>
        <div className="relative aspect-[3/4] md:aspect-[16/20] rounded-2xl overflow-hidden">
          {/* Animated border gradient */}
          <div className={`absolute -inset-[2px] bg-gradient-to-br ${borderGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
          <div className={`absolute -inset-[1px] bg-gradient-to-br ${borderGradient} rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
          
          {/* Card content */}
          <div className="relative h-full bg-gray-900 rounded-2xl overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={guide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Lighter gradient overlay - better image visibility */}
              <div className={`absolute inset-0 bg-gradient-to-t ${gradient} mix-blend-multiply opacity-40`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Animated particles/sparkles on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4 md:p-5">
              {/* Top section - Category badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <FaBookOpen className="w-2.5 h-2.5 text-white/90" />
                  <span className="text-[10px] md:text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                
                {/* Sparkle icon */}
                <motion.div
                  className="w-7 h-7 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiSparkles className="w-3.5 h-3.5 text-yellow-300" />
                </motion.div>
              </div>
              
              {/* Bottom section - Title and CTA */}
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
                  {guide.title}
                </h3>
                
                {/* Read guide button */}
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('guide.readGuide')}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaArrowRight className="w-3 h-3" />
                  </motion.div>
                </div>
                
                {/* Animated underline */}
                <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white/80 to-white/40 rounded-full w-0 group-hover:w-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${borderGradient} rotate-45 opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact Guide Card for mobile
const CompactGuideCard = ({ guide, index }: { guide: Guide; index: number }) => {
  const imageUrl = guide.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const borderGradient = borderGradients[index % borderGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link 
        href={`/${guide.slug}`}
        className="flex gap-3 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-purple-500/20"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-purple-500/20">
          <Image
            src={imageUrl}
            alt={guide.title}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FaBookOpen className="w-2.5 h-2.5 text-purple-400" />
            <span className="text-[10px] font-semibold text-purple-400 uppercase">{t('guide.categoryDefault')}</span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
            {guide.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

// Featured Guide Card - Larger for first article
const FeaturedGuideCard = ({ guide }: { guide: Guide }) => {
  const imageUrl = guide.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = guide.categories?.nodes?.[0]?.name || t('guide.categoryDefault');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/${guide.slug}`}>
        <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden">
          {/* Animated border gradient */}
          <div className="absolute -inset-[2px] bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="absolute -inset-[1px] bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          
          {/* Card content */}
          <div className="relative h-full bg-gray-900 rounded-2xl overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={guide.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600/90 via-purple-600/50 to-transparent mix-blend-multiply opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-5 md:p-8">
              {/* Top section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <FaBookOpen className="w-3 h-3 text-white/90" />
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-400/30"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiSparkles className="w-3 h-3 text-yellow-300" />
                  <span className="text-xs font-semibold text-white uppercase">{t('guide.featured')}</span>
                </motion.div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                  {guide.title}
                </h2>
                
                <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm font-semibold uppercase tracking-wider">{t('guide.readFull')}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 rotate-45 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Subcategory Card - Game-specific guides
const SubcategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const gradient = gradients[index % gradients.length];
  const borderGradient = borderGradients[index % borderGradients.length];
  const imageUrl = category.posts?.nodes?.[0]?.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
      className="group"
    >
      <Link href={`/guides/${category.slug}`}>
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
          {/* Animated border gradient */}
          <div className={`absolute -inset-[1px] bg-gradient-to-br ${borderGradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
          
          {/* Card content */}
          <div className="relative h-full bg-gray-900 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} mix-blend-multiply opacity-50`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <FaGamepad className="w-4 h-4 text-white/80" />
                <span className="text-xs text-white/60 uppercase tracking-wider">{t('guide.gameGuide')}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-white/70 group-hover:text-white transition-colors">
                <span className="text-sm">{t('guide.explore')}</span>
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface GuidesPageContentProps {
  initialSubcategories: Category[];
  initialGuides: Guide[];
  initialHasNextPage: boolean;
}

export default function GuidesPageContent({ initialSubcategories, initialGuides, initialHasNextPage }: GuidesPageContentProps) {
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { fetchMore } = useQuery(GET_GUIDE_CATEGORIES_AND_POSTS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: true,
  });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: { after: afterCursor },
      }).then((fetchMoreResult) => {
        setGuides([...guides, ...fetchMoreResult.data.posts.nodes]);
        setHasNextPage(fetchMoreResult.data.posts.pageInfo.hasNextPage);
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  const featuredGuide = guides[0];
  const remainingGuides = guides.slice(1);

  return (
    <>
      <Header />
      <PageHeader 
        title={t('guide.title')}
        description={t('guide.description')}
        accentColor="purple"
      />
      
      <section className="pb-8 md:pb-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements - same as GuidesSection */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-3 md:px-4 relative">
        {/* Subcategories Section */}
          {initialSubcategories.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="hidden md:flex w-10 h-10 items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                  <FaGamepad className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">{t('guide.byGame')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {initialSubcategories.map((category, index) => (
                  <SubcategoryCard key={category.id} category={category} index={index} />
                ))}
          </div>
        </div>
          )}

        {/* All Guides Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="hidden md:flex w-10 h-10 items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                <FaBookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">{t('guide.allGuides')}</h2>
            </div>
            
            {/* Featured Guide */}
            {featuredGuide && (
              <div className="mb-6 md:mb-8">
                <FeaturedGuideCard guide={featuredGuide} />
              </div>
            )}
            
            {/* Mobile: Compact List View */}
            <div className="md:hidden space-y-2">
              {remainingGuides.map((guide, index) => (
                <CompactGuideCard key={guide.id} guide={guide} index={index} />
              ))}
        </div>
            
            {/* Desktop: Grid View with Guide Cards */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {remainingGuides.map((guide, index) => (
                <GuideCard key={guide.id} guide={guide} index={index} />
              ))}
        </div>
            
          {hasNextPage && (
              <div className="text-center mt-8 md:mt-12">
                <motion.button
                onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
              >
                  <span>{t('guide.loadMore')}</span>
                  <FaArrowRight className="w-3 h-3" />
                </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
      <Footer />
    </>
  );
}
