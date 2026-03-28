import React from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, Share, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import RenderHtml from 'react-native-render-html';
import { GET_POST_BY_SLUG } from '../../lib/queries/posts';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import { COLORS, CONFIG } from '../../constants/config';
import type { Post } from '../../lib/types';

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_SLUG, {
    variables: { id: slug },
    skip: !slug,
  });

  const article: Post | null = data?.post ?? null;

  if (loading) return <LoadingSpinner />;
  if (error || !article) return <ErrorView message="Article not found" onRetry={() => refetch()} />;

  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0]?.name;
  const dateStr = article.date ? format(new Date(article.date), 'MMMM d, yyyy') : '';
  const authorName = article.author?.node?.name;
  const authorAvatar = article.author?.node?.avatar?.url;
  const articleUrl = `${CONFIG.SITE_URL}/${article.slug}`;

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        url: articleUrl,
        message: `${article.title} - ${articleUrl}`,
      });
    } catch {
      // User cancelled
    }
  };

  const handleOpenInBrowser = async () => {
    await WebBrowser.openBrowserAsync(articleUrl);
  };

  // Custom tag styles for HTML rendering
  const tagsStyles = {
    body: { color: COLORS.textSecondary, fontSize: 16, lineHeight: 26 },
    p: { marginBottom: 16 },
    h1: { color: COLORS.text, fontSize: 26, fontWeight: '700' as const, marginTop: 24, marginBottom: 12 },
    h2: { color: COLORS.text, fontSize: 22, fontWeight: '700' as const, marginTop: 20, marginBottom: 10 },
    h3: { color: COLORS.text, fontSize: 18, fontWeight: '600' as const, marginTop: 16, marginBottom: 8 },
    a: { color: COLORS.accent, textDecorationLine: 'none' as const },
    img: { borderRadius: 10 },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: COLORS.accent,
      paddingLeft: 16,
      marginLeft: 0,
      fontStyle: 'italic' as const,
      color: COLORS.textSecondary,
    },
    li: { color: COLORS.textSecondary, marginBottom: 6 },
    strong: { color: COLORS.text, fontWeight: '600' as const },
    figcaption: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center' as const, marginTop: 6 },
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title=""
        showBack
        showSearch={false}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable onPress={handleShare} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="share-outline" size={22} color={COLORS.text} />
            </Pressable>
            <Pressable onPress={handleOpenInBrowser} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="open-outline" size={20} color={COLORS.text} />
            </Pressable>
          </View>
        }
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="cover" />
        )}

        <View style={styles.content}>
          {/* Category */}
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Author & Date */}
          <View style={styles.meta}>
            {authorAvatar && (
              <Image source={{ uri: authorAvatar }} style={styles.avatar} contentFit="cover" />
            )}
            <View>
              {authorName && <Text style={styles.authorName}>{authorName}</Text>}
              <Text style={styles.date}>{dateStr}</Text>
            </View>
          </View>

          {/* Article Body */}
          {article.content && (
            <RenderHtml
              contentWidth={width - 32}
              source={{ html: article.content }}
              tagsStyles={tagsStyles}
              enableExperimentalMarginCollapsing
              renderersProps={{
                a: {
                  onPress: (_: unknown, href: string) => {
                    if (href) WebBrowser.openBrowserAsync(href);
                  },
                },
                img: {
                  enableExperimentalPercentWidth: true,
                },
              }}
              defaultTextProps={{ selectable: true }}
            />
          )}
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
  heroImage: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: COLORS.categoryBadge,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  categoryText: {
    color: COLORS.categoryText,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
