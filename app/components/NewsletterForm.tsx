'use client';

import { motion } from 'framer-motion';
import { FaPaperPlane, FaGamepad, FaTrophy, FaBolt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { t } from '../lib/i18n';

export default function NewsletterForm() {
  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 left-1/4 text-yellow-400/10">
        <FaGamepad className="w-16 h-16 rotate-12" />
      </div>
      <div className="absolute -top-8 right-1/4 text-yellow-400/10">
        <FaTrophy className="w-12 h-12 -rotate-12" />
      </div>
      
      <motion.form 
        className="max-w-xl mx-auto relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Input group with glow effect */}
        <div className="relative group">
          {/* Glow effect on focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full opacity-0 group-focus-within:opacity-30 blur-lg transition-opacity duration-500" />
          
          <div className="relative flex bg-gray-800 rounded-full p-1.5 border border-gray-700 group-focus-within:border-yellow-400/50 transition-colors">
            <div className="flex items-center pl-4 text-gray-500">
              <FaPaperPlane className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder={t('newsletter.emailPlaceholder')}
              className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
              required
            />
            <motion.button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-sm md:text-base hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('newsletter.subscribe')}</span>
              <HiSparkles className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FaBolt className="w-3 h-3 text-yellow-400" />
            <span>{t('newsletter.benefit1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTrophy className="w-3 h-3 text-yellow-400" />
            <span>{t('newsletter.benefit2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGamepad className="w-3 h-3 text-yellow-400" />
            <span>{t('newsletter.benefit3')}</span>
          </div>
        </div>
        
        {/* Privacy note */}
        <p className="text-xs text-gray-600 mt-4">
          {t('newsletter.privacy')}
        </p>
      </motion.form>
    </div>
  );
}
