import Link from 'next/link';
import { GameSearch } from './GameSearch';
import { t } from '../lib/i18n';

/** Game search block. Only the search box itself runs in the browser. */
export default function GameDatabaseSection() {
  return (
    <section className="fb-games fb-wrap">
      <div className="fb-head">
        <h2 className="fb-sec">{t('nav.games')}</h2>
        <Link prefetch={false} href="/games">
          {t('common.viewAll')}
        </Link>
      </div>
      <GameSearch />
    </section>
  );
}
