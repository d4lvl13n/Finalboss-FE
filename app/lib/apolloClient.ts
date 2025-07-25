// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// For local development, use the proxy API to avoid CORS issues
const isLocalDev = process.env.NODE_ENV === 'development';
const isServer = typeof window === 'undefined';

// In development, use our API route proxy to avoid CORS
// In production, connect directly to WordPress GraphQL
const GRAPHQL_ENDPOINT = isLocalDev && !isServer
  ? '/api/wordpress-proxy' // Client-side relative URL is fine
  : isLocalDev && isServer
  ? 'http://localhost:3000/api/wordpress-proxy' // Server-side needs absolute URL
  : process.env.NEXT_PUBLIC_WORDPRESS_URL 
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`
    : 'https://backend.finalboss.io/graphql';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: isLocalDev ? 'same-origin' : 'include', // Adjust for proxy usage
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
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

export default client;
