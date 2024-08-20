// components/LatestArticles.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_LATEST_POSTS } from '../lib/queries/getLatestPosts';
import client from '../lib/apolloClient';
import Loader from './Loader'; // Assuming you have a Loader component

// Define the Article interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

const LatestArticles = () => {
  const { loading, error, data } = useQuery(GET_LATEST_POSTS, {
    client, // Ensuring the Apollo client is used
  });
  
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (data) {
      setArticles(data.posts.nodes);
    }
  }, [data]);

  if (loading) return <Loader />; // Show a loading indicator
  if (error) return <p>Error loading latest articles...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <Link 
          href={`/articles/${article.slug}`} 
          key={article.id}
          className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            index === 0 ? 'md:col-span-2 md:row-span-1' : ''
          }`}
        >
          <div className="relative h-48 md:h-64">
            {article.featuredImage && (
              <Image 
                src={article.featuredImage.node.sourceUrl}
                layout="fill"
                objectFit="cover"
                alt={article.title}
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
          </div>
        </Link>
      ))}
      <div className="col-span-full text-center mt-6">
        <Link 
          href="/articles" 
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
};

export default LatestArticles;
