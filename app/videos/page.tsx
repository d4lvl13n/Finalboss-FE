// app/videos/page.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Video {
  slug: string;
  title: string;
  author: string;
  date: string;
  thumbnail: string;
  duration: string;
  category: string;
}

const videos: Video[] = [
  {
    slug: 'trailer-final-fantasy',
    title: 'Final Fantasy XVI Trailer',
    author: 'Square Enix',
    date: 'June 15, 2024',
    thumbnail: '/images/ff16-review.jpg',
    duration: '3:45',
    category: 'videos',
  },
  {
    slug: 'dlc-starfield-trailer',
    title: 'DLC Starfield Trailer',
    author: 'Bethesda',
    date: 'September 15, 2024',
    thumbnail: '/images/starfield.jpg',
    duration: '2:30',
    category: 'videos',
  },
  {
    slug: 'Shenmue-3',
    title: 'Shenmue 3 Review',
    author: 'Yu Suzuki',
    date: 'September 15, 2019',
    thumbnail: '/images/shenmue3.jpeg',
    duration: '5:30',
    category: 'videos',
  },
  // Add more video entries here
];

export default function VideosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24"> {/* Adjusted padding to prevent header overlap */}
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Link href={`/videos/${video.slug}`} key={video.slug} className="block bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="relative h-48">
              <Image src={video.thumbnail} layout="fill" objectFit="cover" alt={video.title} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-16 h-16 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">{video.title}</h2>
              <p className="text-gray-400">{video.duration}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
