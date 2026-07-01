'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Error boundary for the article route.
 *
 * When the WordPress backend is slow/erroring, getPost() now THROWS (instead of
 * soft-404'ing a valid article). That throw lands here and renders an HTTP 500,
 * which search engines retry — unlike a 404, which de-indexes the page. This is
 * the counterpart to the getPost() fix in page.tsx.
 */
export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[article route] render error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-heading font-bold mb-3">
          This article is temporarily unavailable
        </h1>
        <p className="text-gray-500 mb-6">
          We hit a snag loading this page. It’s us, not a broken link — please try again in a
          moment.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-black transition hover:bg-yellow-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold transition hover:bg-gray-100"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
