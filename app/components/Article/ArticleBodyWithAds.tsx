'use client';

import React from 'react';
import ProcessedContent from '../ProcessedContent';
import { ResponsiveAd } from '../AdSense/AdBanner';
import { SHOW_MANUAL_ADS, ENABLE_EZOIC } from '../../lib/adsConfig';
import InlineContentUpgrade from '../LeadCapture/InlineContentUpgrade';
import { t } from '../../lib/i18n';

interface ArticleBodyWithAdsProps {
  content: string;
  sourceSansClassName: string;
  articleTitle: string;
  categoryName: string;
}

/** Number of H2 sections between each in-article ad. */
const AD_EVERY_N_SECTIONS = 3;

/**
 * Splits article HTML at `<h2` boundaries, renders each chunk via
 * ProcessedContent, and injects ad slots + a mid-article email CTA
 * between sections.
 */
export default function ArticleBodyWithAds({
  content,
  sourceSansClassName,
  articleTitle,
  categoryName,
}: ArticleBodyWithAdsProps) {
  // Split content at each <h2 (keeping the h2 with the following section)
  const sections = splitAtH2(content);
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
            (SHOW_MANUAL_ADS || ENABLE_EZOIC) && (
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
 * Splits HTML string at `<h2` boundaries.
 * First section is everything before the first H2.
 * Returns at least 1 section (the whole content if no H2s).
 */
function splitAtH2(html: string): string[] {
  // Split at positions right before <h2 (case-insensitive)
  const parts = html.split(/(?=<h2[\s>])/i);
  // Filter out empty strings
  return parts.filter((p) => p.trim().length > 0);
}
