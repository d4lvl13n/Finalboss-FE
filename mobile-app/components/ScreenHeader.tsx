import React from 'react';
import { Animated, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { COLORS } from '../constants/config';
import { useChrome } from '../context/ChromeContext';

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
  const { progress, revealChrome } = useChrome();
  const shellHeight = insets.top + (hasLargeTitle ? 112 : 84);

  React.useEffect(() => {
    revealChrome();
  }, [revealChrome, title, largeTitle, showBack]);

  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [shellHeight, 0],
  });

  const animatedOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const animatedTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          height: animatedHeight,
          opacity: animatedOpacity,
          transform: [{ translateY: animatedTranslateY }],
        },
      ]}
    >
      <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
        <View style={styles.glassShell}>
          <BlurView intensity={78} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.glassHighlight} />
          <View style={styles.row}>
            {showBack ? (
              <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
                <Ionicons name="chevron-back" size={22} color={COLORS.text} />
              </Pressable>
            ) : (
              <View style={styles.brandBlock}>
                <Image source={require('../assets/logo.png')} style={styles.logo} contentFit="contain" />
                {title ? <Text style={styles.brandText}>{title}</Text> : <Text style={styles.brandText}>FinalBoss</Text>}
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
                      <Ionicons name="search" size={18} color={COLORS.text} />
                    </Pressable>
                  ) : null}
                  {showSettings ? (
                    <Pressable
                      onPress={() => router.push('/settings')}
                      style={styles.iconBtn}
                      hitSlop={8}
                    >
                      <Ionicons name="options-outline" size={18} color={COLORS.text} />
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  container: {
    paddingBottom: 8,
    paddingHorizontal: 14,
  },
  glassShell: {
    overflow: 'hidden',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(17, 24, 42, 0.42)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  glassHighlight: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '55%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  actions: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  inlineSpacer: {
    flex: 1,
  },
  brandBlock: {
    minWidth: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    width: 24,
    height: 24,
  },
  brandText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  largeTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 2,
    paddingLeft: 2,
  },
});
