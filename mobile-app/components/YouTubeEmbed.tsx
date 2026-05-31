import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Extract an 11-char YouTube video id from the common URL shapes WordPress emits.
export function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

interface YouTubeEmbedProps {
  videoId: string;
  // When false, fills the parent instead of rendering the rounded 16:9 card.
  card?: boolean;
}

// Loads the YouTube player as a real <iframe> inside a document served with a
// youtube.com baseUrl. Loading the bare /embed/ URL top-level (as the HTML
// iframe plugin does) leaves the player with no parent origin/referrer, which
// YouTube rejects with "Error 153 - Video player configuration error".
export default function YouTubeEmbed({ videoId, card = true }: YouTubeEmbedProps) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{background:#000;width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:0;display:block}</style>
</head>
<body>
<iframe src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1&fs=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</body>
</html>`;

  const webView = (
    <WebView
      source={{ html, baseUrl: 'https://www.youtube.com' }}
      style={styles.webview}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      allowsInlineMediaPlayback
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
      scrollEnabled={false}
      setSupportMultipleWindows={false}
    />
  );

  if (!card) {
    return webView;
  }

  return <View style={styles.card}>{webView}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});
