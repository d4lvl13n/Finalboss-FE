import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/config';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, showBack, showSearch = true, rightAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

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
});
