import React from 'react';
import ArticleListScreen from '../../components/ArticleListScreen';
import { GET_GUIDES } from '../../lib/queries/posts';

export default function GuidesScreen() {
  return <ArticleListScreen title="Guides" query={GET_GUIDES} />;
}
