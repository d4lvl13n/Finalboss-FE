'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FeaturedSlider from './components/FeaturedSlider';
import LatestArticles from './components/LatestArticles';
import GameCalendar from './components/GameCalendar';
import VideoSection from './components/VideoSection';
import GuidesSection from './components/GuidesSection';
import TechnologySection from './components/TechnologySection';
import NewsTicker from './components/NewsTicker';
import Loader from './components/Loader';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import GamingSection from './components/GamingSection';

const ReviewsSlider = dynamic(() => import('./components/ReviewsSlider'), {
  ssr: false,
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>FinalBoss.io - Your Ultimate Gaming Destination</title>
        <meta name="description" content="Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world." />
        <meta property="og:title" content="FinalBoss.io - Your Ultimate Gaming Destination" />
        <meta property="og:description" content="Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world." />
        <meta property="og:image" content="/images/finalboss-og-image.jpg" />
        <meta property="og:url" content="https://finalboss.io" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="bg-gray-900 text-white">
        {loading ? (
          <Loader />
        ) : (
          <>
            <FeaturedSlider />
            <LatestArticles />
            <ReviewsSlider />
            <GamingSection />
            <GameCalendar />
            <VideoSection />
            <TechnologySection />
            <GuidesSection />
            <section className="py-16 bg-gray-800">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-yellow-400">Join the FinalBoss Community</h2>
                <p className="text-xl text-gray-300 mb-8">Stay updated with the latest gaming news, reviews, and exclusive content.</p>
                <form className="max-w-md mx-auto">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-grow px-4 py-2 rounded-l-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <button type="submit" className="bg-yellow-400 text-black px-6 py-2 rounded-r-full font-semibold hover:bg-yellow-300 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
