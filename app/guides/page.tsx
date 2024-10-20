'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { GET_GUIDE_CATEGORIES_WITH_POSTS } from '../lib/queries/getGuideCategories';
import client from '../lib/apolloClient';
import Loader from '../components/Loader';

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

const GuidePage = () => {
  const { data, loading, error } = useQuery(GET_GUIDE_CATEGORIES_WITH_POSTS, { client });
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  useEffect(() => {
    if (data) {
      const parentCategory = data.categories.nodes[0]; // 'gaming-guide' category
      setSubcategories(parentCategory.children.nodes); // Get subcategories
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading guide categories...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">Guides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((category: Category) => (
            <Link key={category.id} href={`/guides/${category.slug}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  {category.posts.nodes.length > 0 && category.posts.nodes[0].featuredImage ? (
                    <Image
                      src={category.posts.nodes[0].featuredImage.node.sourceUrl}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
