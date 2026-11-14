import Link from 'next/link';
import Image from 'next/image';
import { PLACEHOLDER_BASE64 } from '../../utils/placeholder';
import { t } from '../../lib/i18n';
import { formatDate } from '../../utils/formatDate';
import { normalizeWordPressImageSrc } from '../../lib/imageUrl';
import type { ExtraPost } from '../../lib/articleExtras';

interface RelatedArticlesProps {
  articles: ExtraPost[];
  sequentialPosts?: { newer?: ExtraPost[]; older?: ExtraPost[] };
  authorPosts?: ExtraPost[];
  sectionTitle?: string;
}

function Card({ post }: { post: ExtraPost }) {
  const imageUrl = normalizeWordPressImageSrc(post.featuredImage?.node?.thumb || post.featuredImage?.node?.sourceUrl);
  const category = post.categories?.nodes?.[0]?.name;
  return (
    <Link prefetch={false} href={`/${post.slug}`} className="fb-card">
      <span className="fb-card-art">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL={PLACEHOLDER_BASE64}
          />
        )}
      </span>
      <span className="fb-card-meta">
        {category && <span className="fb-kind">{category}</span>}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <h3>{post.title}</h3>
    </Link>
  );
}

/**
 * End-of-article reading list. Server component: every link is in the HTML
 * that search engines read (the old version loaded them in the browser).
 */
export default function RelatedArticles({
  articles,
  sequentialPosts,
  authorPosts,
  sectionTitle = t('article.relatedTitle'),
}: RelatedArticlesProps) {
  const prevPost = sequentialPosts?.older?.[0];
  const nextPost = sequentialPosts?.newer?.[0];
  const hasAnything = articles.length > 0 || prevPost || nextPost || (authorPosts?.length ?? 0) > 0;

  return (
    <section className="fb-more">
      <div className="fb-wrap">
        {(prevPost || nextPost) && (
          <nav className="fb-seq" aria-label={t('article.continueReading')}>
            {prevPost && (
              <Link prefetch={false} href={`/${prevPost.slug}`} className="fb-seq-link">
                <span>{t('article.previousArticle')}</span>
                <strong>{prevPost.title}</strong>
              </Link>
            )}
            {nextPost && (
              <Link prefetch={false} href={`/${nextPost.slug}`} className="fb-seq-link fb-seq-next">
                <span>{t('article.nextArticle')}</span>
                <strong>{nextPost.title}</strong>
              </Link>
            )}
          </nav>
        )}

        {articles.length > 0 && (
          <>
            <h2 className="fb-sec">{sectionTitle}</h2>
            <div className="fb-cards">
              {articles.slice(0, 4).map((post) => (
                <Card key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {authorPosts && authorPosts.length > 0 && (
          <>
            <h2 className="fb-sec">{t('article.moreFromAuthor')}</h2>
            <div className="fb-cards fb-cards-3">
              {authorPosts.slice(0, 3).map((post) => (
                <Card key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {!hasAnything && (
          <div className="fb-more-empty">
            <h2 className="fb-sec">{t('article.noRelated')}</h2>
            <p>{t('article.noRelatedTip')}</p>
            <Link prefetch={false} href="/articles" className="fb-btn">
              {t('article.browseAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
