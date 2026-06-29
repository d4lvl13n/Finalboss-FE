// Auto-links the FIRST occurrence of each known glossary term/alias in a block
// of product prose to its glossary page. Links each term at most once, prefers
// the longest match, and never nests links. Server component.

import React from 'react';
import Link from 'next/link';
import { GLOSSARY } from '@/app/lib/laptops/glossary';

interface Entry {
  text: string;
  slug: string;
}

// term + aliases → slug, longest text first so the alternation prefers it.
const ENTRIES: Entry[] = GLOSSARY.flatMap((t) => [
  { text: t.term, slug: t.slug },
  ...t.aliases.map((a) => ({ text: a, slug: t.slug })),
]).sort((a, b) => b.text.length - a.text.length);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERN = new RegExp(`\\b(${ENTRIES.map((e) => escapeRe(e.text)).join('|')})\\b`, 'gi');

export default function TermLinker({ text, className }: { text: string; className?: string }) {
  const linked = new Set<string>();
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  PATTERN.lastIndex = 0;

  while ((m = PATTERN.exec(text)) !== null) {
    const matchText = m[0];
    const entry = ENTRIES.find((e) => e.text.toLowerCase() === matchText.toLowerCase());
    if (!entry || linked.has(entry.slug)) continue; // already linked → leave as plain text
    linked.add(entry.slug);
    nodes.push(text.slice(last, m.index));
    nodes.push(
      <Link
        key={`${entry.slug}-${m.index}`}
        href={`/gaming-laptops/glossary/${entry.slug}`}
        className="text-amber-300/90 underline decoration-dotted underline-offset-2 hover:text-amber-200"
      >
        {matchText}
      </Link>,
    );
    last = m.index + matchText.length;
  }
  nodes.push(text.slice(last));

  return <span className={className}>{nodes}</span>;
}
