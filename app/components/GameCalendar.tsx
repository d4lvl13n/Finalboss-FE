// components/GameCalendar.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const upcomingGames = [
  {
    id: 1,
    title: "Final Fantasy VII Rebirth",
    image: "/images/ff7-rebirth.jpg",
    releaseDate: "February 29, 2024",
    platforms: ["PS5"]
  },
  {
    id: 2,
    title: "Elden Ring: Shadow of the Erdtree",
    image: "/images/elden-ring-dlc.jpg",
    releaseDate: "June 2024",
    platforms: ["PS5", "XSX", "PC"]
  },
  {
    id: 3,
    title: "Hollow Knight: Silksong",
    image: "/images/silksong.jpg",
    releaseDate: "TBA 2024",
    platforms: ["Switch", "PS5", "XSX", "PC"]
  },
  {
    id: 4,
    title: "Dragon's Dogma 2",
    image: "/images/dragons-dogma-2.jpg",
    releaseDate: "March 22, 2024",
    platforms: ["PS5", "XSX", "PC"]
  },
  {
    id: 5,
    title: "Star Wars Outlaws",
    image: "/images/star-wars-outlaws.jpg",
    releaseDate: "Late 2024",
    platforms: ["PS5", "XSX", "PC"]
  },
  {
    id: 6,
    title: "Senua's Saga: Hellblade II",
    image: "/images/hellblade-2.jpg",
    releaseDate: "TBA 2024",
    platforms: ["XSX", "PC"]
  }
];

const GameCalendar = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Upcoming Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative h-48">
                <Image 
                  src={game.image} 
                  layout="fill" 
                  objectFit="cover" 
                  alt={game.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white mb-1">{game.title}</h3>
                  <p className="text-yellow-400 font-bold">{game.releaseDate}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 mb-2">{game.platforms.join(', ')}</p>
                <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors text-sm">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/upcoming-games" 
            className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
          >
            View All Upcoming Games
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GameCalendar;
