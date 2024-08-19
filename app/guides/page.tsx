// app/guides/page.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Guide {
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  category: string;
}

const guides: Guide[] = [
  {
    slug: 'elden-ring-guide',
    title: 'Elden Ring: Beginner\'s Guide',
    author: 'Jane Doe',
    date: 'March 20, 2024',
    image: '/images/elden-ring-boss-guide.jpg',
    excerpt: 'Everything you need to survive in the Lands Between.',
    category: 'guides',
  },
  {
    slug: 'baldurs-gate-3-guide',
    title: "Baldur's Gate 3: Class builds",
    author: 'John Smith',
    date: 'August 25, 2024',
    image: '/images/bg3-class-builds.jpg',
    excerpt: 'Mastering the combat system in Baldur\'s Gate 3.',
    category: 'guides',
  },
  // Add more guide entries here
];

export default function GuidesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24"> {/* Adjusted padding to prevent header overlap */}
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Guides</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <Link href={`/guides/${guide.slug}`} key={guide.slug} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-48">
              <Image src={guide.image} layout="fill" objectFit="cover" alt={guide.title} />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
              <p className="text-gray-400">{guide.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
