import { fetchPaginatedArticles, ARTICLE_PAGE_SIZE } from '../../../lib/pagination';
import siteConfig from '../../../lib/siteConfig';

const baseUrl = siteConfig.url;

function parsePage(param: string): number | null {
  const page = Number(param);
  if (!Number.isInteger(page) || page < 1) return null;
  return page;
}

export default async function Head({ params }: { params: { page: string } }) {
  const pageNumber = parsePage(params.page);
  if (!pageNumber) return null;

  const { total } = await fetchPaginatedArticles(pageNumber);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE));
  const hasPrev = pageNumber > 1;
  const hasNext = pageNumber < totalPages;

  const prevHref = pageNumber === 2 ? `${baseUrl}/articles` : `${baseUrl}/articles/page/${pageNumber - 1}`;
  const nextHref = `${baseUrl}/articles/page/${pageNumber + 1}`;

  return (
    <>
      {hasPrev && <link rel="prev" href={prevHref} />}
      {hasNext && <link rel="next" href={nextHref} />}
    </>
  );
}

