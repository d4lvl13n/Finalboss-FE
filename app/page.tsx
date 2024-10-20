'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FeaturedSlider from './components/FeaturedSlider';
import LatestArticles from './components/LatestArticles';
import GameCalendar from './components/GameCalendar';
import VideoSection from './components/VideoSection';
import GuidesSection from './components/GuidesSection';
import TechnologySection from './components/TechnologySection';
import Loader from './components/Loader';
import Head from 'next/head';

const ReviewsSlider = dynamic(() => import('./components/ReviewsSlider'), {
  ssr: false,
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to show the loader (e.g., waiting for content to load)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Your Dynamic Title</title>
        <meta name="description" content="Your dynamic description" />
      </Head>
      <div className="bg-gray-900 text-white">
        {loading && <Loader />} {/* Display loader when loading */}
        {!loading && (
          <>
            <FeaturedSlider />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <section className="py-12">
                <h2 className="heading-glow text-4xl font-bold text-yellow-400 mb-6">Latest Articles</h2>
                <LatestArticles />
              </section>
              <section className="py-12">
                <ReviewsSlider />
              </section>
              <section className="py-12">
                <GameCalendar />
              </section>
              <section className="py-12">
                <VideoSection />
              </section>
              <section className="py-12">
                <GuidesSection />
              </section>
              <section className="py-12">
                <TechnologySection />
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}
