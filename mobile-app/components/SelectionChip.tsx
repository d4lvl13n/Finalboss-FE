import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectionChip({
  label,
  selected,
  onPress,
}: SelectionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selectedChip,
        pressed && styles.pressedChip,
      ]}
    >
      <View style={styles.content}>
        {selected ? (
          <Ionicons name="checkmark-circle" size={16} color={COLORS.background} />
        ) : null}
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pressedChip: {
    opacity: 0.85,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  selectedLabel: {
    color: COLORS.background,
  },
});
