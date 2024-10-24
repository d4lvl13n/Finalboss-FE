'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useYouTubeVideos } from '../hooks/useYouTubeVideos';
import { YouTubeService } from '../lib/youtube/service';
import Loader from './Loader';
import { FaArrowRight, FaPlay, FaClock, FaEye } from 'react-icons/fa';

const VideoSection = () => {
  const { videos, loading, error } = useYouTubeVideos(3);

  if (loading) return <Loader />;
  if (error) return <p>Error loading videos...</p>;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Featured Videos</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          <Link href="/videos" className="ml-4 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition-colors">
            <FaArrowRight />
          </Link>
        </div>
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
                className="group block bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-video">
                  <Image 
                    src={video.thumbnail.url} 
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-yellow-400 bg-opacity-90 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                        <FaPlay className="text-black text-2xl ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded-md flex items-center">
                    <FaClock className="mr-1" />
                    {YouTubeService.formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex justify-between items-center text-gray-400 text-sm">
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {parseInt(video.viewCount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
