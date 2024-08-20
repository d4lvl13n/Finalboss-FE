'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_GUIDES } from '../lib/queries/getLatestGuides';
import client from '../lib/apolloClient';
import Loader from './Loader'; 
import { stripHtmlTags } from '../lib/utils/stripHtmlTags';


interface GuideArticle {
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

const GuidesSection = () => {
  const { data, loading, error } = useQuery(GET_LATEST_GUIDES, {
    variables: { first: 4 },
    client,
  });
  const [guides, setGuides] = useState<GuideArticle[]>([]);

  useEffect(() => {
    if (data) {
      setGuides(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />; // Show loader while fetching data
  if (error) return <p>Error loading guides...</p>; // Show error if any

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Game Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
            <Link href={`/guide/${guide.slug}`} key={guide.id} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
              <div className="relative h-40">
                {guide.featuredImage && (
                  <Image
                    src={guide.featuredImage.node.sourceUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/guides" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors">
            View All Guides
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
