import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';
import SelectionChip from './SelectionChip';
import type { ContentType, OnboardingSelections } from '../lib/localProfile';

const PLATFORM_OPTIONS = ['PC', 'PlayStation 5', 'Xbox Series X|S', 'Nintendo Switch', 'Steam Deck', 'Mobile'];
const GENRE_OPTIONS = ['RPG', 'Shooter', 'Action', 'Strategy', 'MMO', 'Survival', 'Sports', 'Indie'];
const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'latest', label: 'Breaking News' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'guides', label: 'Guides' },
  { value: 'videos', label: 'Videos' },
];

interface OnboardingSheetProps {
  visible: boolean;
  onComplete: (selections: OnboardingSelections) => void;
  initialSelections?: OnboardingSelections;
}

export default function OnboardingSheet({
  visible,
  onComplete,
  initialSelections,
}: OnboardingSheetProps) {
  const [step, setStep] = React.useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = React.useState<ContentType[]>([
    'latest',
    'reviews',
    'guides',
  ]);

  React.useEffect(() => {
    if (visible) {
      setStep(0);
      setSelectedPlatforms(initialSelections?.selectedPlatforms ?? []);
      setSelectedGenres(initialSelections?.selectedGenres ?? []);
      setSelectedContentTypes(
        initialSelections?.selectedContentTypes ?? ['latest', 'reviews', 'guides']
      );
      return;
    }

    if (!visible) {
      setStep(0);
      setSelectedPlatforms([]);
      setSelectedGenres([]);
      setSelectedContentTypes(['latest', 'reviews', 'guides']);
    }
  }, [initialSelections, visible]);

  const toggleValue = <T extends string>(values: T[], setValues: (next: T[]) => void, value: T) => {
    setValues(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]);
  };

  const canContinue =
    (step === 0 && selectedPlatforms.length > 0) ||
    (step === 1 && selectedGenres.length > 0) ||
    (step === 2 && selectedContentTypes.length > 0);

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <Text style={styles.kicker}>Step 1 of 3</Text>
          <Text style={styles.title}>Pick the platforms you care about</Text>
          <Text style={styles.description}>
            FinalBoss will build a smarter home feed and better alerts around what you actually play.
          </Text>
          <View style={styles.grid}>
            {PLATFORM_OPTIONS.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                selected={selectedPlatforms.includes(option)}
                onPress={() => toggleValue(selectedPlatforms, setSelectedPlatforms, option)}
              />
            ))}
          </View>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <Text style={styles.kicker}>Step 2 of 3</Text>
          <Text style={styles.title}>Choose the genres worth your time</Text>
          <Text style={styles.description}>
            This shapes the For You rail and which guides or reviews get priority.
          </Text>
          <View style={styles.grid}>
            {GENRE_OPTIONS.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                selected={selectedGenres.includes(option)}
                onPress={() => toggleValue(selectedGenres, setSelectedGenres, option)}
              />
            ))}
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.kicker}>Step 3 of 3</Text>
        <Text style={styles.title}>Tell us how you like to keep up</Text>
        <Text style={styles.description}>
          Pick the content types that should get the strongest placement in your daily feed.
        </Text>
        <View style={styles.grid}>
          {CONTENT_TYPE_OPTIONS.map((option) => (
            <SelectionChip
              key={option.value}
              label={option.label}
              selected={selectedContentTypes.includes(option.value)}
              onPress={() =>
                toggleValue(selectedContentTypes, setSelectedContentTypes, option.value)
              }
            />
          ))}
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <ScrollView contentContainerStyle={styles.content}>
              {renderStep()}
            </ScrollView>

            <View style={styles.footer}>
              {step > 0 ? (
                <Pressable onPress={() => setStep(step - 1)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </Pressable>
              ) : (
                <View style={styles.footerSpacer} />
              )}

              <Pressable
                disabled={!canContinue}
                onPress={() => {
                  if (step < 2) {
                    setStep(step + 1);
                    return;
                  }

                  onComplete({
                    selectedPlatforms,
                    selectedGenres,
                    selectedContentTypes,
                  });
                }}
                style={[styles.primaryButton, !canContinue && styles.disabledButton]}
              >
                <Text style={styles.primaryButtonText}>
                  {step < 2 ? 'Continue' : 'Start Reading'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#161d2d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    padding: 24,
    gap: 14,
  },
  kicker: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  footerSpacer: {
    flex: 1,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
