'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../../styles/article.css';
import ProcessedContent from '../../components/ProcessedContent';

interface ArticleContentProps {
  article: any; // Replace 'any' with a proper type for your article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // Add after line 12 in ArticleContent.tsx
  console.log('Raw article content:', article.content);
  const [readingProgress, setReadingProgress] = useState(0);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -250]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
    };
  }, []);



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <motion.div
          className="h-full bg-yellow-400"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Parallax Featured Image */}
      <div className="relative h-[60vh] overflow-hidden">
        {article.featuredImage && (
          <motion.div className="absolute inset-0" style={{ y }}>
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className=""
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-4 -mt-24">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.title}
            </motion.h1>

            {/* Author and Date Section */}
            <motion.div
              className="inline-block rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm shadow-xl p-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-6">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700/70 border-2 border-yellow-400/20 flex items-center justify-center text-yellow-400 text-lg font-semibold shadow-lg">
                    {article.author?.node?.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-yellow-400 font-medium tracking-wide">
                      {article.author?.node?.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-700/50"></div>

                {/* Reading Time Indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg 
                    className="w-5 h-5 text-yellow-400/70" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="prose prose-lg prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProcessedContent content={article.content} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
