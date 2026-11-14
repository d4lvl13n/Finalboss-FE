import Link from 'next/link';
import Image from 'next/image';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';
import { TOTK_BUILDS_PATH } from '../lib/totk-builds/types';
import { RECIPES_PATH } from '../lib/totk-recipes/types';
import SignupForm from './SignupForm';
import GooglePreferredSource from './GooglePreferredSource';

const quickLinks = [
  { href: '/authors', label: t('footer.ourTeam') },
  { href: '/write-for-us', label: t('nav.writeForUs') },
  { href: '/about', label: t('nav.aboutUs') },
  { href: '/contact', label: t('nav.contact') },
  { href: '/privacy-policy', label: t('pages.privacy.heading') },
  { href: '/terms-of-service', label: t('pages.terms.heading') },
];

const categories = [
  { href: '/articles', label: t('nav.news') },
  { href: '/reviews', label: t('nav.reviews') },
  { href: '/guides', label: t('nav.guides') },
  { href: '/games', label: t('nav.games') },
  { href: TOTK_BUILDS_PATH, label: t('nav.totkBuilds') },
  { href: RECIPES_PATH, label: t('nav.totkRecipes') },
  { href: '/videos', label: t('nav.videos') },
  { href: '/technology', label: t('nav.technology') },
];

const socials = [
  { href: siteConfig.socialLinks.twitter, label: 'X' },
  { href: siteConfig.socialLinks.facebook, label: 'Facebook' },
  { href: siteConfig.socialLinks.instagram, label: 'Instagram' },
  { href: siteConfig.socialLinks.youtube, label: 'YouTube' },
].filter((s) => s.href);

/** Site footer. Server-rendered; only the signup form runs in the browser. */
export default function Footer() {
  return (
    <footer className="fb-foot">
      <section className="fb-news">
        <div className="fb-wrap">
          <div>
            <h2>{t('boss.newsletter')}</h2>
            <p>{t('pages.home.newsletterDescription')}</p>
          </div>
          <SignupForm source="Footer Newsletter" />
        </div>
      </section>
      <div className="fb-foot-grid">
        <div className="fb-foot-brand">
          <Image src={siteConfig.logoPath} width={150} height={50} alt={siteConfig.name} />
          <p>{t('footer.tagline')}</p>
        </div>

        <nav aria-label={t('footer.quickLinks')}>
          <h2>{t('footer.quickLinks')}</h2>
          {quickLinks.map((link) => (
            <Link prefetch={false} key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={t('footer.categories')}>
          <h2>{t('footer.categories')}</h2>
          {categories.map((link) => (
            <Link prefetch={false} key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <h2>{t('footer.connect')}</h2>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
          <div className="fb-foot-source">
            <GooglePreferredSource />
          </div>
        </div>
      </div>
      <p className="fb-foot-legal">{t('footer.copyright', { year: new Date().getFullYear(), name: siteConfig.name })}</p>
    </footer>
  );
}
