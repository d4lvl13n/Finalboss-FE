'use client';

import React from 'react';

interface VideoContentProps {
  title: string;
  author: string;
  date: string;
  videoUrl: string;
  image: string;
}

export default function VideoContent({ title, author, date, videoUrl }: VideoContentProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent">{author}</p>
            <p className="text-sm text-gray-400">{date}</p>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full h-96 mb-8">
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>

        {/* Additional description or video content */}
        <div className="leading-relaxed text-lg">
          <p>Watch the latest trailer for Final Fantasy XVI. Dive into the epic world of this beloved franchise and experience the stunning visuals and gameplay.</p>
        </div>
      </div>
    </div>
  );
}
