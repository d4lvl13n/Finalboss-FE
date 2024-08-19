import { ReactNode } from 'react';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
//import NewsTicker from './components/NewsTicker';
import ClientAnimatePresence from './components/ClientAnimatePresence';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {/* <NewsTicker /> */}
        <main>
          <ClientAnimatePresence>{children}</ClientAnimatePresence>
        </main>
        <Footer />
      </body>
    </html>
  );
}