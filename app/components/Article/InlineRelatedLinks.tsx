import Link from 'next/link';
import { t } from '../../lib/i18n';

type InlineArticle = { id: string; title: string; slug: string };

/** "Next fights": the reading list inside the end-of-article panel. */
export default function InlineRelatedLinks({ articles }: { articles: InlineArticle[] }) {
  if (!articles.length) return null;

  return (
    <nav className="fb-next" aria-label={t('article.continueReading')}>
      {articles.map((article) => (
        <Link prefetch={false} key={article.id} href={`/${article.slug}`}>
          {article.title}
        </Link>
      ))}
    </nav>
  );
}
