// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Public HTTP link for queries
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_URL + '/graphql',
  credentials: 'include',
});

// Auth link that only adds authentication for mutations
const authLink = setContext((_, { headers }) => {
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APP_PASSWORD?.replace(/\s+/g, '');

  if (!username || !password) {
    console.warn('WordPress credentials not configured');
    return { headers };
  }

  const base64Auth = Buffer.from(`${username}:${password}`).toString('base64');
  console.log('Setting up auth with credentials:', { username, hasPassword: !!password });

  return {
    headers: {
      ...headers,
      Authorization: `Basic ${base64Auth}`,
    },
  };
});

// Main client for queries (public)
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

// Helper function to verify mutation authentication
const verifyMutationAuth = () => {
  if (!process.env.WP_APP_PASSWORD) {
    throw new Error('WordPress authentication not configured for mutations');
  }
};

// Mutation client that ensures auth is configured
export const createMutationClient = () => {
  if (!process.env.WP_APP_PASSWORD || !process.env.WP_USERNAME) {
    throw new Error('WordPress authentication not configured');
  }
  return client;
};

export default client;
