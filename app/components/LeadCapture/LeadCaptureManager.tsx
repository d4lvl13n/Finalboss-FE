'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExitIntentModal from './ExitIntentModal';
import StickyNotificationBar from './StickyNotificationBar';
import { useExitIntent } from './useExitIntent';

const LeadCaptureManager: React.FC = () => {
  const [showExitModal, setShowExitModal] = useState(false);

  // Exit intent hook
  useExitIntent({
    enabled: true,
    delay: 500,
    onExitIntent: () => {
      // Only show if notification bar hasn't been dismissed
      const notificationDismissed = localStorage.getItem('notification-bar-dismissed');
      if (!notificationDismissed) {
        setShowExitModal(true);
      }
    }
  });

  const handleCloseExitModal = () => {
    setShowExitModal(false);
  };

  return (
    <>
      {/* Sticky Notification Bar */}
      <StickyNotificationBar />

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitModal && (
          <ExitIntentModal onClose={handleCloseExitModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadCaptureManager; 