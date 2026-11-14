'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// The pop-ups use framer-motion. They only ever show on wide, mouse-driven
// screens, so the code is fetched there and only there — phones never download it.
const DesktopLeadCapture = dynamic(() => import('./DesktopLeadCapture'), { ssr: false });

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
