'use client';

import { useState, useEffect } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delay?: number;
  onExitIntent?: () => void;
}

export const useExitIntent = (options: UseExitIntentOptions = {}) => {
  const { enabled = true, delay = 1000, onExitIntent } = options;
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || hasTriggered) return;

    let timeoutId: NodeJS.Timeout;
    let hasShownBefore = false;

    // Check if exit intent has been shown before
    if (typeof window !== 'undefined') {
      hasShownBefore = localStorage.getItem('exit-intent-shown') === 'true';
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasShownBefore && !hasTriggered) {
        timeoutId = setTimeout(() => {
          setHasTriggered(true);
          onExitIntent?.();
          
          // Mark as shown in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('exit-intent-shown', 'true');
          }
        }, delay);
      }
    };

    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // Add minimum time on page before enabling exit intent (5 seconds)
    const enableExitIntent = () => {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
    };

    const minTimeTimeout = setTimeout(enableExitIntent, 5000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(timeoutId);
      clearTimeout(minTimeTimeout);
    };
  }, [enabled, delay, onExitIntent, hasTriggered]);

  return { hasTriggered, setHasTriggered };
}; 