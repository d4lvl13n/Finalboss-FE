'use client';

import React from 'react';
import Image from 'next/image';
import { IGDBGame } from '../types/igdb';
import Header from './Header';
import Footer from './Footer';

export function GameDetails({ game }: { game: IGDBGame }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="relative">
            {game.cover_url && (
              <div className="relative h-96">
                <Image
                  src={game.cover_url}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800 to-transparent p-6">
              <h1 className="text-4xl font-bold text-white">{game.name}</h1>
            </div>
          </div>

          <div className="p-6">
            {game.rating && (
              <div className="flex items-center mb-6">
                <span className="text-yellow-400 text-2xl mr-2">★</span>
                <span className="text-white text-xl">{Math.round(game.rating)}/100</span>
              </div>
            )}

            {game.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{game.description}</p>
              </div>
            )}

            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative h-48">
                      <Image
                        src={screenshot}
                        alt={`${game.name} screenshot ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}