// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  }
});

const client = new ApolloClient({
  uri: 'https://backend.finalboss.io/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    // The nonce will be automatically handled by WordPress
  },
});

export default client;
