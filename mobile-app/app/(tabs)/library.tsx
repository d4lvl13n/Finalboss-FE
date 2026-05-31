import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';
import GameCard from '../../components/GameCard';
import ProgressBar from '../../components/ProgressBar';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { useChromeScroll } from '../../context/ChromeContext';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { COLORS } from '../../constants/config';
import type { Post } from '../../lib/types';

function articleSnapshotToPost(snapshot: {
  slug: string;
  title: string;
  excerpt: string;
  date?: string;
  imageUrl?: string;
  authorName?: string;
  authorSlug?: string;
  categoryName?: string;
  categorySlug?: string;
  content?: string;
  gameTags?: { name: string; slug: string }[];
  mobileDek?: string;
}): Post {
  return {
    id: snapshot.slug,
    slug: snapshot.slug,
    title: snapshot.title,
    excerpt: snapshot.excerpt,
    date: snapshot.date || new Date().toISOString(),
    content: snapshot.content,
    mobileDek: snapshot.mobileDek,
    featuredImage: snapshot.imageUrl
      ? { node: { sourceUrl: snapshot.imageUrl } }
      : undefined,
    author: snapshot.authorName
      ? {
          node: {
            name: snapshot.authorName,
            slug: snapshot.authorSlug,
          },
        }
      : undefined,
    categories: snapshot.categoryName
      ? {
          nodes: [
            {
              name: snapshot.categoryName,
              slug: snapshot.categorySlug || 'latest',
            },
          ],
        }
      : undefined,
    gameTags: snapshot.gameTags
      ? {
          nodes: snapshot.gameTags,
        }
      : undefined,
  };
}

export default function LibraryScreen() {
  const router = useRouter();
  const {
    continueReading,
    savedArticles,
    savedGames,
    openNewsletterPrompt,
    profile,
  } = useLocalProfile();
  const onChromeScroll = useChromeScroll();

  const isEmpty =
    continueReading.length === 0 && savedArticles.length === 0 && savedGames.length === 0;
  const followCount =
    profile.followedGameSlugs.length +
    profile.followedCategorySlugs.length +
    profile.followedAuthorSlugs.length;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Library" showSearch={false} showSettings />
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
      >
        <Pressable
          style={styles.followingCard}
          onPress={() => router.push('/(tabs)/following' as never)}
        >
          <View style={styles.followingIcon}>
            <Ionicons name="sparkles" size={18} color={COLORS.accent} />
          </View>
          <View style={styles.followingText}>
            <Text style={styles.followingTitle}>Following</Text>
            <Text style={styles.followingSubtitle}>
              {followCount > 0
                ? `${followCount} game${followCount === 1 ? '' : 's'}, topics & writers you follow`
                : 'Games, topics & writers you follow'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Pressable>

        {isEmpty ? (
          <EmptyState
            icon="bookmark-outline"
            title="Build your personal media stack"
            description="Save stories, follow games, and keep your own briefing inside FinalBoss."
            actionLabel="Get The Daily Digest"
            onAction={() => openNewsletterPrompt('library')}
          />
        ) : null}

        {continueReading.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Continue Reading" />
            {continueReading.map((entry) => (
              <Pressable
                key={entry.slug}
                style={styles.progressCard}
                onPress={() => router.push(`/article/${entry.slug}`)}
              >
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle} numberOfLines={2}>
                    {entry.title}
                  </Text>
                  <Text style={styles.progressValue}>{entry.progress}%</Text>
                </View>
                <ProgressBar value={entry.progress} />
                <Text style={styles.progressMeta}>
                  {entry.categoryName || 'Article'}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {savedArticles.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Saved Articles" />
            {savedArticles.map((snapshot) => (
              <ArticleCard
                key={snapshot.slug}
                article={articleSnapshotToPost(snapshot)}
                variant="compact"
              />
            ))}
          </View>
        ) : null}

        {savedGames.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Watchlist" />
            <View style={styles.savedGames}>
              {savedGames.map((game) => (
                <View key={game.slug} style={styles.savedGameCard}>
                  <GameCard
                    compact
                  tag={{
                      name: game.name,
                      slug: game.slug,
                      coverUrl: game.coverUrl,
                      rating: game.rating,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {!isEmpty ? (
          <Pressable
            style={styles.digestButton}
            onPress={() => openNewsletterPrompt('manual')}
          >
            <Ionicons name="mail-outline" size={18} color={COLORS.background} />
            <Text style={styles.digestButtonText}>Add the daily digest</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 24,
  },
  followingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  followingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
  },
  followingText: {
    flex: 1,
  },
  followingTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  followingSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    gap: 12,
  },
  progressCard: {
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  progressValue: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  progressMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  savedGames: {
    gap: 12,
  },
  savedGameCard: {
    width: '100%',
  },
  digestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    paddingVertical: 15,
  },
  digestButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
});
