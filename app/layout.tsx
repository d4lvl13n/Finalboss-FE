import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Script from 'next/script';
import RouteLoader from './components/RouteLoader';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SearchProvider } from './components/Search/SearchContext';
import SearchOverlay from './components/Search/SearchOverlay';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata = {
  title: 'FinalBoss.io - Your Ultimate Gaming Destination',
  description: 'Discover the latest gaming news, reviews, guides, and technology insights at FinalBoss.io. Stay ahead in the gaming world.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
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

        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7494322760704385"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script id="adsense-init" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-7494322760704385",
              enable_page_level_ads: true
            });
          `}
        </Script>
      </head>
      <body>
        <SearchProvider>
          <RouteLoader />
          {children}
          <SearchOverlay />
        </SearchProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
