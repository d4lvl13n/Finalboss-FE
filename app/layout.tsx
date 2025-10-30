import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import RouteLoader from './components/RouteLoader';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SearchProvider } from './components/Search/SearchContext';
import SearchOverlay from './components/Search/SearchOverlay';
import LeadCaptureManager from './components/LeadCapture/LeadCaptureManager';
import { ENABLE_AUTO_ADS } from './lib/adsConfig';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'FinalBoss.io - Your Ultimate Gaming Destination',
    template: '%s | FinalBoss.io',
  },
  description:
    'Discover the latest gaming news, reviews, guides, and technology insights at FinalBoss.io. Stay ahead in the gaming world.',
  openGraph: {
    type: 'website',
    siteName: 'FinalBoss.io',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnects for third-parties to reduce connection latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        {/* Verification */}
        <div
          dangerouslySetInnerHTML={{
            __html: '<!-- e2c216ee3e6ae9705e843d5a227568c93d21a3ac -->',
          }}
          style={{ display: 'none' }}   // keep it invisible
        />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HV2MVVJDN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HV2MVVJDN4', {
              page_path: window.location.pathname,
              transport_type: 'beacon',
              web_vitals: { 
                send_page_views: true,
                send_timings: true 
              }
            });
          `}
        </Script>

        {/* Google AdSense base script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7494322760704385"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {ENABLE_AUTO_ADS && (
          <Script id="adsense-auto" strategy="afterInteractive">
            {`
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-7494322760704385",
                enable_page_level_ads: true
              });
            `}
          </Script>
        )}
      </head>
      <body>
        <SearchProvider>
          <RouteLoader />
          <LeadCaptureManager />
          {children}
          <SearchOverlay />
        </SearchProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
