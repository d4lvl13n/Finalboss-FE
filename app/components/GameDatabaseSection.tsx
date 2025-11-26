'use client';

import React from 'react';
import Link from 'next/link';
import { GameSearch } from './GameSearch';
import { FaArrowRight } from 'react-icons/fa';

export default function GameDatabaseSection() {
  return (
    <section className="py-10 md:py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Game Database</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link href="/games" className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors">
            <FaArrowRight />
          </Link>
        </div>
        <GameSearch />
      </div>
    </section>
  );
} 