import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { COLORS } from '../constants/config';
import type { Post } from '../lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ArticleCardProps {
  article: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const router = useRouter();
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0]?.name;
  const dateStr = article.date ? format(new Date(article.date), 'MMM d, yyyy') : '';
  const authorName = article.author?.node?.name;

  const handlePress = () => {
    router.push(`/article/${article.slug}`);
  };

  if (variant === 'compact') {
    return (
      <Pressable style={styles.compactContainer} onPress={handlePress}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.compactImage} contentFit="cover" />
        )}
        <View style={styles.compactContent}>
          {category && <Text style={styles.compactCategory}>{category}</Text>}
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.compactDate}>{dateStr}</Text>
        </View>
      </Pressable>
    );
  }

  if (variant === 'featured') {
    return (
      <Pressable style={styles.featuredContainer} onPress={handlePress}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.featuredImage} contentFit="cover" />
        )}
        <View style={styles.featuredOverlay}>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          <Text style={styles.featuredTitle} numberOfLines={3}>
            {article.title}
          </Text>
          <View style={styles.featuredMeta}>
            {authorName && <Text style={styles.metaText}>{authorName}</Text>}
            {authorName && dateStr ? <Text style={styles.metaDot}>·</Text> : null}
            <Text style={styles.metaText}>{dateStr}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Default card
  return (
    <Pressable style={styles.defaultContainer} onPress={handlePress}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.defaultImage} contentFit="cover" />
      )}
      <View style={styles.defaultContent}>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        <Text style={styles.defaultTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.defaultDate}>{dateStr}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Compact variant
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  compactImage: {
    width: 90,
    height: 90,
  },
  compactContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  compactCategory: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  compactTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  compactDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  // Featured variant
  featuredContainer: {
    width: SCREEN_WIDTH - 32,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  metaDot: {
    color: COLORS.textMuted,
    marginHorizontal: 6,
  },

  // Category badge
  categoryBadge: {
    backgroundColor: COLORS.categoryBadge,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: COLORS.categoryText,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Default variant
  defaultContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  defaultImage: {
    width: '100%',
    height: 180,
  },
  defaultContent: {
    padding: 14,
  },
  defaultTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 6,
  },
  defaultDate: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
