import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

interface LoadingSpinnerProps {
  inline?: boolean;
}

export default function LoadingSpinner({ inline = false }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, inline && styles.inlineContainer]}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  inlineContainer: {
    minHeight: 120,
  },
});
