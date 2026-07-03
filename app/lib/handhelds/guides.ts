// Buying-guide loader. Guides are authored as markdown files in
// content/handheld-guides/*.md (frontmatter = title/description/picks/faq, body =
// editorial prose). Picks reference handhelds by slug; this loader resolves them
// against the live dataset and THROWS on an unknown slug, so a typo fails the
// build instead of shipping a broken guide. Prices are pulled live at render
// time from queries, so editing prose never staleness-rots pricing.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getHandheld } from './queries';
import type { Handheld } from './types';

const DIR = path.join(process.cwd(), 'content/handheld-guides');

export interface GuidePick {
  slug: string;
  note: string;
  handheld: Handheld;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updated: string;
  picks: GuidePick[];
  faq: GuideFaq[];
  body: string; // markdown
}

function parseFile(file: string): Guide {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = String(data.slug || file.replace(/\.md$/, ''));

  const rawPicks: Array<{ slug?: string; note?: string }> = Array.isArray(data.picks) ? data.picks : [];
  const picks: GuidePick[] = rawPicks.map((p) => {
    const handheld = p.slug ? getHandheld(p.slug) : null;
    if (!handheld) {
      throw new Error(`[guides] ${file}: unknown pick slug "${p.slug}" — fix the .md frontmatter`);
    }
    return { slug: handheld.slug, note: String(p.note ?? ''), handheld };
  });
  if (!picks.length) throw new Error(`[guides] ${file}: a guide must have at least one pick`);

  const rawFaq: Array<{ q?: string; a?: string }> = Array.isArray(data.faq) ? data.faq : [];
  const faq: GuideFaq[] = rawFaq
    .filter((f) => f.q && f.a)
    .map((f) => ({ q: String(f.q), a: String(f.a) }));

  return {
    slug,
    title: String(data.title || slug),
    description: String(data.description || ''),
    updated: String(data.updated || ''),
    picks,
    faq,
    body: content.trim(),
  };
}

/** All guides, sorted by title. Reads the markdown dir each call (dev-friendly). */
export function getAllGuides(): Guide[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parseFile)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getGuide(slug: string): Guide | null {
  return getAllGuides().find((g) => g.slug === slug) ?? null;
}
