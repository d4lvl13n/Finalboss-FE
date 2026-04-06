#!/usr/bin/env python3
"""Process SEO batch 8: translate English titles to French, craft French meta descriptions, update WordPress."""

import json
import urllib.request
import urllib.error
import base64
import time
import ssl

INPUT_FILE = "/Users/damienlarquey/gaming-news/seo-batch-fr-8.json"
OUTPUT_FILE = "/Users/damienlarquey/gaming-news/seo-results-fr-8.json"

WP_API = "https://backend.finalboss.fr/wp-json/wp/v2/posts"
WP_USER = "finalboss"
WP_PASS = "TWBN Mbmb qy13 KyGE 3ZIE B9a7"

auth_string = base64.b64encode(f"{WP_USER}:{WP_PASS}".encode()).decode()

# SSL context
ctx = ssl.create_default_context()

def detect_english(title, excerpt):
    """Detect if an article is primarily in English."""
    english_words = {
        'the', 'of', 'and', 'a', 'to', 'in', 'is', 'for', 'on', 'with',
        'that', 'it', 'was', 'are', 'be', 'this', 'from', 'an', 'but',
        'not', 'by', 'or', 'as', 'at', 'which', 'have', 'has', 'its',
        'new', 'when', 'who', 'will', 'can', 'more', 'yet', 'how',
        'why', 'meets', 'revives', 'review', 'free', 'rebirth'
    }
    words = title.lower().split()
    english_count = sum(1 for w in words if w in english_words)
    # Also check excerpt for English
    excerpt_words = excerpt.lower().split()[:20]
    excerpt_english = sum(1 for w in excerpt_words if w in english_words)

    # If more than 30% of title words are English common words, or excerpt is clearly English
    title_ratio = english_count / max(len(words), 1)
    excerpt_ratio = excerpt_english / max(len(excerpt_words), 1)

    return title_ratio > 0.3 or excerpt_ratio > 0.25


def craft_meta_and_title(article):
    """Craft French meta description and translate title if needed. Returns (new_title_or_None, meta_desc, title_translated)."""
    aid = article["id"]
    slug = article["slug"]
    title = article["title"]
    excerpt = article["excerpt"]
    has_yoast = article["has_yoast"]

    # Skip if already has yoast
    if has_yoast:
        return None, None, False

    is_english = detect_english(title, excerpt)

    # Pre-built mapping for all 100 articles
    meta_map = {
        7691: ("Neverness to Everness : le gacha qui brise les codes", None,
               "Neverness to Everness bouscule les conventions du gacha avec un monde ouvert ambitieux signé Hotta Studio. Analyse du jeu qui veut tout changer."),
        6136: ("Chrono Odyssey sous la loupe: innovation ou mirage ?", None,
               "Chrono Odyssey promet un MMORPG next-gen aux graphismes bluffants. Analyse des mécaniques, du monde ouvert et des raisons d'y croire ou non."),
        4710: ("Dead Watch : enquête en boucle temporelle", None,
               "Dead Watch mêle boucle temporelle et murder mystery dans un concept signé Doctor Shinobi. Plongez dans cette enquête où chaque mort révèle un indice."),
        7726: ("Cronos: The New Dawn – la tension renouvelée par la fusion ennemie", None,
               "Cronos: The New Dawn transforme chaque cadavre en menace tactique grâce à sa mécanique de fusion ennemie. Un défi inédit pour les stratèges."),
        7588: ("Death Stranding 2 domine la semaine, mais la variété fait la force", None,
               "Death Stranding 2: On the Beach mène les sorties de la semaine, accompagné d'une sélection variée de jeux à surveiller de près."),
        12085: ("Guide étape par étape pour la mission Ugly Baby", None,
                "Voici comment terminer la mission Ugly Baby de The Witcher 3 à Kaer Morhen. Toutes les étapes détaillées pour lever la malédiction."),
        8205: ("Minecraft en mode next-gen et Notch tease son successeur", None,
               "Minecraft se refait une beauté avec Chase the Skies, sa refonte graphique next-gen. En parallèle, Notch dévoile un mystérieux nouveau projet."),
        4961: ("Les 11 immanquables Xbox & PC en juin 2025", None,
               "11 jeux Xbox et PC incontournables sortent en juin 2025. Sélection complète des titres à ne surtout pas manquer ce mois-ci."),
        9714: ("Guide des meilleurs casques VR 2025 selon vos besoins", None,
               "Comparez les 5 meilleurs casques VR de 2025 : autonomie, confort, qualité d'image et compatibilité PC. Le guide pour choisir selon vos besoins."),
        7997: ("La GameCube ultime : quand le rétro vire à l'obsession", None,
               "DKOldies propose la GameCube ultime à un prix démentiel. Retour sur cette obsession rétro qui repousse les limites du marché vintage."),
        5050: ("Mafia The Old Country : retour aux racines mafieuses en Sicile, date de sortie et analyse", None,
               "Mafia The Old Country sort le 8 août 2025 et ramène la série en Sicile. Analyse du préquel, de sa direction et de ce qui change vraiment."),
        4957: ("Farever : Shiro Games réinvente-t-il le RPG coop ?", None,
               "Farever, le RPG action coop de Shiro Games, surprend au PC Gaming Show 2024. Le studio bordelais mise sur un concept original et ambitieux."),
        5055: ("Den of Wolves : le braquage cyberpunk réinventé par 10 Chambers", None,
               "Den of Wolves réinvente le braquage coopératif dans un univers cyberpunk. 10 Chambers vise plus haut que PAYDAY avec ce nouveau titre."),
        5054: ("Ambrosia Sky : quand nettoyer devient un rituel SF", None,
               "Ambrosia Sky propose un clean-em-up spatial signé par des vétérans de Bethesda, Ubisoft et Riot. Un concept SF étonnant dévoilé au PC Gaming Show."),
        4412: ("LEGO parie gros en multijoueur : de Voyagers au Party! frénétique", None,
               "LEGO dévoile deux jeux multijoueur au Summer Game Fest 2025 : Voyagers et Party!, deux approches radicalement différentes du jeu en ligne."),
        4675: ("System Shock 2 (25e Anniv.) : le remaster 4K coop ultime", None,
               "System Shock 2 fête ses 25 ans avec un remaster 4K intégrant le coop cross-plateforme. Nightdive Studios livre une version définitive."),
        5056: ("Necesse 1.0 : immersion dans un vaste monde infini", None,
               "Necesse passe en version 1.0 avec un monde infini et 94% d'avis positifs. Le rival de Terraria franchit un cap majeur après l'accès anticipé."),
        5051: ("Philips Evnia 34M2C8600 QD-OLED : test immersif mais de niche",
               "Philips Evnia 34M2C8600 QD-OLED : test immersif mais de niche",
               "Test du Philips Evnia 34M2C8600 QD-OLED : un écran ultrawide immersif grâce à l'Ambiglow, mais destiné à un public de niche exigeant."),
        4954: ("Death Stranding 2 : Kojima en dévoile plus, mais est-ce suffisant ?", None,
               "Kojima dévoile un nouveau trailer de Death Stranding 2 avec du gameplay inédit. Analyse de ce qui a été montré et des questions en suspens."),
        4668: ("MONGIL: STAR DIVE révolutionne le monster-taming en 2025", None,
               "MONGIL: STAR DIVE repense le monster-taming avec des mécaniques audacieuses présentées au Summer Game Fest 2025. Netmarble vise haut."),
        4958: ("Planet of Lana II : Évolution méritée ou piège de la suite", None,
               "Planet of Lana II est annoncé trois ans avant sa sortie. Le petit studio indé peut-il éviter le piège de la suite et surpasser l'original ?"),
        4959: ("Endless Legend 2 révolutionne le 4X en Accès Anticipé", None,
               "Endless Legend 2 arrive en accès anticipé et promet de renouveler le genre 4X. Analyse des nouveautés qui bousculent les habitudes des joueurs."),
        4669: ("Tales of the Shire : Tolkien au cœur d'un cozy-game détaillé", None,
               "Tales of the Shire plonge les joueurs dans un cozy-game inspiré de Tolkien. Wētā Workshop dévoile un jeu de vie hobbit riche en détails."),
        4962: ("Moonlighter 2 : la démo Steam Next Fest dévoile un renouveau 3D", None,
               "Moonlighter 2 passe à la 3D et dévoile sa démo au Steam Next Fest. Premiers retours sur cette suite qui mêle donjons et gestion de boutique."),
        4232: ("Xbox Games Showcase 2024 : l'enjeu majeur de Microsoft", None,
               "Le Xbox Games Showcase 2024 représente un tournant pour Microsoft. Analyse des annonces, des exclusivités et des enjeux stratégiques."),
        4709: ("EVE Frontier en accès fondateur : le pari survie de CCP Games", None,
               "EVE Frontier ouvre son Founder Access et passe au mode survie spatiale. CCP Games tente un pari audacieux loin de l'univers MMO classique d'EVE."),
        4664: ("Super Meat Boy 3D revient : une renaissance attendue ou un saut risqué pour la série culte ?", None,
               "Super Meat Boy 3D ressuscite au Xbox Showcase avec un passage à la 3D. Renaissance brillante ou saut risqué pour le platformer culte ?"),
        4535: ("Hitman: World of Assassination – IO Interactive refuse de laisser mourir l'Agent 47", None,
               "Hitman: World of Assassination fête ses dix ans avec du contenu inédit. IO Interactive maintient l'Agent 47 en vie avec brio."),
        4960: ("Dark Switch : le city-builder fantasy qui bouscule Frostpunk avec survie verticale et atmosphère", None,
               "Dark Switch fusionne city-builder et survie verticale dans un univers fantasy sombre. Un concurrent sérieux de Frostpunk à surveiller de près."),
        4955: ("The Alters : quand 11 bit studios transforme la survie en introspection sur PC, PS5 et Xbox", None,
               "The Alters par 11 bit studios transforme le jeu de survie en réflexion sur l'identité. Un concept unique disponible sur PC, PS5 et Xbox."),
        4676: ("Ritual Tides : les vétérans du AAA plongent dans l'horreur insulaire", None,
               "Ritual Tides réunit d'anciens talents de Rockstar et Cloud Imperium pour un survival horror insulaire. Un premier jeu AAA indé prometteur."),
        7933: ("GTA Online : Guide ultime pour braquages rentables", None,
               "Maximisez vos gains dans GTA Online grâce à ce guide des braquages les plus rentables. Méthodes testées après plus de 1 000 heures de jeu."),
        10473: ("Wreckfest 2 en Early Access : survie, Motorhome et dégâts peaufinés", None,
                "Wreckfest 2 peaufine ses dégâts et ajoute le Motorhome en Early Access. Bugbear repousse les limites de la destruction automobile."),
        7521: ("Guide complet pour l'Adepte Bene Gesserit dans Dune Awakening", None,
               "Maîtrisez la classe Adepte Bene Gesserit dans Dune: Awakening grâce à ce guide complet. Ruse, furtivité et contrôle mental au programme."),
        11780: ("Blocky Games : le hub multijoueur inspiré de Minecraft", None,
                "Blocky Games rassemble des mini-jeux multijoueur dans un univers inspiré de Minecraft. Tour d'horizon de ce hub communautaire en pleine expansion."),
        10792: ("Rekindled Trails : quand le cozy rime avec rédemption", None,
                "Rekindled Trails mêle gestion d'inventaire et récit de rédemption dans un jeu cozy captivant dès les premières minutes. Une belle surprise indé."),
        10155: ("Dune Awakening : débloquer et fabriquer l'ornithoptère de transport", None,
                "Voici comment débloquer et fabriquer l'ornithoptère de transport dans Dune Awakening. Le véhicule indispensable pour dominer l'endgame d'Arrakis."),
        10104: ("Codes de récompense Persona 5 The Phantom X : guide complet", None,
                "Tous les codes de récompense actifs pour Persona 5 The Phantom X. Guide complet pour obtenir ressources et bonus gratuits dès le début."),
        6200: ("Dying Light: The Beast – le retour viscéral de Kyle Crane", None,
               "Dying Light: The Beast ramène Kyle Crane dans une aventure viscérale et brutale. Tout ce qu'il faut savoir sur ce standalone très attendu."),
        10806: ("Zombies Overloaded : Arcade rétro, défi et adrénaline", None,
                "Zombies Overloaded par Brainium Games propose un shooter arcade rétro nerveux et addictif. Disponible maintenant pour les fans d'action pure."),
        9808: ("Roadcraft : test du sim tout-terrain plus accessible que Mudrunner",
               "Roadcraft : test du sim tout-terrain plus accessible que Mudrunner",
               "Test de Roadcraft par Saber Interactive : un sim tout-terrain plus accessible que Mudrunner après 40h de jeu. Transport, construction et exploration."),
        8164: ("Maîtrisez l'ornithoptère d'assaut dans Dune: Awakening", None,
               "Maîtrisez l'ornithoptère d'assaut Mk 5 et Mk 6 dans Dune: Awakening. Guide complet pour optimiser vitesse, maniabilité et puissance de feu."),
        11735: ("Reaper Actual : quand MMO, persistance et tactique se rencontrent", None,
                "Reaper Actual ambitionne de fusionner FPS tactique, MMO persistant et économie pilotée par les joueurs. Analyse d'un concept audacieux."),
        8125: ("Switch 2 : un lancement record, mais les tiers à la peine", None,
               "La Switch 2 bat des records de ventes dès son lancement, mais les jeux tiers peinent à suivre. Analyse des ventes et perspectives du marché."),
        11946: ("Blood Strike se réinvente en pixel art cet été", None,
                "Blood Strike lance le mode Block Strike en pixel art pour une durée limitée cet été. NetEase bouscule les codes du battle royale mobile."),
        7938: ("Dune Awakening : 1 M en 2 semaines, le vrai défi commence", None,
               "Dune Awakening dépasse le million de ventes en deux semaines. Un démarrage fulgurant pour le MMO, mais le plus dur reste à venir."),
        7840: ("Jasmium : guide ultime pour farm optimal sur Arrakis", None,
               "Optimisez votre récolte de jasmium dans Dune: Awakening grâce à ce guide. Emplacements, techniques et astuces pour dominer l'endgame d'Arrakis."),
        7652: ("Return From Core 1.0 : un RPG de survie qui tient ses promesses ?", None,
               "Return From Core passe en version 1.0 après un an d'Early Access. Le RPG de survie souterraine de Tanxun Studio livre-t-il ses promesses ?"),
        7609: ("Maestro sur PSVR2 : fan service Star Wars ou prouesse VR ?", None,
               "Maestro arrive sur PSVR2 et promet une expérience Star Wars immersive en réalité virtuelle. Fan service réussi ou vraie prouesse technique ?"),
        11296: ("Phantom Breaker Ultimate: Kaho Shibuya, la boulangère magique", None,
                "Le DLC Kaho Shibuya débarque dans Phantom Breaker: Battle Grounds Ultimate. Portrait d'une boulangère magique au gameplay surprenant."),
        11295: ("Full Metal Schoolgirl : l'ascension punk et satirique du shooter", None,
                "Full Metal Schoolgirl par D3Publisher mêle satire sociale, action brute et délire visuel. Un shooter punk qui ose tout et assume pleinement."),
        11294: ("Donkey Kong Bananza : la première claque 3D de la Switch 2 ?", None,
                "Donkey Kong Bananza s'annonce comme la première vitrine 3D de la Switch 2. Nintendo frappe fort avec une annonce surprise très attendue."),
        10957: ("Ashes of Creation Phase 3 : le renouveau attendu du MMO", None,
                "Ashes of Creation entre en Phase 3 d'alpha avec deux nouvelles races et du contenu prometteur. Intrepid Studios relance enfin les espoirs."),
        10956: ("Death Stranding 2 : l'audace d'un mastodonte narratif", None,
                "Death Stranding 2: On the Beach pousse l'audace narrative encore plus loin. Kojima livre une suite qui surprend même les fans de la première heure."),
        9832: ("20 astuces de pro pour dompter Death Stranding 2: On the Beach", None,
               "20 astuces essentielles pour survivre dans Death Stranding 2: On the Beach. Conseils testés après 80 heures face au Timefall et aux BTs."),
        11542: ("Kick'n Hell : platformer belge de précision extrême", None,
                "Kick'n Hell, le platformer hardcore belge, repousse les limites de la précision. Plongée dans une démo audacieuse signée par un studio indé."),
        11429: ("Broken Ranks: The Other Side – l'envers du vilain", None,
                "Broken Ranks: The Other Side propose de jouer le méchant dans une mise à jour qui renouvelle l'expérience du MMORPG. Analyse complète."),
        11528: ("Donkey Kong Bananza : le renouveau XXL sur Switch 2", None,
                "Donkey Kong Bananza arrive le 17 juillet 2025 sur Switch 2. Premier solo DK développé en interne par Nintendo sur sa nouvelle console."),
        11814: ("3Tower : entre frissons et mécanique en Early Access", None,
                "3Tower mêle horreur et puzzles mécaniques en Early Access. Un premier projet studio qui tranche avec les walking simulators classiques."),
        10147: ("Guide Palpagos Palworld : maîtrisez la carte et progressez vite", None,
                "Maîtrisez la carte de Palpagos dans Palworld grâce à ce guide complet. Régions, emplacements clés et astuces pour progresser rapidement."),
        10152: ("Track Crawler dans Dune Awakening : Guide de Construction et Déploiement Efficace", None,
                "Voici comment construire et déployer le Track Crawler dans Dune Awakening. Guide pratique pour récolter l'épice en fin de jeu efficacement."),
        11737: ("Cathedral: Crow's Curse – renaissance pixel art du metroidvania",
                "Cathedral: Crow's Curse – renaissance pixel art du metroidvania",
                "Cathedral: Crow's Curse revisite le metroidvania en pixel art avec un standalone signé Decemberborn Interactive. Un vent frais sur le genre indé."),
        11736: ("Wuthering Waves 2.4 Phase II : notre décryptage", None,
                "Wuthering Waves 2.4 Phase II apporte des nouveautés qui sortent du lot habituel des mises à jour gacha. Analyse complète des changements."),
        11734: ("Bendy: Lone Wolf – survie et tension dans l'encre", None,
                "Bendy: Lone Wolf sort le 15 août 2025 en version digitale. Boris le loup revient dans un jeu de survie tendu au cœur de l'univers encré."),
        11732: ("Stronghold Crusader DE : un retour digne du mythe RTS", None,
                "Stronghold Crusader Definitive Edition ressuscite le classique RTS des années 2000. Sièges épiques et gestion millimétrée font leur retour."),
        11792: ("Disney Speedstorm Saison 3 : Renouveau, Persos et Défis", None,
                "La saison 3 de Disney Speedstorm renouvelle vraiment le contenu avec de nouveaux personnages et défis. Gameloft frappe fort cette fois."),
        11527: ("Disney Dreamlight Valley : casting infini, nostalgie et DLC", None,
                "Disney Dreamlight Valley enrichit sans cesse son casting de personnages Disney. Tour d'horizon des DLC, nouveautés et contenu nostalgique."),
        11500: ("Subnautica 2 : remaniement majeur et doutes avant l'accès anticipé", None,
                "Subnautica 2 traverse un remaniement interne avant son accès anticipé 2025. Les départs de dirigeants sèment le doute dans la communauté."),
        11499: ("Honkai Star Rail 3.4 : Phaénon jouable et crossover Fate/stay night", None,
                "Honkai Star Rail 3.4 rend Phaénon jouable et lance un crossover avec Fate/stay night. La mise à jour anniversaire qui change la donne."),
        11399: ("The Crew Motorfest Saison 7 : Ferrari et immersion européenne", None,
                "The Crew Motorfest Saison 7 met Ferrari à l'honneur dans un cadre européen immersif. Ubisoft Ivory Tower sort enfin du simple événement."),
        11729: ("Escape From Tarkov : un hardcore wipe radical", None,
                "Escape From Tarkov lance un hardcore wipe radical avant la mise à jour 1.0 et l'arrivée sur Steam. BSG remet tous les compteurs à zéro."),
        12009: ("Marathon de Bungie repoussé à fin 2026 : enjeux clés", None,
                "Marathon de Bungie est repoussé à fin 2026 suite aux retours mitigés. Analyse des enjeux pour le shooter d'extraction PvP le plus attendu."),
        11300: ("WWE 2K25 sur Switch 2 : portage complet et boîte vide", None,
                "WWE 2K25 arrive sur Switch 2 avec un portage complet mais un contenu décevant. Analyse d'un jeu qui mise sur la technique plus que le fond."),
        11727: ("True Fear 3 sur mobile : un final qui tient ses promesses", None,
                "True Fear: Forsaken Souls Part 3 conclut la saga sur mobile avec brio. Un point-and-click horrifique qui récompense les fans de la première heure."),
        11877: ("Meta Marvel Rivals Saison 2.5 : Les héros à maîtriser", None,
                "La méta de Marvel Rivals Saison 2.5 est bouleversée. Voici les héros à maîtriser pour dominer les files compétitives cette saison."),
        10596: ("Hogwarts Legacy sur Switch 2 : le portage portable sans concessions", None,
                "Hogwarts Legacy arrive sur Switch 2 sans compromis visuels. Le triple A de Poudlard tient-il ses promesses en version portable ?"),
        10595: ("Double Dragon Revive : quand un classique se réinvente sur Switch", None,
                "Double Dragon Revive relance la franchise sur Switch après des années d'absence. Arc System Works modernise le beat'em up sans le dénaturer."),
        11287: ("Borderlands 4 : Gérez Claptrap et explorez des builds inédits", None,
                "Borderlands 4 permet enfin de contrôler Claptrap et introduit des builds réinventés. La franchise repousse ses propres limites avec ce nouvel opus."),
        11286: ("Dernier Twisted Masquerade de DBD pulvérise les records Steam", None,
                "Le dernier Twisted Masquerade de Dead by Daylight bat tous les records Steam. L'événement final propulse le jeu vers de nouveaux sommets."),
        10588: ("Forgotten 23 : la survie spatio-temporelle en boucle", None,
                "Forgotten 23 mêle boucle temporelle et survie spatiale dans un solo indé polonais. KovalGames signe un concept original et intrigant."),
        11733: ("Upin & Ipin Universe : le pari culturel de l'open world familial", None,
                "Upin & Ipin Universe tente le pari d'un monde ouvert familial ancré dans la culture malaisienne. Un concept rare qui mérite l'attention."),
        12012: ("Civilization 7 : le mod UI qui change tout en un clic", None,
                "Le mod Policy Yield Previews corrige l'interface de Civilization 7 et révèle l'impact de vos choix en un coup d'œil. Indispensable pour tout joueur."),
        10057: ("Sengoku Dynasty : la mise à jour Bushido défie vos défenses", None,
                "La mise à jour Bushido de Sengoku Dynasty ajoute un système de combat repensé au city-builder féodal. Le mélange survie et gestion s'intensifie."),
        9930: ("Lost Ark : la mise à jour de juin secoue vraiment l'endgame", None,
               "La mise à jour de juin de Lost Ark transforme l'endgame avec des raids simplifiés et du contenu frais. De quoi raviver l'intérêt des vétérans."),
        12094: ("Solo Leveling: Karma – l'action-RPG qui comble le vide narratif", None,
                "Solo Leveling: Karma s'attaque aux mystères non résolus du webtoon dans un action-RPG signé Netmarble. Une adaptation qui va au-delà du fan service."),
        6465: ("RuneScape rehausse l'artisanat à 110 : Starbloom, nouveaux outils et vraie prise en main", None,
               "RuneScape monte l'artisanat au niveau 110 avec Starbloom et de nouveaux outils. Un update majeur après deux décennies de Gielinor."),
        10154: ("Two Point Museum : la folie fantasy du DLC 'Découvertes Fantastiques'", None,
                "Le DLC Découvertes Fantastiques ajoute une dimension fantasy à Two Point Museum. Créatures, artéfacts et nouvelles salles au programme."),
        10157: ("L'été de Dying Light : Techland relance Harran gratuitement",
                "L'été de Dying Light : Techland relance Harran gratuitement",
                "Techland célèbre les 10 ans de Dying Light avec une mise à jour gratuite et des événements communautaires. Harran reprend vie cet été."),
        11726: ("Simon the Sorcerer Origins : quand la nostalgie rencontre l'ambition moderne",
                "Simon the Sorcerer Origins : quand la nostalgie rencontre l'ambition moderne",
                "Simon the Sorcerer Origins ramène le héros culte du point-and-click des années 90. Prévu pour 2025, ce prequel mêle nostalgie et modernité."),
        12062: ("Call of Duty WW2 retiré du Microsoft Store PC pour faille RCE", None,
                "Call of Duty WW2 est suspendu du Microsoft Store PC à cause d'une faille de sécurité RCE critique. Retour sur cet incident rare pour la licence."),
        11848: ("Summer Bash 2025 : boosts, cosmétiques et promo ARK", None,
                "Le Summer Bash 2025 revient dans ARK: Survival Ascended avec des boosts, cosmétiques exclusifs et promotions estivales. Tout le programme."),
        11847: ("Cottonville : le cosy-sim alliant ferme et couture", None,
                "Cottonville fusionne simulation de ferme et atelier de couture dans un cosy-sim original. Une expérience unique entre champ et création textile."),
        10938: ("Jump Stars : codes juin 2025, un bonus utile mais limité", None,
                "Tous les codes gratuits Jump Stars de juin 2025 pour Roblox. Des bonus utiles mais limités pour progresser dans ce jeu inspiré d'anime."),
        10848: ("Moons of Ardan Update #12 : le city-builder spatial fait peau neuve", None,
                "Moons of Ardan franchit un cap avec l'Update #12. Le city-builder spatial indépendant se renouvelle en profondeur et surprend positivement."),
        9831: ("Section 13 : un shooter coopératif intense et fun", None,
               "Section 13 mise tout sur le fun coopératif dans un twin-stick shooter nerveux. Ocean Drive Studio et Kakao Games livrent de l'action pure."),
        11690: ("Arcade Archives AIR COMBAT 22 : Nostalgie ou nouveau vol ?", None,
                "AIR COMBAT 22 atterrit sur Switch et consoles en 2025 via Arcade Archives. Un revival rétro soigné entre nostalgie et redécouverte."),
        7941: ("Marvel Tokon : Arc System Works relance le versus fighting", None,
               "Marvel Tokon: Fighting Souls par Arc System Works relance le versus fighting au State of Play. L'annonce surprise qui enflamme la communauté."),
        7425: ("10 000 h de grind : le défi Xtreme OneChunk Ironman", None,
               "Un joueur Old School RuneScape consacre 10 000 heures à un seul donjon en mode Xtreme OneChunk Ironman. Récit d'un défi hors norme."),
        11797: ("Play Together : Dino Park, vraie révolution ou gadget éphémère?", None,
                "Play Together lance le Dinosaur Park, un ajout ambitieux signé Haegin. Vraie révolution pour le jeu mobile ou simple gadget éphémère ?"),
        6836: ("Dune Awakening – Guide pratique pour visiter les sietches et jouer avec vos amis", None,
               "Voici comment rejoindre vos amis et visiter les sietches dans Dune Awakening. Guide pratique pour le multijoueur sur Arrakis."),
    }

    if aid in meta_map:
        original_title, new_title, meta = meta_map[aid]
        translated = new_title is not None
        return new_title, meta, translated

    return None, None, False


def update_wordpress(article_id, new_title, meta_desc):
    """Update WordPress post via REST API."""
    url = f"{WP_API}/{article_id}"

    body = {}
    if new_title:
        body["title"] = new_title
    if meta_desc:
        body["meta"] = {"_yoast_wpseo_metadesc": meta_desc}

    if not body:
        return "skipped", "No changes needed"

    data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Basic {auth_string}")

    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            if resp.status in (200, 201):
                return "updated", None
            else:
                return "error", f"HTTP {resp.status}"
    except urllib.error.HTTPError as e:
        return "error", f"HTTP {e.code}: {e.reason}"
    except Exception as e:
        return "error", str(e)


def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        articles = json.load(f)

    print(f"Processing {len(articles)} articles...")

    results = []
    updated = 0
    skipped = 0
    errors = 0

    for i, article in enumerate(articles):
        aid = article["id"]
        title = article["title"]
        excerpt = article["excerpt"]
        has_yoast = article["has_yoast"]
        slug = article["slug"]

        if has_yoast:
            results.append({
                "id": aid,
                "slug": slug,
                "title": title,
                "new_title": None,
                "old_excerpt": excerpt[:120],
                "new_meta": None,
                "status": "skipped_yoast",
                "title_translated": False
            })
            skipped += 1
            print(f"  [{i+1}/100] ID {aid}: Skipped (has Yoast)")
            continue

        new_title, meta_desc, translated = craft_meta_and_title(article)

        if not meta_desc:
            results.append({
                "id": aid,
                "slug": slug,
                "title": title,
                "new_title": None,
                "old_excerpt": excerpt[:120],
                "new_meta": None,
                "status": "skipped_no_meta",
                "title_translated": False
            })
            skipped += 1
            print(f"  [{i+1}/100] ID {aid}: Skipped (no meta crafted)")
            continue

        # Verify meta length
        if len(meta_desc) > 155:
            # Trim to 155
            meta_desc = meta_desc[:152] + "..."

        status, err = update_wordpress(aid, new_title, meta_desc)

        result = {
            "id": aid,
            "slug": slug,
            "title": title,
            "new_title": new_title,
            "old_excerpt": excerpt[:120],
            "new_meta": meta_desc,
            "status": status,
            "title_translated": translated
        }

        if err:
            result["error"] = err

        results.append(result)

        if status == "updated":
            updated += 1
            flag = " [TITLE TRANSLATED]" if translated else ""
            print(f"  [{i+1}/100] ID {aid}: Updated{flag} - {meta_desc[:60]}...")
        else:
            errors += 1
            print(f"  [{i+1}/100] ID {aid}: ERROR - {err}")

        # Rate limiting - small delay between API calls
        if i < len(articles) - 1:
            time.sleep(0.3)

    # Save results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Updated: {updated}, Skipped: {skipped}, Errors: {errors}")
    print(f"Results saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
