'use client';

import React from 'react';
import { Element, htmlToDOM, type DOMNode } from 'html-react-parser';
import { render } from 'dom-serializer';
import ProcessedContent from '../ProcessedContent';
import { ResponsiveAd } from '../AdSense/AdBanner';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import InlineContentUpgrade from '../LeadCapture/InlineContentUpgrade';
import { t } from '../../lib/i18n';
import { stripDocumentTagsFromHtml } from '../../lib/wpContent';

interface ArticleBodyWithAdsProps {
  content: string;
  sourceSansClassName: string;
  articleTitle: string;
  categoryName: string;
}

/** Number of H2 sections between each in-article ad. */
const AD_EVERY_N_SECTIONS = 3;

/**
 * Splits article HTML at top-level `<h2>` boundaries, renders each chunk via
 * ProcessedContent, and injects ad slots + a mid-article email CTA between sections.
 *
 * This must be DOM-aware. String-splitting on `<h2>` tears apart custom wrappers
 * authored in WordPress whenever they contain nested headings.
 */
export default function ArticleBodyWithAds({
  content,
  sourceSansClassName,
  articleTitle,
  categoryName,
}: ArticleBodyWithAdsProps) {
  const sections = splitAtTopLevelH2(content);
  const totalSections = sections.length;
  // Place email CTA roughly in the middle
  const ctaIndex = Math.max(1, Math.floor(totalSections / 2));

  const proseClass = `${sourceSansClassName} prose prose-lg prose-invert mx-auto max-w-3xl text-[18px] md:text-[19px] leading-8 tracking-[0.0025em]`;

  const adUnit = (
    <div className="my-8 not-prose">
      <div className="ad-label text-center text-xs text-gray-500 mb-2">{t('article.adLabel')}</div>
      <ResponsiveAd adSlot="5844341661" />
    </div>
  );

  return (
    <div>
      {sections.map((sectionHtml, i) => {
        // Section 0 is the intro (everything before the first H2). Inject the
        // first ad after its 1st–2nd paragraph: the reader is past the hook and
        // engaged, which converts better than a banner above all content.
        if (i === 0 && SHOW_MANUAL_ADS) {
          const [head, tail] = splitAfterParagraphs(sectionHtml, 2);
          return (
            <React.Fragment key={i}>
              <div className={proseClass}>
                <ProcessedContent content={head} />
              </div>
              {adUnit}
              {tail && (
                <div className={proseClass}>
                  <ProcessedContent content={tail} />
                </div>
              )}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={i}>
            <div className={proseClass}>
              <ProcessedContent content={sectionHtml} />
            </div>

            {/* Deeper in-article ad every N sections (skip first + last) */}
            {SHOW_MANUAL_ADS && i > 0 && i < totalSections - 1 && (i + 1) % AD_EVERY_N_SECTIONS === 0 && adUnit}

            {/* Mid-article email CTA */}
            {i === ctaIndex && totalSections >= 4 && (
              <div className="my-8 not-prose">
                <InlineContentUpgrade
                  title={t('article.contentUpgrade.title')}
                  description={t('article.contentUpgrade.description')}
                  bonusContent={t('article.contentUpgrade.bonus', { category: categoryName })}
                  articleTopic={articleTitle}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Splits HTML after the Nth top-level `</p>`. Returns [head, tail]. Used to drop
 * an ad into the intro after the 1st–2nd paragraph. If fewer than N paragraphs
 * exist, head is the whole string and tail is empty (ad lands after the intro).
 */
function splitAfterParagraphs(html: string, n: number): [string, string] {
  const re = /<\/p>/gi;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    count++;
    if (count === n) {
      const cut = match.index + match[0].length;
      return [html.slice(0, cut), html.slice(cut)];
    }
  }
  return [html, ''];
}

/**
 * Splits only on top-level H2 nodes. Any wrapper element is kept intact even if
 * it contains nested headings.
 */
function splitAtTopLevelH2(html: string): string[] {
  const nodes = htmlToDOM(sanitizeContentForSectioning(html));

  if (nodes.length === 0) {
    return [];
  }

  const sections: DOMNode[][] = [];
  let currentSection: DOMNode[] = [];

  for (const node of nodes) {
    if (isTopLevelH2(node) && currentSection.length > 0) {
      sections.push(currentSection);
      currentSection = [];
    }

    currentSection.push(node);
  }

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections
    .map((section) => render(section).trim())
    .filter((section) => section.length > 0);
}

function isTopLevelH2(node: DOMNode): boolean {
  return node instanceof Element && node.name === 'h2';
}

function sanitizeContentForSectioning(content: string): string {
  return stripDocumentTagsFromHtml(content)
    .replace(/<([a-zA-Z]+[^>]*)<(?=[^!])/g, '&lt;$1&lt;')
    .replace(/<(?![a-zA-Z/!])/g, '&lt;')
    .replace(
      /\[pokemon:([a-zA-Z0-9-]+)\]/gi,
      '<div class="fb-pokemon" data-name="$1"></div>'
    );
}
