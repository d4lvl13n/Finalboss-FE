import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { COLORS } from '../constants/config';

interface ScreenHeaderProps {
  title?: string;
  largeTitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  largeTitle,
  showBack,
  showSearch = true,
  showSettings = false,
  rightAction,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const hasLargeTitle = Boolean(largeTitle);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>
        ) : (
          <View style={styles.brandBlock}>
            <Image source={require('../assets/logo.png')} style={styles.logo} contentFit="contain" />
            {title ? <Text style={styles.brandText}>{title}</Text> : null}
          </View>
        )}

        {!showBack && !hasLargeTitle ? (
          <View style={styles.inlineSpacer} />
        ) : !hasLargeTitle && title ? (
          <Text style={styles.inlineTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={styles.inlineSpacer} />
        )}

        <View style={styles.actions}>
          {rightAction ?? (
            <>
              {showSearch ? (
                <Pressable
                  onPress={() => router.push('/search')}
                  style={styles.iconBtn}
                  hitSlop={8}
                >
                  <Ionicons name="search" size={20} color={COLORS.text} />
                </Pressable>
              ) : null}
              {showSettings ? (
                <Pressable
                  onPress={() => router.push('/settings')}
                  style={styles.iconBtn}
                  hitSlop={8}
                >
                  <Ionicons name="options-outline" size={20} color={COLORS.text} />
                </Pressable>
              ) : null}
            </>
          )}
        </View>
      </View>

      {hasLargeTitle ? (
        <Text style={styles.largeTitle} numberOfLines={1}>
          {largeTitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    minWidth: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inlineSpacer: {
    flex: 1,
  },
  brandBlock: {
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  largeTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
});
