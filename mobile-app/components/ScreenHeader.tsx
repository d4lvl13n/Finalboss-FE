import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../constants/config';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type MenuItem =
  | { type: 'divider' }
  | { type: 'header'; label: string }
  | {
      label: string;
      icon: IconName;
      route?: string;
      category?: string;
      url?: string;
      children?: { label: string; slug: string }[];
    };

const MENU_ITEMS: MenuItem[] = [
  // Main nav (matches WP 2024 FinalBoss Menu)
  { label: 'Home', icon: 'home-outline', route: '/(tabs)' },
  { label: 'Gaming', icon: 'game-controller-outline', route: '/(tabs)/gaming' },
  { label: 'Tech', icon: 'hardware-chip-outline', category: 'tech' },
  { label: 'Reviews', icon: 'star-outline', route: '/(tabs)/reviews' },
  {
    label: 'Guides',
    icon: 'book-outline',
    route: '/(tabs)/guides',
    children: [
      { label: 'Gaming Gear Guide', slug: 'gaming-gear-guide-2023' },
      { label: 'Hogwarts Legacy Guide', slug: 'hogwarts-legacy-guide' },
      { label: 'Pokémon Scarlet & Violet', slug: 'pokemon-scarlet-violet-guide' },
      { label: 'Elden Ring Guide', slug: 'elden-ring-guide' },
    ],
  },
  { label: 'Cinema', icon: 'film-outline', category: 'cinema-movies-tvshows' },
  { type: 'divider' },
  // Extra sections
  { label: 'Videos', icon: 'videocam-outline', route: '/videos' },
  { label: 'Game Database', icon: 'grid-outline', route: '/(tabs)/games' },
  { type: 'divider' },
  { label: 'Settings', icon: 'settings-outline', route: '/settings' },
  { label: 'Visit Website', icon: 'globe-outline', url: CONFIG.SITE_URL },
];

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  showBack,
  showSearch = true,
  showLogo = false,
  rightAction,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const showMenu = !showBack; // show hamburger on all non-detail screens

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <View style={styles.row}>
          {showBack ? (
            <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </Pressable>
          ) : showMenu ? (
            <Pressable onPress={() => setMenuOpen(true)} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="menu" size={26} color={COLORS.text} />
            </Pressable>
          ) : (
            <View style={styles.iconBtn} />
          )}

          {showLogo ? (
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          ) : title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          )}

          {rightAction ?? (
            showSearch ? (
              <Pressable onPress={() => router.push('/search')} style={styles.iconBtn} hitSlop={8}>
                <Ionicons name="search" size={22} color={COLORS.text} />
              </Pressable>
            ) : (
              <View style={styles.iconBtn} />
            )
          )}
        </View>
      </View>

      {/* Side Menu */}
      <Modal visible={menuOpen} animationType="fade" transparent onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menuPanel, { paddingTop: insets.top + 16 }]}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.menuLogo}
                contentFit="contain"
              />
              <Pressable onPress={() => setMenuOpen(false)} style={styles.closeBtn} hitSlop={8}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item, index) => {
                if ('type' in item && item.type === 'divider') {
                  return <View key={`div-${index}`} style={styles.divider} />;
                }
                if ('type' in item && item.type === 'header') {
                  return (
                    <Text key={item.label} style={styles.menuSectionHeader}>
                      {item.label}
                    </Text>
                  );
                }

                const menuItem = item as Extract<MenuItem, { label: string }>;
                const hasChildren = 'children' in menuItem && menuItem.children && menuItem.children.length > 0;
                const isExpanded = expandedItem === menuItem.label;

                return (
                  <View key={menuItem.label}>
                    <Pressable
                      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                      onPress={() => {
                        if (hasChildren) {
                          setExpandedItem(isExpanded ? null : menuItem.label);
                          return;
                        }
                        setMenuOpen(false);
                        setExpandedItem(null);
                        if ('url' in menuItem && menuItem.url) {
                          Linking.openURL(menuItem.url);
                        } else if ('route' in menuItem && menuItem.route) {
                          router.push(menuItem.route as never);
                        } else if ('category' in menuItem && menuItem.category) {
                          router.push(`/category/${menuItem.category}` as never);
                        }
                      }}
                    >
                      <Ionicons name={menuItem.icon} size={22} color={COLORS.textSecondary} />
                      <Text style={styles.menuItemText}>{menuItem.label}</Text>
                      {hasChildren ? (
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={COLORS.textMuted}
                        />
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                      )}
                    </Pressable>

                    {/* Sub-items */}
                    {hasChildren && isExpanded && menuItem.children!.map((child) => (
                      <Pressable
                        key={child.slug}
                        style={({ pressed }) => [styles.subMenuItem, pressed && styles.menuItemPressed]}
                        onPress={() => {
                          setMenuOpen(false);
                          setExpandedItem(null);
                          router.push(`/article/${child.slug}` as never);
                        }}
                      >
                        <Text style={styles.subMenuItemText}>{child.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
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
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 40,
  },

  // Modal / Menu
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: COLORS.background,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.border,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  menuLogo: {
    width: 120,
    height: 36,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuScroll: {
    flex: 1,
  },
  menuSectionHeader: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 14,
  },
  menuItemPressed: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  menuItemText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  subMenuItem: {
    paddingVertical: 11,
    paddingLeft: 44,
    paddingRight: 4,
  },
  subMenuItemText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
});
