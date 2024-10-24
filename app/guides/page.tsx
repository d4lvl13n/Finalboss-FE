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
  const { data } = await client.query({
    query: GET_GUIDE_CATEGORIES_AND_POSTS,
    variables: { first: 100 }, // Adjust this number as needed
  });

  const subcategories = data.categories.nodes[0].children.nodes;
  const guides = data.posts.nodes;
  const hasNextPage = data.posts.pageInfo.hasNextPage;

  return (
    <Suspense fallback={<Loader />}>
      <GuidesStructuredData categories={subcategories} guides={guides} />
      <GuidesPageContent initialSubcategories={subcategories} initialGuides={guides} initialHasNextPage={hasNextPage} />
    </Suspense>
  );
}
