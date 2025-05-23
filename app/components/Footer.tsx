import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white pt-12 pb-12">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-futuristic-blue" />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start">
          <Image src="/finalboss.png" width={150} height={50} alt="FinalBoss.io" />
          <p className="mt-4 text-center md:text-left text-gray-400">
            Your ultimate destination for gaming news, reviews, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-futuristic-blue">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/write-for-us">
                <span className="hover:text-yellow transition-colors">Write For Us</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="hover:text-yellow transition-colors">About Us</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="hover:text-yellow transition-colors">Contact</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                <span className="hover:text-yellow transition-colors">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service">
                <span className="hover:text-yellow transition-colors">Terms of Service</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-futuristic-blue">Categories</h3>
          <ul className="space-y-2">
            {['News', 'Reviews', 'Guides', 'Videos', 'Technology'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase()}`}>
                  <span className="hover:text-futuristic-blue transition-colors">{item}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-futuristic-blue">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://x.com/FinalBoss_io" className="text-2xl text-gray-400 hover:text-futuristic-blue transform hover:-translate-y-1 transition-transform duration-200" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.facebook.com/FinalBoss.io/" className="text-2xl text-gray-400 hover:text-futuristic-blue transform hover:-translate-y-1 transition-transform duration-200" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/finalboss.io/" className="text-2xl text-gray-400 hover:text-futuristic-blue transform hover:-translate-y-1 transition-transform duration-200" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/@finalboss6969" className="text-2xl text-gray-400 hover:text-futuristic-blue transform hover:-translate-y-1 transition-transform duration-200" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Additional Section: Contact Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: support@finalboss.io</p>
          <p>Twitter: @FinalBossIO</p>
          {/* ...other contact info */}
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} FinalBoss.io. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
