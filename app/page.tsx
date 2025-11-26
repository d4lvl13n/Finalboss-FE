// Homepage
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Footer from './components/Footer';
import GameDatabaseSection from './components/GameDatabaseSection';
import { buildPageMetadata } from './lib/seo';

// Import critical components with loading priority
const LatestArticles = dynamic(() => import('./components/LatestArticles'), {
  loading: () => <div className="h-[400px] bg-gray-800 animate-pulse" />,
  ssr: true
});

// Optimize non-critical components loading
const ReviewsSlider = dynamic(() => import('./components/ReviewsSlider'), {
  loading: () => <div className="h-[300px] bg-gray-800 animate-pulse" />,
  ssr: false
});

// Group similar sections for better code splitting
const ContentSections = dynamic(
  () => import('./components/ContentSections').then(mod => mod.default),
  {
    loading: () => <div className="h-[400px] bg-gray-800 animate-pulse" />,
    ssr: false
  }
);

// Newsletter form with reduced priority
const NewsletterForm = dynamic(() => import('./components/NewsletterForm'), {
  loading: () => <div className="h-[200px] bg-gray-800 animate-pulse" />,
  ssr: false
});

export const revalidate = 3600;

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'FinalBoss.io - Your Ultimate Gaming Destination',
    description:
      'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
    path: '/',
    image: '/images/finalboss-og-image.jpg',
  });
}

export default async function HomePage() {
  try {
    return (
      <>
        <Header />
        <main className="bg-gray-900 text-white min-h-screen font-body">
          {/* Spacer for fixed header */}
          <div className="h-16 md:h-20" />

          <Suspense
            fallback={
              <div className="h-[400px] bg-gray-800 animate-pulse" />
            }
          >
            <LatestArticles />
          </Suspense>

          {/* Non-critical content with deferred loading */}
          <Suspense
            fallback={
              <div className="h-[300px] bg-gray-800 animate-pulse" />
            }
          >
            <ReviewsSlider />
          </Suspense>

          {/* Group similar sections for better performance */}
          <ContentSections />

          {/* Game Database Section */}
          <Suspense
            fallback={
              <div className="h-[400px] bg-gray-800 animate-pulse" />
            }
          >
            <GameDatabaseSection />
          </Suspense>

          {/* Newsletter section with reserved space */}
          <section className="py-12 md:py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="container mx-auto px-4 text-center relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">Join 10,000+ Gamers</span>
              </div>
              
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                <span className="text-white">Level Up Your </span>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Gaming Knowledge</span>
              </h2>
              <p className="text-sm md:text-lg text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto">
                Get the latest gaming news, exclusive reviews, pro tips, and insider content delivered straight to your inbox every week.
              </p>
              <Suspense
                fallback={
                  <div className="h-[100px] bg-gray-800 rounded-full max-w-xl mx-auto animate-pulse" />
                }
              >
                <NewsletterForm />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Something went wrong. Please try again later.</h1>
      </div>
    );
  }
}
