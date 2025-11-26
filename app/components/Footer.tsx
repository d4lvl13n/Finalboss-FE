'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaGamepad, FaNewspaper, FaStar, FaBookOpen, FaVideo, FaCog } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 opacity-80"></div>
      
      <div className="relative z-10 px-4 py-16 md:py-20">
        <div className="container mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-2xl">
                <Image 
                  src="/finalboss.png" 
                  width={180} 
                  height={60} 
                  alt="FinalBoss.io" 
                  className="mx-auto lg:mx-0 mb-4"
                />
                <p className="text-gray-300 leading-relaxed mb-6 max-w-sm mx-auto lg:mx-0">
                  Your ultimate destination for cutting-edge gaming content, reviews, and the latest industry insights.
                </p>
                
                {/* Newsletter Signup */}
                <div className="space-y-3">
                  <h4 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Stay Updated</h4>
                  <form 
                    action="https://formspree.io/f/xjkronpd" 
                    method="POST" 
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                    />
                    <input type="hidden" name="source" value="Footer Newsletter" />
                    <input type="hidden" name="message" value="User signed up for newsletter via footer" />
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Join
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Quick Links Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <FaGamepad className="text-yellow-400 text-xl mr-3" />
                  <h3 className="text-white font-bold text-lg">Quick Links</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { href: '/authors', label: 'Our Team' },
                    { href: '/write-for-us', label: 'Write For Us' },
                    { href: '/about', label: 'About Us' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/privacy-policy', label: 'Privacy Policy' },
                    { href: '/terms-of-service', label: 'Terms of Service' }
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                                                 <span className="text-gray-300 hover:text-yellow-400 transition-all duration-200 text-sm flex items-center group-hover:translate-x-1">
                          <span className="w-1 h-1 bg-yellow-400/60 rounded-full mr-2 group-hover:bg-yellow-400 transition-colors"></span>
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <FaNewspaper className="text-purple-400 text-xl mr-3" />
                  <h3 className="text-white font-bold text-lg">Categories</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { href: '/articles', label: 'News', icon: FaNewspaper },
                    { href: '/reviews', label: 'Reviews', icon: FaStar },
                    { href: '/guides', label: 'Guides', icon: FaBookOpen },
                    { href: '/videos', label: 'Videos', icon: FaVideo },
                    { href: '/technology', label: 'Technology', icon: FaCog }
                  ].map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                                                 <span className="text-gray-300 hover:text-purple-400 transition-all duration-200 text-sm flex items-center group-hover:translate-x-1">
                          <item.icon className="w-3 h-3 mr-2 opacity-60" />
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social & Contact Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></div>
                  <h3 className="text-white font-bold text-lg">Connect</h3>
                </div>
                
                {/* Social Media */}
                <div className="mb-6">
                  <h4 className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">Follow Us</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { href: "https://x.com/FinalBoss_io", icon: FaTwitter, color: "hover:text-blue-400" },
                      { href: "https://www.facebook.com/FinalBoss.io/", icon: FaFacebookF, color: "hover:text-blue-600" },
                      { href: "https://www.instagram.com/finalboss.io/", icon: FaInstagram, color: "hover:text-pink-400" },
                      { href: "https://www.youtube.com/@finalboss6969", icon: FaYoutube, color: "hover:text-red-500" }
                    ].map((social, index) => (
                      <a 
                        key={index}
                        href={social.href} 
                        className={`p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 ${social.color} transform hover:scale-110 hover:bg-white/10 transition-all duration-200 shadow-lg`}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-3">Contact</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      <button 
                        onClick={() => {
                          const parts = ['thebosses', 'finalboss.io'];
                          window.location.href = `mailto:${parts[0]}@${parts[1]}`;
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.title = 'Click to send email to thebosses@finalboss.io';
                        }}
                        className="hover:text-green-400 transition-colors cursor-pointer underline-offset-2 hover:underline flex items-center"
                      >
                        <span>✉️</span>
                        <span className="ml-1" data-reverse="oi.ssoblanif@sessohbeht">
                          <span style={{display: 'inline-block', transform: 'scaleX(-1)', direction: 'rtl'}}>
                            oi.ssoblanif@sessohbeht
                          </span>
                        </span>
                      </button>
                    </div>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      @FinalBoss_io
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} <span className="text-yellow-400 font-semibold">FinalBoss.io</span>. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Powering the future of gaming content
                </p>
              </div>
              
              {/* Powered by badge */}
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-purple-500/10 border border-yellow-400/20 rounded-full">
                  <span className="text-xs text-yellow-400 font-semibold tracking-wider">GAMING FIRST</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaGamepad className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
