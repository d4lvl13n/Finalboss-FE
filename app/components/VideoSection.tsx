// components/VideoSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// components/VideoSection.tsx
const featuredVideos = [
  {
    id: 1,
    title: "Elden Ring DLC Gameplay Reveal",
    thumbnail: "/images/elden-ring-dlc-video.jpg",
    duration: "15:23",
    slug: "elden-ring-dlc-gameplay"
  },
  {
    id: 2,
    title: "Top 10 Upcoming RPGs of 2024",
    thumbnail: "/images/top-10-rpgs-2024.jpg",
    duration: "12:45",
    slug: "top-10-rpgs-2024"
  },
  {
    id: 3,
    title: "The Evolution of PlayStation: From PS1 to PS5",
    thumbnail: "/images/playstation-evolution.jpg",
    duration: "20:17",
    slug: "playstation-evolution"
  }
];

const VideoSection = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Featured Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/video/${video.slug}`} className="block bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="relative h-48">
                  <Image src={video.thumbnail} layout="fill" objectFit="cover" alt={video.title} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-yellow-400 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{video.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/videos" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
            View All Videos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
