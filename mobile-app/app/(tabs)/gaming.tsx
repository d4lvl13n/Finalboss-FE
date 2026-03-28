import React from 'react';
import ArticleListScreen from '../../components/ArticleListScreen';
import { GET_POSTS_BY_CATEGORY } from '../../lib/queries/posts';

export default function GamingScreen() {
  return (
    <ArticleListScreen
      title="Gaming News"
      query={GET_POSTS_BY_CATEGORY}
      variables={{ categoryName: 'Gaming' }}
    />
  );
}
