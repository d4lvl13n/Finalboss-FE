'use client';

import Link from 'next/link';
import Image from 'next/image';

type InlineArticle = {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
};

export default function InlineRelatedLinks({ articles }: { articles: InlineArticle[] }) {
  if (!articles.length) return null;

  return (
    <section className="not-prose my-10">
      <div className="bg-gray-900/80 border border-yellow-400/30 rounded-2xl p-5 shadow-2xl">
        <h2 className="text-center text-xl font-bold text-yellow-300 mb-4 tracking-wide">
          ⚡ Keep Exploring ⚡
        </h2>
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.slug}`}
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-3 hover:bg-yellow-400/10 transition-colors"
            >
              {article.featuredImage?.node?.sourceUrl && (
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={article.featuredImage.node.sourceUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <span className="flex-1 text-base font-semibold text-white group-hover:text-yellow-300 transition-colors">
                {article.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

