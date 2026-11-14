'use client';

import { Fragment, useEffect, useState } from 'react';
import siteConfig from '../../lib/siteConfig';
import { t } from '../../lib/i18n';
import { SECTION_POSTS_QUERY, SECTION_PAGE_SIZE, type SectionPost } from '../../lib/sectionQuery';
import PostRow from './PostRow';
import AdSlot, { ROWS_PER_AD } from './AdSlot';
import { scheduleJourneySlots } from '../../lib/totk-builds/journey';

// Same-origin proxy in development (CORS); the WordPress endpoint directly in production.
const ENDPOINT = process.env.NODE_ENV === 'development' ? '/api/wordpress-proxy' : `${siteConfig.wordpressUrl}/graphql`;

interface LoadMoreProps {
  categoryName: string | null;
  endCursor: string | null;
  /** How many rows the server already rendered, so ad spacing continues evenly */
  offset: number;
}

/** Appends the next pages of a section. Uses fetch, not Apollo, to stay small. */
export default function LoadMore({ categoryName, endCursor, offset }: LoadMoreProps) {
  const [posts, setPosts] = useState<SectionPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(endCursor);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  // Newly appended ad markers are not seen by Journey's initial scan.
  useEffect(() => {
    if (posts.length > 0) scheduleJourneySlots();
  }, [posts.length]);

  async function load() {
    setState('loading');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: SECTION_POSTS_QUERY, variables: { first: SECTION_PAGE_SIZE, after: cursor, categoryName } }),
      });
      const json = await res.json();
      const page = json?.data?.posts;
      if (!res.ok || !page) throw new Error();
      setPosts((prev) => [...prev, ...page.nodes]);
      setCursor(page.pageInfo?.hasNextPage ? page.pageInfo.endCursor : null);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      {posts.map((post, i) => {
        const position = offset + i + 1;
        return (
          <Fragment key={post.id}>
            <PostRow post={post} />
            {position % ROWS_PER_AD === 0 && i + 1 < posts.length && <AdSlot id={`feed-${position / ROWS_PER_AD + 1}`} />}
          </Fragment>
        );
      })}
      {cursor && (
        <div className="fb-more-btn">
          <button type="button" className="fb-btn" onClick={load} disabled={state === 'loading'}>
            {state === 'loading' ? t('common.loadingMore') : t('common.loadMore')}
          </button>
          {state === 'error' && <p role="alert">{t('common.tryAgain')}</p>}
        </div>
      )}
    </>
  );
}
