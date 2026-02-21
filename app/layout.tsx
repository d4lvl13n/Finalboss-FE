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
import siteConfig from './lib/siteConfig';

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

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.ogImagePath}`,
  sameAs: [
    siteConfig.socialLinks.twitter,
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
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
    <html lang={siteConfig.lang} className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Preconnects for third-parties to reduce connection latency */}
        <link rel="preconnect" href={siteConfig.wordpressUrl} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} Articles`} href={`${siteConfig.url}/feeds/articles`} />
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} Reviews`} href={`${siteConfig.url}/feeds/reviews`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        {siteConfig.siteVerification && (
          <meta name="google-site-verification" content={siteConfig.siteVerification} />
        )}

        {/* Google Analytics */}
        {siteConfig.analyticsId && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analyticsId}`}
            strategy="afterInteractive"
          />
        )}
        {siteConfig.analyticsId && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.analyticsId}', {
                page_path: window.location.pathname,
                transport_type: 'beacon',
                web_vitals: {
                  send_page_views: true,
                  send_timings: true
                }
              });
            `}
          </Script>
        )}

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
