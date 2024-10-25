'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GamerLoader() {
  const [progress, setProgress] = useState(0);
  const [shouldRemove, setShouldRemove] = useState(false);

  useEffect(() => {
    // Start with a quick initial progress
    setProgress(30);

    // Use a more efficient progress simulation
    const timer = setTimeout(() => {
      setProgress(70);
      
      // Force complete after 2 seconds
      const completeTimer = setTimeout(() => {
        setProgress(100);
        setShouldRemove(true);
      }, 2000);

      return () => clearTimeout(completeTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (shouldRemove) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Welcoming Message */}
      <h1 className="text-4xl font-bold mb-4 font-orbitron">
        Welcome to FinalBoss.io
      </h1>

      {/* Simplified Progress Bar */}
      <div className="relative w-80 h-8 bg-gray-700 overflow-hidden transform skew-x-30">
        <div
          className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-black"
            style={{ transform: 'translateY(-50%) skewX(-30deg)' }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Static Loading Text */}
      <div className="mt-4 text-xl">
        Loading...
      </div>
    </div>
  );
}
