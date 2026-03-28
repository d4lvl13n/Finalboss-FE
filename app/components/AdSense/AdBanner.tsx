'use client';

import { useLayoutEffect, useRef } from 'react';
import { ADSENSE_SCRIPT_LOADED_EVENT, SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import siteConfig from '../../lib/siteConfig';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'leaderboard' | 'banner';
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  className = '',
  style = {}
}: AdBannerProps) {
  const pushed = useRef(false);

  // Layout effect so the <ins> is filled before paint; reduces empty responsive units in complex layouts.
  useLayoutEffect(() => {
    if (!SHOW_MANUAL_ADS) return;

    pushed.current = false;
    let cancelled = false;

    const pushUnit = () => {
      if (cancelled || pushed.current) return;
      pushed.current = true;
      // Let layouts settle (incl. flex max-width); early push often yields blank responsive units.
      requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.error('AdSense error:', err);
            pushed.current = false;
          }
        });
      });
    };

    if (window.__adScriptLoaded) {
      pushUnit();
      return () => {
        cancelled = true;
      };
    }

    const onScriptReady = () => pushUnit();
    window.addEventListener(ADSENSE_SCRIPT_LOADED_EVENT, onScriptReady);
    return () => {
      cancelled = true;
      window.removeEventListener(ADSENSE_SCRIPT_LOADED_EVENT, onScriptReady);
    };
  }, [adSlot]);

  if (!SHOW_MANUAL_ADS) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={siteConfig.adsensePublisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="false"
      />
    </div>
  );
}

// Predefined ad components for common sizes
export function LeaderboardAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
  return (
    <AdBanner
      adSlot={adSlot}
      className={`leaderboard-ad ${className}`}
      style={{ width: '728px', height: '90px' }}
    />
  );
}

export function RectangleAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
  return (
    <AdBanner
      adSlot={adSlot}
      className={`rectangle-ad ${className}`}
      style={{ width: '300px', height: '250px' }}
    />
  );
}

export function MobileBannerAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
  return (
    <AdBanner
      adSlot={adSlot}
      className={`mobile-banner-ad ${className}`}
      style={{ width: '320px', height: '50px' }}
    />
  );
}

export function ResponsiveAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat="auto"
      className={`responsive-ad ${className}`}
    />
  );
}

export function VerticalAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat="auto"
      className={`vertical-ad ${className}`}
      style={{ width: '180px', minHeight: '400px', maxHeight: '600px' }}
    />
  );
} 