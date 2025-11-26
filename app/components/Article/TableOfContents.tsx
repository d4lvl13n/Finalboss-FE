'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  minHeadings?: number;
}

export default function TableOfContents({ content, minHeadings = 3 }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings from content
    const headingRegex = /<h([2-4])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[2-4]>/gi;
    const matches: TocItem[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const existingId = match[2];
      const text = match[3].replace(/<[^>]*>/g, '').trim();
      
      // Generate ID from text if not present
      const id = existingId || `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      
      if (text) {
        matches.push({ id, text, level });
      }
      index++;
    }

    setHeadings(matches);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Don't show if not enough headings
  if (headings.length < minHeadings) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
      aria-label="Table of contents"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-yellow-400 font-semibold">
          <List className="w-5 h-5" />
          <span>Table of Contents</span>
          <span className="text-gray-500 font-normal text-sm">({headings.length})</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-1">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left py-1.5 px-3 rounded-lg text-sm transition-all duration-200
                      ${activeId === heading.id
                        ? 'bg-yellow-400/20 text-yellow-400 font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                      }
                    `}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

