import React from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GET_GAME_TAG_WITH_POSTS } from '../../lib/queries/games';
import ArticleCard from '../../components/ArticleCard';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import { COLORS, CONFIG } from '../../constants/config';
import type { GameTag, IGDBGame, Post } from '../../lib/types';

function parseIgdbData(igdbData?: string): IGDBGame | null {
  if (!igdbData) return null;
  try {
    return JSON.parse(igdbData);
  } catch {
    return null;
  }
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function RatingCircle({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const color = rounded >= 75 ? '#22C55E' : rounded >= 50 ? COLORS.accent : COLORS.error;
  return (
    <View style={[styles.ratingCircle, { borderColor: color }]}>
      <Text style={[styles.ratingNumber, { color }]}>{rounded}</Text>
      <Text style={styles.ratingLabel}>Rating</Text>
    </View>
  );
}

export default function GameDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, loading, error, refetch } = useQuery(GET_GAME_TAG_WITH_POSTS, {
    variables: { slug, first: 10 },
    skip: !slug,
  });

  const tag: GameTag | null = data?.gameTag ?? null;
  const game = parseIgdbData(tag?.igdbData);
  const relatedPosts: Post[] = tag?.posts?.nodes ?? [];

  if (loading) return <LoadingSpinner />;
  if (error || !tag) return <ErrorView message="Game not found" onRetry={() => refetch()} />;

  const coverUrl = game?.cover_url;
  const screenshots = game?.screenshots ?? [];

  return (
    <View style={styles.container}>
      <ScreenHeader title={tag.name} showBack showSearch={false} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          {coverUrl && (
            <Image source={{ uri: coverUrl }} style={styles.coverImage} contentFit="cover" />
          )}
          <View style={styles.heroInfo}>
            <Text style={styles.gameName}>{tag.name}</Text>
            {game?.rating && <RatingCircle rating={game.rating} />}
          </View>
        </View>

        <View style={styles.content}>
          {/* Quick Info */}
          <View style={styles.infoCard}>
            <InfoRow label="Release Date" value={game?.release_date} />
            <InfoRow label="Platforms" value={game?.platforms?.map((p) => p.name).join(', ')} />
            <InfoRow label="Genres" value={game?.genres?.join(', ')} />
            <InfoRow label="Developers" value={game?.companies?.join(', ')} />
            <InfoRow label="Game Modes" value={game?.game_modes?.join(', ')} />
          </View>

          {/* Description */}
          {game?.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{game.description}</Text>
            </View>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Screenshots</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {screenshots.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.screenshot} contentFit="cover" />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Articles</Text>
              {relatedPosts.map((post) => (
                <ArticleCard key={post.id} article={post} variant="compact" />
              ))}
            </View>
          )}

          {/* View on Website */}
          <Pressable
            style={styles.websiteButton}
            onPress={() => Linking.openURL(`${CONFIG.SITE_URL}/game/${tag.slug}`)}
          >
            <Ionicons name="globe-outline" size={18} color={COLORS.background} />
            <Text style={styles.websiteButtonText}>View on FinalBoss.io</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
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
    borderRadius: 12,
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  gameName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  ratingCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  ratingLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: -2,
  },
  content: {
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    flex: 0.35,
  },
  infoValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 0.65,
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  screenshot: {
    width: 280,
    height: 160,
    borderRadius: 10,
    marginRight: 10,
  },
  websiteButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  websiteButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
