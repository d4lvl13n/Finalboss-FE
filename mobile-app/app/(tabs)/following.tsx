import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { useChromeScroll } from '../../context/ChromeContext';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { COLORS } from '../../constants/config';
import { buildFollowingFeed } from '../../lib/feed';
import { GET_HOME_POSTS } from '../../lib/queries/posts';
import type { Post } from '../../lib/types';

export default function FollowingScreen() {
  const { profile } = useLocalProfile();
  const onChromeScroll = useChromeScroll();
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
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        {!hasFollows ? (
          <EmptyState
            icon="sparkles-outline"
            title="Your Following feed"
            description="Follow a game, category, or writer — tap Follow on any story or game page and their latest coverage lands here. Until then, here's what's fresh on FinalBoss."
          />
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
            <SectionHeader title={hasFollows ? 'Fresh From Your Follows' : 'Fresh on FinalBoss'} />
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
