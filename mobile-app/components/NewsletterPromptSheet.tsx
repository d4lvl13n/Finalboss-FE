import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';

interface NewsletterPromptSheetProps {
  visible: boolean;
  reason: string | null;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function NewsletterPromptSheet({
  visible,
  reason,
  onClose,
  onSubmit,
}: NewsletterPromptSheetProps) {
  const [step, setStep] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setStep(0);
      setEmail('');
      setSubmitting(false);
      setError(null);
      return;
    }

    if (reason === 'manual' || reason === 'library') {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [reason, visible]);

  const title =
    reason === 'library'
      ? 'Build your daily FinalBoss briefing'
      : 'Get the stories worth coming back for';

  const description =
    reason === 'article'
      ? 'Drop into the daily digest and get new reviews, sharp guides, and follow-up coverage before it disappears in the feed.'
      : 'Turn FinalBoss into a repeat habit with the daily digest and the best game-driven stories.';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <BlurView intensity={44} tint="dark" style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Later</Text>
            </Pressable>

            {step === 0 ? (
              <>
                <Text style={styles.kicker}>Daily Digest</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <Pressable onPress={() => setStep(1)} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Add My Email</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.kicker}>One More Step</Text>
                <Text style={styles.title}>Where should we send it?</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Pressable
                  disabled={submitting}
                  onPress={async () => {
                    if (!email.includes('@')) {
                      setError('Enter a valid email address.');
                      return;
                    }

                    try {
                      setSubmitting(true);
                      setError(null);
                      await onSubmit(email.trim());
                    } catch {
                      setError('Subscription failed. Try again.');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  style={[styles.primaryButton, submitting && styles.disabledButton]}
                >
                  <Text style={styles.primaryButtonText}>
                    {submitting ? 'Subscribing…' : 'Subscribe'}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    backgroundColor: '#121927',
    borderRadius: 28,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  kicker: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButton: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
});
