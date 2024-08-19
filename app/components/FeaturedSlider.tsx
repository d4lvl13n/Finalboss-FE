'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const featuredArticles = [
  { id: 1, title: "Elden Ring 2 Announced", image: "/battle-royale.jpg", description: "FromSoftware reveals the highly anticipated sequel" },
  { id: 2, title: "Starfield lands on PS5", image: "/images/starfield-review.jpg", description: "The groundbreaking open-world is coming for Playstation fans" },
  { id: 3, title: "Cyberpunk 2077 Gets Major Update", image: "/cyberpunk-update.jpg", description: "Night City evolves with new features and improvements" },
];

export default function FeaturedSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full z-10"
        >
          {/* Ensure the container has explicit height */}
          <div className="relative w-full h-full">
            <Image
              src={featuredArticles[currentIndex].image}
              alt={featuredArticles[currentIndex].title}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="absolute inset-0"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end p-8 z-20">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-extrabold text-white mb-4 neon-text-yellow"
            >
              {featuredArticles[currentIndex].title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300 neon-text-yellow"
            >
              {featuredArticles[currentIndex].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {featuredArticles.map((_, index) => (
          <motion.button
            key={index}
            className={`w-4 h-4 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#ffbb1a] shadow-lg' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
