'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';

interface ArticleCardProps {
  article: {
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
        slug?: string;
      }[];
    };
    author?: {
      node?: {
        name?: string;
        avatar?: {
          url?: string;
        };
      };
    };
  };
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
  basePath?: string; // e.g., '/reviews' for review articles
}

// Compact card for mobile list view - Consistent with homepage mobile style
function CompactCard({ article, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <Link href={href} className="flex gap-3 p-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
        <Image
          src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
          alt={article.title}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
          {category && (
            <span className="text-yellow-500 font-medium">{category.name}</span>
          )}
          {article.date && (
            <>
              <span className="text-gray-600">•</span>
              <span>{formatDate(article.date)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Featured card - larger, for first article - Matches homepage hero style
function FeaturedCard({ article, index = 0, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={href} className="block group">
        <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-xl overflow-hidden bg-gray-800">
          <Image
            src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category Badge - Top left */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-yellow-400 text-black text-xs font-bold rounded shadow-lg">
                {category.name}
              </span>
            </div>
          )}
          
          {/* Content - Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight line-clamp-2 mb-2">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              {article.date && (
                <span>{formatDate(article.date)}</span>
              )}
              {article.author?.node?.name && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-yellow-500">{article.author.node.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Default grid card - Matches homepage section style
function DefaultCard({ article, index = 0, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="group"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-800">
          <Image
            src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Lighter gradient for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Category Badge - Top left */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-yellow-400 text-black text-[10px] md:text-xs font-bold rounded shadow-lg">
                {category.name}
              </span>
            </div>
          )}
          
          {/* Content - Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-sm md:text-base font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
            {article.date && (
              <p className="text-xs text-gray-300 mt-2 opacity-80">
                {formatDate(article.date)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Main component that switches based on variant
export default function ArticleCard({ article, index = 0, variant = 'default', basePath = '' }: ArticleCardProps) {
  switch (variant) {
    case 'compact':
      return <CompactCard article={article} basePath={basePath} />;
    case 'featured':
      return <FeaturedCard article={article} index={index} basePath={basePath} />;
    default:
      return <DefaultCard article={article} index={index} basePath={basePath} />;
  }
}

// Export individual variants for direct use
export { CompactCard, FeaturedCard, DefaultCard };
