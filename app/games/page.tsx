 import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GameSearch } from '../components/GameSearch';
import Loader from '../components/Loader';

export const metadata = {
  title: 'Game Database | FinalBoss.io',
  description: 'Search and explore our comprehensive game database with ratings, release dates, and platform information.',
};

export default function GamesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-12">
            <h1 className="text-5xl font-bold text-yellow-400 mr-4">Game Database</h1>
            <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
          </div>
          <Suspense fallback={<Loader />}>
            <GameSearch />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}