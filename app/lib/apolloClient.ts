// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import siteConfig from './siteConfig';

// For local development, use the proxy API to avoid CORS issues
const isLocalDev = process.env.NODE_ENV === 'development';
const isServer = typeof window === 'undefined';

// In development, use our API route proxy to avoid CORS
// In production, connect directly to WordPress GraphQL
const GRAPHQL_ENDPOINT = isLocalDev && !isServer
  ? '/api/wordpress-proxy' // Client-side relative URL is fine
  : isLocalDev && isServer
  ? 'http://localhost:3000/api/wordpress-proxy' // Server-side needs absolute URL
  : `${siteConfig.wordpressUrl}/graphql`;

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };
});

// The WordPress backend intermittently 502s under load (notably during
// `next build`, where SSG fans many queries at it). Without retries a single
// blip fails the whole build — or, at runtime, caches an error page.
const retryLink = new RetryLink({
  // Patient on purpose: during builds the backend can be unresponsive for
  // 30s+ stretches (PHP worker pool exhaustion), so short retry windows all
  // land inside the same outage.
  delay: { initial: 2000, max: 20000, jitter: true },
  attempts: {
    max: 6,
    retryIf: (error) => !!error, // network errors only; GraphQL errors don't reach this link
  },
});

const client = new ApolloClient({
  link: retryLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    query: {
      // Server-side: always fetch fresh data to avoid stale cache across requests.
      // Client-side: use cache-first for performance.
      fetchPolicy: isServer ? 'no-cache' : 'cache-first',
      errorPolicy: 'all',
    },
  },
});

export default client;
