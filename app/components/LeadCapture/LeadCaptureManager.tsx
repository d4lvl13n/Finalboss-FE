'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExitIntentModal from './ExitIntentModal';
import SlideInCTA from './SlideInCTA';
import { useLeadTrigger } from './useLeadTrigger';

const DesktopLeadCapture: React.FC = () => {
  const { triggered, dismiss } = useLeadTrigger({
    minTimeOnPage: 5,
    scrollThreshold: 0.45,
    timeThreshold: 25,
  });

  // exit-intent & scroll → full modal (high-intent moments)
  // time → less intrusive slide-in
  const showModal = triggered === 'exit-intent' || triggered === 'scroll';
  const showSlideIn = triggered === 'time';

  return (
    <AnimatePresence>
      {showModal && <ExitIntentModal onClose={dismiss} />}
      {showSlideIn && <SlideInCTA onClose={dismiss} />}
    </AnimatePresence>
  );
};

// Mount the trigger only for a wide, fine-pointer device. Hiding its markup
// with CSS would still start timers and consume the signup cooldown on phones.
export default function LeadCaptureManager() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const sync = () => setEnabled(desktop.matches);
    sync();
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);
  return enabled ? <DesktopLeadCapture /> : null;
}
