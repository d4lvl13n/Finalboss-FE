import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import VideoCard from '../../components/VideoCard';
import { COLORS } from '../../constants/config';
import { useChromeScroll } from '../../context/ChromeContext';
import { fetchChannelVideos, type YouTubeVideo } from '../../lib/youtube/service';

export default function VideosScreen() {
  const onChromeScroll = useChromeScroll();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  const loadVideos = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const result = await fetchChannelVideos(12);
      setVideos(result.items);
      setNextPageToken(result.nextPageToken);
    } catch (e) {
      setError('Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchChannelVideos(12, nextPageToken);
      setVideos((prev) => [...prev, ...result.items]);
      setNextPageToken(result.nextPageToken);
    } catch {
      // silently fail on pagination
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorView message={error} onRetry={() => loadVideos()} />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Videos" showSearch showSettings />
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={styles.list}
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadVideos(true)} tintColor={COLORS.accent} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <Text style={styles.metaText}>Loading more...</Text>
            </View>
          ) : null
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
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
