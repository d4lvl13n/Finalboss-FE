import React from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import ArticleCard from '../../components/ArticleCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import QuickLinkCard from '../../components/QuickLinkCard';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import SelectionChip from '../../components/SelectionChip';
import VideoCard from '../../components/VideoCard';
import { COLORS } from '../../constants/config';
import { buildPersonalizedFeed, dedupePosts, filterPostsBySegment, pickHeroPost } from '../../lib/feed';
import { GET_HOME_POSTS } from '../../lib/queries/posts';
import type { ContentType } from '../../lib/localProfile';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { useChromeScroll } from '../../context/ChromeContext';
import { fetchChannelVideos, type YouTubeVideo } from '../../lib/youtube/service';
import type { Post } from '../../lib/types';

const SEGMENTS: { value: ContentType | 'videos'; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'guides', label: 'Guides' },
  { value: 'videos', label: 'Videos' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useLocalProfile();
  const onChromeScroll = useChromeScroll();
  const listRef = React.useRef<FlatList<Post>>(null);
  const [segment, setSegment] = React.useState<ContentType | 'videos'>(
    profile.selectedContentTypes[0] ?? 'latest'
  );
  const [videos, setVideos] = React.useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_HOME_POSTS, {
    variables: { first: 30 },
    notifyOnNetworkStatusChange: true,
  });

  const posts: Post[] = data?.posts?.nodes ?? [];
  const heroPost = pickHeroPost(posts);
  const remainingPosts = dedupePosts(
    posts.filter((post) => post.slug !== heroPost?.slug)
  );
  const personalizedPosts = buildPersonalizedFeed(remainingPosts, profile, 6);
  const feedPosts = segment === 'videos' ? [] : filterPostsBySegment(remainingPosts, segment);
  const hasNextPage = data?.posts?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.posts?.pageInfo?.endCursor ?? null;

  const loadVideos = React.useCallback(async () => {
    try {
      setVideosLoading(true);
      const result = await fetchChannelVideos(6);
      setVideos(result.items);
    } catch {
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), loadVideos()]);
    setRefreshing(false);
  };

  const loadMore = React.useCallback(() => {
    if (!hasNextPage || loadingMore || segment === 'videos') {
      return;
    }
    setLoadingMore(true);
    fetchMore({
      variables: { after: endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          posts: {
            ...fetchMoreResult.posts,
            nodes: [...(prev.posts?.nodes ?? []), ...fetchMoreResult.posts.nodes],
          },
        };
      },
    }).finally(() => setLoadingMore(false));
  }, [endCursor, fetchMore, hasNextPage, loadingMore, segment]);

  const selectSegment = React.useCallback((value: ContentType | 'videos') => {
    setSegment(value);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => (
      <View style={styles.feedItem}>
        <ArticleCard article={item} variant="compact" />
      </View>
    ),
    []
  );

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && posts.length === 0) {
    return <ErrorView message="Failed to load the home feed" onRetry={onRefresh} />;
  }

  const listHeader = (
    <>
      {heroPost ? (
        <View style={styles.section}>
          <ArticleCard article={heroPost} variant="featured" />
        </View>
      ) : null}

      {personalizedPosts.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="For You"
            actionLabel="Open Following"
            onAction={() => router.push('/(tabs)/following' as never)}
          />
          {personalizedPosts.slice(0, 3).map((post) => (
            <ArticleCard key={post.id} article={post} />
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Explore" />
        <View style={styles.quickGrid}>
          <QuickLinkCard
            title="Reviews"
            subtitle="Latest verdicts and buying signals."
            icon="star-outline"
            onPress={() => router.push('/reviews')}
          />
          <QuickLinkCard
            title="Guides"
            subtitle="Walkthroughs, builds, and strategy."
            icon="book-outline"
            onPress={() => router.push('/guides')}
          />
          <QuickLinkCard
            title="Videos"
            subtitle="Watch the latest FinalBoss uploads."
            icon="play-circle-outline"
            onPress={() => router.push('/(tabs)/videos' as never)}
          />
          <QuickLinkCard
            title="Library"
            subtitle="Saved reads and your watchlist."
            icon="bookmark-outline"
            onPress={() => router.push('/(tabs)/library' as never)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Browse" />
        <View style={styles.segmentRow}>
          {SEGMENTS.map((item) => (
            <SelectionChip
              key={item.value}
              label={item.label}
              selected={segment === item.value}
              onPress={() => selectSegment(item.value)}
            />
          ))}
        </View>

        {segment === 'videos' ? (
          videosLoading ? (
            <LoadingSpinner inline />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalRail}
            >
              {videos.map((video) => (
                <View key={video.id} style={styles.videoRailItem}>
                  <VideoCard video={video} compact />
                </View>
              ))}
            </ScrollView>
          )
        ) : null}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader showSearch showSettings />
      <FlatList
        ref={listRef}
        data={feedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          segment !== 'videos' && loadingMore ? (
            <View style={styles.footerLoader}>
              <LoadingSpinner inline />
            </View>
          ) : null
        }
        contentContainerStyle={styles.content}
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  horizontalRail: {
    paddingRight: 16,
  },
  videoRailItem: {
    marginRight: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  feedItem: {
    paddingHorizontal: 16,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
