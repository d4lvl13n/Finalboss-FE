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
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setEmail('');
      setSubmitting(false);
      setError(null);
    }
  }, [visible]);

  const title = 'Free game keys, every month';

  const description =
    'Join the FinalBoss daily digest and newsletter — and we drop free game keys into your inbox every single month.';

  const handleSubmit = async () => {
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
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <BlurView intensity={44} tint="dark" style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <View style={styles.grabber} />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Later</Text>
            </Pressable>

            <Text style={styles.kicker}>🎁 Free Game Keys</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              editable={!submitting}
              onSubmitEditing={() => {
                void handleSubmit();
              }}
              returnKeyType="go"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable
              disabled={submitting}
              onPress={() => {
                void handleSubmit();
              }}
              style={[styles.primaryButton, submitting && styles.disabledButton]}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? 'Subscribing…' : 'Subscribe'}
              </Text>
            </Pressable>
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
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 2,
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
