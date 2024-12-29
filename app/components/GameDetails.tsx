'use client';

import React from 'react';
import Image from 'next/image';
import { IGDBGame } from '../types/igdb';
import Header from './Header';
import Footer from './Footer';
import { format } from 'date-fns';
import { GameSearch } from './GameSearch';

// Helper function to ensure valid image URL
const getValidImageUrl = (url: string | undefined) => {
  if (!url) return '';
  
  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL, prepend the WordPress base URL
  if (url.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_WORDPRESS_URL}${url}`;
  }
  
  // If it's just a path, add necessary prefixes
  return `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/${url}`;
};

export function GameDetails({ game }: { game: IGDBGame }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-24">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="relative">
              {game.cover_url && (
                <>
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={game.cover_url}
                      alt=""
                      fill
                      className="object-cover blur-xl opacity-30"
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="relative h-[500px] w-full">
                    <Image
                      src={game.cover_url}
                      alt={game.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800 via-gray-800/80 to-transparent p-8">
                <h1 className="text-5xl font-bold text-white mb-4">{game.name}</h1>
                {game.release_date && (
                  <p className="text-yellow-400 text-xl">
                    Released: {format(new Date(game.release_date), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-6 mb-8">
                {game.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-3xl mr-2">★</span>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(game.rating)}/100
                      </div>
                      <div className="text-gray-400 text-sm">Rating</div>
                    </div>
                  </div>
                )}
                
                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {typeof platform === 'string' ? platform : platform.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {game.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {game.description}
                  </p>
                </div>
              )}

              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {game.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative h-48 group">
                        <Image
                          src={screenshot}
                          alt={`${game.name} screenshot ${index + 1}`}
                          fill
                          className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {game.videos && game.videos.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {game.videos.map((video, index) => (
                      <div key={index} className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.video_id}`}
                          title={video.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {game.websites && game.websites.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Links</h2>
                  <div className="flex flex-wrap gap-4">
                    {game.websites.map((website, index) => (
                      <a
                        key={index}
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        {website.category}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {game.dlcs && game.dlcs.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">DLCs & Add-ons</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {game.dlcs.map((dlc) => (
                      <div
                        key={dlc.id}
                        className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <h3 className="text-white font-semibold">{dlc.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 bg-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Search More Games</h2>
                <GameSearch />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}