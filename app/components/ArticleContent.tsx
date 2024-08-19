'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ArticleContentProps {
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
}

export default function ArticleContent({ title, author, date, content, image }: ArticleContentProps) {
  const [readingTime, setReadingTime] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"]
  });

  // Adjust background for dark theme
  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["hsl(210, 20%, 10%)", "hsl(210, 20%, 15%)"] // Dark theme colors
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const setSectionRef = useCallback((el: HTMLParagraphElement | null, index: number) => {
    sectionRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const wordCount = content.split(/\s+/).length;
    const time = Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed
    setReadingTime(time);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const paragraphs = content.split('\n\n');

  return (
    <motion.div ref={contentRef} style={{ background }} className="min-h-screen text-white pt-24"> {/* Dark background and light text */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-accent"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-4 text-white" /* Light text color */
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-accent">{author}</p> {/* Accent color for author */}
            <p className="text-sm text-gray-400">{date}</p> {/* Lighter text for date */}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-gray-400"
          >
            {readingTime} min read
          </motion.div>
        </div>
        <motion.div 
          className="relative w-full h-96 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Image 
            src={image} 
            alt={title} 
            fill 
            sizes="100vw" 
            style={{ objectFit: 'cover' }} 
            className="rounded-lg" 
            onError={(e) => e.currentTarget.src = '/fallback-image.jpg'}
          />
        </motion.div>
        <div className="flex gap-8">
          <div className="w-3/4">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                ref={(el) => setSectionRef(el, index)}
                className="mb-6 text-lg leading-relaxed text-gray-300" /* Light gray text for paragraphs */
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
          <div className="w-1/4">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-white">Table of Contents</h3> {/* Light text for table of contents */}
              <ul>
                {paragraphs.map((_, index) => (
                  <motion.li
                    key={index}
                    className={`mb-2 cursor-pointer ${activeSection === index ? 'text-accent' : 'text-gray-400'}`} /* Light gray text for non-active sections */
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Section {index + 1}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
