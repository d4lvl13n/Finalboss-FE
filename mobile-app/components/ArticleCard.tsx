import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Linking,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CONFIG } from '../constants/config';
import { getArticleDek } from '../lib/feed';
import { useLocalProfile } from '../context/LocalProfileContext';
import type { Post } from '../lib/types';

interface ArticleCardProps {
  article: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { toggleSaveArticle, isArticleSaved } = useLocalProfile();
  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0]?.name;
  const dateStr = article.date ? format(new Date(article.date), 'MMM d, yyyy') : '';
  const authorName = article.author?.node?.name;
  const saved = isArticleSaved(article.slug);
  const articleUrl = `${CONFIG.SITE_URL}/${article.slug}`;

  const handlePress = () => {
    router.push(`/article/${article.slug}`);
  };

  const handleShare = async () => {
    await Share.share({
      title: article.title,
      message: `${article.title} - ${articleUrl}`,
      url: articleUrl,
    });
  };

  const handleInlineSave = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    await toggleSaveArticle(article);
  };

  const handleInlineShare = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    await handleShare();
  };

  const openActions = () => {
    const saveLabel = saved ? 'Remove from Library' : 'Save for Later';
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [saveLabel, 'Share', 'Open in Browser', 'Cancel'],
          cancelButtonIndex: 3,
        },
        async (selectedIndex) => {
          if (selectedIndex === 0) await toggleSaveArticle(article);
          if (selectedIndex === 1) await handleShare();
          if (selectedIndex === 2) await Linking.openURL(articleUrl);
        }
      );
      return;
    }

    Alert.alert(article.title, undefined, [
      {
        text: saveLabel,
        onPress: () => {
          toggleSaveArticle(article);
        },
      },
      {
        text: 'Share',
        onPress: () => {
          handleShare();
        },
      },
      {
        text: 'Open in Browser',
        onPress: () => {
          Linking.openURL(articleUrl);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (variant === 'compact') {
    return (
      <Pressable style={styles.compactContainer} onPress={handlePress} onLongPress={openActions}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.compactImage} contentFit="cover" />
        )}
        <View style={styles.compactContent}>
          {category && <Text style={styles.compactCategory}>{category}</Text>}
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.compactFooter}>
            <Text style={styles.compactDate}>{dateStr}</Text>
            <View style={styles.inlineActions}>
              <Pressable onPress={handleInlineSave} style={styles.smallAction}>
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={saved ? COLORS.accent : COLORS.textMuted}
                />
              </Pressable>
              <Pressable onPress={handleInlineShare} style={styles.smallAction}>
                <Ionicons name="share-outline" size={16} color={COLORS.textMuted} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === 'featured') {
    return (
      <Pressable
        style={[styles.featuredContainer, { width: SCREEN_WIDTH - 32 }]}
        onPress={handlePress}
        onLongPress={openActions}
      >
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.featuredImage} contentFit="cover" />
        )}
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredTopRow}>
            <View style={styles.featuredTopSpacer} />
            <View style={styles.featuredActions}>
              <Pressable onPress={handleInlineSave} style={styles.overlayAction}>
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={saved ? COLORS.accent : COLORS.text}
                />
              </Pressable>
              <Pressable onPress={handleInlineShare} style={styles.overlayAction}>
                <Ionicons name="share-outline" size={18} color={COLORS.text} />
              </Pressable>
            </View>
          </View>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          <Text style={styles.featuredTitle} numberOfLines={3}>
            {article.title}
          </Text>
          <Text style={styles.featuredDek} numberOfLines={2}>
            {getArticleDek(article)}
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
    <Pressable style={styles.defaultContainer} onPress={handlePress} onLongPress={openActions}>
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
        <Text style={styles.defaultExcerpt} numberOfLines={2}>
          {getArticleDek(article)}
        </Text>
        <View style={styles.defaultFooter}>
          <Text style={styles.defaultDate}>{dateStr}</Text>
          <View style={styles.inlineActions}>
            <Pressable onPress={handleInlineSave} style={styles.smallAction}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={saved ? COLORS.accent : COLORS.textMuted}
              />
            </Pressable>
            <Pressable onPress={handleInlineShare} style={styles.smallAction}>
              <Ionicons name="share-outline" size={18} color={COLORS.textMuted} />
            </Pressable>
          </View>
        </View>
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
    justifyContent: 'space-between',
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
  },
  compactFooter: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Featured variant
  featuredContainer: {
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
    justifyContent: 'space-between',
    padding: 16,
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredTopSpacer: {
    flex: 1,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 8,
  },
  overlayAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,16,32,0.55)',
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 8,
  },
  featuredDek: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
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
  defaultExcerpt: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  defaultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultDate: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  inlineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
