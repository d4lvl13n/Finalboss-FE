'use client';

import React from 'react';
import SocialShare from './SocialShare';
import Header from './Header';
import Footer from './Footer';
import { processTextWithLinks } from '../utils/linkProcessor';

interface VideoContentProps {
  title: string;
  author: string;
  date: string;
  videoId: string;
  description: string;
  viewCount: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
}

export default function VideoContent({ 
  title, 
  author, 
  date, 
  videoId,
  description,
  viewCount 
}: VideoContentProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const shareUrl = `https://finalboss.io/videos/${videoId}`; // Update with your domain

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white pt-24">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-yellow-400">{author}</p>
              <p className="text-sm text-gray-400">{date}</p>
            </div>
            <div className="text-gray-400">
              {viewCount} views
            </div>
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video mb-8">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>

          {/* Social Share Buttons */}
          <div className="mb-8">
            <SocialShare url={shareUrl} title={title} />
          </div>

          {/* Video description */}
          <div className="leading-relaxed text-lg bg-gray-800 p-6 rounded-lg mb-8">
            <div className="whitespace-pre-wrap">
              {processTextWithLinks(description)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
