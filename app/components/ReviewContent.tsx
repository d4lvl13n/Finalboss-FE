'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReviewContentProps {
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  platform: string;
  releaseDate: string;
  developer: string;
}

export default function ReviewContent({ title, author, date, content, image, platform, releaseDate, developer }: ReviewContentProps) {
  const paragraphs = content.split('\n\n');
  const [readingTime, setReadingTime] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll progress logic
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start start', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Calculate reading time based on word count (assuming 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const time = Math.ceil(wordCount / 200);
    setReadingTime(time);
  }, [content]);

  return (
    <div ref={contentRef} className="min-h-screen bg-gray-900 text-white pt-24">
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-yellow-400"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent">{author}</p>
            <p className="text-sm text-gray-400">{date}</p>
          </div>
          <div className="text-sm text-gray-400">
            {readingTime} min read
          </div>
        </div>
        <div className="relative w-full h-96 mb-8">
          <Image 
            src={image} 
            alt={title} 
            fill 
            sizes="100vw" 
            style={{ objectFit: 'cover' }} 
            className="rounded-lg"
          />
        </div>

        {/* Game Info Box */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Game Information</h2>
          <p><strong>Platform:</strong> {platform}</p>
          <p><strong>Release Date:</strong> {releaseDate}</p>
          <p><strong>Developer:</strong> {developer}</p>
        </div>

        <div className="leading-relaxed text-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
