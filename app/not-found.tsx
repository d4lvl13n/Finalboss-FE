'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Press_Start_2P } from 'next/font/google'; // Import game-like font from Google Fonts

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

const NotFoundPage: React.FC = () => {
  const [countdown, setCountdown] = useState(10);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [dartPosition, setDartPosition] = useState({ x: 0, y: 0 });
  const dartboardRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsGameOver(true);
    }
  }, [countdown]);

  const handleDartThrow = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isGameOver && dartboardRef.current) {
      const rect = dartboardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDartPosition({ x, y });

      // Calculate score based on distance from center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
      const newScore = Math.max(0, Math.floor(50 - (distance / maxDistance) * 50));

      setScore(score + newScore);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center items-center text-white text-center px-4 overflow-hidden relative">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-10"
            initial={{ scale: 0, x: Math.random() * 100, y: Math.random() * 100 }}
            animate={{
              scale: Math.random() * 0.5 + 0.5,
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{ width: `${Math.random() * 80 + 30}px`, height: `${Math.random() * 80 + 30}px` }}
          />
        ))}
      </div>

      <motion.div
        className={`text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-4 ${pressStart2P.className}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        &quot;Shenmue Flashbacks...&quot;
      </motion.div>
      <motion.p 
        className="text-2xl mt-4 text-gray-400 font-poppins"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        404 - You seem to be lost in Yokosuka...
      </motion.p>

      {/* Countdown Timer */}
      <motion.div
        className={`text-yellow-400 text-5xl mt-8 font-bold ${pressStart2P.className}`}
        initial={{ scale: 1.5 }}
        animate={{ scale: [1.5, 1.1, 1.5] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        {countdown > 0 ? `${countdown}` : 'Time&apos;s up!'}
      </motion.div>

      {/* Dart Game */}
      <motion.div
        className="mt-8 cursor-crosshair relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Image 
          src="/images/dartboard.png" 
          alt="Dartboard" 
          width={256}
          height={256}
          className="mx-auto rounded-full shadow-lg"
          ref={dartboardRef}
          onClick={handleDartThrow}
        />
        <AnimatePresence>
          {dartPosition.x !== 0 && (
            <motion.div
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{ left: dartPosition.x - 4, top: dartPosition.y - 4 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          )}
        </AnimatePresence>
        <motion.p 
          className={`text-2xl text-yellow-400 mt-4 font-bold ${pressStart2P.className}`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          Score: {score}
        </motion.p>
      </motion.div>

      {/* Button to go back to Home */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Link href="/">
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-xl font-bold rounded-full shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Dobuita Street
          </motion.button>
        </Link>
      </motion.div>

      {isGameOver && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${pressStart2P.className}`}>Game Over</h2>
            <p className="text-2xl mb-4">Final Score: {score}</p>
            <Link href="/">
              <motion.button
                className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NotFoundPage;
