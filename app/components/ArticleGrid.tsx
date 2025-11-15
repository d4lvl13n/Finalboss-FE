// app/components/ArticleGrid.tsx
import React, { useState } from 'react';
import { useQuery, DocumentNode } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleNode {
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

interface ArticleQueryData {
  posts: {
    nodes: ArticleNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface ArticleGridProps<Vars extends Record<string, unknown> = Record<string, unknown>> {
  query: DocumentNode;
  variables: Vars;
  title: string;
  linkPrefix: string;
}

const ArticleGrid = <Vars extends Record<string, unknown>>({
  query,
  variables,
  title,
  linkPrefix,
}: ArticleGridProps<Vars>) => {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [allArticles, setAllArticles] = useState<ArticleNode[]>([]);

  const { data, loading, error, fetchMore } = useQuery<ArticleQueryData, Vars & { after?: string | null }>(query, {
    variables: { ...variables, after: afterCursor },
    onCompleted: (result) => {
      setAllArticles((prevArticles) => [...prevArticles, ...result.posts.nodes]);
    },
  });

  if (loading && allArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-gray-800 animate-pulse mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) return <p>Error loading articles...</p>;

  const handleLoadMore = () => {
    if (data?.posts.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
      }).then((fetchMoreResult) => {
        setAfterCursor(fetchMoreResult.data.posts.pageInfo.endCursor);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <Link key={article.id} href={`${linkPrefix}/${article.slug}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage.node.sourceUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="absolute inset-0 object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {data?.posts.pageInfo.hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGrid;