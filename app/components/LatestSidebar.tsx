// components/LatestSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { t } from '../lib/i18n';

interface Article {
  id: string;
  title: string;
  slug: string;
  date?: string;
  author?: {
    node?: {
      name?: string;
    };
  };
  categories?: {
    nodes?: {
      name: string;
      slug?: string;
    }[];
  };
}

interface LatestSidebarProps {
  articles: Article[];
  title?: string;
  showAllLink?: string;
  showAllText?: string;
  maxItems?: number;
  accentColor?: 'yellow' | 'purple' | 'blue' | 'green' | 'red';
  maxHeight?: string; // e.g., "500px" or "calc(100vh - 200px)"
}

// Format time ago or time of day
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    if (diffMins < 60) {
      return t('common.minsAgo', { mins: diffMins });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return t('common.yesterday');
  }
  
  // Otherwise show date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const accentColors = {
  yellow: {
    bar: 'bg-yellow-400/60 group-hover:bg-yellow-400',
    author: 'text-yellow-500',
    indicator: 'bg-yellow-400',
    button: 'text-yellow-400 hover:text-yellow-300 border-yellow-400/30 hover:border-yellow-400/50',
  },
  purple: {
    bar: 'bg-purple-400/60 group-hover:bg-purple-400',
    author: 'text-purple-500',
    indicator: 'bg-purple-400',
    button: 'text-purple-400 hover:text-purple-300 border-purple-400/30 hover:border-purple-400/50',
  },
  blue: {
    bar: 'bg-blue-400/60 group-hover:bg-blue-400',
    author: 'text-blue-500',
    indicator: 'bg-blue-400',
    button: 'text-blue-400 hover:text-blue-300 border-blue-400/30 hover:border-blue-400/50',
  },
  green: {
    bar: 'bg-green-400/60 group-hover:bg-green-400',
    author: 'text-green-500',
    indicator: 'bg-green-400',
    button: 'text-green-400 hover:text-green-300 border-green-400/30 hover:border-green-400/50',
  },
  red: {
    bar: 'bg-red-400/60 group-hover:bg-red-400',
    author: 'text-red-500',
    indicator: 'bg-red-400',
    button: 'text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400/50',
  },
};

// Sidebar article item with timestamp
const SidebarArticle = ({ 
  article, 
  index, 
  colors 
}: { 
  article: Article; 
  index: number;
  colors: typeof accentColors.yellow;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.03 }}
  >
    <Link 
      href={`/${article.slug}`}
      className="group flex gap-3 py-3 border-b border-gray-800 hover:bg-gray-800/30 transition-colors -mx-2 px-2 rounded"
    >
      {/* Timestamp */}
      <div className="w-16 flex-shrink-0 text-right pt-0.5">
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {article.date ? formatTimeAgo(article.date) : ''}
        </span>
      </div>
      
      {/* Accent bar */}
      <div className={`w-0.5 ${colors.bar} transition-colors flex-shrink-0 rounded-full`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors leading-snug">
          {article.title}
        </h3>
        {article.author?.node?.name && (
          <p className={`text-xs ${colors.author} mt-1.5 uppercase tracking-wide font-medium`}>
            {article.author.node.name}
          </p>
        )}
      </div>
    </Link>
  </motion.div>
);

export default function LatestSidebar({
  articles,
  title = t('common.latest'),
  showAllLink = '/gaming',
  showAllText = t('common.showAll'),
  maxItems = 15,
  accentColor = 'yellow',
  maxHeight = '600px',
}: LatestSidebarProps) {
  const colors = accentColors[accentColor];
  const displayedArticles = articles.slice(0, maxItems);

  return (
    <div className="sticky top-24 flex flex-col" style={{ maxHeight }}>
      {/* Header - Fixed at top */}
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 flex-shrink-0">
        <span className={`w-2 h-2 ${colors.indicator} rounded-full animate-pulse`}></span>
        {title}
      </h3>
      
      {/* Scrollable articles list */}
      <div 
        className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(55 65 81) transparent'
        }}
      >
        <div className="space-y-0">
          {displayedArticles.map((article, index) => (
            <SidebarArticle 
              key={article.id} 
              article={article} 
              index={index}
              colors={colors}
            />
          ))}
        </div>
      </div>
      
      {/* Show all link - Fixed at bottom */}
      {showAllLink && (
        <Link 
          href={showAllLink}
          className={`flex items-center justify-center gap-2 mt-4 py-3 text-sm font-semibold ${colors.button} transition-colors border rounded-lg flex-shrink-0`}
        >
          <span>{showAllText}</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// Export the formatTimeAgo function for use in other components
export { formatTimeAgo };

