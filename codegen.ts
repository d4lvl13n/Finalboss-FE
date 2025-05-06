import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // Local schema file generated from WPGraphQL
  schema: process.env.NEXT_PUBLIC_WORDPRESS_URL
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`
    : 'https://backend.finalboss.io/graphql',
  documents: ["app/lib/queries/getLatestPosts.ts"], // Start with just getLatestPosts query
  ignoreNoDocuments: true, // Don't error if no GraphQL documents are found initially
  generates: {
    "./gql/": { // Output directory
      preset: "client", // Use the client preset for React apps
      plugins: [], // The client preset includes necessary plugins
      presetConfig: {
        gqlTagName: 'gql', // Use gql tags
      }
    }
  },
  hooks: { afterAllFileWrite: ['prettier --write'] } // Format generated files
};

export default config; 