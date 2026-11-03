import type { ReactNode } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
export default function RecipesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
