import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';
import GameCard from '../../components/GameCard';
import ScreenHeader from '../../components/ScreenHeader';
import SectionHeader from '../../components/SectionHeader';
import { useLazyQuery, useQuery } from '@apollo/client';
import { COLORS } from '../../constants/config';
import { useLocalProfile } from '../../context/LocalProfileContext';
import { filterGameTagsByQuery } from '../../lib/gameCatalog';
import { fetchCombinedSearch } from '../../lib/mobileApi';
import { GET_GAME_TAGS } from '../../lib/queries/games';
import { SEARCH_POSTS } from '../../lib/queries/posts';
import type { GameTag, Post } from '../../lib/types';

export default function SearchScreen() {
  const { profile, addRecentSearch, clearRecentSearches } = useLocalProfile();
  const [query, setQuery] = React.useState('');
  const [articles, setArticles] = React.useState<Post[]>([]);
  const [games, setGames] = React.useState<GameTag[]>([]);
  const [loading, setLoading] = React.useState(false);
  const lastLoggedSearchRef = React.useRef('');
  const latestRequestRef = React.useRef(0);
  const [searchArticles] = useLazyQuery(SEARCH_POSTS, {
    fetchPolicy: 'no-cache',
  });
  const { data: gameCatalogData } = useQuery(GET_GAME_TAGS, {
    variables: { first: 250 },
  });
  const catalogGames = React.useMemo<GameTag[]>(
    () => gameCatalogData?.gameTags?.nodes ?? [],
    [gameCatalogData]
  );

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setArticles([]);
      setGames([]);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      try {
        setLoading(true);
        const [articleResult, gameResult] = await Promise.all([
          searchArticles({
            variables: { searchTerm: trimmed, first: 20 },
          }),
          fetchCombinedSearch(trimmed).catch(() => ({ articles: [], games: [] })),
        ]);

        if (latestRequestRef.current !== requestId) {
          return;
        }

        const matchedArticles: Post[] = articleResult.data?.posts?.nodes ?? [];
        setArticles(matchedArticles);
        setGames(
          gameResult.games.length > 0
            ? gameResult.games
            : filterGameTagsByQuery(catalogGames, trimmed)
        );
        if (lastLoggedSearchRef.current !== trimmed) {
          lastLoggedSearchRef.current = trimmed;
          await addRecentSearch(trimmed);
        }
      } catch {
        if (latestRequestRef.current !== requestId) {
          return;
        }
        setArticles([]);
        setGames(filterGameTagsByQuery(catalogGames, trimmed));
      } finally {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [addRecentSearch, catalogGames, query, searchArticles]);

  const hasQuery = query.trim().length >= 2;
  const hasResults = articles.length > 0 || games.length > 0;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Search" showSearch={false} showSettings />
      <View style={styles.searchWrap}>
        <View style={styles.searchInputWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search games, reviews, guides, and news"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {loading ? (
            <ActivityIndicator color={COLORS.accent} size="small" />
          ) : query.length > 0 ? (
            <Pressable onPress={() => setQuery('')}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!hasQuery ? (
          <>
            {profile.recentSearches.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader
                  title="Recent Searches"
                  actionLabel="Clear"
                  onAction={clearRecentSearches}
                />
                <View style={styles.recentWrap}>
                  {profile.recentSearches.map((item) => (
                    <Pressable
                      key={item}
                      style={styles.recentChip}
                      onPress={() => setQuery(item)}
                    >
                      <Text style={styles.recentText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            <EmptyState
              icon="search-outline"
              title="Search across the app"
              description="Find reviews, guides, breaking stories, and game pages without leaving the tab bar."
            />
          </>
        ) : null}

        {hasQuery && !hasResults && !loading ? (
          <EmptyState
            icon="planet-outline"
            title="No matches yet"
            description="Try another title, a franchise name, or a broader category."
          />
        ) : null}

        {articles.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Articles" />
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </View>
        ) : null}

        {games.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Games" />
            <View style={styles.gameResults}>
              {games.map((game) => (
                <GameCard key={game.slug} tag={game} compact />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  clearText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 22,
  },
  section: {
    gap: 12,
  },
  recentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentChip: {
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recentText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  gameResults: {
    gap: 12,
  },
});
