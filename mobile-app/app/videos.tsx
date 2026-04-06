import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import ScreenHeader from '../components/ScreenHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';
import { COLORS } from '../constants/config';
import { fetchChannelVideos, type YouTubeVideo } from '../lib/youtube/service';

function formatViewCount(count: string): string {
  const n = parseInt(count, 10);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });

  return (
    <Pressable
      style={styles.videoCard}
      onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: video.thumbnail.url }} style={styles.thumbnail} contentFit="cover" />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
        <View style={styles.videoMeta}>
          <Text style={styles.metaText}>{formatViewCount(video.viewCount)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{timeAgo}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function VideosScreen() {
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
      <ScreenHeader title="Videos" showBack />
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={styles.list}
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
  },
  videoCard: {
    marginBottom: 20,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  videoTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  metaDot: {
    color: COLORS.textMuted,
    marginHorizontal: 6,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
