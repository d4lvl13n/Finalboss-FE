import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import client from '../lib/apolloClient';
import { COLORS } from '../constants/config';

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="article/[slug]" />
          <Stack.Screen name="game/[slug]" />
          <Stack.Screen name="search" />
        </Stack>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
