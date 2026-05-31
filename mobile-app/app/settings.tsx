import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import ScreenHeader from '../components/ScreenHeader';
import SelectionChip from '../components/SelectionChip';
import { COLORS, CONFIG } from '../constants/config';
import { openStoreReviewPage } from '../lib/review';
import { useChromeScroll } from '../context/ChromeContext';
import { useLocalProfile } from '../context/LocalProfileContext';
import type { TextScale } from '../lib/localProfile';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function formatSlugLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  destructive = false,
  accessory,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  accessory?: React.ReactNode;
}) {
  const content = (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? COLORS.error : COLORS.textSecondary}
        />
      </View>
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {accessory ?? (
        onPress ? <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} /> : null
      )}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.rowPressed]}>
      {content}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const onChromeScroll = useChromeScroll();
  const {
    clearCache,
    openNewsletterPrompt,
    profile,
    requestPushPermission,
    setDigestHour,
    setHapticsEnabled,
    setTextScale,
  } = useLocalProfile();

  const followedTopics = profile.followedCategorySlugs.slice(0, 5);
  const followedGames = profile.followedGameSlugs.slice(0, 5);
  const digestHourLabel = `${profile.digestHour.toString().padStart(2, '0')}:00`;
  const isExpoGo = Constants.appOwnership === 'expo';

  const handleTextScale = (scale: TextScale) => {
    void setTextScale(scale);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" showBack showSearch={false} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
      >
        <Section title="Preferences">
          <Row
            icon="notifications-outline"
            label="Push Notifications"
            value={
              isExpoGo
                ? 'Unavailable in Expo Go'
                : profile.pushStatus === 'granted'
                ? 'Enabled'
                : profile.pushStatus === 'denied'
                ? 'Denied'
                : 'Not Set'
            }
            onPress={() => {
              if (profile.pushStatus === 'denied' || profile.pushStatus === 'granted') {
                void Linking.openSettings();
                return;
              }

              void requestPushPermission();
            }}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="mail-outline"
            label="Daily Digest"
            value={
              profile.newsletterStatus === 'subscribed'
                ? 'Subscribed'
                : profile.newsletterStatus === 'dismissed'
                ? 'Dismissed'
                : 'Not Subscribed'
            }
            onPress={() => openNewsletterPrompt('manual')}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="time-outline"
            label="Digest Hour"
            value={digestHourLabel}
            accessory={
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => {
                    void setDigestHour(profile.digestHour - 1);
                  }}
                >
                  <Ionicons name="remove" size={16} color={COLORS.text} />
                </Pressable>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => {
                    void setDigestHour(profile.digestHour + 1);
                  }}
                >
                  <Ionicons name="add" size={16} color={COLORS.text} />
                </Pressable>
              </View>
            }
          />
          <View style={styles.rowDivider} />
          <Row
            icon="pulse-outline"
            label="Haptics"
            accessory={
              <Switch
                value={profile.hapticsEnabled}
                onValueChange={(value) => {
                  void setHapticsEnabled(value);
                }}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.accent }}
                thumbColor={profile.hapticsEnabled ? COLORS.background : '#f4f4f5'}
              />
            }
          />
        </Section>

        <Section title="Reading">
          <Text style={styles.inlineLabel}>Text Size</Text>
          <View style={styles.chipRow}>
            <SelectionChip
              label="Default"
              selected={profile.textScale === 'default'}
              onPress={() => handleTextScale('default')}
            />
            <SelectionChip
              label="Large"
              selected={profile.textScale === 'large'}
              onPress={() => handleTextScale('large')}
            />
          </View>
        </Section>

        <Section title="Following">
          <Text style={styles.inlineLabel}>Topics</Text>
          <View style={styles.tokenWrap}>
            {followedTopics.length > 0 ? (
              followedTopics.map((slug) => (
                <View key={slug} style={styles.token}>
                  <Text style={styles.tokenLabel}>{formatSlugLabel(slug)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInlineText}>No topics followed yet.</Text>
            )}
          </View>
          <View style={styles.inlineDivider} />
          <Text style={styles.inlineLabel}>Games</Text>
          <View style={styles.tokenWrap}>
            {followedGames.length > 0 ? (
              followedGames.map((slug) => (
                <View key={slug} style={styles.token}>
                  <Text style={styles.tokenLabel}>{formatSlugLabel(slug)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInlineText}>No games followed yet.</Text>
            )}
          </View>
        </Section>

        <Section title="Maintenance">
          <Row
            icon="trash-outline"
            label="Clear Offline Cache"
            value="Saved metadata stays"
            destructive
            onPress={() => {
              void clearCache();
            }}
          />
        </Section>

        <Section title="About">
          <Row
            icon="star-outline"
            label="Rate FinalBoss"
            onPress={() => {
              void openStoreReviewPage();
            }}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="globe-outline"
            label="Visit FinalBoss.io"
            onPress={() => Linking.openURL(CONFIG.SITE_URL)}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="logo-youtube"
            label="YouTube Channel"
            onPress={() => Linking.openURL('https://www.youtube.com/@finalboss6969')}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="logo-twitter"
            label="X / Twitter"
            onPress={() => Linking.openURL('https://x.com/FinalBoss_io')}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL(`${CONFIG.SITE_URL}/privacy-policy`)}
          />
          <View style={styles.rowDivider} />
          <Row
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL(`${CONFIG.SITE_URL}/terms-of-service`)}
          />
        </Section>
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
    paddingBottom: 48,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowPressed: {
    opacity: 0.72,
  },
  rowIconWrap: {
    width: 28,
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rowLabelDestructive: {
    color: COLORS.error,
  },
  rowValue: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  rowDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginLeft: 40,
  },
  inlineLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    marginHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  inlineDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  token: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyInlineText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
