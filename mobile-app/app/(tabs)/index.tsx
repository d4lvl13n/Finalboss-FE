import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import { GET_FEATURED_POSTS, GET_LATEST_POSTS } from '../../lib/queries/posts';
import ArticleCard from '../../components/ArticleCard';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import { COLORS } from '../../constants/config';
import type { Post } from '../../lib/types';

export default function HomeScreen() {
  const router = useRouter();

  const {
    data: featuredData,
    loading: featuredLoading,
    refetch: refetchFeatured,
  } = useQuery(GET_FEATURED_POSTS, { variables: { first: 5 } });

  const {
    data: latestData,
    loading: latestLoading,
    error,
    refetch: refetchLatest,
  } = useQuery(GET_LATEST_POSTS, { variables: { first: 20 } });

  const featuredPosts: Post[] = featuredData?.posts?.nodes ?? [];
  const latestPosts: Post[] = latestData?.posts?.nodes ?? [];

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchLatest()]);
    setRefreshing(false);
  };

  if (featuredLoading && latestLoading && !featuredData && !latestData) {
    return <LoadingSpinner />;
  }

  if (error && !latestData) {
    return <ErrorView message="Failed to load articles" onRetry={onRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="FinalBoss.io" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
      >
        {/* Featured Section */}
        {featuredPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
              {featuredPosts.map((post) => (
                <ArticleCard key={post.id} article={post} variant="featured" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Latest Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Articles</Text>
            <Pressable onPress={() => router.push('/(tabs)/gaming')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {latestPosts.map((post) => (
            <ArticleCard key={post.id} article={post} variant="compact" />
          ))}
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
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  featuredScroll: {
    paddingRight: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});
