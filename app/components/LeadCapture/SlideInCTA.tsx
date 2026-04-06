'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaGamepad, FaBolt } from 'react-icons/fa';
import { t } from '../../lib/i18n';

interface SlideInCTAProps {
  onClose: () => void;
}

const SlideInCTA: React.FC<SlideInCTAProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Slide-in CTA' }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setTimeout(onClose, 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 80, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 right-4 z-40 w-[340px] max-w-[calc(100vw-2rem)]"
    >
      <div className="bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-5 shadow-2xl shadow-black/40">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-2">
            <FaGamepad className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-300 font-semibold text-sm">
              {t('newsletter.successMessage')}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaBolt className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">
                  {t('leadCapture.slideIn.heading')}
                </p>
                <p className="text-gray-400 text-xs">
                  {t('leadCapture.slideIn.subheading')}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('leadCapture.slideIn.placeholder')}
                required
                className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {status === 'submitting' ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  t('leadCapture.slideIn.cta')
                )}
              </button>
            </form>

            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2">Failed. Try again.</p>
            )}

            <p className="text-gray-600 text-[10px] mt-2">
              {t('leadCapture.slideIn.privacy')}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SlideInCTA;
