import React, { Suspense } from 'react';
import { GET_GUIDE_CATEGORIES_AND_POSTS } from '../lib/queries/getGuideCategories';
import client from '../lib/apolloClient';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

const GuidesPageContent = dynamic(() => import('../components/Guides/GuidesPageContent'), { ssr: false });
const GuidesStructuredData = dynamic(() => import('../components/Guides/GuidesStructuredData'), { ssr: false });

export async function generateMetadata() {
  return {
    title: 'Game Guides | FinalBoss.io',
    description: 'Explore our comprehensive game guides and walkthroughs for your favorite games.',
  };
}

export default async function GuidesPage() {
  try {
    const { data, error } = await client.query({
      query: GET_GUIDE_CATEGORIES_AND_POSTS,
      variables: { first: 100 },
    });

    if (error || !data?.categories?.nodes?.[0]) {
      console.error('Error fetching guides:', error);
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold p-8">Game Guides</h1>
          <p className="p-8">Loading game guides...</p>
        </div>
      );
    }

    const subcategories = data.categories.nodes[0].children.nodes;
    const guides = data.posts.nodes;
    const hasNextPage = data.posts.pageInfo?.hasNextPage || false;

    return (
      <Suspense fallback={<Loader />}>
        <GuidesStructuredData categories={subcategories} guides={guides} />
        <GuidesPageContent 
          initialSubcategories={subcategories} 
          initialGuides={guides} 
          initialHasNextPage={hasNextPage} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in GuidesPage:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold p-8">Game Guides</h1>
        <p className="p-8">Unable to load guides. Please try again later.</p>
      </div>
    );
  }
}
