'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useYouTubeVideos } from '../hooks/useYouTubeVideos';
import { YouTubeService } from '../lib/youtube/service';
import Loader from '../components/Loader';
import { YouTubeErrorBoundary } from '../components/YouTubeErrorBoundary';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function VideosPage() {
  return (
    <YouTubeErrorBoundary>
      <Header />
      <VideoPageContent />
      <Footer />
    </YouTubeErrorBoundary>
  );
}

function VideoPageContent() {
  const { videos, loading, error } = useYouTubeVideos(12); // Fetch 12 videos for the page

  if (loading) return <Loader />;
  if (error) return <p>Error loading videos...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-16">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              href={`/videos/${video.id}`}
              className="block bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <Image 
                  src={video.thumbnail.url}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-yellow-400 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-sm">
                  {YouTubeService.formatDuration(video.duration)}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">{video.title}</h2>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  <span>{parseInt(video.viewCount).toLocaleString()} views</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
