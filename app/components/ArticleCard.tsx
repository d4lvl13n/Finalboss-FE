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

// Compact card for mobile list view
function CompactCard({ article, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <Link href={href} className="flex gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
          alt={article.title}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
          {category && (
            <span className="text-yellow-400/80">{category.name}</span>
          )}
          {article.date && (
            <>
              <span>•</span>
              <span>{formatDate(article.date)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Featured card - larger, for first article
function FeaturedCard({ article, index = 0, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={href} className="block group">
        <div className="relative aspect-[16/10] md:aspect-video rounded-xl overflow-hidden">
          <Image
            src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded">
                {category.name}
              </span>
            </div>
          )}
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
              {article.title}
            </h2>
            {article.date && (
              <p className="text-xs text-gray-300 mt-2">
                {formatDate(article.date)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Default grid card
function DefaultCard({ article, index = 0, basePath = '' }: ArticleCardProps) {
  const href = basePath ? `${basePath}/${article.slug}` : `/${article.slug}`;
  const category = article.categories?.nodes?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={href} className="block">
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
          <Image
            src={article.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] md:text-xs font-bold rounded">
                {category.name}
              </span>
            </div>
          )}
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
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

