import Link from 'next/link';
import Image from 'next/image';
import { normalizeWordPressImageSrc } from '../../lib/imageUrl';
import { formatDateShort } from '../../utils/formatDate';
import type { SectionPost } from '../../lib/sectionQuery';

// No 'use client' here on purpose: these render on the server for the first
// page and in the browser for "load more", from the same code.

const plain = (html?: string) =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/&[#a-z0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim() : '';

const thumb = (post: SectionPost) =>
  normalizeWordPressImageSrc(post.featuredImage?.node?.thumb || post.featuredImage?.node?.sourceUrl);

function kindClass(post: SectionPost): string {
  const c = post.categories?.nodes?.[0];
  const key = `${c?.slug || ''} ${c?.name || ''}`.toLowerCase();
  if (key.includes('guide')) return 'fb-kind fb-kind-guide';
  if (key.includes('review')) return 'fb-kind fb-kind-review';
  if (key.includes('tech')) return 'fb-kind fb-kind-tech';
  return 'fb-kind';
}

function Meta({ post }: { post: SectionPost }) {
  const name = post.categories?.nodes?.[0]?.name;
  return (
    <span className="fb-row-meta">
      {name && <span className={kindClass(post)}>{name}</span>}
      <time dateTime={post.date}>{formatDateShort(post.date)}</time>
    </span>
  );
}

/** Two of these open a section page: enough weight to lead, no full-width image. */
export function LeadTile({ post, priority = false }: { post: SectionPost; priority?: boolean }) {
  const src = thumb(post);
  return (
    <Link prefetch={false} href={`/${post.slug}`} className="fb-lead-tile">
      <span className="fb-art block">
        {src && (
          <Image src={src} alt="" fill priority={priority} sizes="(max-width: 700px) 100vw, 480px" style={{ objectFit: 'cover' }} />
        )}
      </span>
      <Meta post={post} />
      <h2>{post.title}</h2>
      <p>{plain(post.excerpt)}</p>
    </Link>
  );
}

/** One line of the feed: thumbnail, type, title, one line of summary. */
export default function PostRow({ post }: { post: SectionPost }) {
  const src = thumb(post);
  return (
    <Link prefetch={false} href={`/${post.slug}`} className="fb-post">
      <span className="fb-art">
        {src && <Image src={src} alt="" fill sizes="200px" style={{ objectFit: 'cover' }} />}
      </span>
      <span>
        <Meta post={post} />
        <h3>{post.title}</h3>
        <p>{plain(post.excerpt)}</p>
      </span>
    </Link>
  );
}
