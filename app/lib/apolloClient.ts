// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create the http link
const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
  credentials: 'include',
});

// Create the auth link with basic authentication
const authLink = setContext((_, { headers }) => {
  const password = process.env.WP_APP_PASSWORD?.replace(/\s+/g, '');
  
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      authorization: password ? 
        `Basic ${Buffer.from(`admin:${password}`).toString('base64')}` : '',
    },
  };
});

// Create the Apollo Client
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

export default client;
