# Ocarina of Time Switch 2 — production éditoriale

**61 nouveaux articles en brouillons WordPress et un comparatif public actualisé**, en anglais. Les textes totalisent **43 197 mots**, avec **335 liens entre articles** et **7 illustrations IGDB renommées et auto-hébergées**.

## État éditorial et vérification Switch 2

Les nouveaux articles restent en brouillons. Les routes historiques servent de base et portent une note d’édition explicite ; elles ne sont pas présentées comme des parcours Switch 2 testés. Le [test Game Informer du 4 novembre](https://gameinformer.com/review/the-legend-of-zelda-ocarina-of-time-2026/exceptionally-familiar) signale moins de clés au Temple de l’Eau. La vérification des portes, clés, emplacements, compteurs, récompenses et commandes de la version finale reste nécessaire avant publication des guides concernés.

Les inventaires complets de référence incluent les 36 Heart Pieces, 100 Skulltulas, 33 grottes cachées, 10 sols à haricots, 12 chansons et 10 déclencheurs de Big Poes du jeu original. Ces chiffres ne constituent pas une validation des totaux du remake.

Le comparatif existant **124753** a été actualisé avec les nouveautés confirmées et le changement de clés rapporté, en conservant son URL, son auteur et sa date de publication. Le comparatif est associé aux deux fiches de jeu, puisqu’il compare les éditions N64 et Switch 2. Ses liens ne pointent que vers des pages déjà publiques. Il ne dirige pas les visiteurs vers les nouveaux brouillons.

## WordPress, jeu et médias

- La fiche originale **8705** pointe désormais vers le jeu N64 IGDB **1029**, au lieu du mod Crystal Clocks **313092**.
- La fiche distincte du remake **8813** est associée à IGDB **405460** et au slug `the-legend-of-zelda-ocarina-of-time-switch-2`.
- Catégories des nouveaux guides : Guide **6194** et Ocarina of Time Switch 2 **8814**.
- Six types enregistrés dans WordPress : Dungeons, Bosses, Quests, Equipment, Collectibles et Exploration.
- Sept médias WebP renommés, optimisés et auto-hébergés (1,18 Mo au total au lieu de 8,72 Mo en encodage sans perte), avec textes alternatifs décrivant réellement les visuels. Ils sont réutilisés selon les sujets ; aucune image générique de Link n’est présentée comme une capture d’un boss précis.
- Deux logos IGDB peu adaptés aux vignettes ont été écartés. Aucun visuel tiers de carte ou de solution n’a été repris.
- Aucun article envoyé à GPBot, aucun service externe de génération et aucune page WordPress créée.

## Contrôles effectués

- Les 62 contenus ont été relus via WordPress : texte, titre, extrait, catégories, jeu, tags, image et champs Yoast conformes.
- Les sept médias répondent en HTTP 200 et sont de vrais WebP. Leurs empreintes correspondent exactement aux fichiers optimisés locaux ; WordPress ne sert pas les versions lourdes initiales.
- HTML équilibré, tableaux rectangulaires et destinations internes vérifiées ; les 62 sujets reçoivent au moins un lien entrant dans le corpus de rédaction.
- Les 62 aperçus privés issus des relectures WordPress passent sur mobile, avec images chargées, tableaux accessibles et navigation entre aperçus.
- Le composant du hub a été testé localement sur la collection complète : six filtres, recherche au-delà des douze premières cartes, pagination, état vide, remise à zéro et mobile.
- Les tests du composant ainsi que les régressions des guides TOTK et des protections Cloudflare passent. Les contrôles HTTP publics confirment les URL canoniques, la séparation des éditions et le maintien des 121 guides TOTK.

## Hub et mise en production

Le [hub Ocarina of Time Switch 2](https://finalboss.io/game/the-legend-of-zelda-ocarina-of-time-switch-2) est en ligne, avec recherche et six filtres dans le style gris et jaune de FinalBoss. **Il affiche actuellement un article public : le comparatif actualisé.** Les 61 nouveaux brouillons rejoindront automatiquement la collection lors de leur publication. Leur index n’est pas proposé aux visiteurs tant qu’il reste privé.

- Déploiement Cloudflare réussi : version `12cdfeec-c931-4ac6-ba07-a5f04242599a`, build `TjPDRA6PZMeXd4aoSA8Lw`.
- Les 5 566 objets de cache du build ont été vérifiés par taille et empreinte. Une erreur transitoire 502 lors du premier chargement a été résolue en reprenant uniquement les 1 030 objets manquants avant activation du Worker.
- Les huit routes publiques contrôlées répondent en HTTP 200 avec leur canonique correcte : hubs des deux éditions OOT, archive OOT, comparatif, section Guides, hub TOTK, builds et recettes.
- La recherche par identifiant IGDB 405460 et la création/résolution du jeu renvoient au hub Switch 2. La fiche N64 utilise bien IGDB 1029.
- Trois URL de brouillons échantillonnées et la route temporaire de prévisualisation renvoient 404 publiquement. La route de prévisualisation a été supprimée avant compilation.
- Le rafraîchissement après déploiement a éliminé les anciennes données de compilation pour N64 et TOTK. Les 121 guides TOTK restent disponibles.
- Les tests navigateur publics passent sur ordinateur et mobile : recherche, six états de filtre, navigation vers le comparatif, images visibles et absence d’erreurs JavaScript. La recherche Lynel dans les 121 guides TOTK passe également.
- Le prébuild efface désormais uniquement `.next/cache/fetch-cache`, pour relire les données CMS actuelles, en conservant les caches de compilation. Vérification sur un dossier temporaire : suppression ciblée et exécution répétée sûres. Cette correction concerne la prochaine compilation ; aucun changement supplémentaire du Worker n’est requis.

## Répartition du corpus de test complet

| Filtre | Articles |
| --- | ---: |
| Dungeons | 12 |
| Bosses | 12 |
| Quests | 20 |
| Equipment | 18 |
| Collectibles | 12 |
| Exploration | 13 |

Les types se recoupent. Ces compteurs décrivent le corpus éditorial de 62 textes, pas le nombre d’articles déjà publics.

## Articles et liens de relecture

| # | Article | État | WordPress |
| ---: | --- | --- | --- |
| 1 | Ocarina of Time: Walkthrough and Guide Index (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125866&action=edit) |
| 2 | Zelda Ocarina of Time: 100% Completion Checklist (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125867&action=edit) |
| 3 | Ocarina of Time: Dungeon Order and Required Items (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125868&action=edit) |
| 4 | Ocarina of Time: Time Travel and the Master Sword (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125869&action=edit) |
| 5 | Ocarina of Time: Switch 2 Remake vs. N64 — What Changed? | Public — actualisé | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=124753&action=edit) |
| 6 | Ocarina of Time: Controls, Camera and Aiming (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125870&action=edit) |
| 7 | Zelda Ocarina of Time: Great Deku Tree Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125871&action=edit) |
| 8 | Zelda Ocarina of Time: Dodongo’s Cavern Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125872&action=edit) |
| 9 | Zelda Ocarina of Time: Jabu-Jabu’s Belly Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125873&action=edit) |
| 10 | Zelda Ocarina of Time: Forest Temple Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125874&action=edit) |
| 11 | Zelda Ocarina of Time: Fire Temple Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125875&action=edit) |
| 12 | Zelda Ocarina of Time: Ice Cavern Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125876&action=edit) |
| 13 | Zelda Ocarina of Time: Water Temple Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125877&action=edit) |
| 14 | Zelda Ocarina of Time: Bottom of the Well Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125878&action=edit) |
| 15 | Zelda Ocarina of Time: Shadow Temple Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125879&action=edit) |
| 16 | Zelda Ocarina of Time: Spirit Temple Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125880&action=edit) |
| 17 | Zelda Ocarina of Time: Ganon’s Castle Walkthrough (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125881&action=edit) |
| 18 | Zelda Ocarina of Time: How to Beat Queen Gohma (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125895&action=edit) |
| 19 | Zelda Ocarina of Time: How to Beat King Dodongo (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125896&action=edit) |
| 20 | Zelda Ocarina of Time: How to Beat Barinade (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125897&action=edit) |
| 21 | Zelda Ocarina of Time: How to Beat Phantom Ganon (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125898&action=edit) |
| 22 | Zelda Ocarina of Time: How to Beat Volvagia (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125899&action=edit) |
| 23 | Zelda Ocarina of Time: How to Beat Dark Link (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125882&action=edit) |
| 24 | Zelda Ocarina of Time: How to Beat Morpha (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125900&action=edit) |
| 25 | Zelda Ocarina of Time: How to Beat Bongo Bongo (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125883&action=edit) |
| 26 | Zelda Ocarina of Time: How to Beat Twinrova (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125884&action=edit) |
| 27 | Zelda Ocarina of Time: How to Beat Ganondorf and Ganon (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125885&action=edit) |
| 28 | Zelda Ocarina of Time: How to Beat Iron Knuckles (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125901&action=edit) |
| 29 | Zelda Ocarina of Time: How to Beat Dead Hand (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125902&action=edit) |
| 30 | Ocarina of Time: Hyrule Castle and Meeting Zelda (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125903&action=edit) |
| 31 | Ocarina of Time: Lost Woods Route and Saria (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125886&action=edit) |
| 32 | Ocarina of Time: Gerudo Fortress Carpenter Rescue (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125887&action=edit) |
| 33 | Ocarina of Time: Haunted Wasteland and Desert Colossus (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125904&action=edit) |
| 34 | Ocarina of Time: Gerudo Training Ground and Ice Arrows (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125905&action=edit) |
| 35 | Ocarina of Time: Dampé’s Race and the Hookshot (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125906&action=edit) |
| 36 | Ocarina of Time: Ruto’s Letter and King Zora (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125907&action=edit) |
| 37 | Zelda Ocarina of Time: All Heart Piece Locations (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125888&action=edit) |
| 38 | Zelda Ocarina of Time: All Gold Skulltula Locations (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125889&action=edit) |
| 39 | Zelda Ocarina of Time: Skulltula Rewards and Wallet Upgrades (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125908&action=edit) |
| 40 | Zelda Ocarina of Time: All Bottle Locations (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125890&action=edit) |
| 41 | Zelda Ocarina of Time: Great Fairy Locations and Magic Upgrades (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125891&action=edit) |
| 42 | Zelda Ocarina of Time: Magic Beans and Soft Soil Locations (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125909&action=edit) |
| 43 | Zelda Ocarina of Time: Hidden Grotto Locations and Rewards (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125910&action=edit) |
| 44 | Zelda Ocarina of Time: Weapons, Shields and Tunics: Equipment Guide (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125911&action=edit) |
| 45 | Zelda Ocarina of Time: Biggoron’s Sword Trading Sequence (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125892&action=edit) |
| 46 | Zelda Ocarina of Time: Hookshot and Longshot: Locations and Uses (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125912&action=edit) |
| 47 | Zelda Ocarina of Time: Iron Boots and Hover Boots: Locations and Uses (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125913&action=edit) |
| 48 | Zelda Ocarina of Time: Goron Tunic and Zora Tunic: How to Get Them (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125914&action=edit) |
| 49 | Zelda Ocarina of Time: Fairy Bow and Quiver Upgrades (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125915&action=edit) |
| 50 | Zelda Ocarina of Time: Bomb Bag, Bullet Bag and Deku Capacity Upgrades (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125916&action=edit) |
| 51 | Zelda Ocarina of Time: Din’s Fire, Farore’s Wind and Nayru’s Love (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125917&action=edit) |
| 52 | Zelda Ocarina of Time: All Ocarina Songs: Locations and Effects (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125893&action=edit) |
| 53 | Zelda Ocarina of Time: Scarecrow’s Song: How to Learn and Use It (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125918&action=edit) |
| 54 | Zelda Ocarina of Time: How to Get Epona (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125894&action=edit) |
| 55 | Zelda Ocarina of Time: Happy Mask Trading Sequence and Mask of Truth (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125919&action=edit) |
| 56 | Zelda Ocarina of Time: Big Poe Locations and the Bottle Reward (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125920&action=edit) |
| 57 | Zelda Ocarina of Time: Fishing Guide and Golden Scale (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125921&action=edit) |
| 58 | Zelda Ocarina of Time: Shooting and Horseback Archery Rewards (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125922&action=edit) |
| 59 | Zelda Ocarina of Time: Bombchu Bowling and Chest Game Rewards (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125923&action=edit) |
| 60 | Zelda Ocarina of Time: Amiibo Rewards and Retro Masks (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125924&action=edit) |
| 61 | Zelda Ocarina of Time: Microphone Ocarina Guide (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125925&action=edit) |
| 62 | Zelda Ocarina of Time: Threads of Time, Lore and Boss Rematches (Switch 2) | Brouillon | [Ouvrir](https://backend.finalboss.io/wp-admin/post.php?post=125926&action=edit) |

## Preuves et fichiers

- `wordpress-articles.csv` : liste des 62 identifiants, états et liens d’édition.
- `final-plan.json` : contenus finaux, SEO, images et taxonomies.
- `wordpress-qa.json` et `wordpress-readback-posts.json` : relectures WordPress.
- `editorial-qa.json` : HTML, liens, métadonnées et médias.
- `article-browser-qa.json`, `hub-browser-qa.json` et `screenshots/` : contrôles des aperçus privés et du composant réel.
- `wordpress-setup.json` : correction IGDB et création des taxonomies.
- `research/` : sources, recoupements, corrections des erreurs repérées dans les références et contrôles indépendants.
- `before-original-game.json`, `before-comparison.json` et `comparison-before-write.json` : sauvegardes avant modification.
- `cloudflare-build.log`, `cloudflare-dry-run.log` et `cloudflare-worker-deploy.log` : compilation et déploiement final réussi. Le premier journal `cloudflare-deploy.log` conserve la tentative interrompue pendant le chargement du cache.
- `public-release-qa.json`, `public-browser-qa.json`, `cache-seed-audit.json` et `build-cache-qa.json` : vérifications de production, intégrité du cache et prévention des instantanés CMS périmés.
- `preview/index.html` : index des aperçus locaux, non exposés sur le site public.

## Sources du cadrage Switch 2

- [Nintendo US — jeu et fonctionnalités](https://www.nintendo.com/us/store/products/the-legend-of-zelda-ocarina-of-time-switch-2/).
- [Nintendo Australie — microphone, combats rejouables et amiibo](https://www.nintendo.com/au/news-and-articles/you-have-been-summoned-to-watch-the-new-the-legend-of-zelda-ocarina-of-time-overview-trailer/).
- [IGDB — fiche distincte du remake](https://www.igdb.com/games/the-legend-of-zelda-ocarina-of-time--1).

Les pages historiques Thonky, Zelda Dungeon, Zelda Central, GameWith et les fiches d’objets sont conservées par article dans les métadonnées de recherche. Les erreurs et divergences repérées ne sont pas traitées comme des preuves Switch 2.
