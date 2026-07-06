// Kinguin affiliate — one place owns the game-key money path.
//
// The FinalBoss referral code is public (it appears in every affiliate URL), so
// it's safe to hardcode. Kinguin sets the referral cookie on any kinguin.net
// landing that carries `?r=<code>`, so a contextual search deep-link both lands
// the reader on keys for the specific game AND tracks the referral.

export const KINGUIN_REF = '69c1463b5a34a';

/** Contextual Kinguin search for a game, with the referral attached. */
export function kinguinSearchUrl(game: string): string {
  return `https://www.kinguin.net/listing?active=1&phrase=${encodeURIComponent(game)}&r=${KINGUIN_REF}`;
}

/** Generic already-tagged Kinguin link (fallback when no game context). */
export const KINGUIN_HOME_URL = `https://www.kinguin.net/?r=${KINGUIN_REF}`;

// Matches the generic homepage ref link baked into WordPress article content by
// the publishing pipeline, in any http/https/www form.
const GENERIC_KINGUIN_RE = /https?:\/\/(?:www\.)?kinguin\.net\/\?r=69c1463b5a34a/gi;

/**
 * Rewrite the generic Kinguin ref link inside a WP content string into a
 * game-contextual search link, so a guide about <game> sends readers to keys
 * for THAT game instead of the homepage. Referral tracking is preserved.
 *
 * `&` is entity-encoded (`&amp;`) because the value lives in an HTML `href`
 * attribute that html-react-parser will decode back to `&` at render time.
 * No-ops when there's no game context (leaves the generic link untouched).
 */
export function contextualizeKinguinLinks(html: string, gameName?: string): string {
  if (!html || !gameName || !gameName.trim()) return html;
  const href = kinguinSearchUrl(gameName.trim()).replace(/&/g, '&amp;');
  return html.replace(GENERIC_KINGUIN_RE, href);
}
