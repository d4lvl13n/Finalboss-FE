import Header from '../components/Header';
import Footer from '../components/Footer';
import { Suspense } from 'react';
import SearchPageClient from '../components/Search/SearchPageClient';
import { buildPageMetadata } from '../lib/seo';

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim();
  const title = query ? `Search results for "${query}" | FinalBoss.io` : 'Search | FinalBoss.io';
  const description = query
    ? `Discover articles, guides, and reviews related to "${query}" on FinalBoss.io.`
    : 'Search FinalBoss.io for gaming news, guides, reviews, and technology insights.';

  return buildPageMetadata({
    title,
    description,
    path: '/search',
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default function SearchResultsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="text-center text-gray-400 mt-12">Searching...</div>}>
        <SearchPageClient />
      </Suspense>
      <Footer />
    </>
  );
} 
 
