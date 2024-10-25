// Homepage
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { getHomePageData } from './components/HomePage/HomePageData';

// Import critical components
const FeaturedSlider = dynamic(() => import('./components/FeaturedSlider'));
const LatestArticles = dynamic(() => import('./components/LatestArticles'));

// Dynamically import non-critical components
const ReviewsSlider = dynamic(() => import('./components/ReviewsSlider'));
const GamingSection = dynamic(() => import('./components/GamingSection'));
const VideoSection = dynamic(() => import('./components/VideoSection'));
const TechnologySection = dynamic(() => import('./components/TechnologySection'));
const GuidesSection = dynamic(() => import('./components/GuidesSection'));

// Newsletter form component (client-side)
const NewsletterForm = dynamic(() => import('./components/NewsletterForm'), {
  ssr: false
});

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 3600;

export const metadata = {
  title: 'FinalBoss.io - Your Ultimate Gaming Destination',
  description: 'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
  openGraph: {
    title: 'FinalBoss.io - Your Ultimate Gaming Destination',
    description: 'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
    images: ['/images/finalboss-og-image.jpg'],
    url: 'https://finalboss.io',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function HomePage() {
  try {
    const { featuredPosts, latestPosts } = await getHomePageData();

    return (
      <>
        <Header />
        <main className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
          <Suspense fallback={<Loader />}>
            {/* Remove the posts prop */}
            <FeaturedSlider />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <LatestArticles posts={latestPosts} />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <ReviewsSlider />
          </Suspense>
          
          <Suspense fallback={<Loader />}>
            <GamingSection />
          </Suspense>
          
          <Suspense fallback={<Loader />}>
            <VideoSection />
          </Suspense>
          
          <Suspense fallback={<Loader />}>
            <TechnologySection />
          </Suspense>
          
          <Suspense fallback={<Loader />}>
            <GuidesSection />
          </Suspense>

          <section className="py-16 bg-gray-800">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-8 text-yellow-400">
                Join the FinalBoss Community
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Stay updated with the latest gaming news, reviews, and exclusive
                content.
              </p>
              <NewsletterForm />
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
