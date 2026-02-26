import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400 text-center">Articles - Page {pageNumber}</h1>
        <p className="text-center text-gray-400 mb-12">
          Showing {(pageNumber - 1) * ARTICLE_PAGE_SIZE + 1}-
          {(pageNumber - 1) * ARTICLE_PAGE_SIZE + articles.length} of {total} articles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.slug}`}
              className="block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/20 transition-shadow"
            >
              <div className="relative h-48">
                {article.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={article.featuredImage.node.sourceUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{article.title}</h2>
                <div className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between mt-12">
          {hasPrev ? (
            <Link
              href={pageNumber === 2 ? '/articles' : `/articles/page/${pageNumber - 1}`}
              className="text-yellow-400 hover:text-yellow-300"
            >
              ← Previous Page
            </Link>
          ) : (
            <span />
          )}
          {hasNext && (
            <Link href={`/articles/page/${pageNumber + 1}`} className="text-yellow-400 hover:text-yellow-300">
              Next Page →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

