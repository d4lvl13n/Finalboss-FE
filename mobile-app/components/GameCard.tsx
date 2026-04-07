import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/config';
import type { GameTag } from '../lib/types';
import { getIgdbCoverUrl, getIgdbPlatforms } from '../lib/types';

function parseIgdbData(tag: GameTag) {
  if (!tag.igdbData) return null;
  try {
    return JSON.parse(tag.igdbData);
  } catch {
    return null;
  }
}

interface GameCardProps {
  tag: GameTag;
  compact?: boolean;
}

export default function GameCard({ tag, compact = false }: GameCardProps) {
  const router = useRouter();
  const game = parseIgdbData(tag);
  const coverUrl = tag.coverUrl || (game ? getIgdbCoverUrl(game) : undefined);
  const rating = typeof tag.rating === 'number' ? tag.rating : game?.rating ?? null;
  const platforms = game ? getIgdbPlatforms(game) : '';

  if (compact) {
    return (
      <Pressable
        style={styles.compactCard}
        onPress={() => router.push(`/game/${tag.slug}`)}
      >
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.compactCover} contentFit="cover" />
        ) : (
          <View style={[styles.compactCover, styles.placeholder]}>
            <Text style={styles.placeholderText}>{tag.name[0]}</Text>
          </View>
        )}
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {tag.name}
          </Text>
          {platforms ? (
            <Text style={styles.compactMeta} numberOfLines={1}>
              {platforms}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/game/${tag.slug}`)}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.cover} contentFit="cover" />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text style={styles.placeholderText}>{tag.name[0]}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {tag.name}
        </Text>
        {typeof rating === 'number' ? (
          <Text style={styles.rating}>{Math.round(rating)}%</Text>
        ) : null}
        {platforms ? (
          <Text style={styles.meta} numberOfLines={1}>
            {platforms}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cover: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  rating: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compactCover: {
    width: 72,
    height: 92,
  },
  compactInfo: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 6,
  },
  compactTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  compactMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  placeholder: {
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontSize: 26,
    fontWeight: '800',
  },
});
