import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FinalBoss.io - Your Ultimate Gaming Destination',
  description:
    'Discover the latest gaming news, reviews, guides, and cutting-edge technology at FinalBoss.io. Stay ahead in the gaming world.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://finalboss.io" />
        <link rel="dns-prefetch" href="https://finalboss.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HV2MVVJDN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HV2MVVJDN4');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
