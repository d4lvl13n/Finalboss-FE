import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import { BUILDS_PER_PAGE, TOTK_GAME_SLUG, buildPath, type BuildCategory, type TotkBuild } from './types';
import { cataloguePath, collectionBuilds, collectionFor } from './collections';
import { TOTK_BUILDS } from './catalogue';

function compact(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return value.slice(0, limit - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
}

export function buildSeo(build: TotkBuild) {
  const shortName = compact(build.name, 44);
  const ambiguous = TOTK_BUILDS.some((other) => other.id !== build.id && compact(other.name, 44) === shortName);
  const identity = ambiguous ? `${compact(build.name, 36)} #${build.id}` : shortName;
  return buildPageMetadata({
    title: `${identity} QR Code — Zelda TOTK`,
    description: compact(`Download the ${identity} Autobuild QR code for Zelda TOTK.${build.zonaite === null ? '' : ` Listed cost: ${build.zonaite} Zonaite.`} View the blueprint and import it with Zelda Notes on Switch 2.`, 165),
    path: buildPath(build), image: build.image,
    imageWidth: build.imageWidth, imageHeight: build.imageHeight,
  });
}

export function buildQuestions(build: TotkBuild) {
  return [
    {
      question: `How much Zonaite does ${build.name} cost?`,
      answer: build.zonaite === null
        ? 'No Zonaite cost was supplied for this blueprint. Check the preview and the in-game Autobuild estimate before confirming the build.'
        : `The listed cost is ${build.zonaite} Zonaite. Autobuild uses compatible parts lying nearby first, so the amount needed can be lower when those parts are available.`,
    },
    {
      question: `How do I import ${build.name} with a QR code?`,
      answer: 'Save the original QR image or open it on another screen. In the Nintendo Switch App, go to Zelda Notes, choose Autobuild Sharing and scan or select the image. Choose Send to Game, then select the blueprint in Autobuild. QR importing requires Tears of the Kingdom — Nintendo Switch 2 Edition.',
    },
  ];
}

export function collectionSeo(category: BuildCategory, page: number) {
  const collection = collectionFor(category);
  const title = category === 'all' ? `Zelda TOTK Builds: ${TOTK_BUILDS.length} Autobuild QR Codes` : collection.title;
  return buildPageMetadata({
    title: `${title}${page > 1 ? ` — Page ${page}` : ''}`,
    description: compact(`${page > 1 ? `Page ${page}: ` : ''}${collection.description}`, 165),
    path: cataloguePath(category, page),
    image: '/images/zelda-totk-review.jpg',
  });
}

export function collectionJsonLd(builds: readonly TotkBuild[], category: BuildCategory, page: number) {
  const collection = collectionFor(category);
  const offset = (page - 1) * BUILDS_PER_PAGE;
  const visible = collectionBuilds(builds, category).slice(offset, offset + BUILDS_PER_PAGE);
  const url = absoluteUrl(cataloguePath(category, page));
  return {
    '@type': 'CollectionPage', '@id': `${url}#collection`, url,
    name: `${collection.title}${page > 1 ? ` — Page ${page}` : ''}`,
    description: collection.description,
    about: { '@type': 'VideoGame', name: 'The Legend of Zelda: Tears of the Kingdom', url: absoluteUrl(`/game/${TOTK_GAME_SLUG}`) },
    mainEntity: {
      '@type': 'ItemList', numberOfItems: visible.length,
      itemListElement: visible.map((build, i) => ({
        '@type': 'ListItem', position: offset + i + 1,
        item: { '@type': 'CreativeWork', name: build.name, url: absoluteUrl(buildPath(build)), image: absoluteUrl(build.image) },
      })),
    },
  };
}
