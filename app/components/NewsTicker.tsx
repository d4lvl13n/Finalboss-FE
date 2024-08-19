'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const newsItems = [
  "Breaking: New 'God of War' game announced for 2025",
  "Esports: Team Liquid wins Dota 2 International",
  "Industry: Microsoft acquires another major game studio",
  "Tech: NVIDIA unveils next-gen gaming GPUs",
  "Mobile: 'Genshin Impact' surpasses $4 billion in revenue"
];

export default function NewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-accent text-primary py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentNewsIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center font-semibold"
          >
            {newsItems[currentNewsIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}