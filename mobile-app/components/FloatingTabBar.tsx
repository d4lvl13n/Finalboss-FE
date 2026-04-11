import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/config';
import { useChrome } from '../context/ChromeContext';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; title: string; icon: TabIcon; iconFocused: TabIcon }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'following', title: 'Following', icon: 'sparkles-outline', iconFocused: 'sparkles' },
  { name: 'search', title: 'Search', icon: 'search-outline', iconFocused: 'search' },
  { name: 'games', title: 'Games', icon: 'grid-outline', iconFocused: 'grid' },
  { name: 'library', title: 'Library', icon: 'bookmark-outline', iconFocused: 'bookmark' },
];

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { progress, revealChrome } = useChrome();

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.86],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          bottom: Math.max(insets.bottom, 10),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.shadow} />
      <View style={styles.shell}>
        <BlurView intensity={88} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.chromaticBlue} />
        <View style={styles.chromaticGold} />
        <View style={styles.chromaticGlow} />
        <View style={styles.highlight} />
        <View style={styles.row}>
          {tabs.map((tab) => {
            const routeIndex = state.routes.findIndex((route) => route.name === tab.name);
            if (routeIndex === -1) {
              return null;
            }

            const route = state.routes[routeIndex];
            const focused = state.index === routeIndex;
            const color = focused ? COLORS.text : COLORS.textMuted;
            const iconName = focused ? tab.iconFocused : tab.icon;

            return (
              <Pressable
                key={tab.name}
                onPress={() => {
                  revealChrome();
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                onLongPress={() =>
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  })
                }
                style={({ pressed }) => [
                  styles.item,
                  focused && styles.itemActive,
                  pressed && styles.itemPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
              >
                <Ionicons name={iconName} size={20} color={focused ? COLORS.background : color} />
                <Text style={[styles.label, focused && styles.labelActive]}>{tab.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 34,
    backgroundColor: 'rgba(4, 8, 20, 0.26)',
    shadowColor: '#040812',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
  },
  shell: {
    overflow: 'hidden',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(20, 28, 48, 0.34)',
  },
  chromaticBlue: {
    position: 'absolute',
    left: -18,
    bottom: -12,
    width: 118,
    height: 78,
    borderRadius: 999,
    backgroundColor: 'rgba(86, 153, 255, 0.18)',
  },
  chromaticGold: {
    position: 'absolute',
    right: -10,
    top: -18,
    width: 124,
    height: 84,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 204, 21, 0.14)',
  },
  chromaticGlow: {
    position: 'absolute',
    left: '24%',
    right: '24%',
    top: -22,
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  highlight: {
    position: 'absolute',
    inset: 1,
    borderRadius: 33,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
  },
  item: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 22,
  },
  itemActive: {
    backgroundColor: COLORS.accent,
    shadowColor: '#FACC15',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  itemPressed: {
    opacity: 0.86,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  labelActive: {
    color: COLORS.background,
  },
});
