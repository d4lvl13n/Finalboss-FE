import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import RenderHtml from 'react-native-render-html';
import ArticleCard from '../../components/ArticleCard';
import ErrorView from '../../components/ErrorView';
import LoadingSpinner from '../../components/LoadingSpinner';
import NewsletterInline from '../../components/NewsletterInline';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import YouTubeEmbed, { getYouTubeVideoId } from '../../components/YouTubeEmbed';
import { COLORS, CONFIG } from '../../constants/config';
import { useChromeScroll } from '../../context/ChromeContext';
import { useLocalProfile } from '../../context/LocalProfileContext';
import {
  getArticleDek,
  getContentTypeForPost,
  getPrimaryGameTag,
} from '../../lib/feed';
import { type ArticleSnapshot } from '../../lib/localProfile';
import { fetchRelatedPosts } from '../../lib/mobileApi';
import { GET_POST_BY_SLUG } from '../../lib/queries/posts';
import type { Post } from '../../lib/types';

let customHTMLElementModels: any;
let renderers: any;
let WebViewComponent: any;

if (Platform.OS !== 'web') {
  try {
    const iframePlugin = require('@native-html/iframe-plugin');
    const webview = require('react-native-webview');
    WebViewComponent = webview.default;
    customHTMLElementModels = { iframe: iframePlugin.iframeModel };
    const DefaultIframeRenderer = iframePlugin.default;
    // Route YouTube iframes through YouTubeEmbed (loaded with a valid origin so
    // YouTube doesn't reject them with "Error 153"); any other iframe falls
    // back to the default plugin renderer.
    renderers = {
      iframe: (props: any) => {
        const videoId = getYouTubeVideoId(props?.tnode?.attributes?.src);
        if (videoId) {
          return <YouTubeEmbed videoId={videoId} />;
        }
        return <DefaultIframeRenderer {...props} />;
      },
    };
  } catch {
    // Ignore optional iframe support issues on runtimes without native modules.
  }
}

// Stable references so RenderHtml doesn't rebuild its render tree each render.
const IGNORED_STYLES: string[] = [];
const SELECTABLE_TEXT_PROPS = { selectable: true } as const;

function snapshotToPost(snapshot: ArticleSnapshot): Post {
  return {
    id: snapshot.slug,
    slug: snapshot.slug,
    title: snapshot.title,
    excerpt: snapshot.excerpt,
    content: snapshot.content,
    date: snapshot.date || new Date().toISOString(),
    mobileDek: snapshot.mobileDek,
    featuredImage: snapshot.imageUrl
      ? {
          node: {
            sourceUrl: snapshot.imageUrl,
          },
        }
      : undefined,
    author: snapshot.authorName
      ? {
          node: {
            name: snapshot.authorName,
            slug: snapshot.authorSlug,
          },
        }
      : undefined,
    categories: snapshot.categoryName
      ? {
          nodes: [
            {
              name: snapshot.categoryName,
              slug: snapshot.categorySlug || 'latest',
            },
          ],
        }
      : undefined,
    gameTags: {
      nodes: snapshot.gameTags,
    },
  };
}

function ActionButton({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active?: boolean;
  onPress: () => unknown | Promise<unknown>;
}) {
  return (
    <Pressable
      style={[styles.actionButton, active && styles.actionButtonActive]}
      onPress={() => {
        void onPress();
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? COLORS.background : COLORS.text}
      />
      <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function FollowChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => unknown | Promise<unknown>;
}) {
  return (
    <Pressable
      onPress={() => {
        void onPress();
      }}
      style={[styles.followChip, active && styles.followChipActive]}
    >
      <Text style={[styles.followChipLabel, active && styles.followChipLabelActive]}>
        {active ? 'Following' : 'Follow'} {label}
      </Text>
    </Pressable>
  );
}

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const onChromeScroll = useChromeScroll();
  const {
    profile,
    beginArticleSession,
    cacheArticle,
    isArticleSaved,
    isAuthorFollowed,
    isCategoryFollowed,
    isGameFollowed,
    openNewsletterPrompt,
    recordArticleProgress,
    toggleFollowAuthor,
    toggleFollowCategory,
    toggleFollowGame,
    toggleSaveArticle,
  } = useLocalProfile();
  const [relatedPosts, setRelatedPosts] = React.useState<Post[]>([]);
  const [relatedLoading, setRelatedLoading] = React.useState(false);
  const progressRef = React.useRef(0);
  const newsletterTriggeredRef = React.useRef(false);
  const sessionBootstrappedRef = React.useRef(false);

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_SLUG, {
    variables: { id: slug },
    skip: !slug,
  });

  const cachedSnapshot = slug ? profile.cachedArticles[slug] : undefined;
  // Memoized so a cache-derived article (revisits / offline) keeps a stable
  // identity across renders; otherwise the article-dependent effects below
  // re-fire every render and trigger "Maximum update depth exceeded".
  const article = React.useMemo(
    () => data?.post ?? (cachedSnapshot ? snapshotToPost(cachedSnapshot) : null),
    [data?.post, cachedSnapshot]
  );

  React.useEffect(() => {
    if (!slug || sessionBootstrappedRef.current) {
      return;
    }

    sessionBootstrappedRef.current = true;
    void beginArticleSession(slug);
  }, [beginArticleSession, slug]);

  React.useEffect(() => {
    // Only persist authoritative server content. Caching the cache-derived
    // article would rewrite the snapshot it was built from and loop forever.
    if (data?.post) {
      void cacheArticle(data.post);
    }
  }, [data?.post, cacheArticle]);

  React.useEffect(() => {
    if (!article) {
      return;
    }

    const timer = setTimeout(() => {
      const nextProgress = Math.max(progressRef.current, 25);
      progressRef.current = nextProgress;
      void recordArticleProgress(article, nextProgress);
    }, 10_000);

    return () => clearTimeout(timer);
  }, [article, recordArticleProgress]);

  React.useEffect(() => {
    if (!article) {
      return;
    }

    let cancelled = false;

    setRelatedLoading(true);
    fetchRelatedPosts({
      slug: article.slug,
      categorySlugs:
        article.categories?.nodes?.map((item: { slug: string }) => item.slug) ?? [],
      gameTagSlugs:
        article.gameTags?.nodes?.map((item: { slug: string }) => item.slug) ?? [],
      authorSlug: article.author?.node?.slug,
    })
      .then((result) => {
        if (!cancelled) {
          setRelatedPosts(result.posts);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRelatedPosts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRelatedLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [article]);

  const fontScale = profile.textScale === 'large' ? 1.08 : 1;

  // Memoized so scroll-driven re-renders don't rebuild the HTML render engine
  // (react-native-render-html warns about costly TRenderEngineProvider updates
  // when these props change identity on every render).
  const tagsStyles = React.useMemo(
    () => ({
      body: { color: COLORS.textSecondary, fontSize: 16 * fontScale, lineHeight: 26 * fontScale },
      p: { marginBottom: 16 },
      h1: {
        color: COLORS.text,
        fontSize: 26 * fontScale,
        fontWeight: '700' as const,
        marginTop: 24,
        marginBottom: 12,
      },
      h2: {
        color: COLORS.text,
        fontSize: 22 * fontScale,
        fontWeight: '700' as const,
        marginTop: 20,
        marginBottom: 10,
      },
      h3: {
        color: COLORS.text,
        fontSize: 18 * fontScale,
        fontWeight: '600' as const,
        marginTop: 16,
        marginBottom: 8,
      },
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
      figcaption: {
        color: COLORS.textMuted,
        fontSize: 13,
        textAlign: 'center' as const,
        marginTop: 6,
      },
    }),
    [fontScale]
  );

  const renderersProps = React.useMemo(
    () => ({
      a: {
        onPress: (_: unknown, href: string) => {
          if (href) {
            void WebBrowser.openBrowserAsync(href);
          }
        },
      },
      img: {
        enableExperimentalPercentWidth: true,
      },
      ...(WebViewComponent
        ? {
            iframe: {
              scalesPageToFit: true,
              webViewProps: {
                allowsFullscreenVideo: true,
              },
            },
          }
        : {}),
    }),
    []
  );

  const htmlSource = React.useMemo(() => ({ html: article?.content ?? '' }), [article]);

  if (loading && !article) {
    return <LoadingSpinner />;
  }

  if ((error || !article) && !cachedSnapshot) {
    return <ErrorView message="Article not found" onRetry={() => refetch()} />;
  }

  if (!article) {
    return null;
  }

  const imageUrl = article.featuredImage?.node?.sourceUrl;
  const category = article.categories?.nodes?.[0];
  const primaryGameTag = getPrimaryGameTag(article);
  const author = article.author?.node;
  const dateStr = article.date ? format(new Date(article.date), 'MMMM d, yyyy') : '';
  const authorAvatar = article.author?.node?.avatar?.url;
  const articleUrl = `${CONFIG.SITE_URL}/${article.slug}`;
  const saved = isArticleSaved(article.slug);
  const followingGame = primaryGameTag ? isGameFollowed(primaryGameTag.slug) : false;
  const followingCategory = category ? isCategoryFollowed(category.slug) : false;
  const followingAuthor = author?.slug ? isAuthorFollowed(author.slug) : false;
  const contentType = getContentTypeForPost(article);
  const isGuideOrReview = contentType === 'guides' || contentType === 'reviews';
  const displayCopy =
    cachedSnapshot && !data?.post ? 'Offline copy available' : getArticleDek(article);

  const handleShare = async () => {
    await Share.share({
      title: article.title,
      url: articleUrl,
      message: `${article.title} - ${articleUrl}`,
    });
  };

  const handleOpenInBrowser = async () => {
    await WebBrowser.openBrowserAsync(articleUrl);
  };

  const handleMainFollow = async () => {
    if (primaryGameTag) {
      await toggleFollowGame(primaryGameTag.slug);
      return;
    }

    if (category?.slug) {
      await toggleFollowCategory(category.slug);
      return;
    }

    if (author?.slug) {
      await toggleFollowAuthor(author.slug);
    }
  };

  const mainFollowActive = primaryGameTag
    ? followingGame
    : category?.slug
    ? followingCategory
    : author?.slug
    ? followingAuthor
    : false;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onChromeScroll(event);
    const {
      contentOffset,
      contentSize,
      layoutMeasurement,
    } = event.nativeEvent;
    const maxScrollableHeight = contentSize.height - layoutMeasurement.height;

    if (maxScrollableHeight <= 0) {
      return;
    }

    const progress = Math.max(
      0,
      Math.min(100, (contentOffset.y / maxScrollableHeight) * 100)
    );

    if (
      progress >= 90 ||
      progressRef.current === 0 ||
      progress >= progressRef.current + 10 ||
      (progressRef.current < 25 && progress >= 25)
    ) {
      progressRef.current = progress;
      void recordArticleProgress(article, progress);
    }

    if (isGuideOrReview && progress >= 60 && !newsletterTriggeredRef.current) {
      newsletterTriggeredRef.current = true;
      openNewsletterPrompt('article');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Story"
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="cover" />
        ) : null}

        <View style={styles.content}>
          {category ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ) : null}

          <Text style={[styles.title, { fontSize: 30 * fontScale, lineHeight: 36 * fontScale }]}>
            {article.title}
          </Text>
          <Text style={styles.dek}>{displayCopy}</Text>

          <View style={styles.meta}>
            <View style={styles.metaIdentity}>
              {authorAvatar ? (
                <Image source={{ uri: authorAvatar }} style={styles.avatar} contentFit="cover" />
              ) : null}
              <View>
                {author?.name ? <Text style={styles.authorName}>{author.name}</Text> : null}
                <Text style={styles.date}>{dateStr}</Text>
              </View>
            </View>
            {cachedSnapshot && !data?.post ? (
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>Offline</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.actionRow}>
            <ActionButton
              icon={saved ? 'bookmark' : 'bookmark-outline'}
              label={saved ? 'Saved' : 'Save'}
              active={saved}
              onPress={() => toggleSaveArticle(article)}
            />
            {(primaryGameTag || category?.slug || author?.slug) ? (
              <ActionButton
                icon={mainFollowActive ? 'notifications' : 'notifications-outline'}
                label={mainFollowActive ? 'Following' : 'Follow'}
                active={mainFollowActive}
                onPress={handleMainFollow}
              />
            ) : null}
            <ActionButton icon="share-outline" label="Share" onPress={handleShare} />
          </View>

          <View style={styles.followChips}>
            {primaryGameTag ? (
              <FollowChip
                label={primaryGameTag.name}
                active={followingGame}
                onPress={() => toggleFollowGame(primaryGameTag.slug)}
              />
            ) : null}
            {category?.slug ? (
              <FollowChip
                label={category.name}
                active={followingCategory}
                onPress={() => toggleFollowCategory(category.slug)}
              />
            ) : null}
            {author?.slug ? (
              <FollowChip
                label={author.name}
                active={followingAuthor}
                onPress={() => toggleFollowAuthor(author.slug)}
              />
            ) : null}
          </View>

          {article.content ? (
            <RenderHtml
              contentWidth={width - 32}
              source={htmlSource}
              tagsStyles={tagsStyles}
              ignoredStyles={IGNORED_STYLES}
              emSize={16}
              {...(customHTMLElementModels && {
                customHTMLElementModels,
              })}
              {...(renderers && { renderers })}
              {...(WebViewComponent ? { WebView: WebViewComponent } : {})}
              enableExperimentalMarginCollapsing
              renderersProps={renderersProps}
              defaultTextProps={SELECTABLE_TEXT_PROPS}
            />
          ) : null}

          <View style={styles.endCap}>
            <SectionHeader title="Stay On This Story" />
            <Text style={styles.endCapText}>
              Keep FinalBoss working like a daily habit instead of a one-off read.
            </Text>
            {(primaryGameTag || category?.slug) ? (
              <Pressable
                style={styles.primaryCta}
                onPress={() => {
                  void handleMainFollow();
                }}
              >
                <Ionicons name="notifications-outline" size={18} color={COLORS.background} />
                <Text style={styles.primaryCtaText}>
                  {mainFollowActive ? 'Alerts Enabled' : 'Get Alerts'}
                </Text>
              </Pressable>
            ) : null}
            <NewsletterInline source="article" />
          </View>

          <View style={styles.relatedSection}>
            <SectionHeader title="Next Up" />
            {relatedLoading && relatedPosts.length === 0 ? <LoadingSpinner inline /> : null}
            {relatedPosts.map((post) => (
              <ArticleCard key={post.id} article={post} variant="compact" />
            ))}
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
  heroImage: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 16,
    gap: 18,
  },
  categoryBadge: {
    backgroundColor: COLORS.categoryBadge,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
    fontWeight: '800',
  },
  dek: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: -4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  metaIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  offlineBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offlineBadgeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  actionLabelActive: {
    color: COLORS.background,
  },
  followChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  followChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  followChipActive: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    backgroundColor: 'rgba(74, 222, 128, 0.14)',
  },
  followChipLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  followChipLabelActive: {
    color: COLORS.success,
  },
  endCap: {
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  endCapText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  endCapButtons: {
    gap: 10,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
  },
  primaryCtaText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 15,
  },
  secondaryCtaText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  relatedSection: {
    gap: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
