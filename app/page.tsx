// Homepage
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Footer from './components/Footer';
import GameDatabaseSection from './components/GameDatabaseSection';
import { buildPageMetadata } from './lib/seo';

// Skeleton components with exact dimensions to prevent CLS
const LatestArticlesSkeleton = () => (
  <section className="py-10 md:py-16 bg-gray-900">
    <div className="container mx-auto px-3 md:px-4">
      <div className="flex items-center mb-6 md:mb-8 h-8 md:h-10">
        <div className="h-6 md:h-8 w-40 md:w-48 bg-gray-800 rounded" />
        <div className="flex-grow h-0.5 md:h-1 bg-gray-800 rounded-full ml-3 md:ml-4" />
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full ml-3 md:ml-4" />
      </div>
      <div className="md:hidden">
        <div className="h-[220px] sm:h-[280px] bg-gray-800 rounded-xl mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 p-2 bg-gray-800/30 rounded-lg h-[88px]">
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="h-[380px] lg:h-[420px] bg-gray-800 rounded-xl mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[200px]">
                <div className="h-[130px] bg-gray-800 rounded-lg mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-80 lg:w-96 flex-shrink-0 space-y-3">
          <div className="h-6 bg-gray-800 rounded w-20" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-3 py-3 border-b border-gray-800/50">
              <div className="w-14 h-4 bg-gray-800 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ReviewsSliderSkeleton = () => (
  <section className="py-10 md:py-16 bg-gray-900">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div className="flex items-center flex-1">
          <div className="h-8 md:h-10 w-40 md:w-48 bg-gray-800 rounded" />
          <div className="flex-grow h-0.5 md:h-1 bg-gray-800 rounded-full ml-4" />
        </div>
        <div className="h-10 w-28 bg-gray-800 rounded-full" />
      </div>
      <div className="hidden lg:grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 h-[400px] md:h-[500px] bg-gray-800 rounded-2xl" />
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 bg-gray-800 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4 p-3 h-[100px]">
              <div className="w-32 h-24 bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-16 bg-gray-700 rounded" />
                <div className="h-4 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:hidden">
        <div className="h-[280px] md:h-[400px] bg-gray-800 rounded-2xl mb-4" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 p-2 h-[88px]">
              <div className="w-20 h-20 bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-16 bg-gray-700 rounded" />
                <div className="h-4 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Import critical components with loading priority - SSR for LCP
const LatestArticles = dynamic(() => import('./components/LatestArticles'), {
  loading: () => <LatestArticlesSkeleton />,
  ssr: true
});

// SSR enabled so review links appear in initial HTML for crawlers
const ReviewsSlider = dynamic(() => import('./components/ReviewsSlider'), {
  loading: () => <ReviewsSliderSkeleton />,
  ssr: true
});

// Group similar sections for better code splitting
const ContentSections = dynamic(
  () => import('./components/ContentSections').then(mod => mod.default),
  {
    loading: () => (
      <div className="bg-gray-900 space-y-0">
        {/* GuidesSection skeleton */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="hidden md:block w-14 h-14 bg-gray-800 rounded-xl" />
                <div className="h-10 w-48 bg-gray-800 rounded" />
              </div>
              <div className="h-10 w-28 bg-gray-800 rounded-full" />
            </div>
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] h-[380px] md:h-[420px] bg-gray-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </section>
        {/* TechnologySection skeleton */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="hidden md:block w-14 h-14 bg-gray-800 rounded-lg" />
                <div className="h-10 w-48 bg-gray-800 rounded" />
              </div>
              <div className="h-10 w-28 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[300px] md:w-[360px] h-[280px] md:h-[320px] bg-gray-800 rounded-xl border border-gray-700/30" />
              ))}
            </div>
          </div>
        </section>
        {/* VideoSection skeleton */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-40 bg-gray-800 rounded" />
              <div className="h-10 w-28 bg-gray-800 rounded-full" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-[360px]">
                  <div className="aspect-video bg-gray-800 rounded-xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    ),
    ssr: false
  }
);

// Newsletter form with reduced priority
const NewsletterForm = dynamic(() => import('./components/NewsletterForm'), {
  loading: () => (
    <div className="max-w-xl mx-auto">
      <div className="h-14 bg-gray-800/50 rounded-full" />
      <div className="flex justify-center gap-6 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 w-24 bg-gray-800/30 rounded" />
        ))}
      </div>
    </div>
  ),
  ssr: false
});

export const revalidate = 3600;

export async function generateMetadata() {
  const meta = buildPageMetadata({
    title: 'FinalBoss.io - Your Ultimate Gaming Destination',
    description:
      'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
    path: '/',
    image: '/images/finalboss-og-image.jpg',
  });
  return {
    ...meta,
    title: {
      absolute: 'FinalBoss.io - Your Ultimate Gaming Destination',
    },
  };
}

export default async function HomePage() {
  try {
    return (
      <>
        <Header />
        <main className="bg-gray-900 text-white min-h-screen font-body">
          {/* Spacer for fixed header */}
          <div className="h-16 md:h-20" />

          <Suspense fallback={<LatestArticlesSkeleton />}>
            <LatestArticles />
          </Suspense>

          {/* Non-critical content with deferred loading */}
          <Suspense fallback={<ReviewsSliderSkeleton />}>
            <ReviewsSlider />
          </Suspense>

          {/* Group similar sections for better performance */}
          <ContentSections />

          {/* Game Database Section */}
          <Suspense
            fallback={
              <div className="py-10 md:py-16 bg-gray-900" style={{ minHeight: '300px' }} />
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
