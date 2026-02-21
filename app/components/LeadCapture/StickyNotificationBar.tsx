'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBell, FaFire, FaGamepad } from 'react-icons/fa';
import { formspreeUrl } from '../../lib/siteConfig';
import { t } from '../../lib/i18n';

const DISMISS_DURATION_DAYS = 7;

const StickyNotificationBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Show after 5 seconds if not dismissed within the last 7 days
    const timer = setTimeout(() => {
      const dismissedAt = localStorage.getItem('notification-bar-dismissed');
      
      if (dismissedAt) {
        const dismissedDate = new Date(dismissedAt);
        const now = new Date();
        const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Only show if more than 7 days have passed
        if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
          return;
        }
      }
      
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store the dismissal timestamp instead of just 'true'
    localStorage.setItem('notification-bar-dismissed', new Date().toISOString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'Sticky Notification Bar - Gaming Deals Alert',
          message: 'User signed up for gaming deals alerts via sticky notification bar'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
          localStorage.setItem('notification-bar-dismissed', 'true');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-md border-b border-purple-400/30 shadow-xl"
        >
          <div className="container mx-auto px-4 py-3">
            {isSuccess ? (
              <div className="flex items-center justify-center text-center">
                <FaBell className="text-green-400 mr-2" />
                <span className="text-white font-semibold">
                  {t('leadCapture.sticky.successMessage')}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                  <div className="flex items-center text-yellow-400 flex-shrink-0">
                    <FaFire className="animate-pulse mr-1 sm:mr-2" />
                    <span className="font-bold text-xs sm:text-sm">{t('leadCapture.sticky.hotDeals')}</span>
                  </div>
                  
                  <div className="hidden sm:block text-white text-sm">
                    {t('leadCapture.sticky.desktopMessage')}
                  </div>

                  <div className="sm:hidden text-white text-xs truncate">
                    {t('leadCapture.sticky.mobileMessage')}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center space-x-2 flex-shrink-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('leadCapture.sticky.emailPlaceholder')}
                    required
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 text-sm focus:outline-none focus:border-yellow-400/50 focus:bg-white/15 transition-all w-40 sm:w-48"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all text-sm whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 border border-black/20 border-t-black rounded-full animate-spin mr-1"></div>
                        <span className="hidden sm:inline">{t('leadCapture.sticky.submitting')}</span>
                      </div>
                    ) : (
                      <>
                        <FaGamepad className="inline mr-1" />
                        <span className="hidden sm:inline">{t('leadCapture.sticky.submit')}</span>
                        <span className="sm:hidden">{t('leadCapture.sticky.submitMobile')}</span>
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white transition-colors p-3 sm:p-1 -m-2 sm:m-0 flex-shrink-0"
                  aria-label={t('a11y.closeNotification')}
                >
                  <FaTimes className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyNotificationBar; 