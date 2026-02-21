'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useYouTubeVideos } from '../../hooks/useYouTubeVideos';
import { YouTubeService } from '../../lib/youtube/service';
import PageHeader from '../PageHeader';
import { t } from '../../lib/i18n';
import { formatDate, formatNumber } from '../../utils/formatDate';

export default function VideosPageClient() {
  const { videos, loading, error } = useYouTubeVideos(12);

  if (loading) {
    return (
      <>
        <PageHeader 
          title={t('video.title')}
          description={t('video.description')}
          accentColor="red"
        />
        <section className="max-w-6xl mx-auto px-4 pb-16 text-center text-gray-400">
          {t('video.loadingVideos')}
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader 
          title={t('video.title')}
          description={t('video.description')}
          accentColor="red"
        />
        <section className="max-w-6xl mx-auto px-4 pb-16 text-center text-red-400">
          {t('video.loadError')}
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={t('video.title')}
        description={t('video.description')}
        accentColor="red"
      />
      
      <div className="max-w-6xl mx-auto px-4 pb-16">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <span>{formatDate(video.publishedAt)}</span>
                  <span>{t('video.views', { count: formatNumber(parseInt(video.viewCount)) })}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        </div>
      </div>
    </>
  );
}

