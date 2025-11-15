'use client';

import { useEffect } from 'react';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';

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
  // Always run the hook to satisfy React rules
  useEffect(() => {
    if (!SHOW_MANUAL_ADS) return;
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, []);

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
        data-ad-client="ca-pub-7494322760704385"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
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