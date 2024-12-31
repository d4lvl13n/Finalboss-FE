// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Regular client for queries
const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// Separate client for mutations with authentication
const createMutationClient = () => {
  const password = process.env.WP_APP_PASSWORD?.replace(/\s+/g, '');
  
  const authLink = createHttpLink({
    uri: 'https://backend.finalboss.io/graphql',
    headers: {
      authorization: `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`,
    }
  });

  return new ApolloClient({
    link: authLink,
    cache: new InMemoryCache(),
  });
};

export { createMutationClient };
export default client;
