import { BUILDS_PER_PAGE, TOTK_BUILDS_PATH, type BuildCategory, type TotkBuild } from './types';

export const TOTK_COLLECTIONS = [
  { id: 'all', title: 'Zelda TOTK Builds & QR Codes', shortTitle: 'All Autobuilds',
    description: 'Browse Zelda: Tears of the Kingdom Autobuild QR codes for flying machines, combat vehicles and useful creations. Compare Zonaite costs and download a blueprint for Zelda Notes.',
    intro: 'Find an Autobuild blueprint for your next trip across Hyrule. This collection includes flying machines, combat vehicles, boats and practical builds, each with a downloadable QR image. Search by name or device, compare the listed Zonaite costs, and use the community-tested filter to narrow your choice.' },
  { id: 'flying', title: 'Zelda TOTK Flying Builds & Hoverbike QR Codes', shortTitle: 'Flying Builds',
    description: 'Find Zelda TOTK flying builds, hoverbikes and planes with downloadable Autobuild QR codes. Compare Zonaite costs and import a blueprint with Zelda Notes.',
    intro: 'Browse flying machines, hoverbikes and planes for Tears of the Kingdom. Compare the listed Zonaite costs to choose a blueprint for exploration or transport. Each build has its own QR image; check the individual description for its devices, handling notes and any special requirements.' },
  { id: 'combat', title: 'Zelda TOTK Combat Builds, Tanks & Weapon QR Codes', shortTitle: 'Combat Builds',
    description: 'Explore Zelda TOTK combat builds, tanks, laser machines and weapons. View each blueprint, check its Zonaite cost and download the original Autobuild QR code.',
    intro: 'Explore combat-focused Tears of the Kingdom creations, including weapon platforms, tanks and machines equipped with Zonai devices. The build descriptions contain any supplied equipment or operating notes. Use the Zonaite budget filter to compare listed costs before importing a QR into Zelda Notes.' },
  { id: 'transport', title: 'Zelda TOTK Transport & Korok Build QR Codes', shortTitle: 'Transport Builds',
    description: 'Browse Zelda TOTK transport builds and Korok carriers. Find an Autobuild blueprint, compare listed Zonaite costs and save its QR code for Zelda Notes.',
    intro: 'Find Tears of the Kingdom builds intended for carrying passengers, Koroks or cargo. Some overlap with the flying and water collections, so open each blueprint to check its intended use. Download the QR image to bring a design into the Switch 2 Edition through Zelda Notes.' },
  { id: 'water', title: 'Zelda TOTK Boat & Amphibious Build QR Codes', shortTitle: 'Boats & Water Builds',
    description: 'Discover Zelda TOTK boats and amphibious builds with Autobuild QR codes. Compare the blueprints and their listed Zonaite costs before saving a design.',
    intro: 'Browse boats, sailing creations and amphibious machines for Tears of the Kingdom. The collection brings together water-focused blueprints with their original QR images. Look at the description of each design for its devices and controls, then compare the listed cost with your Zonaite budget.' },
  { id: 'ground', title: 'Zelda TOTK Vehicle, Bike & Buggy QR Codes', shortTitle: 'Land Vehicles',
    description: 'Find Zelda TOTK land vehicles, bikes and buggies. Explore Autobuild blueprints, compare listed Zonaite costs and download QR images for Zelda Notes.',
    intro: 'Explore ground-focused Tears of the Kingdom vehicles, including bikes, buggies and other wheeled creations. Each blueprint has a separate page with the available description, listed cost and original QR image. Use search to find a particular design or device without browsing the entire collection.' },
  { id: 'utility', title: 'Zelda TOTK Utility & Farming Build QR Codes', shortTitle: 'Utility Builds',
    description: 'Browse Zelda TOTK utility builds, apple pickers and farming machines. Find a practical Autobuild blueprint and download its QR code for Zelda Notes.',
    intro: 'Find practical Tears of the Kingdom creations for collecting items, gathering resources and other tasks. This collection includes utility blueprints such as apple pickers and mining machines. Read the supplied instructions on each build page, especially where a design depends on a particular location or setup.' },
  { id: 'glitches', title: 'Zelda TOTK Glitch Build QR Codes', shortTitle: 'Glitch Builds',
    description: 'Explore Zelda TOTK glitch-related Autobuild QR codes. Read the individual build notes and requirements before downloading a blueprint for Zelda Notes.',
    intro: 'Browse Tears of the Kingdom blueprints described as glitch-related by their supplied names or tags. Requirements and behavior can vary between game versions. Read the individual notes before importing a QR; a readable code by itself does not confirm that every effect still works in the game.' },
  { id: 'other', title: 'More Zelda TOTK Autobuild QR Codes', shortTitle: 'More Creations',
    description: 'Explore more Zelda TOTK creations and Autobuild QR codes. Search the collection, check the available build details and download a blueprint for Zelda Notes.',
    intro: 'Explore Tears of the Kingdom creations that do not fit a more specific collection. Search by name, device or tag, and open a blueprint to see its available description and original QR image. A missing Zonaite cost means that no cost was supplied; it does not mean the build is free.' },
] as const;

export function collectionFor(category: BuildCategory) {
  return TOTK_COLLECTIONS.find((collection) => collection.id === category)!;
}

export function cataloguePath(category: BuildCategory = 'all', page = 1): string {
  const base = category === 'all' ? TOTK_BUILDS_PATH : `${TOTK_BUILDS_PATH}/category/${category}`;
  return page > 1 ? `${base}/page/${page}` : base;
}

export function catalogueLocation(pathname: string): { category: BuildCategory; page: number } {
  const suffix = pathname.startsWith(TOTK_BUILDS_PATH) ? pathname.slice(TOTK_BUILDS_PATH.length) : '';
  const match = suffix.match(/^(?:\/category\/([a-z]+))?(?:\/page\/(\d+))?\/?$/);
  const category = TOTK_COLLECTIONS.find((collection) => collection.id === match?.[1])?.id || 'all';
  return { category, page: Number(match?.[2]) || 1 };
}

export function collectionBuilds(builds: readonly TotkBuild[], category: BuildCategory): TotkBuild[] {
  return builds.filter((build) => category === 'all' || build.categories.includes(category));
}

export function collectionPageCount(builds: readonly TotkBuild[], category: BuildCategory): number {
  return Math.ceil(collectionBuilds(builds, category).length / BUILDS_PER_PAGE);
}

export function paginatedCollectionParams(builds: readonly TotkBuild[], category: BuildCategory) {
  return Array.from({ length: Math.max(0, collectionPageCount(builds, category) - 1) }, (_, i) => String(i + 2));
}
