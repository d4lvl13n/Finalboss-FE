'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBell, FaFire, FaGamepad } from 'react-icons/fa';

const StickyNotificationBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Show after 3 seconds if not dismissed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('notification-bar-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('notification-bar-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xjkronpd', {
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
                  🎉 You&apos;re all set! Gaming deals coming your way!
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                  <div className="flex items-center text-yellow-400 flex-shrink-0">
                    <FaFire className="animate-pulse mr-1 sm:mr-2" />
                    <span className="font-bold text-xs sm:text-sm">HOT DEALS</span>
                  </div>
                  
                  <div className="hidden sm:block text-white text-sm">
                    Get instant alerts for gaming deals up to 90% off + free game keys every month!
                  </div>
                  
                  <div className="sm:hidden text-white text-xs truncate">
                    Gaming deals up to 90% off + free keys!
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center space-x-2 flex-shrink-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                        <span className="hidden sm:inline">Joining...</span>
                      </div>
                    ) : (
                      <>
                        <FaGamepad className="inline mr-1" />
                        <span className="hidden sm:inline">Get Alerts</span>
                        <span className="sm:hidden">Join</span>
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white transition-colors p-3 sm:p-1 -m-2 sm:m-0 flex-shrink-0"
                  aria-label="Close notification"
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