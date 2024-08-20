'use client';

import { useQuery } from '@apollo/client';
import { GET_ARTICLE_BY_SLUG } from '../../../lib/queries/getArticleBySlug';
import client from '../../../lib/apolloClient';
import Image from 'next/image';

export default function GuideArticlePage({ params }: { params: { slug: string, articleSlug: string } }) {
  const { articleSlug } = params;

  const { data, loading, error } = useQuery(GET_ARTICLE_BY_SLUG, {
    variables: { slug: articleSlug },
    client,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading Article...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Failed to Load Article</h1>
      </div>
    );
  }

  const article = data.post;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-yellow-400">{article.title}</h1>
        {article.featuredImage && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
        <div className="leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
}
