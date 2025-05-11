'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_GUIDE_CATEGORIES_AND_POSTS } from '../../lib/queries/getGuideCategories';
import client from '../../lib/apolloClient';
import Header from '../Header';

interface Category {
  id: string;
  name: string;
  slug: string;
  posts: {
    nodes: {
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

interface GuidesPageContentProps {
  initialSubcategories: Category[];
  initialGuides: Guide[];
  initialHasNextPage: boolean;
}

export default function GuidesPageContent({ initialSubcategories, initialGuides, initialHasNextPage }: GuidesPageContentProps) {
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { fetchMore } = useQuery(GET_GUIDE_CATEGORIES_AND_POSTS, {
    variables: { first: 24, after: afterCursor },
    client,
    skip: true,
  });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: { after: afterCursor },
      }).then((fetchMoreResult) => {
        setGuides([...guides, ...fetchMoreResult.data.posts.nodes]);
        setHasNextPage(fetchMoreResult.data.posts.pageInfo.hasNextPage);
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  const renderSubcategory = (category: Category, index: number) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="col-span-1"
    >
      <Link href={`/guides/${category.slug}`}>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
          <div className="relative h-40">
            {category.posts?.nodes && category.posts.nodes.length > 0 && category.posts.nodes[0].featuredImage ? (
              <Image
                src={category.posts.nodes[0].featuredImage.node.sourceUrl}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
            <div className="flex items-center text-yellow-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span>Explore Guides</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  const renderGuide = (guide: Guide, index: number) => (
    <motion.div
      key={guide.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group h-64 overflow-hidden rounded-lg"
    >
      <Link href={`/guide/${guide.slug}`} className="block h-full">
        <Image
          src={guide.featuredImage?.node.sourceUrl || '/images/placeholder.png'}
          alt={guide.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {guide.title}
          </h3>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {guide.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: guide.excerpt }} />
          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
            Read Guide
          </span>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <>
      <Header />
      <section className="pt-32 pb-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mr-4">Game Guides</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        
        {/* Subcategories Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialSubcategories.map((category, index) => renderSubcategory(category, index))}
          </div>
        </div>

        {/* All Guides Section */}
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-12">
            <h2 className="text-4xl font-bold text-yellow-400 mr-4">All Guides</h2>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => renderGuide(guide, index))}
        </div>
          {hasNextPage && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
              >
                Load More Guides
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
