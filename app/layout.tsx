import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import RouteLoader from './components/RouteLoader';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SearchProvider } from './components/Search/SearchContext';
import SearchOverlay from './components/Search/SearchOverlay';
import LeadCaptureManager from './components/LeadCapture/LeadCaptureManager';
import AdScriptLoader from './components/AdSense/AdScriptLoader';
import { ENABLE_AUTO_ADS } from './lib/adsConfig';
import BackToTop from './components/BackToTop';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-body'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading'
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FinalBoss.io',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FinalBoss.io',
  url: baseUrl,
  logo: `${baseUrl}/images/finalboss-og-image.jpg`,
  sameAs: [
    'https://x.com/finalbossio',
  ],
};

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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Preconnects for third-parties to reduce connection latency */}
        <link rel="preconnect" href="https://backend.finalboss.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="alternate" type="application/rss+xml" title="FinalBoss.io Articles" href={`${baseUrl}/feeds/articles`} />
        <link rel="alternate" type="application/rss+xml" title="FinalBoss.io Reviews" href={`${baseUrl}/feeds/reviews`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <meta name="google-site-verification" content="e2c216ee3e6ae9705e843d5a227568c93d21a3ac" />
        
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

      </head>
      <body className="font-body">
        <SearchProvider>
          <RouteLoader />
          <LeadCaptureManager />
          {children}
          <SearchOverlay />
          <BackToTop />
        </SearchProvider>
        <AdScriptLoader enableAutoAds={ENABLE_AUTO_ADS} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
