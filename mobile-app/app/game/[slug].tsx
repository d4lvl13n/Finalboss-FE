import React from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import ArticleCard from '../../components/ArticleCard';
import ErrorView from '../../components/ErrorView';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { COLORS, CONFIG } from '../../constants/config';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { type GameSnapshot } from '../../lib/localProfile';
import { GET_GAME_TAG_WITH_POSTS } from '../../lib/queries/games';
import type { GameTag, IGDBGame, Post } from '../../lib/types';
import {
  getIgdbCompanies,
  getIgdbCoverUrl,
  getIgdbDescription,
  getIgdbGameModes,
  getIgdbGenres,
  getIgdbPlatforms,
  getIgdbReleaseDate,
  getIgdbScreenshots,
} from '../../lib/types';

function parseIgdbData(igdbData?: string): IGDBGame | null {
  if (!igdbData) return null;
  try {
    return JSON.parse(igdbData);
  } catch {
    return null;
  }
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active?: boolean;
  onPress: () => unknown | Promise<unknown>;
}) {
  return (
    <Pressable
      style={[styles.actionButton, active && styles.actionButtonActive]}
      onPress={() => {
        void onPress();
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? COLORS.background : COLORS.text}
      />
      <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function RatingPill({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const color = rounded >= 75 ? COLORS.success : rounded >= 50 ? COLORS.accent : COLORS.error;

  return (
    <View style={[styles.ratingPill, { borderColor: color }]}>
      <Text style={[styles.ratingValue, { color }]}>{rounded}</Text>
      <Text style={styles.ratingLabel}>Meta Pulse</Text>
    </View>
  );
}

export default function GameDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const {
    isGameFollowed,
    isGameSaved,
    openNewsletterPrompt,
    toggleFollowGame,
    toggleSaveGame,
  } = useLocalProfile();

  const { data, loading, error, refetch } = useQuery(GET_GAME_TAG_WITH_POSTS, {
    variables: { slug, first: 10 },
    skip: !slug,
  });

  const tag: GameTag | null = data?.gameTag ?? null;
  const game = parseIgdbData(tag?.igdbData);
  const relatedPosts: Post[] = tag?.posts?.nodes ?? [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !tag) {
    return <ErrorView message="Game not found" onRetry={() => refetch()} />;
  }

  const coverUrl = game ? getIgdbCoverUrl(game) : undefined;
  const screenshots = game ? getIgdbScreenshots(game) : [];
  const platforms = game ? getIgdbPlatforms(game) : '';
  const genres = game ? getIgdbGenres(game) : '';
  const companies = game ? getIgdbCompanies(game) : '';
  const gameModes = game ? getIgdbGameModes(game) : '';
  const releaseDate = game ? getIgdbReleaseDate(game) : undefined;
  const description = game ? getIgdbDescription(game) : undefined;
  const gameUrl = `${CONFIG.SITE_URL}/game/${tag.slug}`;
  const saved = isGameSaved(tag.slug);
  const followed = isGameFollowed(tag.slug);

  const gameSnapshot: GameSnapshot = {
    slug: tag.slug,
    name: tag.name,
    coverUrl,
    rating: game?.rating ?? null,
    savedAt: new Date().toISOString(),
  };

  const handleShare = async () => {
    await Share.share({
      title: tag.name,
      message: `${tag.name} - ${gameUrl}`,
      url: gameUrl,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={tag.name}
        showBack
        showSearch={false}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable onPress={handleShare} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="share-outline" size={20} color={COLORS.text} />
            </Pressable>
            <Pressable onPress={() => Linking.openURL(gameUrl)} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="open-outline" size={20} color={COLORS.text} />
            </Pressable>
          </View>
        }
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.coverImage} contentFit="cover" />
          ) : (
            <View style={[styles.coverImage, styles.coverPlaceholder]}>
              <Text style={styles.coverPlaceholderText}>{tag.name[0]}</Text>
            </View>
          )}
          <View style={styles.heroInfo}>
            <Text style={styles.gameName}>{tag.name}</Text>
            {game?.rating ? <RatingPill rating={game.rating} /> : null}
            <Text style={styles.heroCopy}>
              Follow this title to turn FinalBoss into a live release radar instead of a static database page.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.actionRow}>
            <ActionButton
              icon={followed ? 'notifications' : 'notifications-outline'}
              label={followed ? 'Following' : 'Follow'}
              active={followed}
              onPress={() => toggleFollowGame(tag.slug)}
            />
            <ActionButton
              icon={saved ? 'bookmark' : 'bookmark-outline'}
              label={saved ? 'Watchlisted' : 'Watchlist'}
              active={saved}
              onPress={() => toggleSaveGame(gameSnapshot)}
            />
            <ActionButton icon="share-outline" label="Share" onPress={handleShare} />
          </View>

          <View style={styles.infoCard}>
            <InfoRow label="Release Date" value={releaseDate} />
            <InfoRow label="Platforms" value={platforms} />
            <InfoRow label="Genres" value={genres} />
            <InfoRow label="Studios" value={companies} />
            <InfoRow label="Game Modes" value={gameModes} />
          </View>

          {description ? (
            <View style={styles.section}>
              <SectionHeader title="About" />
              <Text style={styles.description}>{description}</Text>
            </View>
          ) : null}

          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Keep this game on your radar</Text>
            <Text style={styles.alertText}>
              Follow the title for review drops, late-breaking coverage, and then add the daily digest if you want the whole briefing in one place.
            </Text>
            <View style={styles.alertActions}>
              <Pressable
                style={styles.primaryCta}
                onPress={() => {
                  void toggleFollowGame(tag.slug);
                }}
              >
                <Ionicons name="notifications-outline" size={18} color={COLORS.background} />
                <Text style={styles.primaryCtaText}>
                  {followed ? 'Alerts On' : 'Get Alerts'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.secondaryCta}
                onPress={() => openNewsletterPrompt('manual')}
              >
                <Ionicons name="mail-outline" size={18} color={COLORS.text} />
                <Text style={styles.secondaryCtaText}>Get The Daily Digest</Text>
              </Pressable>
            </View>
          </View>

          {screenshots.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="Screenshots" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {screenshots.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.screenshot}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {relatedPosts.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="Coverage Around This Game" />
              {relatedPosts.map((post) => (
                <ArticleCard key={post.id} article={post} variant="compact" />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  coverImage: {
    width: 140,
    height: 190,
    borderRadius: 18,
  },
  coverPlaceholder: {
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    color: COLORS.textMuted,
    fontSize: 36,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  heroCopy: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  gameName: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  ratingPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  ratingLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  actionLabelActive: {
    color: COLORS.background,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
    flex: 0.34,
  },
  infoValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 0.66,
    textAlign: 'right',
  },
  section: {
    gap: 12,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  alertCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  alertText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  alertActions: {
    gap: 10,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
  },
  primaryCtaText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
  },
  secondaryCtaText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  screenshot: {
    width: 280,
    height: 160,
    borderRadius: 14,
    marginRight: 10,
  },
  bottomSpacer: {
    height: 40,
  },
});
