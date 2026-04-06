'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lead-capture-shown';
const COOLDOWN_DAYS = 3;

/** Returns true if the capture was shown recently (within COOLDOWN_DAYS). */
function wasRecentlyShown(): boolean {
  if (typeof window === 'undefined') return true;
  const ts = localStorage.getItem(STORAGE_KEY);
  if (!ts) return false;
  const diff = Date.now() - Number(ts);
  return diff < COOLDOWN_DAYS * 86_400_000;
}

function markShown() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }
}

interface UseLeadTriggerOptions {
  /** Minimum seconds on page before any trigger fires. */
  minTimeOnPage?: number;
  /** Scroll depth (0-1) that triggers on mobile. */
  scrollThreshold?: number;
  /** Seconds on page that triggers the slide-in. */
  timeThreshold?: number;
}

export type TriggerSource = 'exit-intent' | 'scroll' | 'time';

/**
 * Unified lead-capture trigger hook.
 * - Desktop: exit intent (mouseleave top)
 * - Mobile: scroll depth threshold
 * - Both: time-on-page threshold (for slide-in)
 */
export function useLeadTrigger(options: UseLeadTriggerOptions = {}) {
  const {
    minTimeOnPage = 5,
    scrollThreshold = 0.45,
    timeThreshold = 25,
  } = options;

  const [triggered, setTriggered] = useState<TriggerSource | null>(null);

  const fire = useCallback(
    (source: TriggerSource) => {
      if (wasRecentlyShown()) return;
      setTriggered(source);
      markShown();
    },
    [],
  );

  useEffect(() => {
    if (wasRecentlyShown()) return;

    let ready = false;
    let fired = false;

    // Gate: wait minTimeOnPage before enabling any trigger
    const gateTimer = setTimeout(() => {
      ready = true;
    }, minTimeOnPage * 1000);

    // ── Exit intent (desktop only) ──
    const handleMouseLeave = (e: MouseEvent) => {
      if (!ready || fired) return;
      if (e.clientY <= 0 && e.relatedTarget === null) {
        fired = true;
        fire('exit-intent');
      }
    };

    // ── Scroll trigger (mobile-friendly) ──
    const handleScroll = () => {
      if (!ready || fired) return;
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= scrollThreshold) {
        // Only fire on touch devices or narrow screens (mobile proxy)
        const isMobile = 'ontouchstart' in window || window.innerWidth < 768;
        if (isMobile) {
          fired = true;
          fire('scroll');
        }
      }
    };

    // ── Time trigger (both) ──
    const timeTimer = setTimeout(() => {
      if (!fired) {
        fired = true;
        fire('time');
      }
    }, timeThreshold * 1000);

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(gateTimer);
      clearTimeout(timeTimer);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fire, minTimeOnPage, scrollThreshold, timeThreshold]);

  const dismiss = useCallback(() => setTriggered(null), []);

  return { triggered, dismiss };
}
