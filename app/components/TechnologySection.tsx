'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_TECH_ARTICLES } from '../lib/queries/getTechArticles';
import client from '../lib/apolloClient';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaMicrochip, FaBolt } from 'react-icons/fa';
import { HiCpuChip } from 'react-icons/hi2';

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

// Futuristic Tech Card with circuit board aesthetic
const TechCard = ({ article, index }: { article: Article; index: number }) => {
  const imageUrl = article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const category = article.categories?.nodes?.[0]?.name || 'Tech';
  
  // Cyber color schemes
  const colorSchemes = [
    { primary: 'cyan', glow: 'cyan-400', gradient: 'from-cyan-500 to-blue-600', border: 'cyan-400/50', text: 'cyan-400' },
    { primary: 'emerald', glow: 'emerald-400', gradient: 'from-emerald-500 to-teal-600', border: 'emerald-400/50', text: 'emerald-400' },
    { primary: 'violet', glow: 'violet-400', gradient: 'from-violet-500 to-purple-600', border: 'violet-400/50', text: 'violet-400' },
    { primary: 'amber', glow: 'amber-400', gradient: 'from-amber-500 to-orange-600', border: 'amber-400/50', text: 'amber-400' },
    { primary: 'rose', glow: 'rose-400', gradient: 'from-rose-500 to-pink-600', border: 'rose-400/50', text: 'rose-400' },
    { primary: 'sky', glow: 'sky-400', gradient: 'from-sky-500 to-indigo-600', border: 'sky-400/50', text: 'sky-400' },
  ];
  
  const scheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-[300px] md:w-[360px] group"
    >
      <Link href={`/${article.slug}`}>
        <div className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden bg-gray-950">
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
                sizes="(max-width: 768px) 300px, 360px"
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
              
              {/* Circuit nodes */}
              <div className={`absolute top-[20%] left-[25%] w-2 h-2 bg-${scheme.glow} rounded-full`} />
              <div className={`absolute top-[40%] left-[50%] w-2 h-2 bg-${scheme.glow} rounded-full`} />
              <div className={`absolute top-[60%] left-[75%] w-2 h-2 bg-${scheme.glow} rounded-full`} />
            </div>
            
            {/* Scanning line animation on hover */}
            <motion.div 
              className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${scheme.glow} to-transparent opacity-0 group-hover:opacity-100`}
              initial={{ top: '0%' }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-5">
              {/* Top section */}
              <div className="flex items-center justify-between">
                {/* Category badge with tech style */}
                <motion.div 
                  className={`flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded border border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaMicrochip className={`w-3 h-3 text-${scheme.text}`} />
                  <span className={`text-xs font-mono font-bold text-${scheme.text} uppercase tracking-wider`}>
                    {category}
                  </span>
                </motion.div>
                
                {/* Status indicator */}
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 bg-${scheme.glow} rounded-full`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`text-xs font-mono text-${scheme.text}/70`}>LIVE</span>
                </div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-4">
                {/* Data line decoration */}
                <div className="flex items-center gap-2">
                  <div className={`h-[2px] w-8 bg-gradient-to-r from-${scheme.glow} to-transparent`} />
                  <FaBolt className={`w-3 h-3 text-${scheme.text}`} />
                </div>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-3 font-sans">
                  {article.title}
                </h3>
                
                {/* Read more with tech styling */}
                <div className="flex items-center justify-between">
                  <motion.div 
                    className={`flex items-center gap-2 text-${scheme.text} group-hover:text-white transition-colors`}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xs font-mono font-semibold uppercase tracking-widest">Access</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FaArrowRight className="w-3 h-3" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Tech decoration */}
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 h-3 bg-${scheme.glow}/50 rounded-full`}
                        animate={{ height: ['12px', '20px', '12px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
            <div className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-${scheme.border} group-hover:border-${scheme.glow} transition-colors duration-300`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const TechnologySection = () => {
  const { data, loading, error } = useQuery(GET_TECH_ARTICLES, {
    variables: { first: 8 },
    client,
  });
  
  const [articles, setArticles] = useState<Article[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (data) {
      setArticles(data.posts.nodes);
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
  }, [articles]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-900 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="h-10 w-56 bg-gray-800 animate-pulse mb-8 rounded" />
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-[300px] md:w-[360px] h-[280px] md:h-[320px] bg-gray-900 rounded-xl animate-pulse border border-cyan-900/30" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error || articles.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-gray-900 overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            {/* Animated tech icon */}
            <motion.div
              className="hidden md:flex w-14 h-14 items-center justify-center bg-gray-900 rounded-lg border border-cyan-500/30 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <HiCpuChip className="w-7 h-7 text-cyan-400 relative z-10" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    Tech Hub
                  </span>
                </h2>
                {/* Live indicator */}
                <motion.div
                  className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span className="text-xs font-mono text-cyan-400 uppercase">Live</span>
                </motion.div>
              </div>
              <p className="text-gray-500 text-sm md:text-base mt-1 hidden md:block font-mono">
                // Latest in gaming hardware & software
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Navigation arrows */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 flex items-center justify-center rounded border transition-all duration-300 ${
                  canScrollLeft 
                    ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400' 
                    : 'border-gray-800 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                whileTap={canScrollLeft ? { scale: 0.95 } : {}}
              >
                <FaChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 flex items-center justify-center rounded border transition-all duration-300 ${
                  canScrollRight 
                    ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400' 
                    : 'border-gray-800 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollRight ? { scale: 1.1 } : {}}
                whileTap={canScrollRight ? { scale: 0.95 } : {}}
              >
                <FaChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* View all button */}
            <Link 
              href="/technology" 
              className="group flex items-center gap-2 px-4 py-2 bg-gray-900 border border-cyan-500/30 text-cyan-400 rounded font-mono text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
            >
              <span className="hidden sm:inline">Explore</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="w-3 h-3" />
              </motion.div>
            </Link>
          </div>
        </div>
        
        {/* Data stream decoration */}
        <div className="flex items-center gap-4 mb-6 overflow-hidden">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
            <span>{'<'}</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-cyan-500"
            >
              streaming
            </motion.span>
            <span>{'/>'}</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
        
        {/* Scrollable cards container */}
        <div className="relative">
          {/* Left fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Right fade */}
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Cards */}
          <div 
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article, index) => (
              <TechCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-1.5 mt-6 md:hidden">
          {articles.slice(0, Math.min(articles.length, 6)).map((_, idx) => (
            <motion.div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-cyan-400' : 'bg-gray-700'}`}
              animate={idx === 0 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>
        
        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-2 mt-8 text-gray-700">
          <div className="w-2 h-2 border border-cyan-500/30 rotate-45" />
          <div className="h-[1px] w-20 bg-gradient-to-r from-cyan-500/30 to-transparent" />
          <span className="text-xs font-mono">EOF</span>
          <div className="h-[1px] w-20 bg-gradient-to-l from-cyan-500/30 to-transparent" />
          <div className="w-2 h-2 border border-cyan-500/30 rotate-45" />
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
