// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://backend.finalboss.io/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Remove spaces from the password as they're not needed in Basic Auth
  const password = process.env.WP_APP_PASSWORD?.replace(/\s+/g, '');
  
  return {
    headers: {
      ...headers,
      authorization: `Basic ${Buffer.from(
        `admin:${password}`
      ).toString('base64')}`,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
