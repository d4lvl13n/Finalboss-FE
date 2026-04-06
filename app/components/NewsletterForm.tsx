'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaGamepad, FaTrophy, FaBolt, FaCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { t } from '../lib/i18n';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Homepage Newsletter' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="max-w-xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-3 bg-green-900/30 border border-green-400/30 rounded-full px-6 py-4">
          <FaCheck className="w-5 h-5 text-green-400" />
          <span className="text-green-200 font-medium">{t('newsletter.successMessage')}</span>
        </div>
      </motion.div>
    );
  }

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
        onSubmit={handleSubmit}
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder={t('newsletter.emailPlaceholder')}
              className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
              disabled={isSubmitting}
              required
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-sm md:text-base hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <span>{t('newsletter.subscribe')}</span>
                  <HiSparkles className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}

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
