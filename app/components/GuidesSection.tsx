// components/GuidesSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// components/GuidesSection.tsx
const guides = [
  {
    id: 1,
    title: "Baldur's Gate 3: Best Builds for Each Class",
    image: "/images/bg3-class-builds.jpg",
    excerpt: "Optimize your character for maximum effectiveness",
    slug: "baldurs-gate-3-class-builds"
  },
  {
    id: 2,
    title: "Zelda: Tears of the Kingdom - All Shrine Locations",
    image: "/images/zelda-totk-shrines.jpg",
    excerpt: "Complete guide to finding and solving every shrine",
    slug: "zelda-totk-shrine-locations"
  },
  {
    id: 3,
    title: "Starfield: Essential Tips for Space Exploration",
    image: "/images/starfield-exploration-tips.jpg",
    excerpt: "Navigate the cosmos like a pro with these tips",
    slug: "starfield-exploration-guide"
  },
  {
    id: 4,
    title: "Elden Ring: How to Defeat Every Boss",
    image: "/images/elden-ring-boss-guide.jpg",
    excerpt: "Strategies and tactics for overcoming every challenge",
    slug: "elden-ring-boss-guide"
  }
];

const GuidesSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Game Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
            <Link href={`/guide/${guide.slug}`} key={guide.id} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="relative h-40">
                  <Image src={guide.image} layout="fill" objectFit="cover" alt={guide.title} />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-400 text-sm">{guide.excerpt}</p>
                </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/guides" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
              View All Guides
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;