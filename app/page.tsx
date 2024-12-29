// Homepage
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { getHomePageData } from './components/HomePage/HomePageData';
import GameDatabaseSection from './components/GameDatabaseSection';

// Import critical components with loading priority
const FeaturedSlider = dynamic(() => import('./components/FeaturedSlider'), {
  loading: () => <div className="h-[600px] bg-gray-800 animate-pulse" />,
  ssr: true
});

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

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const revalidate = 3600;

// Metadata optimization
export const metadata = {
  title: 'FinalBoss.io - Your Ultimate Gaming Destination',
  description: 'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
  openGraph: {
    title: 'FinalBoss.io - Your Ultimate Gaming Destination',
    description: 'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
    images: [{
      url: '/images/finalboss-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'FinalBoss.io'
    }],
    url: 'https://finalboss.io',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://finalboss.io',
  },
};

export default async function HomePage() {
  try {
    const { featuredPosts, latestPosts } = await getHomePageData();

    return (
      <>
        <Header />
        <main className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
          {/* Critical content with priority loading */}
          <Suspense 
            fallback={
              <div className="h-[600px] bg-gray-800 animate-pulse opacity-40" />
            }
          >
            <FeaturedSlider />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-[400px] bg-gray-800 animate-pulse" />
            }
          >
            <LatestArticles posts={latestPosts} />
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
          <section className="py-16 bg-gray-800">
            <div className="container mx-auto px-4 text-center min-h-[300px]">
              <h2 className="text-4xl font-bold mb-8 text-yellow-400">
                Join the FinalBoss Community
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Stay updated with the latest gaming news, reviews, and exclusive
                content.
              </p>
              <Suspense
                fallback={
                  <div className="h-[100px] bg-gray-700 rounded animate-pulse" />
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
