'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  accentColor?: 'yellow' | 'purple' | 'blue' | 'green' | 'red' | 'orange';
  compact?: boolean; // For even smaller header on some pages
}

const accentColors = {
  yellow: {
    gradient: 'from-yellow-400 to-orange-500',
    glow: 'from-yellow-400/20',
    text: 'text-yellow-400',
  },
  purple: {
    gradient: 'from-purple-400 to-pink-500',
    glow: 'from-purple-400/20',
    text: 'text-purple-400',
  },
  blue: {
    gradient: 'from-blue-400 to-cyan-500',
    glow: 'from-blue-400/20',
    text: 'text-blue-400',
  },
  green: {
    gradient: 'from-green-400 to-emerald-500',
    glow: 'from-green-400/20',
    text: 'text-green-400',
  },
  red: {
    gradient: 'from-red-400 to-rose-500',
    glow: 'from-red-400/20',
    text: 'text-red-400',
  },
  orange: {
    gradient: 'from-orange-400 to-amber-500',
    glow: 'from-orange-400/20',
    text: 'text-orange-400',
  },
};

export default function PageHeader({ title, description, accentColor = 'yellow', compact = false }: PageHeaderProps) {
  const colors = accentColors[accentColor];
  
  // pt-20 accounts for fixed header height (~80px)
  return (
    <section className={`relative overflow-hidden pt-20 md:pt-24 ${compact ? 'pb-4 md:pb-8' : 'pb-6 md:pb-12'}`}>
      {/* Background Effects - Simplified on mobile */}
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.glow} via-transparent to-transparent opacity-30 md:opacity-50`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/30 md:from-gray-800/50 via-gray-900 to-gray-900" />
      
      {/* Grid Pattern - Hidden on mobile for cleaner look */}
      <div 
        className="absolute inset-0 opacity-[0.03] hidden md:block"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="relative container mx-auto px-4 text-center">
        {/* Animated Title - Smaller on mobile */}
        <motion.h1 
          className={`font-bold ${compact ? 'text-2xl md:text-4xl mb-2' : 'text-2xl md:text-4xl lg:text-5xl mb-2 md:mb-4'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {title}
          </span>
        </motion.h1>
        
        {/* Description - Hidden on mobile for compact view, or smaller */}
        {description && (
          <motion.p 
            className={`text-gray-400 max-w-2xl mx-auto ${compact ? 'hidden md:block text-sm md:text-base' : 'text-sm md:text-lg'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
        
        {/* Decorative Line - Smaller on mobile */}
        <motion.div 
          className={`mx-auto h-0.5 md:h-1 rounded-full bg-gradient-to-r ${colors.gradient} ${compact ? 'mt-3 w-12 md:w-16' : 'mt-4 md:mt-6 w-16 md:w-24'}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />
      </div>
    </section>
  );
}

