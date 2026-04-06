import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';
import ScreenHeader from '../components/ScreenHeader';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingsItem {
  label: string;
  icon: IconName;
  url?: string;
  value?: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SECTIONS: SettingsSection[] = [
  {
    title: 'About',
    items: [
      { label: 'About FinalBoss.io', icon: 'information-circle-outline', url: 'https://finalboss.io/about' },
      { label: 'Version', icon: 'code-slash-outline', value: '1.0.0' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', icon: 'shield-checkmark-outline', url: 'https://finalboss.io/privacy-policy' },
      { label: 'Terms of Service', icon: 'document-text-outline', url: 'https://finalboss.io/terms-of-service' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'Visit Website', icon: 'globe-outline', url: 'https://finalboss.io' },
      { label: 'YouTube Channel', icon: 'logo-youtube', url: 'https://www.youtube.com/@finalboss6969' },
      { label: 'Twitter / X', icon: 'logo-twitter', url: 'https://x.com/finaborssio' },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" showBack showSearch={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => {
                const isLast = index === section.items.length - 1;
                const isTappable = !!item.url;

                const row = (
                  <View
                    key={item.label}
                    style={[styles.row, !isLast && styles.rowBorder]}
                  >
                    <Ionicons name={item.icon} size={20} color={COLORS.textSecondary} />
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    {item.value ? (
                      <Text style={styles.rowValue}>{item.value}</Text>
                    ) : (
                      <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
                    )}
                  </View>
                );

                if (isTappable) {
                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => Linking.openURL(item.url!)}
                      style={({ pressed }) => pressed && styles.rowPressed}
                    >
                      {row}
                    </Pressable>
                  );
                }

                return row;
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  rowValue: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
