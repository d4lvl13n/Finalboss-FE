'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ExitIntentModal from './ExitIntentModal';
import SlideInCTA from './SlideInCTA';
import { useLeadTrigger } from './useLeadTrigger';

const LeadCaptureManager: React.FC = () => {
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

export default LeadCaptureManager;
