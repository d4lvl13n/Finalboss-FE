'use client';

import { useEffect } from 'react';
import { ENABLE_EZOIC } from '../../lib/adsConfig';

declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      define: (...ids: number[]) => void;
      enable: () => void;
      display: () => void;
      refresh: () => void;
      enabled?: boolean;
    };
    __ezoicScriptLoaded?: boolean;
  }
}

const EZOIC_SCRIPT_SRC = 'https://the.gatekeeperconsent.com/cmp.min.js';
const EZOIC_SA_SRC = 'https://ezojs.com/ezoic/sa.min.js';

export default function EzoicScriptLoader() {
  useEffect(() => {
    if (!ENABLE_EZOIC) return;
    if (typeof window === 'undefined') return;

    // Initialize ezstandalone global
    if (!window.ezstandalone) {
      (window as any).ezstandalone = { cmd: [] };
    }
    if (!window.ezstandalone!.cmd) {
      window.ezstandalone!.cmd = [];
    }

    if (window.__ezoicScriptLoaded) return;

    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const init = async () => {
      try {
        // Load Ezoic consent manager and standalone ad script
        await Promise.all([
          loadScript(EZOIC_SCRIPT_SRC, 'ezoic-cmp'),
          loadScript(EZOIC_SA_SRC, 'ezoic-sa'),
        ]);
        window.__ezoicScriptLoaded = true;
      } catch (err) {
        console.warn('[Ezoic] Script loading failed:', err);
      }
    };

    // Defer loading to avoid blocking main thread
    if (document.readyState === 'complete') {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => init());
      } else {
        setTimeout(init, 1000);
      }
    } else {
      window.addEventListener('load', () => init(), { once: true });
    }
  }, []);

  return null;
}
