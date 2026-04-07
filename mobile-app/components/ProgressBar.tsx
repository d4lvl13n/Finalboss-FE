import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/config';

interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceLight,
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
});
