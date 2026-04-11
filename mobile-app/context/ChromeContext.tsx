import React from 'react';
import { Animated, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

interface ChromeContextValue {
  progress: Animated.Value;
  revealChrome: () => void;
  handleScrollOffset: (offsetY: number) => void;
}

const ChromeContext = React.createContext<ChromeContextValue | null>(null);

export function ChromeProvider({ children }: { children: React.ReactNode }) {
  const progress = React.useRef(new Animated.Value(0)).current;
  const lastOffsetRef = React.useRef(0);
  const hiddenRef = React.useRef(false);

  const animateTo = React.useCallback(
    (hidden: boolean) => {
      if (hiddenRef.current === hidden) {
        return;
      }

      hiddenRef.current = hidden;
      Animated.spring(progress, {
        toValue: hidden ? 1 : 0,
        stiffness: 210,
        damping: 28,
        mass: 0.9,
        useNativeDriver: false,
      }).start();
    },
    [progress]
  );

  const revealChrome = React.useCallback(() => {
    lastOffsetRef.current = 0;
    animateTo(false);
  }, [animateTo]);

  const handleScrollOffset = React.useCallback(
    (offsetY: number) => {
      if (offsetY <= 18) {
        lastOffsetRef.current = offsetY;
        animateTo(false);
        return;
      }

      const delta = offsetY - lastOffsetRef.current;
      lastOffsetRef.current = offsetY;

      if (delta > 14) {
        animateTo(true);
      } else if (delta < -10) {
        animateTo(false);
      }
    },
    [animateTo]
  );

  const value = React.useMemo(
    () => ({
      progress,
      revealChrome,
      handleScrollOffset,
    }),
    [handleScrollOffset, progress, revealChrome]
  );

  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  const context = React.useContext(ChromeContext);

  if (!context) {
    throw new Error('useChrome must be used inside ChromeProvider');
  }

  return context;
}

export function useChromeScroll() {
  const { handleScrollOffset } = useChrome();

  return React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      handleScrollOffset(event.nativeEvent.contentOffset.y);
    },
    [handleScrollOffset]
  );
}
