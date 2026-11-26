import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';
import { TOTK_BUILDS_PATH } from '../lib/totk-builds/types';
import { RECIPES_PATH } from '../lib/totk-recipes/types';
import SearchButton from './Search/SearchButton';

const navItems = [
  { name: t('nav.news'), href: '/gaming' },
  { name: t('nav.reviews'), href: '/reviews' },
  { name: t('nav.laptops'), href: '/gaming-laptops' },
  { name: t('nav.handhelds'), href: '/handhelds' },
  { name: t('nav.guides'), href: '/guides' },
  { name: 'GTA 6', href: '/game/gta-6' },
  { name: t('nav.technology'), href: '/technology' },
  { name: t('nav.videos'), href: '/videos' },
  { name: t('nav.games'), href: '/games' },
  { name: t('nav.team'), href: '/authors' },
];

const moreItems = [
  { name: t('nav.allArticles'), href: '/articles' },
  { name: t('nav.totkBuilds'), href: TOTK_BUILDS_PATH },
  { name: t('nav.totkRecipes'), href: RECIPES_PATH },
  { name: t('nav.writeForUs'), href: '/write-for-us' },
  { name: t('nav.aboutUs'), href: '/about' },
  { name: t('nav.contact'), href: '/contact' },
];

/**
 * Site header. Plain HTML and CSS: every link is in the markup, and the phone
 * menu is a native <details> element, so it opens with no JavaScript at all.
 * The only interactive piece is the search button (a tiny client component).
 *
 * This used to be a client component with scroll listeners, a portal and
 * framer-motion — which put the animation library in every page's bundle.
 */
export default function Header() {
  return (
    <header className="fb-top">
      <div className="fb-top-in">
        <details className="fb-menu">
          <summary aria-label={t('a11y.menu') === 'a11y.menu' ? 'Menu' : t('a11y.menu')}>
            <span aria-hidden="true" />
          </summary>
          <nav className="fb-menu-panel" aria-label="Menu">
            {[...navItems, ...moreItems].map((item) => (
              <Link prefetch={false} key={item.href} href={item.href}>
                {item.name}
              </Link>
            ))}
          </nav>
        </details>

        <Link prefetch={false} href="/" className="fb-logo">
          <Image src={siteConfig.logoPath} width={120} height={40} alt={siteConfig.name} priority />
        </Link>

        <nav className="fb-nav" aria-label="Main">
          {navItems.map((item) => (
            <Link prefetch={false} key={item.href} href={item.href}>
              {item.name}
            </Link>
          ))}
        </nav>

        <SearchButton label={t('nav.openSearch')} />
      </div>
    </header>
  );
}
