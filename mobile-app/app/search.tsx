import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SEARCH_POSTS } from '../lib/queries/posts';
import ArticleCard from '../components/ArticleCard';
import { COLORS } from '../constants/config';
import type { Post } from '../lib/types';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [search, { data, loading }] = useLazyQuery(SEARCH_POSTS);

  const results: Post[] = data?.posts?.nodes ?? [];
  const hasSearched = data !== undefined;

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    search({ variables: { searchTerm: trimmed, first: 20 } });
  }, [query, search]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </Pressable>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search articles..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Results */}
      {loading && (
        <View style={styles.center}>
          <Text style={styles.statusText}>Searching...</Text>
        </View>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.statusText}>No results found</Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ArticleCard article={item} variant="compact" />
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {!loading && !hasSearched && (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={COLORS.surfaceLight} />
          <Text style={styles.statusText}>Search for gaming articles, reviews, and guides</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  list: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  statusText: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
});
