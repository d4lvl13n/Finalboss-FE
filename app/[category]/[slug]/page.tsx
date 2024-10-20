'use client';

import { useQuery } from '@apollo/client';
import { GET_POST_BY_SLUG } from '../../lib/queries/getPostBySlug';
import client from '../../lib/apolloClient';
import Image from 'next/image';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head'; // Import Head for SEO
import '../../styles/article.css'; // Adjust the path if necessary

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const { slug } = params;

  const { data, loading, error } = useQuery(GET_POST_BY_SLUG, {
    variables: { id: slug },
    client,
  });

  const [readingProgress, setReadingProgress] = useState(0);

  // Parallax effect setup
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -250]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
    };
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error loading article...</p>;

  const article = data?.post;

  if (!article) return <p>Article not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SEO Meta Tags */}
      <Head>
        <title>{article.title} | FinalBoss.io</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:image" content={article.featuredImage?.node?.sourceUrl} />
        <meta property="og:url" content={`https://finalboss.io/${article.slug}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://finalboss.io/${article.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            image: article.featuredImage?.node?.sourceUrl,
            author: {
              '@type': 'Person',
              name: article.author?.node?.name,
            },
            datePublished: article.date,
            description: article.excerpt || article.title,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://finalboss.io/${article.slug}`,
            },
          })}
        </script>
      </Head>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <motion.div
          className="h-full bg-yellow-400"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Parallax Featured Image */}
      <div className="relative h-[60vh] overflow-hidden">
        {article.featuredImage && (
          <motion.div className="absolute inset-0" style={{ y }}>
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className=""
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
      </div>

      {/* Article Content */}
      <div className="relative z-10 px-4 -mt-24">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.title}
            </motion.h1>
            <motion.div
              className="flex items-center text-gray-400 text-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>{new Date(article.date).toLocaleDateString()}</span>
              {article.author?.node?.name && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.author.node.name}</span>
                </>
              )}
            </motion.div>
            <motion.div
              className="prose prose-lg prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
