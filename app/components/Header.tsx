'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GiGamepadCross } from 'react-icons/gi';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface MenuItemProps {
  href: string;
  children: ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, children }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mb-4"
  >
    <Link href={href}>
      <span className="block text-white text-2xl font-medium hover:text-futuristic-blue transition-colors p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700">
        {children}
      </span>
    </Link>
  </motion.div>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMegaMenu = () => setMegaMenuOpen(!isMegaMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMegaMenu}
            className="text-futuristic-blue z-50 mr-4"
          >
            {isMegaMenuOpen ? <FaTimes size={28} /> : <GiGamepadCross size={28} />}
          </motion.button>
          <Link href="/">
            <Image src="/finalboss.png" width={120} height={40} alt="FinalBoss.io" />
          </Link>
          <div className="ml-auto flex items-center">
            <FaSearch className="text-white cursor-pointer" />
            {/* Toggle search input visibility on icon click */}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            ref={menuRef}
            className="fixed top-0 left-0 h-screen w-full max-w-md bg-black bg-opacity-90 backdrop-blur-lg text-white p-8 shadow-lg overflow-y-auto"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <Image src="/finalboss.png" width={150} height={50} alt="FinalBoss.io" />
              </div>
              
              <nav className="flex-grow">
                {['News', 'Reviews', 'Guides', 'Videos', 'Technology'].map((item) => (
                  <MenuItem key={item} href={`/${item.toLowerCase()}`}>
                    {item}
                  </MenuItem>
                ))}
                <MenuItem href="/skull-and-bones-guide">
                  Skull And Bones Guide
                </MenuItem>
              </nav>
              
              <div className="space-y-12 mb-12">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-full bg-gray-800 text-white border-2 border-futuristic-blue focus:outline-none"
                    placeholder="Search..."
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-blue" size={18} />
                </div>
                <Link href="/login">
                  <motion.button
                    className="w-full bg-futuristic-blue text-black px-4 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 191, 255, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

              <div className="flex justify-between text-sm">
                {[
                  { name: 'Write For Us', href: '/write-for-us' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((item) => (
                  <Link key={item.name} href={item.href}>
                    <motion.span 
                      className="text-gray-400 hover:text-futuristic-blue transition-colors p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                ))}
              </div>
            </div>
            <motion.div 
              className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-futuristic-blue via-purple-500 to-pink-500"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
