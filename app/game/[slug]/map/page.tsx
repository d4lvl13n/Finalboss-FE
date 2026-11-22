import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Gta6MapExplorer from '@/app/components/gta6-map/Gta6MapExplorer';
import { getMapLocations, gta6MapPath, mapLabels } from '@/app/lib/gta6-map';
import { buildPageMetadata } from '@/app/lib/seo';
import siteConfig from '@/app/lib/siteConfig';
import styles from '@/app/components/gta6-map/gta6-map.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: 'gta-6' }];
}

export function generateMetadata() {
  const { title, description } = mapLabels[siteConfig.locale];
  return buildPageMetadata({ title, description, path: gta6MapPath });
}

export default function Gta6MapPage({ params }: { params: { slug: string } }) {
  if (params.slug !== 'gta-6') notFound();
  const locale = siteConfig.locale;
  const t = mapLabels[locale];
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.heading}>
            <Link href="/game/gta-6" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> {t.backToHub}</Link>
            <h1>{t.title}</h1>
            <p>{t.description}</p>
          </header>
          <Gta6MapExplorer locale={locale} locations={getMapLocations(locale)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
