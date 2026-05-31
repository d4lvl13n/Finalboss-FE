import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/config';
import { useChrome } from '../context/ChromeContext';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; title: string; icon: TabIcon; iconFocused: TabIcon }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'videos', title: 'Videos', icon: 'play-circle-outline', iconFocused: 'play-circle' },
  { name: 'games', title: 'Games', icon: 'grid-outline', iconFocused: 'grid' },
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
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          bottom: Math.max(insets.bottom, 12),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.shell}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.tint} />
        <View style={styles.highlight} />
        <View style={styles.row}>
          {tabs.map((tab) => {
            const routeIndex = state.routes.findIndex((route) => route.name === tab.name);
            if (routeIndex === -1) {
              return null;
            }

            const route = state.routes[routeIndex];
            const focused = state.index === routeIndex;
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
                accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel ?? tab.title}
              >
                <Ionicons
                  name={iconName}
                  size={23}
                  color={focused ? COLORS.background : COLORS.textSecondary}
                />
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
    right: 16,
    // right-adjusted compact bar
    alignItems: 'flex-end',
  },
  shell: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(16, 22, 40, 0.5)',
    shadowColor: '#040812',
    shadowOpacity: 0.38,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 16, 32, 0.28)',
  },
  highlight: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '52%',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  item: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  itemActive: {
    backgroundColor: COLORS.accent,
  },
  itemPressed: {
    opacity: 0.7,
  },
});
