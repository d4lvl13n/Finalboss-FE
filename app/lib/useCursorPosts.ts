'use client';

import { useRef, useState } from 'react';

export interface PostPage<T> {
  nodes: T[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

/** Keep pagination anchored to the SSR cursor, including retries and fast clicks. */
export function useCursorPosts<T extends { id: string }>(
  initial: PostPage<T>,
  fetchPage: (after: string) => Promise<PostPage<T>>,
) {
  const [posts, setPosts] = useState(initial.nodes);
  const [pageInfo, setPageInfo] = useState(initial.pageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function loadMore() {
    if (inFlight.current || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const next = await fetchPage(pageInfo.endCursor);
      if (next.pageInfo.hasNextPage && (!next.pageInfo.endCursor || next.pageInfo.endCursor === pageInfo.endCursor)) {
        throw new Error('The next page did not advance.');
      }
      setPosts((current) => {
        const seen = new Set(current.map((post) => post.id));
        return [...current, ...next.nodes.filter((post) => {
          if (seen.has(post.id)) return false;
          seen.add(post.id);
          return true;
        })];
      });
      setPageInfo(next.pageInfo);
    } catch {
      setError('Could not load more articles. Please try again.');
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return { posts, hasNextPage: pageInfo.hasNextPage, loading, error, loadMore };
}
