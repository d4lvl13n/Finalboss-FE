'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_GUIDES } from '../lib/queries/getLatestGuides';
import client from '../lib/apolloClient';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaBookOpen, FaGamepad } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  categories?: {
    nodes?: {
      name: string;
    }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

// Modern Guide Card with glassmorphism and hover effects
const GuideCard = ({ guide, index }: { guide: GuideArticle; index: number }) => {
  const imageUrl = guide.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = guide.categories?.nodes?.[0]?.name || 'Guide';
  
  // Gradient colors based on index for variety
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

  const gradient = gradients[index % gradients.length];
  const borderGradient = borderGradients[index % borderGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[280px] md:w-[320px] group"
    >
      <Link href={`/${guide.slug}`}>
        <div className="relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden">
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
                sizes="(max-width: 768px) 280px, 320px"
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
            <div className="relative h-full flex flex-col justify-between p-5">
              {/* Top section - Category badge */}
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaBookOpen className="w-3 h-3 text-white/90" />
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {category}
                  </span>
                </motion.div>
                
                {/* Sparkle icon */}
                <motion.div
                  className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiSparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>
              
              {/* Bottom section - Title and CTA */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
                  {guide.title}
                </h3>
                
                {/* Read guide button */}
                <motion.div 
                  className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-sm font-semibold uppercase tracking-wider">Read Guide</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
                
                {/* Animated underline */}
                <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white/80 to-white/40 rounded-full"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${borderGradient} rotate-45 opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const GuidesSection = () => {
  const { data, loading, error } = useQuery(GET_LATEST_GUIDES, {
    variables: { first: 8 },
    client,
  });
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (data) {
      setGuides(data.posts.nodes);
    }
  }, [data]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [guides]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-gray-800 animate-pulse mb-8 rounded-lg" />
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-[280px] md:w-[320px] h-[380px] md:h-[420px] bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error || guides.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-gray-900 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex w-14 h-14 items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/25"
            >
              <FaGamepad className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Game Guides
                </span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-1 hidden md:block">
                Master every game with our expert walkthroughs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Navigation arrows - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  canScrollLeft 
                    ? 'border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400' 
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                whileTap={canScrollLeft ? { scale: 0.95 } : {}}
              >
                <FaChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  canScrollRight 
                    ? 'border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400' 
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollRight ? { scale: 1.1 } : {}}
                whileTap={canScrollRight ? { scale: 0.95 } : {}}
              >
                <FaChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* View all link */}
            <Link 
              href="/guides" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <span className="hidden sm:inline">View All</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        
        {/* Scrollable cards container */}
        <div className="relative">
          {/* Left fade gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Right fade gradient */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Cards */}
          <div 
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {guides.map((guide, index) => (
              <GuideCard key={guide.id} guide={guide} index={index} />
            ))}
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-1.5 mt-6 md:hidden">
          {guides.slice(0, Math.min(guides.length, 6)).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === 0 ? 'bg-purple-400' : 'bg-gray-600'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
