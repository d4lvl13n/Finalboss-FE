import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ArticleListScreen from '../../components/ArticleListScreen';
import { GET_POSTS_BY_CATEGORY } from '../../lib/queries/posts';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const title = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category';

  return (
    <ArticleListScreen
      title={title}
      query={GET_POSTS_BY_CATEGORY}
      variables={{ categoryName: slug }}
      showBack
    />
  );
}
