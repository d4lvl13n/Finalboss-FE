'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Press_Start_2P } from 'next/font/google';
import { FaSearch } from 'react-icons/fa';
import { SEARCH_POSTS } from './lib/queries/searchPosts';
import client from './lib/apolloClient';
import { SearchResult } from './types/search';
import { PLACEHOLDER_BASE64 } from './utils/placeholder';
import { normalizeWordPressImageSrc } from './lib/imageUrl';
import { formatDateShort } from './utils/formatDate';
import { t } from './lib/i18n';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

// Words that carry no search signal when recovered from a dead slug. The goal
// is to keep the game/topic tokens ("cell survivor weapon builds"), not the
// article framing ("how-to-get-the-best-...").
const STOPWORDS = new Set([
  'a', 'an', 'and', 'or', 'the', 'in', 'on', 'of', 'for', 'to', 'is', 'are',
  'with', 'your', 'you', 'my', 'i', 'it', 'its', 'this', 'that', 'these',
  'how', 'what', 'why', 'when', 'where', 'which', 'who', 'get', 'use', 'do',
  'best', 'all', 'every', 'top', 'complete', 'full', 'guide', 'guides',
  'after', 'before', 'still', 'vs', 'versus', 'heres', 'im', 'dont', 'cant',
]);

function queryFromPathname(pathname: string): string {
  const slug = decodeURIComponent(pathname).split('/').filter(Boolean).pop() || '';
  const tokens = slug
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !/^\d+$/.test(w) && !STOPWORDS.has(w));
  return tokens.slice(0, 4).join(' ');
}

const SECTIONS = [
  { href: '/guides', key: 'notFound.browseGuides' },
  { href: '/gaming', key: 'notFound.browseGaming' },
  { href: '/reviews', key: 'notFound.browseReviews' },
  { href: '/games', key: 'notFound.browseGames' },
];

function Suggestions({ searchTerm }: { searchTerm: string }) {
  const { loading, data } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm, first: 4 },
    client,
    skip: !searchTerm,
  });

  const results: SearchResult[] = data?.posts?.nodes || [];

  if (!searchTerm) return null;
  if (loading) {
    return <p className="text-gray-400 mt-10">{t('notFound.searchingSuggestions')}</p>;
  }
  if (results.length === 0) return null;

  return (
    <motion.div
      className="mt-10 w-full max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold text-yellow-400 mb-4 text-left">
        {t('notFound.suggestionsTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/20 transition-shadow text-left"
          >
            <Link href={`/${result.slug}`}>
              <div className="relative h-32">
                <Image
                  src={normalizeWordPressImageSrc(result.featuredImage?.node?.sourceUrl) || PLACEHOLDER_BASE64}
                  alt={result.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_BASE64;
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white line-clamp-2">{result.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{formatDateShort(result.date)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // not-found.tsx has no access to the requested path on the server, and the
  // statically-cached 404 shell must stay path-independent anyway — so the
  // slug is recovered client-side and suggestions load after hydration.
  useEffect(() => {
    const derived = queryFromPathname(window.location.pathname);
    setSearchTerm(derived);
    setSearchInput(derived);
  }, []);

  // No ads on 404s: this page has no publisher content (AdSense policy), and
  // bot floods hitting dead URLs would otherwise generate invalid ad
  // impressions here. pauseAdRequests is AdSense's documented page-level
  // kill-switch; resume on unmount so SPA-navigating away restores ads.
  useEffect(() => {
    const w = window as unknown as { adsbygoogle?: { pauseAdRequests?: number } & unknown[] };
    w.adsbygoogle = w.adsbygoogle || ([] as unknown as NonNullable<typeof w.adsbygoogle>);
    w.adsbygoogle.pauseAdRequests = 1;
    return () => {
      if (w.adsbygoogle) w.adsbygoogle.pauseAdRequests = 0;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center text-white text-center px-4 py-24">
      <motion.div
        className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-4 ${pressStart2P.className}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('notFound.title')}
      </motion.div>
      <motion.p
        className="text-xl md:text-2xl mt-2 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t('notFound.subtitle')}
      </motion.p>
      <p className="mt-4 text-gray-300">{t('notFound.movedOrGone')}</p>

      {/* Search — prefilled with the topic recovered from the dead URL */}
      <motion.form
        className="mt-8 w-full max-w-xl"
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('notFound.searchPlaceholder')}
            className="w-full py-3 pl-12 pr-28 bg-gray-800 text-white rounded-full border-2 border-gray-700 focus:border-yellow-400 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 text-sm font-bold rounded-full"
          >
            {t('notFound.searchButton')}
          </button>
        </div>
      </motion.form>

      <Suggestions searchTerm={searchTerm} />

      {/* Section shortcuts */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-gray-400 mb-4">{t('notFound.browseTitle')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {SECTIONS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="bg-gray-800 border border-gray-700 hover:border-yellow-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link href="/">
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            {t('notFound.returnButton')}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
