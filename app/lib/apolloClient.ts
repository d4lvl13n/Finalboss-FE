// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
});

// Auth link for mutations only
const authLink = setContext((operation, { headers }) => {
  // Only add auth headers for mutations
  if (operation.query.definitions.some(def => 
    def.kind === 'OperationDefinition' && def.operation === 'mutation'
  )) {
    const password = process.env.WP_APP_PASSWORD?.replace(/\s+/g, '');
    return {
      headers: {
        ...headers,
        authorization: `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`,
      }
    };
  }
  // Return regular headers for queries
  return { headers };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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

export default client;
