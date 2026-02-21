'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaGamepad, FaClock, FaGift, FaUsers } from 'react-icons/fa';
import { formspreeUrl } from '../../lib/siteConfig';
import { t } from '../../lib/i18n';

interface ExitIntentModalProps {
  onClose: () => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          source: 'Exit Intent Modal - Gaming Insider Access',
          message: 'User signed up for Gaming Insider Access via exit intent modal'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-900/90 to-green-800/90 backdrop-blur-md border border-green-400/30 rounded-2xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGamepad className="w-8 h-8 text-green-900" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{t('leadCapture.exitIntent.successTitle')}</h3>
          <p className="text-green-200">
            {t('leadCapture.exitIntent.successMessage')}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-8 max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                <FaGamepad className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{t('leadCapture.exitIntent.heading')}</h2>
                <p className="text-yellow-400 text-sm font-semibold">{t('leadCapture.exitIntent.subtitle')}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              {t('leadCapture.exitIntent.description')}
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {[
                { icon: FaClock, text: t('leadCapture.exitIntent.benefit1'), color: "text-blue-400" },
                { icon: FaGift, text: t('leadCapture.exitIntent.benefit2'), color: "text-purple-400" },
                { icon: FaUsers, text: t('leadCapture.exitIntent.benefit3'), color: "text-green-400" }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <benefit.icon className={`w-4 h-4 mr-3 ${benefit.color}`} />
                  <span className="text-gray-300 text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              {t('leadCapture.exitIntent.privacyNote')}
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {t('leadCapture.exitIntent.formTitle')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('leadCapture.exitIntent.emailPlaceholder')}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                    {t('leadCapture.exitIntent.submitting')}
                  </div>
                ) : (
                  t('leadCapture.exitIntent.submit')
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-xs text-gray-400">
                {t('leadCapture.exitIntent.trustBadge')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExitIntentModal; 