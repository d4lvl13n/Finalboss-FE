import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../constants/config';
import type { YouTubeVideo } from '../lib/youtube/service';

function formatViewCount(count: string): string {
  const n = parseInt(count, 10);
  if (Number.isNaN(n)) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

interface VideoCardProps {
  video: YouTubeVideo;
  compact?: boolean;
}

export default function VideoCard({ video, compact = false }: VideoCardProps) {
  const router = useRouter();
  const publishedDate = new Date(video.publishedAt);
  const timeAgo = Number.isNaN(publishedDate.getTime())
    ? ''
    : formatDistanceToNow(publishedDate, { addSuffix: true });
  const viewLabel = formatViewCount(video.viewCount);
  const cardStyle = compact ? styles.compactCard : styles.card;
  const thumbnailStyle = compact ? styles.compactThumbnail : styles.thumbnail;

  return (
    <Pressable
      style={cardStyle}
      onPress={() => router.push(`/videos/${video.id}` as never)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: video.thumbnail.url }} style={thumbnailStyle} contentFit="cover" />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={styles.metaRow}>
          {viewLabel ? <Text style={styles.metaText}>{viewLabel}</Text> : null}
          {viewLabel && timeAgo ? <Text style={styles.metaDot}>·</Text> : null}
          {timeAgo ? <Text style={styles.metaText}>{timeAgo}</Text> : null}
        </View>
      </View>
      <Pressable
        style={styles.shareButton}
        onPress={async () => {
          const url = `${CONFIG.SITE_URL}/videos/${video.id}`;
          await Share.share({
            title: video.title,
            message: `${video.title} - ${url}`,
            url,
          });
        }}
      >
        <Ionicons name="share-outline" size={18} color={COLORS.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compactCard: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  compactThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  info: {
    paddingTop: 12,
    paddingHorizontal: 4,
    gap: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  metaRow: {
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
  shareButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(11,16,32,0.72)',
  },
});
