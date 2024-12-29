'use client';

import React from 'react';
import Image from 'next/image';
import { IGDBGame } from '../types/igdb';

export function GameDetails({ game }: { game: IGDBGame }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {game.cover_url && (
          <div className="relative h-96">
            <Image
              src={game.cover_url}
              alt={game.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{game.name}</h1>
          
          {game.rating && (
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 mr-2">★</span>
              <span className="text-white text-xl">{Math.round(game.rating)}/100</span>
            </div>
          )}

          {game.description && (
            <p className="text-gray-300 mb-6">{game.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {game.platforms && game.platforms.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded"
                    >
                      {typeof platform === 'string' ? platform : platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.genres && game.genres.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {game.screenshots && game.screenshots.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
    </div>
  );
}