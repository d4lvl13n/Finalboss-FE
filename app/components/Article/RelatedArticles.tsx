'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaUser, FaTags } from 'react-icons/fa';
import { PLACEHOLDER_BASE64 } from '../../utils/placeholder';
import { t } from '../../lib/i18n';
import { formatDate } from '../../utils/formatDate';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
  author?: {
    node: {
      name: string;
    };
  };
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  isLoading?: boolean;
  sequentialPosts?: {
    newer?: RelatedArticle[];
    older?: RelatedArticle[];
  };
  authorPosts?: RelatedArticle[];
  sectionTitle?: string;
}

export default function RelatedArticles({
  articles,
  isLoading = false,
  sequentialPosts,
  authorPosts,
  sectionTitle = t('article.relatedTitle')
}: RelatedArticlesProps) {
  if (isLoading) {
    return (
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-700 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render article card
  const renderArticleCard = (article: RelatedArticle, index: number, size: 'small' | 'medium' = 'medium') => (
    <motion.div
      key={article.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-750 transition-all duration-300 ${
        size === 'small' ? 'h-32' : 'h-64'
      }`}
    >
      <Link href={`/${article.slug}`} className="block h-full">
        {article.featuredImage ? (
          <div className="relative h-full">
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              fill
              sizes={size === 'small' ? '300px' : '400px'}
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={PLACEHOLDER_BASE64}
              className="transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_BASE64;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <FaTags className="text-yellow-400 text-2xl" />
          </div>
        )}
        
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <h3 className={`font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors ${
            size === 'small' ? 'text-sm' : 'text-lg'
          }`}>
            {article.title}
          </h3>
          
          {size === 'medium' && article.excerpt && (
            <p className="text-gray-300 text-sm line-clamp-2 mb-3" 
               dangerouslySetInnerHTML={{ __html: article.excerpt }} />
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDate(article.date)}</span>
            {article.categories?.nodes?.[0] && (
              <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                {article.categories.nodes[0].name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );

  // Helper function to render sequential navigation
  const renderSequentialNav = () => {
    if (!sequentialPosts) return null;

    const prevPost = sequentialPosts.older?.[0];
    const nextPost = sequentialPosts.newer?.[0];

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          <FaArrowLeft className="text-lg" />
          {t('article.continueReading')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prevPost && (
            <Link href={`/${prevPost.slug}`} className="group">
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <FaArrowLeft className="text-yellow-400 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">{t('article.previousArticle')}</p>
                  <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {prevPost.title}
                  </h4>
                </div>
              </div>
            </Link>
          )}
          
          {nextPost && (
            <Link href={`/${nextPost.slug}`} className="group">
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-400 mb-1">{t('article.nextArticle')}</p>
                  <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {nextPost.title}
                  </h4>
                </div>
                <FaArrowRight className="text-yellow-400 group-hover:transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Sequential Navigation */}
        {renderSequentialNav()}

        {/* Related Articles by Category */}
        {articles && articles.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center gap-2">
              <FaTags className="text-2xl" />
              {sectionTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.slice(0, 4).map((article, index) => 
                renderArticleCard(article, index, 'medium')
              )}
            </div>
          </div>
        )}

        {/* More by Author */}
        {authorPosts && authorPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <FaUser className="text-lg" />
              {t('article.moreFromAuthor')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {authorPosts.slice(0, 3).map((article, index) => 
                renderArticleCard(article, index, 'small')
              )}
            </div>
          </div>
        )}

        {/* No recommendations fallback */}
        {(!articles || articles.length === 0) && 
         (!sequentialPosts?.newer?.length && !sequentialPosts?.older?.length) && 
         (!authorPosts || authorPosts.length === 0) && (
          <div className="text-center py-12">
            <FaTags className="text-yellow-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">{t('article.noRelated')}</h3>
            <p className="text-gray-400 mb-6">{t('article.noRelatedTip')}</p>
            <Link href="/articles" className="inline-block bg-yellow-400 text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors">
              {t('article.browseAll')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 