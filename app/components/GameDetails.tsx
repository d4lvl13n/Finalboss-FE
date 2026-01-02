'use client';

import React from 'react';
import Image from 'next/image';
import { IGDBGame } from '../types/igdb';
import { format } from 'date-fns';
import { GameSearch } from './GameSearch';
import ResponsiveArticleGrid from './ResponsiveArticleGrid';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: {
      name: string;
      slug?: string;
    }[];
  };
  author?: {
    node?: {
      name?: string;
      avatar?: {
        url?: string;
      };
    };
  };
}

export function GameDetails({
  game,
  relatedArticles = [],
}: {
  game: IGDBGame;
  relatedArticles?: RelatedArticle[];
}) {
  return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="relative h-[70vh] w-full">
          {game.cover_url && (
            <>
              {/* Background blur effect */}
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
              {/* Main cover image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[300px] h-[400px] rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src={game.cover_url}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {relatedArticles.length > 0 && (
          <section className="bg-gray-900/80 text-white py-10">
            <div className="container mx-auto px-4">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mr-4">
                  More {game.name} Coverage
                </h2>
                <div className="flex-grow h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full" />
              </div>
              <ResponsiveArticleGrid
                articles={relatedArticles}
                showFeatured={false}
                featuredCount={0}
              />
            </div>
          </section>
        )}

        {/* Game Info */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
            {game.name}
          </h1>
          
          {game.release_date && (
            <p className="text-yellow-400 text-center mb-8">
              Released: {format(new Date(game.release_date), 'MMMM d, yyyy')}
            </p>
          )}

          {/* Rating and Platforms */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {game.rating && (
              <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold">
                {Math.round(game.rating)}/100
              </div>
            )}
            {game.platforms?.map((platform, index) => (
              <span 
                key={index} 
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full"
              >
                {typeof platform === 'string' ? platform : platform.name}
              </span>
            ))}
          </div>

          {/* Description */}
          {game.description && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
              <p className="text-gray-300 leading-relaxed">{game.description}</p>
            </div>
          )}

          {/* Screenshots */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {game.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative h-48 group rounded-lg overflow-hidden">
                    <Image
                      src={screenshot}
                      alt={`${game.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
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

          {/* Game Search Section */}
          <div className="mt-12 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Search More Games</h2>
            <GameSearch />
          </div>
        </div>
      </main>
  );
}
