import { Fragment } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PageHero from '../../../components/PageHero';
import PostRow from '../../../components/Section/PostRow';
import AdSlot, { ROWS_PER_AD } from '../../../components/Section/AdSlot';
import type { SectionPost } from '../../../lib/sectionQuery';
import { t } from '../../../lib/i18n';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '../../../lib/seo';
import siteConfig from '../../../lib/siteConfig';
import { ARTICLE_PAGE_SIZE, fetchPaginatedArticles } from '../../../lib/pagination';

interface PageProps {
  params: { page: string };
}

function parsePageNumber(param: string): number | null {
  const page = Number(param);
  if (!Number.isInteger(page) || page < 1) {
    return null;
  }
  return page;
}

export async function generateMetadata({ params }: PageProps) {
  const pageNumber = parsePageNumber(params.page);
  if (!pageNumber) {
    return buildPageMetadata({
      title: 'Articles',
      description: 'Explore curated gaming news, reviews, and guides.',
      path: '/articles',
    });
  }

  return buildPageMetadata({
    title: `Articles - Page ${pageNumber}`,
    description: `Browse page ${pageNumber} of ${siteConfig.name} articles.`,
    path: `/articles/page/${pageNumber}`,
  });
}

export default async function PaginatedArticlesPage({ params }: PageProps) {
  const pageNumber = parsePageNumber(params.page);
  if (!pageNumber) {
    notFound();
  }

  const { articles, total } = await fetchPaginatedArticles(pageNumber);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE));

  if (articles.length === 0) {
    notFound();
  }

  const hasNext = pageNumber < totalPages;
  const hasPrev = pageNumber > 1;

  return (
    <>
      <Header />
      <main className="fb-section fb-section-flush">
        <PageHero
          title={t('boss.pageOf', { page: pageNumber })}
          description={t('boss.showing', {
            from: (pageNumber - 1) * ARTICLE_PAGE_SIZE + 1,
            to: (pageNumber - 1) * ARTICLE_PAGE_SIZE + articles.length,
            total,
          })}
        />
        <div className="fb-wrap fb-section-body fb-feed-narrow">
          {articles.map((article, i) => (
            <Fragment key={article.id}>
              <PostRow post={article as unknown as SectionPost} />
              {(i + 1) % ROWS_PER_AD === 0 && i + 1 < articles.length && <AdSlot id={`feed-${(i + 1) / ROWS_PER_AD}`} />}
            </Fragment>
          ))}
          <nav className="fb-pager" aria-label="Pagination">
            {hasPrev ? (
              <Link prefetch={false} href={pageNumber === 2 ? '/articles' : `/articles/page/${pageNumber - 1}`} className="fb-btn">
                {t('boss.prevPage')}
              </Link>
            ) : (
              <span />
            )}
            {hasNext && (
              <Link prefetch={false} href={`/articles/page/${pageNumber + 1}`} className="fb-btn">
                {t('boss.nextPage')}
              </Link>
            )}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
