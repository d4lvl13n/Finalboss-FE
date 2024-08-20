// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://finalbossio.local/graphql', // Your WordPress GraphQL endpoint
  cache: new InMemoryCache({
    resultCaching: false, // Disable result caching for development
  }),
});

export default client;
