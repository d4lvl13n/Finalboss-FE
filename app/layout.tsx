import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Script from 'next/script';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata = {
  title: 'FinalBoss.io - Your Ultimate Gaming Destination',
  description: 'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://finalboss.io" />
        <link rel="dns-prefetch" href="https://finalboss.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/images/finalboss-og-image.jpg" />

        {/* Defer non-critical third-party scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HV2MVVJDN4"
          strategy="lazyOnload"
          defer
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HV2MVVJDN4', {
              page_path: window.location.pathname,
              transport_type: 'beacon'
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
