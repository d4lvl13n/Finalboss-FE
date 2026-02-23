// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
