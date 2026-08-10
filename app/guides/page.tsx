import React, { Suspense } from 'react';
import { GET_GUIDE_CATEGORIES_AND_POSTS } from '../lib/queries/getGuideCategories';
import client from '../lib/apolloClient';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import GuidesPageContent from '../components/Guides/GuidesPageContent';
import GuidesStructuredData from '../components/Guides/GuidesStructuredData';
import Header from '../components/Header';
import Footer from '../components/Footer';

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Game Guides & Walkthroughs',
    description: `Master every quest with ${siteConfig.name} guides, walkthroughs, and strategy breakdowns.`,
    path: '/guides',
  });
}

export default async function GuidesPage() {
  const { data } = await client.query({
    query: GET_GUIDE_CATEGORIES_AND_POSTS,
    // Ceiling is the WordPress backend, not taste: combined with the category
    // tree above, this query 502s (PHP crash) at first:100 and works at 80 —
    // the guide count crossed the backend's memory limit in mid-2026. Keep
    // headroom; raise only after the backend's PHP memory_limit is raised.
    variables: { first: 60 },
  });

  const subcategories = data.categories.nodes[0].children.nodes;
  const guides = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <section className="py-24 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-800 animate-pulse mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-64 bg-gray-800 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <GuidesStructuredData categories={subcategories} guides={guides} />
        <GuidesPageContent initialSubcategories={subcategories} initialGuides={guides} initialHasNextPage={hasNextPage} />
      </Suspense>
      <Footer />
    </>
  );
}
