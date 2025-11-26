'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useYouTubeVideos } from '../hooks/useYouTubeVideos';
import { YouTubeService } from '../lib/youtube/service';
import { FaArrowRight, FaPlay, FaClock, FaEye, FaChevronLeft, FaChevronRight, FaYoutube } from 'react-icons/fa';

const VideoSection = () => {
  const { videos, loading, error } = useYouTubeVideos(6);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [videos]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="h-8 w-40 bg-gray-800 animate-pulse mb-6 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-[280px] md:w-[360px]">
                <div className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) return null;

  return (
    <section className="py-10 md:py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-10 h-10 items-center justify-center bg-red-600 rounded-lg">
                <FaYoutube className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-yellow-400">Featured Videos</h2>
            </div>
            <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full ml-4"></div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  canScrollLeft 
                    ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400' 
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                whileTap={canScrollLeft ? { scale: 0.95 } : {}}
              >
                <FaChevronLeft className="w-3 h-3" />
              </motion.button>
              <motion.button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  canScrollRight 
                    ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400' 
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={canScrollRight ? { scale: 1.1 } : {}}
                whileTap={canScrollRight ? { scale: 0.95 } : {}}
              >
                <FaChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
            
            <Link 
              href="/videos" 
              className="bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>
        </div>

        {/* Video Slider */}
        <div className="relative">
          {/* Mobile scroll buttons */}
          <button 
            onClick={() => scroll('left')}
            className={`md:hidden absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={`md:hidden absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>

          {/* Left fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Right fade */}
          <div className={`absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-[260px] md:w-[340px] group"
              >
                <Link 
                  href={`/videos/${video.id}`} 
                  className="block"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image 
                      src={video.thumbnail.url} 
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 260px, 340px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlay className="text-black text-base md:text-lg ml-1" />
                      </motion.div>
                    </div>
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded flex items-center gap-1">
                      <FaClock className="w-2.5 h-2.5" />
                      {YouTubeService.formatDuration(video.duration)}
                    </div>
                    
                    {/* Red accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                  
                  {/* Info */}
                  <div className="mt-3">
                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex justify-between items-center text-gray-400 text-xs mt-2">
                      <span>{new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        {parseInt(video.viewCount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {videos.slice(0, Math.min(videos.length, 6)).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-yellow-400' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
