'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import client from '@/app/lib/apolloClient';
import { GET_SUBCATEGORY_ARTICLES } from '@/app/lib/queries/getSubcategoryArticles';
import { imageSrcWithFallback } from '@/app/lib/imageUrl';
import { useCursorPosts } from '@/app/lib/useCursorPosts';

interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

interface SubcategoryQueryData {
  posts: {
    nodes: GuideArticle[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface GuideCategoryClientProps {
  slug: string;
  title: string;
  initialArticles: GuideArticle[];
  initialHasNextPage: boolean;
  initialEndCursor?: string | null;
}

export default function GuideCategoryClient({
  slug,
  title,
  initialArticles,
  initialHasNextPage,
  initialEndCursor = null,
}: GuideCategoryClientProps) {
  const { posts: articles, hasNextPage, loading, error, loadMore } = useCursorPosts<GuideArticle>(
    { nodes: initialArticles, pageInfo: { hasNextPage: initialHasNextPage, endCursor: initialEndCursor } },
    async (after) => {
      const result = await client.query<SubcategoryQueryData>({
        query: GET_SUBCATEGORY_ARTICLES,
        variables: { categorySlug: slug, first: 24, after },
        fetchPolicy: 'network-only',
      });
      if (result.errors?.length || !result.data?.posts) throw new Error('Guide category query failed');
      return result.data.posts;
    },
  );

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mr-4">{title} Guides</h1>
          <div className="flex-grow h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full glow-effect"></div>
        </div>
        <div data-guide-articles className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group h-64 overflow-hidden rounded-lg"
            >
              <Link href={`/${article.slug}`} className="block h-full">
                <Image
                  src={imageSrcWithFallback(article.featuredImage?.node?.sourceUrl)}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                  <div className="text-gray-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                  <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-300 transition-colors">
                    Read Guide
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {articles.length === 0 && <p className="text-gray-300">No guides have been published in this category yet.</p>}
        {error && <p role="alert" className="mt-6 text-center text-red-300">{error}</p>}
        {hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              aria-busy={loading}
              className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load More Guides'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
