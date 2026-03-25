'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExitIntentModal from './ExitIntentModal';
import { useExitIntent } from './useExitIntent';

const LeadCaptureManager: React.FC = () => {
  const [showExitModal, setShowExitModal] = useState(false);

  useExitIntent({
    enabled: true,
    delay: 500,
    onExitIntent: () => setShowExitModal(true),
  });

  const handleCloseExitModal = () => {
    setShowExitModal(false);
  };

  return (
    <>
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