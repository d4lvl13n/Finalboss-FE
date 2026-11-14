import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import PostRow, { LeadTile } from './PostRow';
import AdSlot, { ROWS_PER_AD } from './AdSlot';
import LoadMore from './LoadMore';
import type { SectionPage as SectionData } from '../../lib/sectionQuery';
import { t } from '../../lib/i18n';

const RAIL_LINKS = [
  { href: '/guides', label: t('nav.guides') },
  { href: '/reviews', label: t('nav.reviews') },
  { href: '/gaming', label: t('nav.news') },
  { href: '/technology', label: t('nav.technology') },
  { href: '/videos', label: t('nav.videos') },
  { href: '/games', label: t('nav.games') },
  { href: '/gaming-laptops', label: t('nav.laptops') },
  { href: '/handhelds', label: t('nav.handhelds') },
];

interface Chip {
  name: string;
  href: string;
}

interface SectionPageProps {
  title: string;
  description: string;
  data: SectionData;
  /** WordPress category name for "load more"; null for every category */
  categoryName: string | null;
  /** Sub-sections shown as links under the title (e.g. guides by game) */
  chips?: Chip[];
  chipsLabel?: string;
  /** Link to static paginated archives, when the section has them */
  olderHref?: string;
  olderLabel?: string;
  /** Structured data scripts */
  children?: ReactNode;
}

/**
 * Shared layout for /articles, /reviews, /guides and /technology.
 *
 * Server-rendered: the first 24 posts and every link are plain HTML. The page
 * opens with two medium lead stories instead of one full-width image, then a
 * dense scannable list. Ad slots sit after the leads, after every sixth row,
 * and in a column that stays in view on wide screens — never before content.
 */
export default function SectionPage({
  title,
  description,
  data,
  categoryName,
  chips,
  chipsLabel,
  olderHref,
  olderLabel,
  children,
}: SectionPageProps) {
  const leads = data.posts.slice(0, 2);
  const rows = data.posts.slice(2);

  return (
    <>
      <Header />
      {children}
      <main className="fb-section">
        <header className="fb-section-head">
          <div className="fb-wrap">
            <h1>{title}</h1>
            <p>{description}</p>
            {chips && chips.length > 0 && (
              <nav className="fb-chips" aria-label={chipsLabel || title}>
                {chips.map((chip) => (
                  <Link prefetch={false} key={chip.href} href={chip.href}>
                    {chip.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </header>

        <div className="fb-wrap">
          <div className="fb-section-grid">
            <div className="fb-feed">
              {leads.length > 0 && (
                <div className="fb-leads">
                  {leads.map((post, i) => (
                    <LeadTile key={post.id} post={post} priority={i === 0} />
                  ))}
                </div>
              )}

              <AdSlot id="feed-1" />

              {rows.map((post, i) => (
                <Fragment key={post.id}>
                  <PostRow post={post} />
                  {/* never as the very last thing in the list */}
                  {(i + 1) % ROWS_PER_AD === 0 && i + 1 < rows.length && (
                    <AdSlot id={`feed-${(i + 1) / ROWS_PER_AD + 1}`} />
                  )}
                </Fragment>
              ))}

              {data.hasNextPage && <LoadMore categoryName={categoryName} endCursor={data.endCursor} offset={rows.length} />}

              {olderHref && (
                <p className="fb-older">
                  <Link prefetch={false} href={olderHref}>
                    {olderLabel}
                  </Link>
                </p>
              )}
            </div>

            <aside className="fb-section-rail">
              <div className="fb-section-rail-in">
                <AdSlot id="rail" format="rail" />
                {/* Always something useful here, so the column is never an empty
                    gap when no ad fills the slot above. */}
                <nav className="fb-rail-nav" aria-label={t('footer.categories')}>
                  <h2>{t('footer.categories')}</h2>
                  {RAIL_LINKS.map((link) => (
                    <Link prefetch={false} key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
