'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'leaderboard' | 'banner';
  className?: string;
  style?: React.CSSProperties;
}

interface AdSenseObject {
  [key: string]: unknown;
}

declare global {
  interface Window {
    adsbygoogle: AdSenseObject[];
  }
}

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  className = '',
  style = {}
}: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

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
      style={{ width: '300px', minHeight: '600px' }}
    />
  );
} 