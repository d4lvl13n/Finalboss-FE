import { Linking } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { CONFIG } from '../constants/config';

// Native in-app rating sheet (SKStoreReviewController). Best-effort — iOS
// throttles this to a few prompts per year and may silently no-op, so it's
// only used for the automatic, well-timed prompt, never for an explicit tap.
export async function requestInAppReview(): Promise<void> {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch {
    // Reviews should never interrupt the experience on failure.
  }
}

// Explicit "Rate us" action — always sends the user to the App Store write-review
// screen so the tap visibly does something (unlike the throttled in-app sheet).
export async function openStoreReviewPage(): Promise<void> {
  const fallback = `${CONFIG.IOS_APP_STORE_URL}?action=write-review`;
  let url = fallback;

  try {
    const configured = StoreReview.storeUrl();
    if (configured) {
      url = configured.includes('action=write-review')
        ? configured
        : `${configured}?action=write-review`;
    }
  } catch {
    url = fallback;
  }

  try {
    await Linking.openURL(url);
  } catch {
    await Linking.openURL(CONFIG.IOS_APP_STORE_URL);
  }
}
