import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';

interface PushPermissionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAllow: () => Promise<void>;
}

export default function PushPermissionSheet({
  visible,
  onClose,
  onAllow,
}: PushPermissionSheetProps) {
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setSubmitting(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <Text style={styles.kicker}>Stay Ahead</Text>
            <Text style={styles.title}>Get alerts that are actually relevant</Text>
            <Text style={styles.description}>
              FinalBoss will only use push for followed games, major reviews, and the daily digest you asked for.
            </Text>

            <View style={styles.actions}>
              <Pressable onPress={onClose} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Not now</Text>
              </Pressable>
              <Pressable
                disabled={submitting}
                onPress={async () => {
                  setSubmitting(true);
                  try {
                    await onAllow();
                  } finally {
                    setSubmitting(false);
                  }
                }}
                style={[styles.primaryButton, submitting && styles.disabledButton]}
              >
                <Text style={styles.primaryText}>
                  {submitting ? 'Enabling…' : 'Enable Alerts'}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    backgroundColor: '#101725',
    borderRadius: 28,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  kicker: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 15,
    backgroundColor: COLORS.accent,
  },
  secondaryButton: {
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  primaryText: {
    color: COLORS.background,
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
