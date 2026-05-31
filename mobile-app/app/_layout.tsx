import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import client from '../lib/apolloClient';
import { COLORS } from '../constants/config';
import { ChromeProvider } from '../context/ChromeContext';
import { LocalProfileProvider } from '../context/LocalProfileContext';
import { SideMenuProvider } from '../context/SideMenuContext';
import SideMenu from '../components/SideMenu';

let NotificationsModule: typeof import('expo-notifications') | null = null;
const isExpoGo = Constants.appOwnership === 'expo';

function loadNotificationsModule() {
  if (isExpoGo) {
    return null;
  }

  try {
    const dynamicRequire = globalThis.eval?.('require') as
      | ((value: string) => typeof import('expo-notifications'))
      | undefined;

    if (!dynamicRequire) {
      return null;
    }

    return dynamicRequire('expo-notifications');
  } catch {
    return null;
  }
}

NotificationsModule = loadNotificationsModule();

function NotificationBindings() {
  const router = useRouter();

  React.useEffect(() => {
    if (!NotificationsModule) {
      return;
    }

    NotificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const subscription = NotificationsModule.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data ?? {};
        const target =
          typeof data.url === 'string'
            ? data.url
            : typeof data.route === 'string'
            ? data.route
            : null;

        if (target) {
          router.push(target as never);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <ChromeProvider>
          <LocalProfileProvider>
            <SideMenuProvider>
              <StatusBar style="light" />
              <NotificationBindings />
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
                <Stack.Screen name="category/[slug]" />
                <Stack.Screen name="videos/[id]" />
                <Stack.Screen name="search" />
                <Stack.Screen name="settings" />
              </Stack>
              <SideMenu />
            </SideMenuProvider>
          </LocalProfileProvider>
        </ChromeProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
