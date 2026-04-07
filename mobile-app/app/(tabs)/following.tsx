import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { COLORS } from '../../constants/config';
import { buildFollowingFeed } from '../../lib/feed';
import { GET_HOME_POSTS } from '../../lib/queries/posts';
import type { Post } from '../../lib/types';

export default function FollowingScreen() {
  const { profile, beginOnboarding } = useLocalProfile();
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, error, refetch } = useQuery(GET_HOME_POSTS, {
    variables: { first: 80 },
    notifyOnNetworkStatusChange: true,
  });

  const posts: Post[] = data?.posts?.nodes ?? [];
  const followingFeed = buildFollowingFeed(posts, profile);
  const hasFollows =
    profile.followedGameSlugs.length > 0 ||
    profile.followedCategorySlugs.length > 0 ||
    profile.followedAuthorSlugs.length > 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && posts.length === 0) {
    return <ErrorView message="Failed to load Following" onRetry={onRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Following" showSearch showSettings />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        {!hasFollows ? (
          <View style={styles.emptyBlock}>
            <EmptyState
              icon="sparkles-outline"
              title="Following now starts from your onboarding picks"
              description="This feed is seeded from your selected platforms, genres, and content types. Follow a game, category, or writer to make it even sharper."
              actionLabel="Update Interests"
              onAction={beginOnboarding}
            />
            {(profile.selectedPlatforms.length > 0 || profile.selectedGenres.length > 0) ? (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Current Preferences</Text>
                <Text style={styles.summaryText}>
                  {[
                    ...profile.selectedPlatforms,
                    ...profile.selectedGenres,
                    ...profile.selectedContentTypes,
                  ].join(' • ')}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {hasFollows && followingFeed.length === 0 ? (
          <EmptyState
            icon="trail-sign-outline"
            title="Nothing new from your follows yet"
            description="Your feed will fill up as soon as FinalBoss publishes around the games and topics you track."
          />
        ) : null}

        {followingFeed.length > 0 ? (
          <>
            <SectionHeader title="Fresh From Your Follows" />
            {followingFeed.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </>
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
    gap: 18,
  },
  emptyBlock: {
    gap: 12,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
