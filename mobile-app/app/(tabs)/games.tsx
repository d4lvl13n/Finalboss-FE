import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@apollo/client';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';
import GameCard from '../../components/GameCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { COLORS } from '../../constants/config';
import { filterGameTagsByQuery } from '../../lib/gameCatalog';
import { fetchCombinedSearch, fetchUpcomingGames } from '../../lib/mobileApi';
import { GET_GAME_TAGS } from '../../lib/queries/games';
import type { GameTag, IGDBGame } from '../../lib/types';

export default function GamesScreen() {
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<GameTag[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [upcomingGames, setUpcomingGames] = React.useState<IGDBGame[]>([]);
  const [upcomingLoading, setUpcomingLoading] = React.useState(true);
  const [upcomingError, setUpcomingError] = React.useState(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_GAME_TAGS, {
    variables: { first: 250 },
    notifyOnNetworkStatusChange: true,
  });

  const tags: GameTag[] = React.useMemo(() => data?.gameTags?.nodes ?? [], [data?.gameTags?.nodes]);
  const hasNextPage = data?.gameTags?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.gameTags?.pageInfo?.endCursor;
  const upcomingSections = React.useMemo(() => groupUpcomingGames(upcomingGames), [upcomingGames]);

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent}
            />
          }
        >
          <View style={styles.calendarIntro}>
            <SectionHeader title="Releasing Soon" />
            <Text style={styles.calendarText}>
              Track the next wave of launches from IGDB without digging through the full catalog.
            </Text>
          </View>

          {upcomingLoading ? (
            <ActivityIndicator size="small" color={COLORS.accent} style={styles.calendarLoader} />
          ) : null}

          {!upcomingLoading && upcomingGames.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No upcoming releases loaded"
              description="Pull to refresh and try fetching the IGDB release calendar again."
            />
          ) : null}

          {upcomingSections.map((section) => (
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
  const coverUrl = game.cover_url;
  const platforms = formatPlatforms(game);
  const genreLabel = game.genres?.slice(0, 2).join(' • ');
  const description = game.description?.replace(/\s+/g, ' ').trim();

  return (
    <Pressable style={styles.releaseCard}>
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
        {platforms ? (
          <Text style={styles.releaseMeta} numberOfLines={2}>
            {platforms}
          </Text>
        ) : null}
        {genreLabel ? (
          <Text style={styles.releaseGenres} numberOfLines={1}>
            {genreLabel}
          </Text>
        ) : null}
        {description ? (
          <Text style={styles.releaseDescription} numberOfLines={2}>
            {description}
          </Text>
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
  calendarIntro: {
    marginBottom: 4,
  },
  calendarText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: -4,
  },
  calendarLoader: {
    marginTop: 20,
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
  },
  releaseCover: {
    width: 108,
    minHeight: 148,
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
    padding: 14,
    gap: 6,
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
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  releaseMeta: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  releaseGenres: {
    color: COLORS.categoryText,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  releaseDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
