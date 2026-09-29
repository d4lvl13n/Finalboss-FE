'use client';

import { articleHeadings } from '../../lib/articleHeadings';
import { t } from '../../lib/i18n';

interface TableOfContentsProps {
  content: string;
  minHeadings?: number;
  variant?: 'inline' | 'sidebar';
}

/** Native anchors and details are present in server HTML and work before hydration. */
export default function TableOfContents({ content, minHeadings = 3, variant = 'inline' }: TableOfContentsProps) {
  const headings = articleHeadings(content);
  if (headings.length < minHeadings) return null;
  const links = (
    <nav aria-label={t('article.tableOfContents')}>
      <ul className="m-0 list-none p-0">
        {headings.map((heading, index) => (
          <li key={`${heading.id}-${index}`} className="m-0" style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
            <a href={`#${heading.id}`} className="block py-2.5 text-sm leading-relaxed text-gray-300 hover:text-yellow-400 no-underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
  if (variant === 'sidebar') return <div className="article-toc"><h2 className="mb-3 text-base text-white">{t('article.tableOfContents')}</h2>{links}</div>;
  return (
    <details className="article-toc not-prose my-6 border-y border-gray-700 xl:hidden">
      <summary className="cursor-pointer py-4 text-sm font-medium text-yellow-400">
        {t('article.tableOfContents')} <span className="ml-2 text-gray-400">({headings.length})</span>
      </summary>
      <div className="pb-3">{links}</div>
    </details>
  );
}
