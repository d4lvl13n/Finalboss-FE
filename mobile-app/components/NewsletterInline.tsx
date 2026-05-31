import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';
import { useLocalProfile } from '../context/LocalProfileContext';

interface NewsletterInlineProps {
  source?: string;
  title?: string;
  description?: string;
}

export default function NewsletterInline({
  source = 'mobile-inline',
  title = 'Free game keys, every month',
  description = 'Join the FinalBoss daily digest and newsletter — and get free game keys dropped to your inbox every month.',
}: NewsletterInlineProps) {
  const { profile, submitNewsletter } = useLocalProfile();
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [subscribed, setSubscribed] = React.useState(
    profile.newsletterStatus === 'subscribed'
  );

  if (subscribed || profile.newsletterStatus === 'subscribed') {
    return (
      <View style={styles.successCard}>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        <Text style={styles.successText}>You're on the FinalBoss daily digest.</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitNewsletter(email.trim(), source);
      setSubscribed(true);
    } catch {
      setError('Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Daily Digest</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.inputRow}>
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
        <Pressable
          disabled={submitting}
          onPress={() => {
            void handleSubmit();
          }}
          style={[styles.button, submitting && styles.buttonDisabled]}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
          )}
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    width: 52,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.35)',
  },
  successText: {
    flex: 1,
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '700',
  },
});
