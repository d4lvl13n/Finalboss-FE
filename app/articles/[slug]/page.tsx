'use client';

import { useQuery } from '@apollo/client';
import { GET_ARTICLE_BY_SLUG } from '../../lib/queries/getArticleBySlug';
import client from '../../lib/apolloClient';
import Image from 'next/image';
import Loader from '../../components/Loader';
import '../../styles/article.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { data, loading, error } = useQuery(GET_ARTICLE_BY_SLUG, {
    variables: { slug: params.slug },
    client,
  });

  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error loading article...</p>;

  const article = data?.post;

  if (!article) return <p>Article not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <motion.div 
          className="h-full bg-yellow-400" 
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>
      <div className="px-4 py-12 sm:py-24 max-w-5xl mx-auto">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
        >
          <header className="relative">
            {article.featuredImage && (
              <div className="relative h-64 sm:h-96">
                <Image
                  src={article.featuredImage.node.sourceUrl}
                  alt={article.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">{article.title}</h1>
              <div className="flex items-center text-gray-300 text-sm sm:text-base">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                {article.author?.node?.name && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{article.author.node.name}</span>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="p-6 sm:p-8">
            <div className="prose prose-lg prose-invert max-w-none">
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
