import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { CONFIG } from '../constants/config';

const httpLink = createHttpLink({
  uri: CONFIG.GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

export default client;
