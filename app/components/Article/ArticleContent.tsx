'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../../styles/article.css';

interface ArticleContentProps {
  article: any; // Replace 'any' with a proper type for your article
}

export default function ArticleContent({ article }: ArticleContentProps) {
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
            <motion.div
              className="flex items-center text-gray-400 text-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>{new Date(article.date).toLocaleDateString()}</span>
              {article.author?.node?.name && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.author.node.name}</span>
                </>
              )}
            </motion.div>
            <motion.div
              className="prose prose-lg prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}