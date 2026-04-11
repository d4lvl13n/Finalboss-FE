import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useQuery, DocumentNode } from '@apollo/client';
import ArticleCard from './ArticleCard';
import ScreenHeader from './ScreenHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorView from './ErrorView';
import { COLORS } from '../constants/config';
import { useChromeScroll } from '../context/ChromeContext';
import type { Post } from '../lib/types';

interface ArticleListScreenProps {
  title: string;
  query: DocumentNode;
  variables?: Record<string, unknown>;
  dataPath?: string; // e.g. 'posts'
  showBack?: boolean;
}

export default function ArticleListScreen({ title, query, variables, dataPath = 'posts', showBack }: ArticleListScreenProps) {
  const onChromeScroll = useChromeScroll();
  const { data, loading, error, refetch, fetchMore } = useQuery(query, {
    variables: { first: 24, ...variables },
    notifyOnNetworkStatusChange: true,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const posts: Post[] = data?.[dataPath]?.nodes ?? [];
  const hasNextPage = data?.[dataPath]?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.[dataPath]?.pageInfo?.endCursor;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!hasNextPage || loading) return;
    fetchMore({
      variables: { after: endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          [dataPath]: {
            ...fetchMoreResult[dataPath],
            nodes: [...prev[dataPath].nodes, ...fetchMoreResult[dataPath].nodes],
          },
        };
      },
    });
  };

  if (loading && !data) return <LoadingSpinner />;
  if (error && !data) return <ErrorView message="Failed to load articles" onRetry={() => refetch()} />;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={showBack ? title : undefined}
        largeTitle={showBack ? undefined : title}
        showBack={showBack}
        showSettings={!showBack}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ArticleCard article={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        onScroll={onChromeScroll}
        scrollEventThrottle={16}
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
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  cardWrapper: {
    marginBottom: 0,
  },
});
