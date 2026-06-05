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

  return (
    <div>
      {sections.map((sectionHtml, i) => (
        <React.Fragment key={i}>
          <div className={proseClass}>
            <ProcessedContent content={sectionHtml} />
          </div>

          {/* In-article ad every N sections (skip first section, skip last) */}
          {i > 0 && i < totalSections - 1 && (i + 1) % AD_EVERY_N_SECTIONS === 0 && (
            SHOW_MANUAL_ADS && (
              <div className="my-8 not-prose">
                <div className="ad-label text-center text-xs text-gray-500 mb-2">{t('article.adLabel')}</div>
                {SHOW_MANUAL_ADS && <ResponsiveAd adSlot="5844341661" />}
              </div>
            )
          )}

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
      ))}
    </div>
  );
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
