// components/LatestArticles.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// components/LatestArticles.tsx
const articles = [
  {
    id: 1,
    title: "The Last of Us Season 2: First Teaser Revealed",
    image: "/images/last-of-us-2.jpg",
    excerpt: "HBO's hit series continues with a sneak peek of Abby",
    slug: "last-of-us-season-2-teaser",
    category: "TV & Movies"
  },
  {
    id: 2,
    title: "Monster Hunter Wilds Gameplay Unveiled",
    image: "/images/monster-hunter-wilds.jpg",
    excerpt: "New features and concentration mode detailed",
    slug: "monster-hunter-wilds-gameplay",
    category: "Game News"
  },
  {
    id: 3,
    title: "Indie Spotlight: Fairy Tail Universe Expands",
    image: "/images/fairy-tail-indie.jpg",
    excerpt: "Two new games set in the beloved anime world announced",
    slug: "fairy-tail-indie-games",
    category: "Indie Games"
  },
  {
    id: 4,
    title: "God of War Studio's Secret Project Leaked",
    image: "/images/santa-monica-leak.jpg",
    excerpt: "Rumors suggest a new IP in development",
    slug: "god-of-war-studio-new-ip",
    category: "Industry News"
  },
  {
    id: 5,
    title: "Caravan Sandwitch: A Delicious Adventure",
    image: "/images/caravan-sandwitch.jpg",
    excerpt: "Quirky food truck sim coming to PC and consoles",
    slug: "caravan-sandwitch-preview",
    category: "Previews"
  }
];

const LatestArticles = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.slice(0, 5).map((article, index) => (
        <Link 
          href={`/article/${article.slug}`} 
          key={article.id}
          className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            index === 0 ? 'md:col-span-2 md:row-span-1' : ''
          }`}
        >
          <div className="relative h-48 md:h-64">
            <Image src={article.image} layout="fill" objectFit="cover" alt={article.title} />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
            <p className="text-gray-400">{article.excerpt}</p>
          </div>
        </Link>
      ))}
      <div className="col-span-full text-center mt-6">
        <Link 
          href="/articles" 
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
};

export default LatestArticles;