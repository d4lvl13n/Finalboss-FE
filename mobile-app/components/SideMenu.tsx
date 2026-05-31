import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';
import { useSideMenu } from '../context/SideMenuContext';
import { useLocalProfile } from '../context/LocalProfileContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuLink {
  label: string;
  href: string;
  icon: IconName;
}

const CATEGORIES: MenuLink[] = [
  { label: 'Gaming News', href: '/(tabs)/gaming', icon: 'newspaper-outline' },
  { label: 'Reviews', href: '/(tabs)/reviews', icon: 'star-outline' },
  { label: 'Guides', href: '/(tabs)/guides', icon: 'book-outline' },
  { label: 'Technology', href: '/category/technology', icon: 'hardware-chip-outline' },
  { label: 'Videos', href: '/(tabs)/videos', icon: 'play-circle-outline' },
  { label: 'Games', href: '/(tabs)/games', icon: 'grid-outline' },
];

const PANEL_WIDTH = Math.min(320, Dimensions.get('window').width * 0.84);

export default function SideMenu() {
  const { isOpen, closeMenu } = useSideMenu();
  const { profile, openNewsletterPrompt } = useLocalProfile();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const progress = React.useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }

    Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: isOpen ? 260 : 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !isOpen) {
        setMounted(false);
      }
    });
  }, [isOpen, progress]);

  const navigate = React.useCallback(
    (href: string) => {
      closeMenu();
      // Defer so the close animation can begin before the route transition.
      requestAnimationFrame(() => router.push(href as never));
    },
    [closeMenu, router]
  );

  const openDigest = React.useCallback(() => {
    closeMenu();
    requestAnimationFrame(() => openNewsletterPrompt('manual'));
  }, [closeMenu, openNewsletterPrompt]);

  const subscribed = profile.newsletterStatus === 'subscribed';

  if (!mounted) {
    return null;
  }

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-PANEL_WIDTH - 24, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            width: PANEL_WIDTH,
            paddingTop: insets.top + 14,
            paddingBottom: insets.bottom + 18,
            transform: [{ translateX }],
          },
        ]}
      >
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.panelTint} />

        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Image source={require('../assets/logo.png')} style={styles.logo} contentFit="contain" />
            <Text style={styles.brandText}>FinalBoss</Text>
          </View>
          <Pressable onPress={closeMenu} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={({ pressed }) => [styles.searchPill, pressed && styles.rowPressed]}
            onPress={() => navigate('/search')}
          >
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <Text style={styles.searchText}>Search FinalBoss…</Text>
          </Pressable>

          <Text style={styles.sectionLabel}>Categories</Text>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item.href}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => navigate(item.href)}
            >
              <View style={styles.rowIcon}>
                <Ionicons name={item.icon} size={19} color={COLORS.text} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </Pressable>
          ))}

          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={openDigest}
          >
            <View style={styles.rowIcon}>
              <Ionicons
                name={subscribed ? 'checkmark-circle-outline' : 'mail-outline'}
                size={19}
                color={subscribed ? COLORS.success : COLORS.text}
              />
            </View>
            <Text style={styles.rowLabel}>
              {subscribed ? 'Subscribed to the digest' : 'Subscribe to the digest'}
            </Text>
            {subscribed ? null : (
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => navigate('/settings')}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="options-outline" size={19} color={COLORS.text} />
            </View>
            <Text style={styles.rowLabel}>Settings</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </Pressable>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 18, 0.62)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(13, 19, 34, 0.6)',
    paddingHorizontal: 14,
  },
  panelTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 16, 32, 0.32)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  brandBlock: {
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
    fontSize: 18,
    fontWeight: '800',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  scroll: {
    paddingBottom: 12,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  searchText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: 14,
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rowIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  rowLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
    marginHorizontal: 4,
  },
});
