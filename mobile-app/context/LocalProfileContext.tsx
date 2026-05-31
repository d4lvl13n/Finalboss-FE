import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { PropsWithChildren } from 'react';
import NewsletterPromptSheet from '../components/NewsletterPromptSheet';
import PushPermissionSheet from '../components/PushPermissionSheet';
import { triggerHaptic } from '../lib/haptics';
import { requestInAppReview } from '../lib/review';
import {
  getDefaultLocalProfile,
  loadLocalProfile,
  persistLocalProfile,
  type ArticleProgress,
  type ArticleSnapshot,
  type ContentType,
  type GameSnapshot,
  type LocalProfile,
  type OnboardingSelections,
  type PushStatus,
  type TextScale,
} from '../lib/localProfile';
import {
  getInterestLabels,
  logMobileEvent,
  registerPushToken,
  subscribeToNewsletter,
  syncInstall,
  syncPreferences,
} from '../lib/mobileApi';
import type { Post } from '../lib/types';

let NotificationsModule: typeof import('expo-notifications') | null = null;
const isExpoGo = Constants.appOwnership === 'expo';

function loadNotificationsModule() {
  if (isExpoGo) {
    return null;
  }

  try {
    const dynamicRequire = globalThis.eval?.('require') as
      | ((value: string) => typeof import('expo-notifications'))
      | undefined;

    if (!dynamicRequire) {
      return null;
    }

    return dynamicRequire('expo-notifications');
  } catch {
    return null;
  }
}

NotificationsModule = loadNotificationsModule();

type PromptReason =
  | 'save'
  | 'follow'
  | 'article'
  | 'library'
  | 'manual'
  | 'auto'
  | null;

interface LocalProfileContextValue {
  profile: LocalProfile;
  hydrated: boolean;
  newsletterPromptReason: PromptReason;
  pushPromptVisible: boolean;
  savedArticles: ArticleSnapshot[];
  continueReading: ArticleProgress[];
  savedGames: GameSnapshot[];
  isArticleSaved: (slug: string) => boolean;
  isGameSaved: (slug: string) => boolean;
  isGameFollowed: (slug: string) => boolean;
  isCategoryFollowed: (slug: string) => boolean;
  isAuthorFollowed: (slug: string) => boolean;
  cacheArticle: (article: Post) => Promise<void>;
  toggleSaveArticle: (article: Post | ArticleSnapshot) => Promise<boolean>;
  toggleSaveGame: (game: GameSnapshot) => Promise<boolean>;
  toggleFollowGame: (slug: string) => Promise<boolean>;
  toggleFollowCategory: (slug: string) => Promise<boolean>;
  toggleFollowAuthor: (slug: string) => Promise<boolean>;
  beginArticleSession: (slug: string) => Promise<void>;
  recordArticleProgress: (
    article: Post | ArticleSnapshot,
    progress: number
  ) => Promise<void>;
  addRecentSearch: (query: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  clearCache: () => Promise<void>;
  setDigestHour: (hour: number) => Promise<void>;
  setHapticsEnabled: (enabled: boolean) => Promise<void>;
  setTextScale: (scale: TextScale) => Promise<void>;
  openNewsletterPrompt: (reason: Exclude<PromptReason, null>) => void;
  closeNewsletterPrompt: () => Promise<void>;
  setNewsletterSubscribed: () => Promise<void>;
  submitNewsletter: (email: string, source?: string) => Promise<void>;
  dismissPushPrompt: () => Promise<void>;
  requestPushPermission: () => Promise<void>;
}

const LocalProfileContext = React.createContext<LocalProfileContextValue | null>(null);

function toArticleSnapshot(article: Post | ArticleSnapshot): ArticleSnapshot {
  if ('savedAt' in article) {
    return article;
  }

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    date: article.date,
    imageUrl: article.featuredImage?.node?.sourceUrl,
    authorName: article.author?.node?.name,
    authorSlug: article.author?.node?.slug,
    categoryName: article.categories?.nodes?.[0]?.name,
    categorySlug: article.categories?.nodes?.[0]?.slug,
    mobileDek: article.mobileDek,
    gameTags: article.gameTags?.nodes?.map((tag) => ({ name: tag.name, slug: tag.slug })) ?? [],
    savedAt: new Date().toISOString(),
  };
}

function uniqueRecentSearches(values: string[], nextValue?: string) {
  const next = nextValue ? [nextValue.trim(), ...values] : values;
  return Array.from(new Set(next.filter(Boolean))).slice(0, 8);
}

export function LocalProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = React.useState<LocalProfile>(getDefaultLocalProfile());
  const [hydrated, setHydrated] = React.useState(false);
  const [newsletterPromptReason, setNewsletterPromptReason] =
    React.useState<PromptReason>(null);
  const [pushPromptVisible, setPushPromptVisible] = React.useState(false);
  const openedArticlesRef = React.useRef<Set<string>>(new Set());

  const savedArticles = React.useMemo(
    () =>
      profile.savedArticleSlugs
        .map((slug) => profile.cachedArticles[slug])
        .filter(Boolean)
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt)),
    [profile.cachedArticles, profile.savedArticleSlugs]
  );

  const continueReading = React.useMemo(
    () =>
      Object.values(profile.recentArticleProgress)
        .filter((entry) => !entry.completed)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [profile.recentArticleProgress]
  );

  const savedGames = React.useMemo(
    () =>
      profile.savedGameSlugs
        .map((slug) => profile.savedGames[slug])
        .filter(Boolean)
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt)),
    [profile.savedGameSlugs, profile.savedGames]
  );

  React.useEffect(() => {
    let mounted = true;

    loadLocalProfile()
      .then((storedProfile) => {
        if (!mounted) {
          return;
        }
        setProfile(storedProfile);
        // Register the install with the backend on launch (previously this only
        // happened when onboarding completed). Best-effort; the app works
        // fully without it.
        syncInstall(storedProfile).catch(() => {});
      })
      .finally(() => {
        if (mounted) {
          setHydrated(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    persistLocalProfile(profile).catch((error) => {
      console.warn('Failed to persist local profile', error);
    });
  }, [hydrated, profile]);

  React.useEffect(() => {
    if (Platform.OS === 'android' && NotificationsModule) {
      NotificationsModule.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: NotificationsModule.AndroidImportance.DEFAULT,
      }).catch(() => {
        // Ignore channel failures on unsupported runtimes.
      });
    }
  }, []);

  const updateProfile = React.useCallback(
    (updater: (current: LocalProfile) => LocalProfile) =>
      // Resolve once the state updater has actually run so callers awaiting the
      // result (save/follow/onboarding sync) always observe the committed
      // profile instead of relying on React's eager-state optimization.
      new Promise<LocalProfile>((resolve) => {
        setProfile((current) => {
          const next = updater(current);
          resolve(next);
          return next;
        });
      }),
    []
  );

  const maybeOpenNewsletterPrompt = React.useCallback(
    (reason: Exclude<PromptReason, null>, current: LocalProfile) => {
      if (current.newsletterStatus === 'subscribed') {
        return;
      }

      if (current.lastNewsletterPromptAt) {
        const lastPrompt = new Date(current.lastNewsletterPromptAt);
        const hoursSincePrompt =
          (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60);

        if (hoursSincePrompt < 12 && reason !== 'manual') {
          return;
        }
      }

      setNewsletterPromptReason(reason);
    },
    []
  );

  const maybeOpenPushPrompt = React.useCallback((current: LocalProfile) => {
    if (!NotificationsModule) {
      return;
    }

    if (current.pushStatus !== 'unknown') {
      return;
    }

    if (current.lastPushPromptAt) {
      const lastPrompt = new Date(current.lastPushPromptAt);
      const hoursSincePrompt =
        (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60);

      if (hoursSincePrompt < 12) {
        return;
      }
    }

    setPushPromptVisible(true);
  }, []);

  // Keep a live reference to the latest profile so the delayed auto-prompt
  // evaluates current eligibility (subscribed / throttle) when it fires.
  const profileRef = React.useRef(profile);
  profileRef.current = profile;

  const autoPromptScheduledRef = React.useRef(false);

  // Slide the free-game-keys signup sheet up a few seconds after the app
  // settles — the iOS share-sheet style moment, throttled like every other
  // newsletter prompt so it never nags a subscriber or a recent dismisser.
  React.useEffect(() => {
    if (!hydrated || autoPromptScheduledRef.current) {
      return;
    }

    autoPromptScheduledRef.current = true;
    const timer = setTimeout(() => {
      maybeOpenNewsletterPrompt('auto', profileRef.current);
    }, 4000);

    return () => clearTimeout(timer);
  }, [hydrated, maybeOpenNewsletterPrompt]);

  const bestEffortLog = React.useCallback(
    (name: string, payload?: Record<string, unknown>) => {
      logMobileEvent(profile.installId, name, payload).catch(() => {
        // Analytics should never block the primary action.
      });
    },
    [profile.installId]
  );

  const cacheArticle = React.useCallback(
    async (article: Post) => {
      await updateProfile((current) => ({
        ...current,
        cachedArticles: {
          ...current.cachedArticles,
          [article.slug]: toArticleSnapshot(article),
        },
      }));
    },
    [updateProfile]
  );

  const toggleSaveArticle = React.useCallback(
    async (article: Post | ArticleSnapshot) => {
      const snapshot = toArticleSnapshot(article);
      let saved = false;

      const nextProfile = await updateProfile((current) => {
        saved = !current.savedArticleSlugs.includes(snapshot.slug);
        const savedArticleSlugs = saved
          ? [...current.savedArticleSlugs, snapshot.slug]
          : current.savedArticleSlugs.filter((slug) => slug !== snapshot.slug);

        return {
          ...current,
          savedArticleSlugs,
          cachedArticles: {
            ...current.cachedArticles,
            [snapshot.slug]: {
              ...snapshot,
              savedAt: new Date().toISOString(),
            },
          },
          saveCount: saved ? current.saveCount + 1 : current.saveCount,
        };
      });

      triggerHaptic(nextProfile.hapticsEnabled, saved ? 'success' : 'light');
      bestEffortLog(saved ? 'article_saved' : 'article_unsaved', { slug: snapshot.slug });

      if (saved && nextProfile.saveCount >= 2) {
        maybeOpenNewsletterPrompt('save', nextProfile);
      }

      return saved;
    },
    [bestEffortLog, maybeOpenNewsletterPrompt, updateProfile]
  );

  const toggleSaveGame = React.useCallback(
    async (game: GameSnapshot) => {
      let saved = false;

      const nextProfile = await updateProfile((current) => {
        saved = !current.savedGameSlugs.includes(game.slug);
        const savedGameSlugs = saved
          ? [...current.savedGameSlugs, game.slug]
          : current.savedGameSlugs.filter((slug) => slug !== game.slug);

        return {
          ...current,
          savedGameSlugs,
          savedGames: {
            ...current.savedGames,
            [game.slug]: { ...game, savedAt: new Date().toISOString() },
          },
        };
      });

      triggerHaptic(nextProfile.hapticsEnabled, saved ? 'success' : 'light');
      bestEffortLog(saved ? 'game_saved' : 'game_unsaved', { slug: game.slug });
      return saved;
    },
    [bestEffortLog, updateProfile]
  );

  const updateFollowList = React.useCallback(
    async (key: 'followedGameSlugs' | 'followedCategorySlugs' | 'followedAuthorSlugs', slug: string) => {
      let followed = false;

      const nextProfile = await updateProfile((current) => {
        const currentValues = current[key];
        followed = !currentValues.includes(slug);

        return {
          ...current,
          [key]: followed
            ? [...currentValues, slug]
            : currentValues.filter((value) => value !== slug),
          followCount: followed ? current.followCount + 1 : current.followCount,
        };
      });

      triggerHaptic(nextProfile.hapticsEnabled, followed ? 'success' : 'light');
      syncPreferences(nextProfile).catch(() => {
        // Local follows are the source of truth for this release.
      });
      bestEffortLog(followed ? 'follow_added' : 'follow_removed', {
        slug,
        type: key,
      });

      if (followed && nextProfile.followCount >= 2) {
        maybeOpenNewsletterPrompt('follow', nextProfile);
        maybeOpenPushPrompt(nextProfile);
      }

      return followed;
    },
    [bestEffortLog, maybeOpenNewsletterPrompt, maybeOpenPushPrompt, updateProfile]
  );

  const toggleFollowGame = React.useCallback(
    (slug: string) => updateFollowList('followedGameSlugs', slug),
    [updateFollowList]
  );

  const toggleFollowCategory = React.useCallback(
    (slug: string) => updateFollowList('followedCategorySlugs', slug),
    [updateFollowList]
  );

  const toggleFollowAuthor = React.useCallback(
    (slug: string) => updateFollowList('followedAuthorSlugs', slug),
    [updateFollowList]
  );

  const beginArticleSession = React.useCallback(
    async (slug: string) => {
      if (openedArticlesRef.current.has(slug)) {
        return;
      }

      openedArticlesRef.current.add(slug);

      const nextProfile = await updateProfile((current) => ({
        ...current,
        articleSessionCount: current.articleSessionCount + 1,
      }));

      bestEffortLog('article_session_started', { slug });
      if (nextProfile.articleSessionCount >= 3) {
        maybeOpenPushPrompt(nextProfile);
      }
    },
    [bestEffortLog, maybeOpenPushPrompt, updateProfile]
  );

  const recordArticleProgress = React.useCallback(
    async (article: Post | ArticleSnapshot, progress: number) => {
      const snapshot = toArticleSnapshot(article);
      const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));
      const completed = normalizedProgress >= 90;
      let shouldRequestReview = false;

      await updateProfile((current) => {
        const alreadyCompleted = current.recentArticleProgress[snapshot.slug]?.completed;
        // Ask for an App Store rating once, the first time an engaged reader
        // finishes an article — a genuine delight moment, never on launch.
        shouldRequestReview =
          completed &&
          !alreadyCompleted &&
          !current.reviewRequested &&
          current.articleSessionCount >= 2;

        return {
          ...current,
          reviewRequested: current.reviewRequested || shouldRequestReview,
          cachedArticles: {
            ...current.cachedArticles,
            [snapshot.slug]: {
              ...current.cachedArticles[snapshot.slug],
              ...snapshot,
            },
          },
          recentArticleProgress: {
            ...current.recentArticleProgress,
            [snapshot.slug]: {
              slug: snapshot.slug,
              title: snapshot.title,
              progress: normalizedProgress,
              completed,
              updatedAt: new Date().toISOString(),
              imageUrl: snapshot.imageUrl,
              authorName: snapshot.authorName,
              categoryName: snapshot.categoryName,
              categorySlug: snapshot.categorySlug,
            },
          },
        };
      });

      bestEffortLog('article_progress', {
        slug: snapshot.slug,
        progress: normalizedProgress,
      });

      if (shouldRequestReview) {
        bestEffortLog('review_prompt_requested', { slug: snapshot.slug });
        // Let the reading UI settle before the system sheet appears.
        setTimeout(() => {
          void requestInAppReview();
        }, 1200);
      }
    },
    [bestEffortLog, updateProfile]
  );

  const addRecentSearch = React.useCallback(
    async (query: string) => {
      await updateProfile((current) => ({
        ...current,
        recentSearches: uniqueRecentSearches(current.recentSearches, query),
      }));
    },
    [updateProfile]
  );

  const clearRecentSearches = React.useCallback(async () => {
    await updateProfile((current) => ({
      ...current,
      recentSearches: [],
    }));
  }, [updateProfile]);

  const clearCache = React.useCallback(async () => {
    await updateProfile((current) => ({
      ...current,
      recentArticleProgress: {},
      recentSearches: [],
      cachedArticles: Object.fromEntries(
        Object.entries(current.cachedArticles).map(([slug, article]) => [
          slug,
          {
            ...article,
            content: undefined,
          },
        ])
      ),
    }));
  }, [updateProfile]);

  const setDigestHour = React.useCallback(
    async (hour: number) => {
      const boundedHour = Math.max(6, Math.min(22, hour));
      const nextProfile = await updateProfile((current) => ({
        ...current,
        digestHour: boundedHour,
      }));
      syncPreferences(nextProfile).catch(() => {
        // Ignore sync failures in mobile settings.
      });
    },
    [updateProfile]
  );

  const setHapticsEnabled = React.useCallback(
    async (enabled: boolean) => {
      await updateProfile((current) => ({
        ...current,
        hapticsEnabled: enabled,
      }));
    },
    [updateProfile]
  );

  const setTextScale = React.useCallback(
    async (scale: TextScale) => {
      await updateProfile((current) => ({
        ...current,
        textScale: scale,
      }));
    },
    [updateProfile]
  );

  const openNewsletterPrompt = React.useCallback(
    (reason: Exclude<PromptReason, null>) => {
      maybeOpenNewsletterPrompt(reason, profile);
    },
    [maybeOpenNewsletterPrompt, profile]
  );

  const closeNewsletterPrompt = React.useCallback(async () => {
    setNewsletterPromptReason(null);
    await updateProfile((current) => ({
      ...current,
      newsletterStatus:
        current.newsletterStatus === 'subscribed' ? current.newsletterStatus : 'dismissed',
      lastNewsletterPromptAt: new Date().toISOString(),
    }));
  }, [updateProfile]);

  const setNewsletterSubscribed = React.useCallback(async () => {
    setNewsletterPromptReason(null);
    await updateProfile((current) => ({
      ...current,
      newsletterStatus: 'subscribed',
      lastNewsletterPromptAt: new Date().toISOString(),
    }));
  }, [updateProfile]);

  // Shared Kit subscribe path used by every capture surface (the prompt sheet,
  // the in-article inline form, the side menu). Pipes to the same
  // /api/newsletter/subscribe → Kit v4 endpoint the website uses.
  const submitNewsletter = React.useCallback(
    async (email: string, source = 'mobile') => {
      await subscribeToNewsletter({
        email,
        installId: profile.installId,
        interests: getInterestLabels(profile),
      });
      await setNewsletterSubscribed();
      triggerHaptic(profile.hapticsEnabled, 'success');
      bestEffortLog('newsletter_subscribed', { source });
    },
    [bestEffortLog, profile, setNewsletterSubscribed]
  );

  const dismissPushPrompt = React.useCallback(async () => {
    setPushPromptVisible(false);
    await updateProfile((current) => ({
      ...current,
      pushStatus: current.pushStatus === 'granted' ? current.pushStatus : 'prompted',
      lastPushPromptAt: new Date().toISOString(),
    }));
  }, [updateProfile]);

  const requestPushPermission = React.useCallback(async () => {
    if (!NotificationsModule) {
      setPushPromptVisible(false);
      return;
    }

    try {
      const existing = await NotificationsModule.getPermissionsAsync();
      let status: PushStatus =
        existing.status === 'granted'
          ? 'granted'
          : existing.status === 'denied'
          ? 'denied'
          : 'prompted';

      if (existing.status !== 'granted') {
        const requested = await NotificationsModule.requestPermissionsAsync();
        status =
          requested.status === 'granted'
            ? 'granted'
            : requested.status === 'denied'
            ? 'denied'
            : 'prompted';
      }

      const nextProfile = await updateProfile((current) => ({
        ...current,
        pushStatus: status,
        lastPushPromptAt: new Date().toISOString(),
      }));

      setPushPromptVisible(false);

      if (status === 'granted') {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

        if (projectId) {
          const token = (
            await NotificationsModule.getExpoPushTokenAsync({ projectId })
          ).data;
          registerPushToken(nextProfile.installId, token).catch(() => {
            // Keep permission locally even if token registration fails.
          });
        }

        triggerHaptic(nextProfile.hapticsEnabled, 'success');
        bestEffortLog('push_enabled');
        syncPreferences(nextProfile).catch(() => {
          // Ignore sync failures here.
        });
        return;
      }

      bestEffortLog('push_denied');
    } catch {
      await updateProfile((current) => ({
        ...current,
        pushStatus: 'denied',
        lastPushPromptAt: new Date().toISOString(),
      }));
      setPushPromptVisible(false);
    }
  }, [bestEffortLog, updateProfile]);

  const contextValue = React.useMemo<LocalProfileContextValue>(
    () => ({
      profile,
      hydrated,
      newsletterPromptReason,
      pushPromptVisible,
      savedArticles,
      continueReading,
      savedGames,
      isArticleSaved: (slug: string) => profile.savedArticleSlugs.includes(slug),
      isGameSaved: (slug: string) => profile.savedGameSlugs.includes(slug),
      isGameFollowed: (slug: string) => profile.followedGameSlugs.includes(slug),
      isCategoryFollowed: (slug: string) => profile.followedCategorySlugs.includes(slug),
      isAuthorFollowed: (slug: string) => profile.followedAuthorSlugs.includes(slug),
      cacheArticle,
      toggleSaveArticle,
      toggleSaveGame,
      toggleFollowGame,
      toggleFollowCategory,
      toggleFollowAuthor,
      beginArticleSession,
      recordArticleProgress,
      addRecentSearch,
      clearRecentSearches,
      clearCache,
      setDigestHour,
      setHapticsEnabled,
      setTextScale,
      openNewsletterPrompt,
      closeNewsletterPrompt,
      setNewsletterSubscribed,
      submitNewsletter,
      dismissPushPrompt,
      requestPushPermission,
    }),
    [
      addRecentSearch,
      beginArticleSession,
      cacheArticle,
      clearCache,
      clearRecentSearches,
      closeNewsletterPrompt,
      continueReading,
      dismissPushPrompt,
      hydrated,
      newsletterPromptReason,
      openNewsletterPrompt,
      profile,
      pushPromptVisible,
      recordArticleProgress,
      requestPushPermission,
      savedArticles,
      savedGames,
      setDigestHour,
      setHapticsEnabled,
      setNewsletterSubscribed,
      submitNewsletter,
      setTextScale,
      toggleFollowAuthor,
      toggleFollowCategory,
      toggleFollowGame,
      toggleSaveArticle,
      toggleSaveGame,
    ]
  );

  return (
    <LocalProfileContext.Provider value={contextValue}>
      {children}
      <NewsletterPromptSheet
        visible={newsletterPromptReason !== null}
        reason={newsletterPromptReason}
        onClose={closeNewsletterPrompt}
        onSubmit={(email) => submitNewsletter(email, newsletterPromptReason ?? 'mobile')}
      />
      <PushPermissionSheet
        visible={pushPromptVisible}
        onClose={dismissPushPrompt}
        onAllow={requestPushPermission}
      />
    </LocalProfileContext.Provider>
  );
}

export function useLocalProfile() {
  const context = React.useContext(LocalProfileContext);

  if (!context) {
    throw new Error('useLocalProfile must be used inside LocalProfileProvider');
  }

  return context;
}
