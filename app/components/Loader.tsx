'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GamerLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30); // Adjust speed of progress bar

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Welcoming Message */}
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        Welcome to FinalBoss.io
      </motion.h1>

      {/* Progress Bar */}
      <div className="range relative w-80 h-8 bg-gray-700 overflow-hidden transform skew-x-30">
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ backgroundColor: '#ffbb19' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2.0 }}
        />
        <div
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-black"
          style={{ transform: 'translateY(-50%) skewX(-30deg)' }}
        >
          {progress}%
        </div>
      </div>

      {/* Glitch Animation */}
      <motion.div
        className="mt-4 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        Loading...
      </motion.div>
    </div>
  );
}
