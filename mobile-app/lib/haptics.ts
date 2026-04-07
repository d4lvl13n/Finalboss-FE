import * as ExpoHaptics from 'expo-haptics';

export async function triggerHaptic(
  enabled: boolean,
  type: 'selection' | 'success' | 'warning' | 'light' = 'selection'
) {
  if (!enabled) {
    return;
  }

  try {
    switch (type) {
      case 'success':
        await ExpoHaptics.notificationAsync(
          ExpoHaptics.NotificationFeedbackType.Success
        );
        break;
      case 'warning':
        await ExpoHaptics.notificationAsync(
          ExpoHaptics.NotificationFeedbackType.Warning
        );
        break;
      case 'light':
        await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
        break;
      default:
        await ExpoHaptics.selectionAsync();
        break;
    }
  } catch {
    // Haptics should never block the interaction.
  }
}
