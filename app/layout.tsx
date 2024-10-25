import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Script from 'next/script';
import RouteLoader from './components/RouteLoader';

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
      <body>
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
