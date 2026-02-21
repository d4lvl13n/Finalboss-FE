'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GiGamepadCross } from 'react-icons/gi';
import { FaSearch, FaTimes, FaBars } from 'react-icons/fa';
import { useSearch } from './Search/SearchContext';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

interface MenuItemProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, children, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link href={href} onClick={onClick}>
      <span className="block text-white text-xl font-medium hover:text-yellow-400 transition-colors py-3 px-4 rounded-lg hover:bg-white/5 active:bg-white/10">
        {children}
      </span>
    </Link>
  </motion.div>
);

const navItems = [
  { name: t('nav.news'), href: '/gaming' },
  { name: t('nav.reviews'), href: '/reviews' },
  { name: t('nav.guides'), href: '/guides' },
  { name: t('nav.technology'), href: '/technology' },
  { name: t('nav.videos'), href: '/videos' },
  { name: t('nav.games'), href: '/games' },
  { name: t('nav.team'), href: '/authors' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const { openSearch } = useSearch();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMegaMenu = () => setMegaMenuOpen(!isMegaMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4">
          {/* Desktop: Mega Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMegaMenu}
            className="hidden md:block text-futuristic-blue z-50 mr-4"
          >
            {isMegaMenuOpen ? <FaTimes size={28} /> : <GiGamepadCross size={28} />}
          </motion.button>
          
          {/* Mobile: Hamburger Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className="md:hidden text-white z-50 mr-4 p-2 -ml-2"
            aria-label={t('nav.toggleMenu')}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
          
          <Link href="/">
            <Image src={siteConfig.logoPath} width={120} height={40} alt={siteConfig.name} />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors rounded-lg hover:bg-white/5"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="ml-auto flex items-center gap-4">
            <motion.button 
              onClick={openSearch}
              className="text-white hover:text-yellow-400 transition-colors p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t('nav.openSearch')}
            >
              <FaSearch size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-gray-900/98 backdrop-blur-lg z-[9999] md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <Image src={siteConfig.logoPath} width={100} height={33} alt={siteConfig.name} />
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                
                {/* Mobile Menu Navigation */}
                <nav className="flex-1 py-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MenuItem href={item.href} onClick={closeMobileMenu}>
                        {item.name}
                      </MenuItem>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-gray-800 space-y-3">
                  <Link
                    href="/write-for-us"
                    onClick={closeMobileMenu}
                    className="block text-sm text-gray-400 hover:text-yellow-400 transition-colors py-2"
                  >
                    {t('nav.writeForUs')}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="block text-sm text-gray-400 hover:text-yellow-400 transition-colors py-2"
                  >
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>
              
              {/* Accent Line */}
              <motion.div 
                className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                <Image src={siteConfig.logoPath} width={150} height={50} alt={siteConfig.name} />
              </div>
              
              <nav className="flex-grow">
                <MenuItem href="/gaming">
                  {t('nav.news')}
                </MenuItem>
                <MenuItem href="/games">
                  {t('nav.games')}
                </MenuItem>
                {[
                  { key: 'nav.reviews', href: '/reviews' },
                  { key: 'nav.guides', href: '/guides' },
                  { key: 'nav.videos', href: '/videos' },
                  { key: 'nav.technology', href: '/technology' },
                ].map((item) => (
                  <MenuItem key={item.href} href={item.href}>
                    {t(item.key)}
                  </MenuItem>
                ))}
                <MenuItem href="/articles">
                  {t('nav.allArticles')}
                </MenuItem>
                <MenuItem href="/authors">
                  {t('nav.team')}
                </MenuItem>
              </nav>
              
              <div className="space-y-12 mb-12">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-full bg-gray-800 text-white border-2 border-futuristic-blue focus:outline-none"
                    placeholder={t('nav.searchPlaceholder')}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-blue" size={18} />
                </div>
                <Link href="/login">
                  <motion.button
                    className="w-full bg-futuristic-blue text-black px-4 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 191, 255, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('nav.login')}
                  </motion.button>
                </Link>
              </div>

              <div className="flex justify-between text-sm">
                {[
                  { name: t('nav.writeForUs'), href: '/write-for-us' },
                  { name: t('nav.aboutUs'), href: '/about' },
                  { name: t('nav.contact'), href: '/contact' }
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
