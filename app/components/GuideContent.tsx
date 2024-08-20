'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_LATEST_GUIDES } from '../lib/queries/getLatestGuides';
import client from '../lib/apolloClient';
import Loader from './Loader';

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

const GuideContent = () => {
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

  if (loading) return <Loader />;
  if (error) return <p>Error loading guides...</p>;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">Latest Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <Link
              href={`/guide/${guide.slug}`}
              key={guide.id}
              className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative h-48">
                {guide.featuredImage && (
                  <Image
                    src={guide.featuredImage.node.sourceUrl}
                    alt={guide.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: guide.excerpt }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
