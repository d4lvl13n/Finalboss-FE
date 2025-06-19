'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaGamepad, FaClock, FaLock } from 'react-icons/fa';

interface InlineContentUpgradeProps {
  title: string;
  description: string;
  bonusContent: string;
  articleTopic?: string;
}

const InlineContentUpgrade: React.FC<InlineContentUpgradeProps> = ({
  title,
  description,
  bonusContent,
  articleTopic = 'this article'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          source: `Inline Content Upgrade - ${title}`,
          article_topic: articleTopic,
          message: `User requested bonus content: ${bonusContent} for ${articleTopic}`
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-400/30 rounded-xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaDownload className="w-8 h-8 text-green-900" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Check Your Email! 📧</h3>
          <p className="text-green-200">
            Your exclusive {bonusContent.toLowerCase()} is on its way to your inbox.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-400/30 rounded-xl relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 text-6xl">🎮</div>
        <div className="absolute bottom-4 right-4 text-4xl">⭐</div>
        <div className="absolute top-1/2 right-8 text-3xl">🚀</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <FaLock className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <FaGamepad className="text-yellow-400" />
            <span className="text-white font-semibold">Exclusive Bonus Content:</span>
          </div>
          <p className="text-yellow-200 text-sm">{bonusContent}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for instant access..."
            required
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-white/15 transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none whitespace-nowrap"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              <>
                <FaDownload className="inline mr-2" />
                Get Bonus Content
              </>
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center">
            <FaClock className="mr-1" />
            Instant delivery
          </span>
          <span>No spam, unsubscribe anytime</span>
        </div>
      </div>
    </motion.div>
  );
};

export default InlineContentUpgrade; 