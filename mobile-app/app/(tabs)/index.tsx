import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
  const [segment, setSegment] = React.useState<ContentType | 'videos'>(
    profile.selectedContentTypes[0] ?? 'latest'
  );
  const [videos, setVideos] = React.useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, loading, error, refetch } = useQuery(GET_HOME_POSTS, {
    variables: { first: 60 },
    notifyOnNetworkStatusChange: true,
  });

  const posts: Post[] = data?.posts?.nodes ?? [];
  const heroPost = pickHeroPost(posts);
  const remainingPosts = dedupePosts(
    posts.filter((post) => post.slug !== heroPost?.slug)
  );
  const personalizedPosts = buildPersonalizedFeed(remainingPosts, profile, 6);
  const latestPosts =
    segment === 'videos'
      ? []
      : filterPostsBySegment(remainingPosts, segment).slice(0, 8);

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

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && posts.length === 0) {
    return <ErrorView message="Failed to load the home feed" onRetry={onRefresh} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader showSearch showSettings />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
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
          <SectionHeader title="Browse" />
          <View style={styles.segmentRow}>
            {SEGMENTS.map((item) => (
              <SelectionChip
                key={item.value}
                label={item.label}
                selected={segment === item.value}
                onPress={() => setSegment(item.value)}
              />
            ))}
          </View>

          {segment === 'videos' ? (
            <>
              {videosLoading ? <LoadingSpinner /> : null}
              {!videosLoading ? (
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
              ) : null}
            </>
          ) : (
            latestPosts.map((post) => (
              <ArticleCard key={post.id} article={post} variant="compact" />
            ))
          )}
        </View>

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
              onPress={() => router.push('/videos')}
            />
            <QuickLinkCard
              title="Library"
              subtitle="Saved reads and your watchlist."
              icon="bookmark-outline"
              onPress={() => router.push('/(tabs)/library' as never)}
            />
          </View>
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
  bottomSpacer: {
    height: 20,
  },
});
