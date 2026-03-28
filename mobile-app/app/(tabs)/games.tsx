import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import { GET_GAME_TAGS } from '../../lib/queries/games';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorView from '../../components/ErrorView';
import { COLORS } from '../../constants/config';
import type { GameTag, IGDBGame } from '../../lib/types';

function parseIgdbData(tag: GameTag): IGDBGame | null {
  if (!tag.igdbData) return null;
  try {
    return JSON.parse(tag.igdbData);
  } catch {
    return null;
  }
}

function GameCard({ tag }: { tag: GameTag }) {
  const router = useRouter();
  const game = parseIgdbData(tag);
  const coverUrl = game?.cover_url;
  const rating = game?.rating ? Math.round(game.rating) : null;
  const platforms = game?.platforms?.map((p) => p.name).join(', ');

  return (
    <Pressable style={styles.gameCard} onPress={() => router.push(`/game/${tag.slug}`)}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.gameCover} contentFit="cover" />
      ) : (
        <View style={[styles.gameCover, styles.gameCoverPlaceholder]}>
          <Text style={styles.placeholderText}>{tag.name[0]}</Text>
        </View>
      )}
      <View style={styles.gameInfo}>
        <Text style={styles.gameName} numberOfLines={2}>{tag.name}</Text>
        {rating && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{rating}%</Text>
          </View>
        )}
        {platforms && (
          <Text style={styles.platformText} numberOfLines={1}>{platforms}</Text>
        )}
      </View>
    </Pressable>
  );
}

export default function GamesScreen() {
  const [searchText, setSearchText] = useState('');
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_GAME_TAGS, {
    variables: { first: 30 },
    notifyOnNetworkStatusChange: true,
  });

  const [refreshing, setRefreshing] = useState(false);

  const tags: GameTag[] = data?.gameTags?.nodes ?? [];
  const hasNextPage = data?.gameTags?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.gameTags?.pageInfo?.endCursor;

  const filteredTags = searchText
    ? tags.filter((t) => t.name.toLowerCase().includes(searchText.toLowerCase()))
    : tags;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onEndReached = useCallback(() => {
    if (!hasNextPage || loading) return;
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
  }, [hasNextPage, loading, endCursor, fetchMore]);

  if (loading && !data) return <LoadingSpinner />;
  if (error && !data) return <ErrorView message="Failed to load games" onRetry={() => refetch()} />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Game Database" />
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter games..."
          placeholderTextColor={COLORS.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredTags}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <GameCard tag={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  list: {
    padding: 16,
    paddingTop: 4,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gameCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gameCover: {
    width: '100%',
    height: 200,
  },
  gameCoverPlaceholder: {
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontSize: 32,
    fontWeight: '700',
  },
  gameInfo: {
    padding: 10,
  },
  gameName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  platformText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
