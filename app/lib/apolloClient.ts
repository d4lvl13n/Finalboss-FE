// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Regular client for queries
const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
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
    link: from([errorLink, authLink]),
    cache: new InMemoryCache(),
  });
};

export { createMutationClient };
export default client;
