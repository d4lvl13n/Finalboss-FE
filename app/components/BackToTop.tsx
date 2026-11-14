import { t } from '../lib/i18n';

/** Plain anchor to the top of the page. CSS reveals it after some scrolling. */
export default function BackToTop() {
  const label = t('a11y.backToTop') === 'a11y.backToTop' ? 'Back to top' : t('a11y.backToTop');
  return (
    <a href="#top" className="fb-totop" aria-label={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </a>
  );
}
