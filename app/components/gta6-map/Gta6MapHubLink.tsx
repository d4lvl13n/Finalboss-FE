import Link from 'next/link';
import { Map } from 'lucide-react';

import { gta6MapPath } from '@/app/lib/gta6-map';
import styles from './gta6-map.module.css';

export default function Gta6MapHubLink({ locale }: { locale: 'en' | 'fr' }) {
  return (
    <Link className={styles.hubLink} href={gta6MapPath} prefetch={false}>
      <Map size={19} aria-hidden="true" />
      {locale === 'fr' ? 'Carte interactive de GTA 6' : 'GTA 6 interactive map'}
    </Link>
  );
}
