// app/reviews/page.tsx
import { GET_REVIEWS } from '../lib/queries/getReviews';
import client from '../lib/apolloClient';
import ReviewsPageContent from '../components/Reviews/ReviewsPageContent';
import ReviewsStructuredData from '../components/Reviews/ReviewsStructuredData';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const revalidate = 3600; // Revalidate every hour (optional)

export async function generateMetadata() {
  return {
    title: 'Game Reviews | FinalBoss.io',
    description: 'Read our latest game reviews and ratings for the hottest new releases.',
  };
}

export default async function ReviewsPage() {
  try {
    const { data } = await client.query({
      query: GET_REVIEWS,
      variables: { first: 24, after: null },
    });

    const reviews = data.posts.nodes;
    const hasNextPage = data.posts.pageInfo.hasNextPage;

    return (
      <>
        <Header />
        <ReviewsStructuredData reviews={reviews} />
        <ReviewsPageContent initialReviews={reviews} initialHasNextPage={hasNextPage} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Something went wrong. Please try again later.</h1>
      </div>
    );
  }
}
