export const gta6MapPath = '/game/gta-6/map';
export const leonidaMap = {
  src: 'https://www.rockstargames.com/VI/_next/static/media/Leonida_Map_Poster.08ir77j-.26ny.jpg',
  width: 2805,
  height: 3840,
  source: 'https://www.rockstargames.com/VI/media/artwork-wallpapers',
};

export type MapPoint = [x: number, y: number];

// The digital and printable editions share the same margins and map frame.
function posterPoint(x: number, y: number): MapPoint {
  return [x * 100 / 5775, y * 100 / 7900];
}


const guides = {
  cards: { en: 'gta-6-collectible-cards', fr: 'gta-6-cartes-a-collectionner' },
  watches: {
    en: 'gta-6-waink-scan-locations',
    fr: 'gta-6-emplacements-des-scans-waink-dans-monuments-sculptures-et-tags-no-flusher',
  },
  scans: {
    en: 'gta-6-waink-scan-locations',
    fr: 'gta-6-emplacements-des-scans-waink-dans-monuments-sculptures-et-tags-no-flusher',
  },
  flamingos: {
    en: 'gta-6-cocaine-flamingo-locations',
    fr: 'gta-6-emplacements-des-flamingos-de-cocaine-dans-belpoint-watson-bay-et-la-perle',
  },
  jumps: {
    en: 'gta-6-stunt-jump-locations',
    fr: 'gta-6-emplacements-des-sauts-uniques-dans-et-comment-reussir-les-300-cascades',
  },
};

export type MapCategory = keyof typeof guides;
export const mapRegions = [
  'Key Lento', 'Abismo Key', 'Mile Zero', 'Southwind', 'Corsair Key', 'Riquezas Keys',
  'Grassrivers', 'Hamlet', 'Watson Bay', 'Belpoint', 'Port Gellhorn', 'Vice City',
  'Vice Beach', 'Catalan Key', 'Featherstone Islands',
] as const;
export type MapRegion = (typeof mapRegions)[number];
type Locale = 'en' | 'fr';
type Translated = Record<Locale, string>;

interface MapLocation {
  id: string;
  region: MapRegion;
  category: MapCategory;
  position: MapPoint;
  approximate?: boolean;
  name: string | Translated;
  directions: Translated;
  anchor: string;
  image?: { file: string; alt: Translated };
}

const locations: MapLocation[] = [
  {
    id: 'santiago-lopez', region: 'Key Lento', category: 'cards', position: posterPoint(3420, 6310), approximate: true,
    name: 'Santiago Lopez',
    directions: {
      en: 'On Peach Palm Drive, enter the yellow-and-white mobile home just west of Jason’s house. The card is on the bedside table in the back bedroom.',
      fr: 'Sur Peach Palm Drive, entrez dans le mobile home jaune et blanc juste à l’ouest de la maison de Jason. La carte est sur la table de nuit de la chambre du fond.',
    },
    anchor: 'extra-card-pickups',
    image: {
      file: 'gta-6-key-lento-santiago-lopez-bedside-table',
      alt: { en: 'Card pickup prompt beside the bed', fr: 'Indication de ramassage à côté du lit' },
    },
  },
  {
    id: 'the-educated-woman', region: 'Key Lento', category: 'cards', position: posterPoint(3410, 6250), approximate: true,
    name: 'The Educated Woman',
    directions: {
      en: 'Find the red-and-white mobile home on Scuttlebutt Drive in northern Key Lento. The white-bordered card is on the front steps.',
      fr: 'Repérez le mobile home rouge et blanc sur Scuttlebutt Drive, dans le nord de Key Lento. La carte à bordure blanche est sur les marches de l’entrée.',
    },
    anchor: 'extra-card-pickups',
    image: {
      file: 'gta-6-key-lento-educated-woman-card',
      alt: { en: 'The white-bordered Educated Woman card', fr: 'La carte The Educated Woman à bordure blanche' },
    },
  },
  {
    id: 'marquise-bernard', region: 'Key Lento', category: 'cards', position: posterPoint(3493, 6404),
    name: 'Marquise Bernard',
    directions: {
      en: 'Stop at Kenton’s shop in Key Lento. Check the barrel just outside the shop for the card.',
      fr: 'Arrêtez-vous chez Kenton à Key Lento. La carte se trouve sur le tonneau juste à l’extérieur de la boutique.',
    },
    anchor: 'south-pickups',
  },
  {
    id: 'novak-laurent-alcazar', region: 'Key Lento', category: 'watches', position: posterPoint(3490, 6224), approximate: true,
    name: 'Novak Laurent Alcazar',
    directions: {
      en: 'On Dolphin Drive near the Corsair Key bridge, find the house next to the yard with a basketball hoop. Take the exterior stairs and enter the first bedroom on the left. Check the table by the window.',
      fr: 'Sur Dolphin Drive, près du pont de Corsair Key, repérez la maison à côté du jardin au panier de basket. Montez par l’escalier extérieur et prenez la première chambre à gauche. La montre est sur la table près de la fenêtre.',
    },
    anchor: 'watch-key-lento',
  },
  {
    id: 'gambit-bay-flamingo', region: 'Key Lento', category: 'flamingos', position: posterPoint(3414, 6226),
    name: 'Gambit Bay',
    directions: {
      en: 'At the Gambit Bay end of Key Lento, check the lawn between the palm trunks. Aim at the pink figure with a black-and-white beak.',
      fr: 'À l’extrémité de Key Lento côté Gambit Bay, regardez sur la pelouse entre les palmiers. Visez la figurine rose au bec noir et blanc.',
    },
    anchor: 'more-mariana-flamingos',
  },
  {
    id: 'surfside-drive-flamingo', region: 'Key Lento', category: 'flamingos', position: posterPoint(3115, 6746),
    name: 'Surfside Drive',
    directions: {
      en: 'Find the porch with purple lighting and inflatable pool toys. Look for the flamingo in the grass beside the steps.',
      fr: 'Trouvez le porche aux lumières violettes et aux bouées gonflables. Le flamant se trouve dans l’herbe à côté des marches.',
    },
    anchor: 'more-mariana-flamingos',
  },
  {
    id: 'saltrock-east', region: 'Abismo Key', category: 'jumps', position: posterPoint(2181, 6976),
    name: { en: 'Saltrock Bridge East', fr: 'Saltrock Bridge, côté est' },
    directions: {
      en: 'Take the open road around to the Abismo Key end of the abandoned span. Line up with the gap in the old road and use the east-side jump.',
      fr: 'Prenez la route ouverte jusqu’au côté Abismo Key du pont abandonné. Alignez-vous sur la coupure de l’ancienne chaussée pour effectuer le saut côté est.',
    },
    anchor: 'stunt-jumps-early-route',
  },
  {
    id: 'saltrock-west', region: 'Mile Zero', category: 'jumps', position: posterPoint(1939, 6865),
    name: { en: 'Saltrock Bridge West', fr: 'Saltrock Bridge, côté ouest' },
    directions: {
      en: 'From the Mile Zero side, leave the working road for the dirt approach. Take a run-up toward the broken edge of the old span.',
      fr: 'Côté Mile Zero, quittez la route en service pour le chemin de terre. Prenez de l’élan vers le bord cassé du vieux pont.',
    },
    anchor: 'stunt-jumps-early-route',
    image: {
      file: 'gta-6-stunt-saltrock-bridge-west-approach',
      alt: { en: 'The dirt approach on the west side of the abandoned bridge', fr: 'Le chemin de terre du côté ouest du pont abandonné' },
    },
  },
  {
    id: 'mile-zero-south', region: 'Mile Zero', category: 'jumps', position: posterPoint(1440, 6927),
    name: { en: 'Mile Zero Air Station South', fr: 'Base de Mile Zero, saut sud' },
    directions: {
      en: 'Follow the service road outside the southern fence. Back up on the gravel and drive straight up the broad dirt mound toward the airfield.',
      fr: 'Longez la clôture sud par la voie de service. Reculez sur le gravier, puis visez la grosse butte de terre en ligne droite vers l’aérodrome.',
    },
    anchor: 'stunt-jumps-early-route',
    image: {
      file: 'gta-6-stunt-mile-zero-south-dirt-ramp',
      alt: { en: 'Dirt ramp outside the airfield fence', fr: 'Tremplin de terre à l’extérieur de la clôture de la base' },
    },
  },
  {
    id: 'mile-zero-southeast', region: 'Mile Zero', category: 'jumps', position: posterPoint(1784, 6849),
    name: { en: 'Mile Zero Air Station Southeast', fr: 'Base de Mile Zero, saut sud-est' },
    directions: {
      en: 'Follow the approach road toward the southeast gate. On a bike, aim for the dirt ramp by the fence and land on the flat ground beside the airfield buildings.',
      fr: 'Suivez la route d’accès vers le portail sud-est. À moto, visez le tremplin de terre près de la clôture et posez-vous sur le terrain plat à côté des bâtiments.',
    },
    anchor: 'stunt-jumps-early-route',
    image: {
      file: 'gta-6-stunt-mile-zero-southeast-motorcycle-jump',
      alt: { en: 'Motorcycle approach to the southeast jump', fr: 'Trajectoire à moto vers le saut sud-est' },
    },
  },
  {
    id: 'goose-key-flamingo', region: 'Mile Zero', category: 'flamingos', position: posterPoint(1919, 6869),
    name: { en: 'Goose Key rocky shore', fr: 'Rivage rocheux de Goose Key' },
    directions: {
      en: 'Approach by water and check the rock barrier on the south side of the military island, near the east end of the runways. Look between the rocks.',
      fr: 'Approchez par l’eau et rejoignez l’enrochement sur la côte sud de l’île militaire, vers l’extrémité est des pistes. Cherchez entre les rochers.',
    },
    anchor: 'goose-key',
    image: {
      file: 'gta-6-mile-zero-goose-key-flamingo-rocks',
      alt: { en: 'Flamingo figures and the package in the rocks', fr: 'Figurines et paquet entre les rochers' },
    },
  },
  {
    id: 'southwind-flamingo', region: 'Southwind', category: 'flamingos', position: posterPoint(2022, 6608),
    name: { en: 'Southwind beach shack', fr: 'Cabane de plage de Southwind' },
    directions: {
      en: 'Take a boat east of Southwind to the camp on the Permit Keys shore. Find the hut with a blue panel, a yellow door and a tire. Look low between the door and the blue barrel.',
      fr: 'Partez en bateau à l’est de Southwind jusqu’au camp sur le rivage des Permit Keys. Repérez la cabane à la paroi bleue, avec une porte jaune et un pneu. Regardez au sol entre la porte et le tonneau bleu.',
    },
    anchor: 'southwind-shack',
    image: {
      file: 'gta-6-southwind-beach-shack-flamingo',
      alt: { en: 'Pickup by the yellow door and coiled hose', fr: 'Paquet près de la porte jaune et du tuyau enroulé' },
    },
  },
  {
    id: 'maximus-goldbart', region: 'Southwind', category: 'cards', position: posterPoint(1863, 6639),
    name: { en: 'Maximus Goldbart (Silver)', fr: 'Maximus Goldbart (argent)' },
    directions: {
      en: 'Take Cangrejo Street down to the water. Walk underneath the stilt house at the end of the road. Check the TV stand next to the shed.',
      fr: 'Suivez Cangrejo Street jusqu’à l’eau. Passez sous la maison sur pilotis au bout de la rue et regardez sur le meuble télé près de la remise.',
    },
    anchor: 'extra-card-pickups',
    image: {
      file: 'gta-6-southwind-maximus-goldbart-silver-card',
      alt: { en: 'Maximus Goldbart’s silver card', fr: 'La carte argent de Maximus Goldbart' },
    },
  },
  {
    id: 'vicki-starlet-motel', region: 'Port Gellhorn', category: 'cards', position: posterPoint(1900, 2920), approximate: true,
    name: 'Vicki',
    directions: {
      en: 'During Chapter 2, enter the Starlet Motel reception office and check beside the toilet in the bathroom. Pick up the card before starting Checking Out.',
      fr: 'Au chapitre 2, entrez dans la réception du Starlet Motel et regardez à côté de la cuvette dans les toilettes. Ramassez la carte avant Heurts de départ.',
    },
    anchor: 'port-gellhorn-pickups',
  },
  {
    id: 'victor-maravilla-starlet-motel', region: 'Port Gellhorn', category: 'cards', position: posterPoint(1900, 2920), approximate: true,
    name: 'Victor Maravilla',
    directions: {
      en: 'At the Starlet Motel in Chapter 2, go to the diner and inspect the refrigerator before Checking Out. Do this while the motel is still your safehouse.',
      fr: 'Au chapitre 2, entrez dans le restaurant du Starlet Motel et inspectez le réfrigérateur avant Heurts de départ, tant que le motel vous sert encore de planque.',
    },
    anchor: 'port-gellhorn-pickups',
    image: {
      file: 'gta-6-starlet-motel-victor-maravilla-fridge',
      alt: { en: 'Card pickup prompt on the motel refrigerator', fr: 'Indication de ramassage sur le frigo du motel' },
    },
  },
  {
    id: 'vaccerine-hamlet', region: 'Hamlet', category: 'cards', position: posterPoint(3310, 5560), approximate: true,
    name: 'Vaccerine',
    directions: {
      en: 'At the east edge of Hamlet, find the billboard beside I-97. Climb its maintenance ladder and check the corner of the platform behind the sign.',
      fr: 'À l’est de Hamlet, trouvez le panneau publicitaire au bord de l’I-97. Montez par l’échelle d’entretien et cherchez dans l’angle de la passerelle derrière le panneau.',
    },
    anchor: 'extra-card-pickups',
    image: {
      file: 'gta-6-hamlet-vaccerine-billboard-walkway',
      alt: { en: 'Maintenance walkway behind the billboard', fr: 'Passerelle d’entretien derrière le panneau' },
    },
  },
  {
    id: 'laki-maivia-cottonmouth', region: 'Grassrivers', category: 'cards', position: posterPoint(2720, 6143), approximate: true,
    name: { en: 'Laki Maivia (Bronze)', fr: 'Laki Maivia (bronze)' },
    directions: {
      en: 'Southwest of Cottonmouth Lake, enter the red-and-white trailer at the camp with a green canopy. Enter 44017 on the black safe under the microwave.',
      fr: 'Au sud-ouest de Cottonmouth Lake, entrez dans la caravane rouge et blanche du camp à la bâche verte. Tapez 44017 sur le coffre noir sous le micro-ondes.',
    },
    anchor: 'cottonmouth-lake-laki-maivia',
  },
  {
    id: 'death-of-swallow-marbelle', region: 'Vice City', category: 'cards', position: posterPoint(4020, 3988), approximate: true,
    name: { en: 'Death of Swallow (Purple)', fr: 'Death of Swallow (violet)' },
    directions: {
      en: 'Enter the boarded-up Marbelle Hotel through its rear door on NW 8th St in Crosstown. Look on the cabinet by the stairs.',
      fr: 'À Crosstown, entrez par l’arrière du Marbelle Hotel, le bâtiment condamné de NW 8th St. Regardez sur le meuble près de l’escalier.',
    },
    anchor: 'extra-card-pickups',
  },
  {
    id: 'monalisa-meerwunder', region: 'Featherstone Islands', category: 'cards', position: posterPoint(2310, 1209), approximate: true,
    name: { en: 'MonaLi$a (Silver)', fr: 'MonaLi$a (argent)' },
    directions: {
      en: 'Board the Meerwunder on the northern shore of the southeastern island. Take the outside stairs and yellow ladder, then check the blue bag on the upper landing by the rail.',
      fr: 'Montez à bord du Meerwunder, échoué sur la côte nord de l’île sud-est. Prenez l’escalier extérieur et l’échelle jaune. La carte est près du sac bleu sur le palier supérieur, contre la rambarde.',
    },
    anchor: 'meerwunder-card',
    image: {
      file: 'gta-6-meerwunder-monalisa-silver-card',
      alt: { en: 'Silver MonaLi$a card collected at the wreck', fr: 'Carte argent MonaLi$a ramassée dans l’épave' },
    },
  },
  {
    id: 'kingpin-orca-watch', region: 'Port Gellhorn', category: 'watches', position: posterPoint(1824, 3156), approximate: true,
    name: 'Crowex Octane “Orca”',
    directions: {
      en: 'Enter Kingpin Bowling and head toward the curved counter. Walk past the CCTV screens in the back office and check the round table by the glass-panel door.',
      fr: 'Entrez dans Kingpin Bowling et dirigez-vous vers le comptoir incurvé. Dépassez les écrans de surveillance dans le bureau du fond. La montre est sur la table ronde près de la porte vitrée.',
    },
    anchor: 'watch-kingpin',
    image: {
      file: 'gta-6-kingpin-bowling-orca-watch-round-table',
      alt: { en: 'Watch on the round table near the bowling alley office', fr: 'Montre sur la table ronde près du bureau du bowling' },
    },
  },
  {
    id: 'marbelle-breakfast-watch', region: 'Vice City', category: 'watches', position: posterPoint(4020, 3988), approximate: true,
    name: 'Crowex Ambassador “Breakfast”',
    directions: {
      en: 'Enter the Marbelle Hotel from the rear. Go through the door upstairs that opens by itself and read the note on the roof. Use 955214 on the safe downstairs.',
      fr: 'Entrez par l’arrière du Marbelle Hotel. À l’étage, passez la porte qui s’ouvre toute seule et lisez la note sur le toit. Tapez 955214 sur le coffre en bas.',
    },
    anchor: 'watch-marbelle',
    image: {
      file: 'gta-6-marbelle-hotel-watch-safe',
      alt: { en: 'Keypad on the Marbelle Hotel safe', fr: 'Clavier du coffre du Marbelle Hotel' },
    },
  },
  {
    id: 'balsero-midas-watch', region: 'Vice City', category: 'watches', position: posterPoint(3280, 3981), approximate: true,
    name: 'Crowex Octane “Midas”',
    directions: {
      en: 'At the Leonida Carrier Warehouse in Balsero by US-35 and I-404, enter through the loading bay. Find the office with a pink chair and take the watch on the desk.',
      fr: 'Entrez par le quai de chargement de l’entrepôt Leonida Carrier, à Balsero près de l’US-35 et de l’I-404. Repérez le bureau à la chaise rose et ramassez la montre près de l’ordinateur.',
    },
    anchor: 'watch-belsero',
    image: {
      file: 'gta-6-balsero-carrier-warehouse-midas-watch-desk',
      alt: { en: 'Midas watch pickup on the warehouse office desk', fr: 'Montre Midas récupérée au bureau de l’entrepôt' },
    },
  },
  {
    id: 'catalan-key-villa-watch', region: 'Catalan Key', category: 'watches', position: posterPoint(4190, 5050), approximate: true,
    name: { en: 'Catalan Key villa watch', fr: 'Montre de la villa de Catalan Key' },
    directions: {
      en: 'Find the waterfront villa southwest of the small roundabout. Climb over the shingled roof to the balcony above the pool. Check the box on the blue sofa.',
      fr: 'Cherchez la villa au bord de l’eau, au sud-ouest du petit rond-point. Passez par le toit en tuiles pour rejoindre le balcon au-dessus de la piscine. Ouvrez l’écrin sur le canapé bleu.',
    },
    anchor: 'watch-catalan',
    image: {
      file: 'gta-6-catalan-key-watch-blue-sofa',
      alt: { en: 'Watch box on the blue balcony sofa', fr: 'Écrin de la montre sur le canapé bleu du balcon' },
    },
  },
  {
    id: 'riquezas-b207-flamingo', region: 'Riquezas Keys', category: 'flamingos', position: posterPoint(1268, 6775), approximate: true,
    name: { en: 'Radar island, B-207', fr: 'Île du radar, bâtiment B-207' },
    directions: {
      en: 'On the radar dome island, follow the southern road loop to B-207, east of the dome. Enter through the door beside the graffiti and look by the sink.',
      fr: 'Sur l’île au dôme radar, suivez la route en boucle au sud jusqu’au B-207, à l’est du dôme. Entrez par la porte près des graffitis et regardez à côté de l’évier.',
    },
    anchor: 'riquezas-dome',
    image: {
      file: 'gta-6-riquezas-b207-flamingo-candles',
      alt: { en: 'Flamingo in the candlelit room at B-207', fr: 'Flamant dans la salle aux bougies du B-207' },
    },
  },
  {
    id: 'meerwunder-beach-route', region: 'Featherstone Islands', category: 'flamingos', position: posterPoint(2323, 1223), approximate: true,
    name: { en: 'Meerwunder beach route', fr: 'Parcours de la plage du Meerwunder' },
    directions: {
      en: 'Land beside the cargo ship on the north shore of the southeastern island. Sweep the beach from the low rocks toward the SCOOP container and the waterline.',
      fr: 'Accostez près du cargo sur la côte nord de l’île sud-est. Balayez la plage des rochers bas jusqu’au conteneur SCOOP et au bord de l’eau.',
    },
    anchor: 'meerwunder-flamingos',
    image: {
      file: 'gta-6-meerwunder-flamingos-rocky-beach',
      alt: { en: 'Beach and flamingo figures beside the Meerwunder wreck', fr: 'Plage et flamants près de l’épave du Meerwunder' },
    },
  },
  {
    id: 'belpoint-flamingo-route', region: 'Belpoint', category: 'flamingos', position: posterPoint(1230, 4450), approximate: true,
    name: { en: 'Belpoint flamingo route', fr: 'Parcours des flamants de Belpoint' },
    directions: {
      en: 'Start at the southeast docks. Check the white houses, then head down to the beach and search around the containers for the rest of the route.',
      fr: 'Commencez aux quais du sud-est. Fouillez près des maisons blanches, puis descendez à la plage et regardez autour des conteneurs pour la suite du parcours.',
    },
    anchor: 'belpoint',
  },
  {
    id: 'watson-bay-motel-flamingo', region: 'Watson Bay', category: 'flamingos', position: posterPoint(2440, 5520), approximate: true,
    name: { en: 'Watson Bay motel flamingo', fr: 'Flamant du motel de Watson Bay' },
    directions: {
      en: 'At the motel on the east edge of Watson Bay, walk around to the southwest corner and look beside the piled-up rubbish.',
      fr: 'Contournez le motel à l’est de Watson Bay jusqu’à son angle sud-ouest. Cherchez près du tas d’ordures.',
    },
    anchor: 'other-flamingos',
  },
  {
    id: 'key-lento-bridge-west', region: 'Abismo Key', category: 'jumps', position: posterPoint(2790, 6932), approximate: true,
    name: { en: 'Key Lento Bridge West', fr: 'Pont de Key Lento, côté ouest' },
    directions: {
      en: 'From Abismo Key, take the old span beside the open road to Key Lento. Line up with the broken edge before accelerating.',
      fr: 'Depuis Abismo Key, prenez l’ancien pont parallèle à la route de Key Lento. Alignez le véhicule sur le bord cassé avant d’accélérer.',
    },
    anchor: 'stunt-jumps-keys-mariana',
  },
  {
    id: 'ocean-sound-jump', region: 'Corsair Key', category: 'jumps', position: posterPoint(3703, 5960), approximate: true,
    name: 'Ocean Sound Road',
    directions: {
      en: 'At the south end of Corsair Key, enter the coastal construction site and line up with the green container. Launch out onto Ocean Sound Road.',
      fr: 'Au sud de Corsair Key, entrez dans le chantier côtier et alignez le véhicule sur le conteneur vert. Sautez en direction d’Ocean Sound Road.',
    },
    anchor: 'stunt-jumps-keys-mariana',
  },
  {
    id: 'sahara-arena-scan', region: 'Vice City', category: 'scans', position: posterPoint(4228, 4023),
    name: 'Sahara Arena',
    directions: {
      en: 'From the road on Downtown’s east waterfront, open WAiNK and center the Sahara Arena sign on the front façade.',
      fr: 'Depuis la route qui longe l’eau à l’est de Downtown, ouvrez WAiNK et cadrez l’enseigne Sahara Arena sur la façade.',
    },
    anchor: 'neighborhood-scan-loops',
  },
  {
    id: 'dock-ring-scan', region: 'Vice City', category: 'scans', position: posterPoint(4234, 4213), approximate: true,
    name: 'Dock Ring',
    directions: {
      en: 'Follow the pier on the east side of Downtown. Stop where you can frame the whole Ferris wheel over the water with WAiNK.',
      fr: 'Suivez la jetée à l’est de Downtown. Arrêtez-vous à un endroit d’où vous pouvez cadrer toute la grande roue au-dessus de l’eau avec WAiNK.',
    },
    anchor: 'neighborhood-scan-loops',
  },
  {
    id: 'neptune-rises-scan', region: 'Vice Beach', category: 'scans', position: posterPoint(4810, 3670), approximate: true,
    name: 'Neptune Rises',
    directions: {
      en: 'Go underneath the Flamingo Parkway bridge on the Washington Beach side. Step back until the Neptune sculpture fits in the WAiNK frame.',
      fr: 'Passez sous le pont de Flamingo Parkway côté Washington Beach. Reculez jusqu’à pouvoir cadrer toute la sculpture de Neptune dans WAiNK.',
    },
    anchor: 'neighborhood-scan-loops',
    image: {
      file: 'gta-6-waink-neptune-rises-scan-bridge',
      alt: { en: 'Neptune sculpture targeted by WAiNK under the bridge', fr: 'Sculpture de Neptune cadrée avec WAiNK sous le pont' },
    },
  },
];

export function getMapLocations(locale: Locale) {
  const media = locale === 'fr' ? 'https://backend.finalboss.fr' : 'https://backend.finalboss.io';
  return locations.map(({ name, directions, image, anchor, ...location }) => ({
    ...location,
    name: typeof name === 'string' ? name : name[locale],
    directions: directions[locale],
    href: `/${guides[location.category][locale]}#${anchor}`,
    image: image ? {
      src: `${media}/wp-content/uploads/2026/11/${image.file}.webp`,
      alt: image.alt[locale],
    } : undefined,
  }));
}

export type LocalizedMapLocation = ReturnType<typeof getMapLocations>[number];

export const mapLabels = {
  en: {
    title: 'GTA 6 interactive map',
    description: 'Find collectible cards, luxury watches, flamingos, WAiNK scans and stunt jumps in GTA 6. Filter the map of Leonida and track your finds.',
    backToHub: 'GTA 6 hub',
    area: 'Leonida Keys',
    mapCredit: 'Official map by Rockstar Games',
    mapUnavailable: 'The base map is temporarily unavailable. Location details are listed below.',
    approximate: 'Approximate pin',
    overview: 'View all of Leonida',
    group: 'Open grouped locations',
    groupBack: 'Back to grouped locations',
    groupZoom: 'Zoom to this group',
    search: 'Search locations',
    searchHint: 'Search by name or landmark',
    categories: { cards: 'Cards', watches: 'Watches', flamingos: 'Flamingos', jumps: 'Stunt jumps', scans: 'WAiNK scans' },
    all: 'All',
    allRegions: 'All areas',
    region: 'Area',
    remaining: 'Still to find',
    found: 'Found',
    markFound: 'Mark as found',
    undoFound: 'Mark as not found',
    guide: 'Open the guide',
    close: 'Close location details',
    ad: 'Advertisement',
    copy: 'Copy link',
    copied: 'Link copied',
    copyFailed: 'Use the address bar to copy the link.',
    empty: 'No locations match these filters.',
    reset: 'Clear filters',
    plus: 'Zoom in',
    minus: 'Zoom out',
    fit: 'Return to the Leonida Keys',
    map: 'Location map',
    stops: 'Locations',
  },
  fr: {
    title: 'Carte interactive de GTA 6',
    description: 'Trouvez les cartes, montres de luxe, flamants, scans WAiNK et sauts uniques de GTA 6. Filtrez la carte de Leonida et suivez vos trouvailles.',
    backToHub: 'Hub GTA 6',
    area: 'Leonida Keys',
    mapCredit: 'Carte officielle de Rockstar Games',
    mapUnavailable: 'Le fond de carte est momentanément indisponible. Retrouvez les fiches dans la liste ci-dessous.',
    approximate: 'Position indicative',
    overview: 'Voir tout Leonida',
    group: 'Ouvrir les emplacements du groupe',
    groupBack: 'Revenir aux emplacements du groupe',
    groupZoom: 'Zoomer sur ce groupe',
    search: 'Rechercher un emplacement',
    searchHint: 'Un nom ou un repère…',
    categories: { cards: 'Cartes', watches: 'Montres', flamingos: 'Flamants', jumps: 'Sauts uniques', scans: 'Scans WAiNK' },
    all: 'Tout',
    allRegions: 'Tous les secteurs',
    region: 'Secteur',
    remaining: 'À trouver',
    found: 'Trouvés',
    markFound: 'Marquer comme trouvé',
    undoFound: 'Retirer des trouvés',
    guide: 'Ouvrir le guide',
    close: 'Fermer la fiche',
    ad: 'Publicité',
    copy: 'Copier le lien',
    copied: 'Lien copié',
    copyFailed: 'Copiez le lien depuis la barre d’adresse.',
    empty: 'Aucun emplacement ne correspond à ces filtres.',
    reset: 'Effacer les filtres',
    plus: 'Zoom avant',
    minus: 'Zoom arrière',
    fit: 'Revenir dans les Leonida Keys',
    map: 'Carte des emplacements',
    stops: 'Emplacements',
  },
} satisfies Record<Locale, {
  categories: Record<MapCategory, string>;
  [key: string]: string | Record<MapCategory, string>;
}>;
