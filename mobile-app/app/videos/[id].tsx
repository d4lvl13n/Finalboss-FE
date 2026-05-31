import React from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import YouTubeEmbed from '../../components/YouTubeEmbed';
import { COLORS } from '../../constants/config';

export default function VideoDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
  const videoTitle = title || 'FinalBoss Video';

  const handleShare = async () => {
    await Share.share({
      title: videoTitle,
      message: `${videoTitle} - ${youtubeUrl}`,
      url: youtubeUrl,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Video"
        showBack
        showSearch={false}
        rightAction={
          <View style={styles.headerActions}>
            <Pressable onPress={handleShare} style={styles.iconButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.text} />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(youtubeUrl)}
              style={styles.iconButton}
            >
              <Ionicons name="logo-youtube" size={20} color={COLORS.text} />
            </Pressable>
          </View>
        }
      />

      <View style={styles.playerWrap}>
        {id ? <YouTubeEmbed videoId={id} card={false} /> : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{videoTitle}</Text>
        <Text style={styles.description}>
          Stay inside the app for the latest FinalBoss upload, then jump to YouTube only if you want the full channel surface.
        </Text>
        <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL(youtubeUrl)}>
          <Ionicons name="open-outline" size={18} color={COLORS.text} />
          <Text style={styles.secondaryButtonText}>Open in YouTube</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerWrap: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    gap: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
