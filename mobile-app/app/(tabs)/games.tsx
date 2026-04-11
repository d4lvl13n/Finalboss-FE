import React from 'react';
import {
  ActivityIndicator,
  Linking,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';
import GameCard from '../../components/GameCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScreenHeader from '../../components/ScreenHeader';
import SelectionChip from '../../components/SelectionChip';
import { COLORS } from '../../constants/config';
import { useChromeScroll } from '../../context/ChromeContext';
import { filterGameTagsByQuery } from '../../lib/gameCatalog';
import { fetchCombinedSearch, fetchUpcomingGames, resolveGameSlug } from '../../lib/mobileApi';
import { GET_GAME_TAGS } from '../../lib/queries/games';
import type { GameTag, IGDBGame } from '../../lib/types';

export default function GamesScreen() {
  const onChromeScroll = useChromeScroll();
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<GameTag[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [upcomingGames, setUpcomingGames] = React.useState<IGDBGame[]>([]);
  const [upcomingLoading, setUpcomingLoading] = React.useState(true);
  const [upcomingError, setUpcomingError] = React.useState(false);
  const [filtersVisible, setFiltersVisible] = React.useState(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_GAME_TAGS, {
    variables: { first: 250 },
    notifyOnNetworkStatusChange: true,
  });

  const tags: GameTag[] = React.useMemo(() => data?.gameTags?.nodes ?? [], [data?.gameTags?.nodes]);
  const hasNextPage = data?.gameTags?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.gameTags?.pageInfo?.endCursor;
  const upcomingSections = React.useMemo(() => groupUpcomingGames(upcomingGames), [upcomingGames]);
  const [monthFilter, setMonthFilter] = React.useState('All');
  const [platformFilter, setPlatformFilter] = React.useState('All');
  const [genreFilter, setGenreFilter] = React.useState('All');

  const monthOptions = React.useMemo(() => ['All', ...getMonthOptions(upcomingGames)], [upcomingGames]);
  const platformOptions = React.useMemo(
    () => ['All', ...getPlatformOptions(upcomingGames)],
    [upcomingGames]
  );
  const genreOptions = React.useMemo(() => ['All', ...getGenreOptions(upcomingGames)], [upcomingGames]);

  const filteredUpcomingGames = React.useMemo(() => {
    return upcomingGames.filter((game) => {
      const matchesMonth =
        monthFilter === 'All' || formatMonthTitle(game.release_date) === monthFilter;
      const matchesPlatform =
        platformFilter === 'All' ||
        (game.platforms?.some((platform) =>
          (typeof platform === 'string' ? platform : platform.name || '') === platformFilter
        ) ?? false);
      const matchesGenre =
        genreFilter === 'All' || (game.genres?.includes(genreFilter) ?? false);

      return matchesMonth && matchesPlatform && matchesGenre;
    });
  }, [genreFilter, monthFilter, platformFilter, upcomingGames]);

  const filteredUpcomingSections = React.useMemo(
    () => groupUpcomingGames(filteredUpcomingGames),
    [filteredUpcomingGames]
  );
  const loadUpcomingGames = React.useCallback(async () => {
    try {
      setUpcomingLoading(true);
      setUpcomingError(false);
      const nextGames = await fetchUpcomingGames(24);
      setUpcomingGames(nextGames);
    } catch {
      setUpcomingError(true);
      setUpcomingGames([]);
    } finally {
      setUpcomingLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadUpcomingGames();
  }, [loadUpcomingGames]);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const result = await fetchCombinedSearch(trimmed);
        const fallbackResults = filterGameTagsByQuery(tags, trimmed);
        const mergedResults = [...result.games, ...fallbackResults].filter(
          (game, index, collection) =>
            collection.findIndex((entry) => entry.slug === game.slug) === index
        );
        setSearchResults(mergedResults);
      } catch {
        setSearchResults(filterGameTagsByQuery(tags, trimmed));
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, tags]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), loadUpcomingGames()]);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!hasNextPage || loading || query.trim().length >= 2 || tags.length >= 250) {
      return;
    }

    fetchMore({
      variables: { after: endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          gameTags: {
            ...fetchMoreResult.gameTags,
            nodes: [...prev.gameTags.nodes, ...fetchMoreResult.gameTags.nodes],
          },
        };
      },
    });
  };

  if (loading && tags.length === 0 && upcomingLoading) {
    return <LoadingSpinner />;
  }

  if (error && tags.length === 0 && upcomingError) {
    return <ErrorView message="Failed to load games" onRetry={() => refetch()} />;
  }

  const isSearching = query.trim().length >= 2;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Games" showSearch={false} showSettings />
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search the game database…"
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchLoading ? (
            <ActivityIndicator size="small" color={COLORS.accent} />
          ) : null}
        </View>
      </View>
      {isSearching ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.slug}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <GameCard tag={item} />}
          contentContainerStyle={styles.list}
          onScroll={onChromeScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !searchLoading ? (
              <EmptyState
                icon="game-controller-outline"
                title="No games matched that search"
                description="Try another game title or franchise name."
              />
            ) : null
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.calendarContent}
          onScroll={onChromeScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent}
            />
          }
        >
          <View style={styles.calendarTopRow}>
            <Text style={styles.calendarHeading}>Releasing Soon</Text>
            <Pressable style={styles.filterIconChip} onPress={() => setFiltersVisible(true)}>
              <Ionicons name="options-outline" size={15} color={COLORS.background} />
              <Text style={styles.filterIconChipText}>Filter</Text>
            </Pressable>
          </View>
          {upcomingLoading ? (
            <ActivityIndicator size="small" color={COLORS.accent} style={styles.calendarLoader} />
          ) : null}

          {!upcomingLoading && filteredUpcomingGames.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No upcoming releases matched"
              description="Try another month, platform, or genre filter."
            />
          ) : null}

          {filteredUpcomingSections.map((section) => (
            <View key={section.title} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{section.title}</Text>
              <View style={styles.monthList}>
                {section.games.map((game) => (
                  <UpcomingReleaseCard key={String(game.id ?? game.name)} game={game} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        visible={filtersVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.overlay}>
          <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFillObject} />
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetKicker}>Release Filters</Text>
                  <Text style={styles.sheetTitle}>Tune the calendar</Text>
                </View>
                <Pressable onPress={() => setFiltersVisible(false)} style={styles.sheetClose}>
                  <Ionicons name="close" size={20} color={COLORS.text} />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.sheetContent}>
                <Text style={styles.filterLabel}>Month</Text>
                <View style={styles.sheetChipWrap}>
                  {monthOptions.map((option) => (
                    <SelectionChip
                      key={option}
                      label={option}
                      selected={monthFilter === option}
                      onPress={() => setMonthFilter(option)}
                    />
                  ))}
                </View>

                <Text style={styles.filterLabel}>Platform</Text>
                <View style={styles.sheetChipWrap}>
                  {platformOptions.map((option) => (
                    <SelectionChip
                      key={option}
                      label={option}
                      selected={platformFilter === option}
                      onPress={() => setPlatformFilter(option)}
                    />
                  ))}
                </View>

                <Text style={styles.filterLabel}>Genre</Text>
                <View style={styles.sheetChipWrap}>
                  {genreOptions.map((option) => (
                    <SelectionChip
                      key={option}
                      label={option}
                      selected={genreFilter === option}
                      onPress={() => setGenreFilter(option)}
                    />
                  ))}
                </View>
              </ScrollView>

              <View style={styles.sheetActions}>
                <Pressable
                  style={styles.resetButton}
                  onPress={() => {
                    setMonthFilter('All');
                    setPlatformFilter('All');
                    setGenreFilter('All');
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </Pressable>
                <Pressable style={styles.applyButton} onPress={() => setFiltersVisible(false)}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

function formatReleaseDate(value?: string) {
  if (!value) {
    return 'Date TBA';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Date TBA';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMonthTitle(value?: string) {
  if (!value) {
    return 'Coming Up';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Coming Up';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function getMonthOptions(games: IGDBGame[]): string[] {
  return Array.from(new Set(games.map((game) => formatMonthTitle(game.release_date))));
}

function getPlatformOptions(games: IGDBGame[]): string[] {
  return Array.from(
    new Set(
      games.flatMap((game) =>
        game.platforms?.map((platform) =>
          typeof platform === 'string' ? platform : platform.name || ''
        ) ?? []
      )
    )
  )
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right));
}

function getGenreOptions(games: IGDBGame[]): string[] {
  return Array.from(
    new Set(games.flatMap((game) => game.genres ?? []).filter((value): value is string => Boolean(value)))
  ).sort((left, right) => left.localeCompare(right));
}

function formatPlatforms(game: IGDBGame) {
  const platforms =
    game.platforms
      ?.map((platform) => (typeof platform === 'string' ? platform : platform.name || ''))
      .filter(Boolean) ?? [];

  if (platforms.length <= 3) {
    return platforms.join(' • ');
  }

  return `${platforms.slice(0, 3).join(' • ')} +${platforms.length - 3}`;
}

function getPlatformBadges(game: IGDBGame) {
  const platforms =
    game.platforms
      ?.map((platform) => (typeof platform === 'string' ? platform : platform.name || ''))
      .filter(Boolean) ?? [];

  const seen = new Set<string>();

  return platforms
    .map((platform) => {
      const lower = platform.toLowerCase();

      if (lower.includes('windows') || lower === 'pc') {
        return { key: 'windows', icon: 'logo-windows', label: 'PC' as const };
      }
      if (lower.includes('ios') || lower.includes('mac')) {
        return { key: 'apple', icon: 'logo-apple', label: lower.includes('ios') ? 'iOS' : 'Mac' };
      }
      if (lower.includes('android')) {
        return { key: 'android', icon: 'logo-android', label: 'Android' as const };
      }
      if (lower.includes('playstation') || lower.includes('ps')) {
        return { key: platform, label: 'PS' as const };
      }
      if (lower.includes('xbox')) {
        return { key: platform, label: 'XB' as const };
      }
      if (lower.includes('switch') || lower.includes('nintendo')) {
        return { key: platform, label: 'NS' as const };
      }

      return { key: platform, label: platform.slice(0, 3).toUpperCase() };
    })
    .filter((badge) => {
      if (seen.has(badge.key)) {
        return false;
      }
      seen.add(badge.key);
      return true;
    })
    .slice(0, 5);
}

function groupUpcomingGames(games: IGDBGame[]) {
  const sections = new Map<string, IGDBGame[]>();

  for (const game of games) {
    const key = formatMonthTitle(game.release_date);
    const bucket = sections.get(key) ?? [];
    bucket.push(game);
    sections.set(key, bucket);
  }

  return Array.from(sections.entries()).map(([title, bucket]) => ({
    title,
    games: bucket,
  }));
}

function UpcomingReleaseCard({ game }: { game: IGDBGame }) {
  const router = useRouter();
  const [opening, setOpening] = React.useState(false);
  const coverUrl = game.cover_url;
  const platformBadges = getPlatformBadges(game);
  const genreLabel = game.genres?.slice(0, 2).join(' • ');
  const description = game.description?.replace(/\s+/g, ' ').trim();

  const handlePress = async () => {
    if (opening) {
      return;
    }

    try {
      setOpening(true);
      const slug = await resolveGameSlug(game);
      router.push(`/game/${slug}`);
    } catch {
      if (game.id) {
        await Linking.openURL(`https://finalboss.io/game/${game.id}`);
      }
    } finally {
      setOpening(false);
    }
  };

  return (
    <Pressable style={styles.releaseCard} onPress={() => void handlePress()} disabled={opening}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.releaseCover} contentFit="cover" />
      ) : (
        <View style={[styles.releaseCover, styles.releasePlaceholder]}>
          <Text style={styles.releasePlaceholderText}>{game.name[0]}</Text>
        </View>
      )}
      <View style={styles.releaseContent}>
        <View style={styles.releaseHeaderRow}>
          <View style={styles.releaseBadge}>
            <Text style={styles.releaseBadgeText}>{formatReleaseDate(game.release_date)}</Text>
          </View>
        </View>
        <Text style={styles.releaseTitle} numberOfLines={2}>
          {game.name}
        </Text>
        {platformBadges.length ? (
          <View style={styles.platformBadgeRow}>
            {platformBadges.map((platform) => (
              <View key={platform.key} style={styles.platformBadge}>
                {'icon' in platform ? (
                  <Ionicons
                    name={platform.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={13}
                    color={COLORS.textSecondary}
                  />
                ) : null}
                <Text style={styles.platformBadgeText}>{platform.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {genreLabel ? (
          <Text style={styles.releaseGenres} numberOfLines={1}>
            {genreLabel}
          </Text>
        ) : null}
        {description ? (
          <Text style={styles.releaseDescription} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
        {opening ? (
          <View style={styles.releaseLoadingRow}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.releaseLoadingText}>Opening game</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  calendarContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 20,
  },
  calendarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  calendarHeading: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 0,
  },
  calendarLoader: {
    marginTop: 20,
  },
  filterLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  filterIconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
  filterIconChipText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: {
    maxHeight: '82%',
    borderRadius: 28,
    backgroundColor: '#101725',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 22,
    paddingBottom: 14,
  },
  sheetKicker: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sheetTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  sheetContent: {
    paddingHorizontal: 22,
    paddingBottom: 18,
    gap: 10,
  },
  sheetChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 22,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  resetButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  monthSection: {
    gap: 10,
  },
  monthTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  monthList: {
    gap: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  releaseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    minHeight: 156,
  },
  releaseCover: {
    width: '40%',
    minHeight: 156,
    backgroundColor: COLORS.surfaceLight,
  },
  releasePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  releasePlaceholderText: {
    color: COLORS.textMuted,
    fontSize: 34,
    fontWeight: '800',
  },
  releaseContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 5,
  },
  releaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  releaseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.categoryBadge,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  releaseBadgeText: {
    color: COLORS.categoryText,
    fontSize: 12,
    fontWeight: '800',
  },
  releaseBody: {
    gap: 4,
  },
  releaseTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 21,
  },
  platformBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  platformBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  releaseGenres: {
    color: COLORS.categoryText,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
  },
  releaseDescription: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  releaseLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  releaseLoadingText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
