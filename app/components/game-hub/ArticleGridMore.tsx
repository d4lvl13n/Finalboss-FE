'use client';

// "Read next" grid that shows a first page of articles and reveals more on
// demand (the hub can carry many game-tag posts). Wraps the site's own
// ResponsiveArticleGrid so the cards match everywhere else.

import { useState } from 'react';
import ResponsiveArticleGrid from '@/app/components/ResponsiveArticleGrid';
import type { HubArticle } from '@/app/lib/game-hub/related-articles';

export default function ArticleGridMore({
  articles,
  pageSize = 6,
}: {
  articles: HubArticle[];
  pageSize?: number;
}) {
  const [visible, setVisible] = useState(pageSize);
  const shown = articles.slice(0, visible);
  return (
    <>
      <ResponsiveArticleGrid articles={shown} showFeatured={false} featuredCount={0} />
      {visible < articles.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisible((v) => v + pageSize)}
            className="rounded-full bg-gray-700 px-6 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Load more articles
          </button>
        </div>
      )}
    </>
  );
}
