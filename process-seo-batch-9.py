#!/usr/bin/env python3
"""Process SEO batch 9: translate English titles to French, craft French meta descriptions, update WordPress."""

import json
import urllib.request
import urllib.error
import base64
import time
import ssl

INPUT_FILE = "/Users/damienlarquey/gaming-news/seo-batch-fr-9.json"
OUTPUT_FILE = "/Users/damienlarquey/gaming-news/seo-results-fr-9.json"

WP_API = "https://backend.finalboss.fr/wp-json/wp/v2/posts"
WP_USER = "finalboss"
WP_PASS = "TWBN Mbmb qy13 KyGE 3ZIE B9a7"
AUTH = base64.b64encode(f"{WP_USER}:{WP_PASS}".encode()).decode()

# SSL context
ctx = ssl.create_default_context()

def wp_update(post_id, payload):
    """Update a WordPress post via REST API."""
    url = f"{WP_API}/{post_id}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Basic {AUTH}")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        print(f"  HTTP Error {e.code} for post {post_id}: {e.reason}")
        return e.code
    except Exception as e:
        print(f"  Error for post {post_id}: {e}")
        return 0


# Map of article id -> (new_title_if_translated, meta_description, title_translated)
# All meta descriptions must be in French, max 155 chars, complete sentence, active voice.
# Never start with "Cet article", "Dans cet article", "Découvrez".

ARTICLE_SEO = {
    7755: {
        "meta": "Death Stranding 2 : On The Beach arrive le 26 juin 2025 sur PS5. Analyse des enjeux narratifs et techniques du prochain chef-d'œuvre de Kojima.",
    },
    8186: {
        "meta": "Récupérez les Twitch Drops Pride 2025 de Dead by Daylight et célébrez la diversité avec des cosmétiques exclusifs et une communauté engagée.",
    },
    7873: {
        "meta": "Crimson Desert de Pearl Abyss impressionne par son ambition, mais la démo du Summer Game Fest révèle des défis structurels majeurs. Analyse complète.",
    },
    8184: {
        "meta": "Valorant accueille Corrode, une carte française au décor de château-minier gothique. Analyse du gameplay et des rotations stratégiques inédites.",
    },
    9711: {
        "meta": "Optimisez Marvel Rivals sur PC et Steam Deck grâce à ce guide complet des réglages graphiques, audio et performances pour un gameplay fluide.",
    },
    12132: {
        "meta": "Escape From Tarkov prépare un wipe hardcore en plusieurs phases. BSG repense la progression pour offrir une expérience plus punitive et immersive.",
    },
    7791: {
        "meta": "La manette REALMz Sonic Green Hill Zone pour Nintendo Switch rend hommage au hérisson bleu avec un design collector et des fonctionnalités premium.",
    },
    7754: {
        "meta": "Elden Ring Nightreign pousse le défi avec Everdark Sovereign, un endgame surboosté par FromSoftware. Stratégies et mécaniques décryptées ici.",
    },
    7848: {
        "meta": "Le patch 1.2.2 de Civilization 7 corrige l'IA, l'équilibrage et les diplomaties. Une mise à jour charnière qui relance l'empire de Firaxis.",
    },
    10959: {
        "meta": "Death Stranding 2 «On The Beach» pousse la PS5 dans ses retranchements techniques. Analyse des défis graphiques et narratifs du projet de Kojima.",
    },
    10960: {
        "meta": "Last Epoch Saison 3 «Beneath Ancient Skies» arrive le 21 août avec un thème préhistorique, de nouvelles mécaniques et un endgame renouvelé.",
    },
    10958: {
        "meta": "Voin Permafrost fusionne la brutalité de Doom et la difficulté de Dark Souls dans un monde glacé. L'update ultime qui redéfinit le FPS indépendant.",
    },
    10149: {
        "meta": "Maîtrisez le système de skins et bundles Valorant grâce à ce guide complet : paliers, Radianite, rotations de boutique et astuces économiques.",
    },
    10862: {
        "new_title": "GTA 6 : solo spectaculaire, multijoueur déchaîné – le pari le plus audacieux de Rockstar",
        "meta": "GTA 6 promet un solo spectaculaire et un multijoueur déchaîné. Rockstar repousse les limites du monde ouvert avec son pari le plus ambitieux.",
        "title_translated": True,
    },
    10863: {
        "meta": "Mistfall Hunter réinvente le soulslike en mode extraction sans armes à feu. Un mélange de survie et de tension qui bouscule les codes du genre.",
    },
    11885: {
        "meta": "Resident Evil Survival Unit ose la stratégie mobile pour la licence culte de Capcom. Pari risqué ou véritable renouveau tactique ? Analyse complète.",
    },
    10719: {
        "meta": "50 Cent incarnera Balrog dans le film Street Fighter 2026. Un casting audacieux qui secoue la communauté FGC et les fans de la saga Capcom.",
    },
    10591: {
        "meta": "Bladesong, simulateur de forge grimdark, ouvre son playtest public. Plongez dans les mécaniques de forgeage et les enjeux de ce projet ambitieux.",
    },
    7752: {
        "meta": "Maximisez vos profits avec l'usine de fausse monnaie dans GTA Online. Voici comment débloquer, améliorer et rentabiliser cette entreprise clé.",
    },
    7457: {
        "meta": "Bloodlines 2 porte l'avenir de Vampire: The Masquerade sur ses épaules. Après 20 ans d'attente, la licence peut-elle retrouver son éclat légendaire ?",
    },
    10059: {
        "new_title": "Odin: Valhalla Rising – Le patch d'été apporte PvP hardcore et détente",
        "meta": "Odin: Valhalla Rising déploie son patch d'été avec du PvP hardcore et du contenu détente. Le MMORPG coréen mythologique frappe fort en Occident.",
        "title_translated": True,
    },
    11886: {
        "meta": "Destiny: Rising arrive sur mobile en free-to-play. NetEase peut-il honorer l'héritage Bungie ou le modèle F2P gâchera-t-il l'expérience looter ?",
    },
    8156: {
        "new_title": "Rematch de Sloclap : le jeu de foot multijoueur qui bouscule l'arène",
        "meta": "Rematch, le nouveau jeu de foot multijoueur signé Sloclap, bouscule les codes du genre avec un gameplay arcade nerveux et stratégique.",
        "title_translated": True,
    },
    10151: {
        "meta": "Runescape Dragonwilds entre en accès anticipé avec un focus survie. Voici les dates clés et les meilleurs conseils pour survivre sur Gielinor.",
    },
    7608: {
        "meta": "Trouvez la salle secrète des Loups-garous dans Hogwarts Legacy grâce à ce guide pas-à-pas. Un mystère bien caché au cœur de Poudlard vous attend.",
    },
    7610: {
        "meta": "Clair Obscur: Expedition 33 doit son succès à une alchimie collective, bien au-delà du seul nom de Charlie Cox. Analyse d'un phénomène RPG français.",
    },
    7611: {
        "meta": "La roadmap 2025 de Disney Dreamlight Valley révèle l'arrivée de Vice-Versa et Cendrillon. Toutes les nouveautés à venir pour les joueurs assidus.",
    },
    7613: {
        "new_title": "Rusty Rangers : le roguelike pixel-art rafraîchissant qui débarque sur consoles",
        "meta": "Rusty Rangers combine pixel-art rétro et mécaniques roguelike robustes sur consoles. Un titre indé qui se démarque dans un océan de jeux rétro.",
        "title_translated": True,
    },
    7612: {
        "meta": "Obsidian supprime le respec dans The Outer Worlds 2 pour favoriser le vrai roleplay. Un choix audacieux qui redonne du poids à chaque décision.",
    },
    7614: {
        "meta": "La bêta fermée de Chrono Odyssey mélange manipulation temporelle et MMORPG ambitieux. Révolution du genre ou simple effet de buzz ? Analyse ici.",
    },
    7615: {
        "meta": "Forgotten But Unbroken reçoit une mise à jour majeure qui enrichit la tactique WW2 avec de nouvelles mécaniques et un réalisme accru.",
    },
    7616: {
        "meta": "Nova Hearts fusionne tactical RPG, visual novel et dating-sim dans un univers magical girl. Un cocktail inédit qui réinvente les codes du genre.",
    },
    7617: {
        "meta": "Honor of Kings Plus transforme le MOBA phénomène avec des mécaniques repensées. Simple rebrand ou vraie révolution du gameplay ? Analyse complète.",
    },
    7619: {
        "meta": "Reclaim the Sea marie roguelike et combats navals dans une aventure maritime captivante. Un jeu de stratégie qui prend le large avec brio.",
    },
    7564: {
        "meta": "DreamWorks Gabby's Dollhouse: Ready to Party offre une aventure familiale colorée adaptée aux plus jeunes. Le jeu vidéo idéal pour jouer ensemble.",
    },
    7551: {
        "new_title": "Warhammer 40K Space Marine 2 : l'action brutale en promo rare à -40%",
        "meta": "Space Marine 2 profite d'une réduction rare de 40%. Plongez dans l'action brutale de Warhammer 40K à prix réduit avant que l'offre ne s'envole.",
        "title_translated": True,
    },
    7520: {
        "meta": "Stardew Valley reste le cosy game idéal pour déconnecter cet été. Entre farming zen et exploration, redécouvrez pourquoi ce jeu est intemporel.",
    },
    7519: {
        "new_title": "Len's Island 1.0 : le renouveau coopératif explosif du crafting-survie",
        "meta": "Len's Island passe en version 1.0 avec un mode coopératif transformateur. Le crafting-survie prend une toute nouvelle dimension à plusieurs joueurs.",
        "title_translated": True,
    },
    7522: {
        "meta": "Maîtrisez la classe Planétologue dans Dune Awakening grâce à ce guide complet : talents, équipements et stratégies pour dominer Arrakis.",
    },
    7524: {
        "meta": "Grimpez en classé dans Shadowverse Worlds Beyond avec ces 7 decks F2P efficaces. Cartes bronze et argent suffisent pour rivaliser au sommet.",
    },
    7497: {
        "meta": "The Blood of Dawnwalker, RPG vampirique de Rebel Wolves, promet un open-world ambitieux. Les vétérans de The Witcher 3 redéfinissent le genre.",
    },
    7514: {
        "meta": "Voici comment choisir, gérer et rentabiliser votre hangar dans GTA Online. Emplacement, stockage, missions aériennes et revenus passifs détaillés.",
    },
    7499: {
        "meta": "Les manoirs XXL arrivent dans GTA Online et promettent un luxe inédit. Entre investissement massif et nouvelles mécaniques, faut-il foncer ?",
    },
    7498: {
        "meta": "Fangs of Asterkarn s'annonce comme la plus grande extension de Grim Dawn. Nouveaux contenus, mécaniques et défis pour les fans d'ARPG exigeants.",
    },
    7456: {
        "meta": "Cyberpunk 2077 tourne sur Switch 2 avec des surprises et quelques pépins. Retour d'expérience sur le portage nomade le plus inattendu de l'année.",
    },
    7459: {
        "meta": "Grow a Garden explose les compteurs avec 16 millions de joueurs simultanés. Retour sur le phénomène idle-game qui bat tous les records sur Roblox.",
    },
    7458: {
        "meta": "Rune Factory: Guardians of Azuma propose un RPG premium sans gacha. Une alternative rafraîchissante pour les fans de Genshin Impact lassés du F2P.",
    },
    7071: {
        "meta": "Palworld et Terraria annoncent un crossover explosif mêlant capture de Pals et crafting 2D. Toutes les infos sur cette collaboration inattendue.",
    },
    7070: {
        "meta": "Ragnarok Libre mélange nostalgie MMO, idle RPG et Web3 sur Telegram. DeLabs Games tente un pari audacieux entre blockchain et gameplay accessible.",
    },
    6926: {
        "meta": "Directive 8020 de Supermassive Games transpose le whodunnit spatial en horreur narrative. Premières impressions après une session au Summer Game Fest.",
    },
    7426: {
        "meta": "Supermassive Games réinvente l'horreur spatiale avec Directive 8020. Narration à choix multiples, tension permanente et ambition AAA au programme.",
    },
    7727: {
        "new_title": "Cyberpunk 2077 : la mise à jour 2.3 reportée entre ambitions et ressources limitées",
        "meta": "La mise à jour 2.3 de Cyberpunk 2077 est reportée. CD Projekt Red jongle entre ambitions techniques et ressources après le succès de Phantom Liberty.",
        "title_translated": True,
    },
    7697: {
        "meta": "Dune: Awakening franchit le million de joueurs en sept jours et redéfinit le MMO-survie. Analyse du phénomène Funcom qui secoue l'industrie.",
    },
    7693: {
        "meta": "La traduction de Final Fantasy VI a façonné un mythe RPG. Retour sur l'odyssée éditoriale qui a transformé ce classique japonais en légende mondiale.",
    },
    6664: {
        "new_title": "Soulstone Survivors 1.0 : un roguelike impitoyable enfin abouti",
        "meta": "Soulstone Survivors sort de l'accès anticipé en version 1.0. Ce roguelike de type Survivors offre une montée en puissance brutale et addictive.",
        "title_translated": True,
    },
    12103: {
        "meta": "Hearts of Iron IV remanie son système de factions dans une mise à jour stratégique. Un changement prometteur pour les amateurs de grand-stratégie.",
    },
    12104: {
        "meta": "Alpha Response ramène le FPS tactique PvE old-school dans la lignée de SWAT 4 et Rainbow Six 3. Un titre à surveiller pour les fans du genre.",
    },
    12105: {
        "meta": "Bitcraft Online ajoute les commandes WASD et des améliorations QoL majeures. Le MMO sandbox redonne du pouvoir aux joueurs avec cette mise à jour.",
    },
    12106: {
        "meta": "Zelda Breath of the Wild et Tears of the Kingdom reviennent remasterisés sur Switch 2. Bien plus qu'un simple polish HD pour ces chefs-d'œuvre.",
    },
    12011: {
        "meta": "Trouvez et améliorez la tenue Esprit du Héros Ancien dans Zelda Tears of the Kingdom. Voici chaque étape pour obtenir cet équipement légendaire.",
    },
    11998: {
        "new_title": "Soldes d'été Nintendo : Super Mario Strikers, WWE 2K25, Monument Valley 3",
        "meta": "Les soldes d'été Nintendo mettent en avant Super Mario Strikers, WWE 2K25 et Monument Valley 3. Les meilleures offres eShop de la semaine décryptées.",
        "title_translated": True,
    },
    11984: {
        "meta": "Les Sims 4 Nature enchantée plonge vos Sims dans un univers féérique riche en gameplay. Pack d'extension ou simple cosmétique ? Verdict complet.",
    },
    11947: {
        "meta": "Black Salt Games fonde le studio Disc 2 et lance deux nouvelles licences après le succès de DREDGE. L'avenir s'annonce prometteur pour l'équipe.",
    },
    11889: {
        "meta": "GTA 6 promet une Vice City étendue des Everglades à Miami Beach. Analyse de l'immersion, de la carte XXL et des enjeux du prochain Rockstar.",
    },
    11865: {
        "meta": "Un speedrun extrême de Death Stranding relance le débat avant la sortie de DS2. Analyse des records et des enjeux autour du prochain Kojima.",
    },
    11866: {
        "meta": "LIMBO est disponible à 0,99€ sur Nintendo Switch jusqu'au 11 juillet. Le chef-d'œuvre indé de Playdead mérite sa place dans toute ludothèque.",
    },
    11730: {
        "new_title": "Summer Games Done Quick 2025 : le marathon speedrun caritatif de retour",
        "meta": "Le SGDQ 2025 revient du 6 au 13 juillet avec les meilleurs speedrunners au monde. Marathon caritatif, records et moments épiques au programme.",
        "title_translated": True,
    },
    11725: {
        "meta": "DigiGods 2.0 renaît avec un reboot VR qui réinvente le chaos social en réalité virtuelle. Squido Studio repousse les limites du sandbox multijoueur.",
    },
    11709: {
        "meta": "John Romero, créateur de Doom, se voit refuser le financement de son nouveau FPS sous Unreal Engine 5. Un revers qui interroge toute l'industrie.",
    },
    11710: {
        "meta": "Le Threadripper 9980X d'AMD pousse les limites du multi-cœur, mais à quel prix ? Analyse d'un monstre de puissance réservé aux professionnels.",
    },
    11625: {
        "meta": "Tous les codes Berry Avenue actifs en juillet 2025 sont listés ici. Débloquez accessoires, tenues et items exclusifs pour personnaliser votre avatar.",
    },
    11627: {
        "meta": "Microsoft annule le reboot de Perfect Dark et ferme The Initiative. Un séisme chez Xbox entre pressions budgétaires et stratégie Game Pass.",
    },
    11550: {
        "new_title": "Flame Fatales 2025 : les femmes à l'honneur du marathon speedrun GDQ",
        "meta": "Flame Fatales 2025 célèbre les speedrunneuses avec un marathon caritatif GDQ. Performances record et représentation féminine au cœur de l'événement.",
        "title_translated": True,
    },
    11505: {
        "new_title": "PS6 et Project Amethyst : la feuille de route next-gen de Sony dévoilée",
        "meta": "Sony prépare déjà la PS6 et le Project Amethyst. La feuille de route next-gen se précise entre innovation hardware et stratégie cloud gaming.",
        "title_translated": True,
    },
    11485: {
        "meta": "Résolvez l'épreuve des Motards Sans Tête dans Death Stranding 2 grâce à ce guide. Stratégie, équipement et astuces pour vaincre ce défi redoutable.",
    },
    11486: {
        "meta": "Percez le secret du Pizzaiolo dans Death Stranding 2 grâce à ce guide détaillé. Chaque étape de la quête et les meilleures récompenses révélées.",
    },
    11458: {
        "meta": "Le Humble Choice de juillet 2025 propose 8 pépites indés parfaites pour le Steam Deck. Analyse des titres et de leur compatibilité portable.",
    },
    11396: {
        "meta": "Identifiez la meilleure pelle S-Tier dans Dig sur Roblox grâce à ce classement complet. Astuces de farming et stratégies pour progresser vite.",
    },
    11338: {
        "meta": "Halo Studios amorce un virage majeur après Infinite. Nouvelle direction, nouveaux projets et enjeux pour l'avenir de la franchise mythique de Xbox.",
    },
    11342: {
        "meta": "PAX West et PAX Unplugged 2025 redéfinissent l'avenir du jeu de société. Annonces, tendances et enjeux d'un secteur en pleine mutation analysés.",
    },
    11344: {
        "meta": "Nvidia met fin au support de la GTX 1060 après presque dix ans de service. Voici ce que cela signifie pour les millions de joueurs encore équipés.",
    },
    11346: {
        "new_title": "Nacon RIG 800 Pro HS à 60€ : le casque sans-fil gaming à prix cassé",
        "meta": "Le Nacon RIG 800 Pro HS tombe à 60€ avec audio 3D, 40 mm et 24h d'autonomie sur PC et PS5. Une affaire rare pour un casque sans-fil de cette qualité.",
        "title_translated": True,
    },
    11272: {
        "meta": "Le Nvidia DLSS SDK 310.0.3 réduit enfin la consommation VRAM du DLSS Transformer. Une mise à jour technique cruciale pour les GPU à mémoire limitée.",
    },
    11271: {
        "meta": "Maîtrisez le Crâne Maudit de Peak pour transformer chaque sacrifice en avantage décisif. Stratégies, timings et synergies révélés dans ce guide.",
    },
    11230: {
        "meta": "Sega refuse le remake de Sonic Adventure et mise sur l'innovation. Takashi Iizuka explique pourquoi le hérisson bleu regarde vers l'avant.",
    },
    11231: {
        "meta": "La RTX 5070 Super de Nvidia promet un vrai bond pour le milieu de gamme. Fuites, spécifications et analyse de ce que les joueurs peuvent attendre.",
    },
    11211: {
        "meta": "Optimisez vos DPS dans le mode Stadium d'Overwatch 2 avec les meilleurs builds, items et synergies d'équipe. Guide complet pour dominer chaque match.",
    },
    11212: {
        "meta": "Farmez efficacement les cristaux chiraux dans Death Stranding 2 grâce à ce guide. Meilleures routes, astuces et stratégies de collecte détaillées.",
    },
    11165: {
        "meta": "Japan Expo 2025 amorce un virage gaming décisif. L'événement parisien mise sur le jeu vidéo comme pilier central de son édition estivale.",
    },
    11167: {
        "meta": "Le PlayStation Plus de juillet 2025 réunit Diablo IV, Jusant et d'autres pépites. AAA, indé et jeux de combat composent un line-up solide.",
    },
    11097: {
        "meta": "Le Samsung Smart Monitor M9 M90SF offre une dalle QD-OLED 32\" 4K/165Hz, Smart TV intégrée et audio 3D. Le moniteur gaming ultime tout-en-un.",
    },
    11080: {
        "meta": "La manette EasySMX X05 offre une qualité surprenante pour moins de 30€ sur PC. Test complet d'un contrôleur budget qui rivalise avec les grandes marques.",
    },
    11081: {
        "meta": "Transformez Skyrim en 2025 avec cette modlist PC ultime. Les meilleurs mods gameplay, graphismes et immersion testés sur plus de 800 heures de jeu.",
    },
    11022: {
        "meta": "Bandai Namco dévoile son line-up impressionnant pour la SDCC 2025. Démos jouables, expériences immersives et fan service au rendez-vous cet été.",
    },
    11021: {
        "meta": "Xbox sacrifie son identité console au profit du Game Pass. Microsoft abandonne progressivement le hardware au risque de perdre son ADN gaming.",
    },
    11031: {
        "meta": "Ziggurat Interactive solde plus de 100 jeux rétro jusqu'à -85% cet été. Les meilleures pépites classiques à récupérer pendant les promotions.",
    },
    11000: {
        "meta": "Le Bandai Namco Summer Showcase 2025 s'annonce comme le rendez-vous incontournable de l'été. Annonces majeures et révélations attendues au programme.",
    },
    10997: {
        "new_title": "Perfect Days : un chef-d'œuvre contemplatif qui redéfinit la simplicité",
        "meta": "Perfect Days de Wim Wenders sublime la beauté du quotidien à Tokyo. Un film contemplatif qui résonne profondément avec la culture du jeu vidéo.",
        "title_translated": True,
    },
    10971: {
        "meta": "FBC Firebreak déçoit malgré ses promesses de coop immersive. Onboarding raté, narration légère et grind excessif plombent le spin-off de Control.",
    },
    10904: {
        "meta": "Le créateur de Squid Game doute lui-même de sa saison 3. Entre promesses et incertitudes, la finale du phénomène mondial divise joueurs et fans.",
    },
}

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        articles = json.load(f)

    results = []
    total = len(articles)

    for i, art in enumerate(articles):
        aid = art["id"]
        slug = art["slug"]
        title = art["title"]
        excerpt = art.get("excerpt", "")
        has_yoast = art.get("has_yoast", False)

        print(f"[{i+1}/{total}] Processing {aid}: {title[:60]}...")

        seo = ARTICLE_SEO.get(aid, {})
        meta_desc = seo.get("meta", "")
        new_title = seo.get("new_title", None)
        title_translated = seo.get("title_translated", False)

        if has_yoast:
            results.append({
                "id": aid,
                "slug": slug,
                "title": title,
                "new_title": None,
                "old_excerpt": excerpt,
                "new_meta": "",
                "status": "skipped_has_yoast",
                "title_translated": False,
            })
            print(f"  Skipped (has_yoast)")
            continue

        if not meta_desc:
            results.append({
                "id": aid,
                "slug": slug,
                "title": title,
                "new_title": None,
                "old_excerpt": excerpt,
                "new_meta": "",
                "status": "error_no_meta",
                "title_translated": False,
            })
            print(f"  ERROR: No meta defined!")
            continue

        # Check length
        if len(meta_desc) > 155:
            print(f"  WARNING: meta is {len(meta_desc)} chars, truncating...")
            meta_desc = meta_desc[:152] + "..."

        # Build WP payload
        payload = {
            "meta": {
                "_yoast_wpseo_metadesc": meta_desc
            }
        }
        if new_title:
            payload["title"] = new_title

        # Send to WP
        status_code = wp_update(aid, payload)
        status = "updated" if status_code == 200 else f"error_{status_code}"

        results.append({
            "id": aid,
            "slug": slug,
            "title": title,
            "new_title": new_title,
            "old_excerpt": excerpt,
            "new_meta": meta_desc,
            "status": status,
            "title_translated": title_translated,
        })

        print(f"  -> {status} | meta ({len(meta_desc)} chars) | title_translated={title_translated}")

        # Small delay to be nice to the server
        time.sleep(0.3)

    # Save results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # Summary
    updated = sum(1 for r in results if r["status"] == "updated")
    skipped = sum(1 for r in results if r["status"] == "skipped_has_yoast")
    errors = sum(1 for r in results if r["status"].startswith("error"))
    translated = sum(1 for r in results if r["title_translated"])

    print(f"\n=== SUMMARY ===")
    print(f"Total: {total}")
    print(f"Updated: {updated}")
    print(f"Skipped (yoast): {skipped}")
    print(f"Errors: {errors}")
    print(f"Titles translated: {translated}")
    print(f"Results saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
