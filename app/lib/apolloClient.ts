// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-temp-domain.com/graphql',
  cache: new InMemoryCache(),
});

export default client;
