import React from 'react';
import ArticleListScreen from '../../components/ArticleListScreen';
import { GET_REVIEWS } from '../../lib/queries/posts';

export default function ReviewsScreen() {
  return <ArticleListScreen title="Reviews" query={GET_REVIEWS} />;
}
