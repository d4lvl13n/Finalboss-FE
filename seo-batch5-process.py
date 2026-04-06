#!/usr/bin/env python3
"""
SEO Meta Description Updater for seo-batch-5.json
Hand-crafted meta descriptions pushed to WordPress via REST API.
"""

import json
import urllib.request
import urllib.error
import base64
import time

INPUT_FILE = "/Users/damienlarquey/gaming-news/seo-batch-5.json"
OUTPUT_FILE = "/Users/damienlarquey/gaming-news/seo-results-5.json"

WP_BASE = "https://backend.finalboss.io/wp-json/wp/v2/posts"
WP_USER = "Gaia"
WP_PASS = "3z4W 3J1w b9gU R0GZ SshT bDNp"
AUTH_HEADER = "Basic " + base64.b64encode(f"{WP_USER}:{WP_PASS}".encode()).decode()

# Pre-crafted meta descriptions keyed by article ID
META_MAP = {
    105086: "From 1st Edition Shadowless to modern Tera ex, these 12 Charizard cards define 30 years of Pokemon history, hype, and record-breaking auctions.",
    105090: "MSI's MEG X870E Ace Max delivers 10GbE, USB4, and PCIe 5.0 for your AM5 Ryzen rig at a price well below the Godlike. Full hands-on review inside.",
    105082: "The Wooting 60HE v2 and its Lekker Tikken Hall-effect switches finally sold me on 60% keyboards. Here's what a month of gaming revealed.",
    105047: "Ed Skrein's casting as Baldur hints Amazon's God of War series will faithfully adapt the 2018 game's brutal tone. Here's why that casting matters.",
    105041: "5 crucial PS5 headset facts covering Bluetooth limits, hi-res audio, wired vs wireless trade-offs, battery life, and settings tweaks before you buy.",
    105045: "Going Medieval hits 1.0 on March 12 after 16 major updates and 1M+ sales. Renown, Grand Objectives, and new roles aim to finally deliver an endgame.",
    105043: "Splash Damage acquired SCUM developer Gamepires with Emona Capital backing. Here's what the deal means for FPS co-dev and survival live-ops.",
    105039: "Space Marine 2 Patch 12.0 adds a free Techmarine class, Omnissian Axe, and the Disruption operation. Here's everything new in the update.",
    105037: "After 14 hours with Resident Evil Requiem, its blend of RE4-style action and survival horror with an aging Leon feels like the series' best in years.",
    105035: "Capcom's Switch 2 port of RE Requiem uses DLSS upscaling and careful asset scaling to approach PS5 visuals at 40-60 fps. Here's how they pulled it off.",
    104978: "Funcom rolled back Dune Awakening servers after a PvE base exploit, issuing bans and planning server merges. Here's what Patch 1.3.10.0 changes.",
    105015: "Samson: A Tyndalston Story hooked me with heavy melee combat, chunky driving, and a debt-clock loop that feels sharper than most AAA open-world games.",
    105018: "24 tested survival tips for Resident Evil Requiem covering stealth, combat, crafting, and saving strategies tailored to Grace and Leon's playstyles.",
    105013: "Grim Dawn's final expansion pairs a huge paid content drop with a free engine-modernizing patch adding scalable UI, stash overhaul, and new land.",
    105011: "A hidden Konami code unlocks Sons of Sparta's co-op mode early after fan complaints. Here's how God of War's cheeky fix actually works.",
    105009: "Disgaea Mayhem ditches the tactical grid for real-time musou-style combat while keeping Item World. Arriving on Switch and other platforms this summer.",
    104990: "Path of Exile's Mirage league rewires the Atlas with generic node keys and astrolabe rifts, borrowing PoE 2 ideas while preserving PoE 1's structure.",
    104988: "Bloomberg reports Tencent cut Highguard funding on Feb 11 after its post-launch crash, triggering mass layoffs at Wildlight. Here's what happened.",
    104986: "Just Cause creator Christofer Sundberg launches Samson on April 8 for $24.99 -- a compact, single-player open-world brawler rejecting AAA bloat.",
    104984: "Bungie's Marathon Server Slam drew 143K+ players and stress-tested its PvPvE social systems. Here's what broke, what worked, and what it means.",
    104982: "We Were Here Tomorrow moves the cult co-op puzzle series to a retrofuturistic facility with stronger role splits and rebuilt walkie-talkie mechanics.",
    104980: "Neverness to Everness launches April 29 on PC, PS5, iOS, and Android with cross-play gacha blending anomaly hunting, vehicle crime, and cafe life.",
    104976: "New Stardew Valley anniversary footage reveals the 2012 prototype's SNES-era roots and confirms Clint and Sandy as romance options in update 1.7.",
    104956: "LEGO's 6,838-piece Venusaur, Charizard, and Blastoise set costs $650 but might be the ultimate Pokemon display piece. Here's why it works.",
    104954: "Woot's LEVEL20 coupon, Pokemon Day restocks, and PS Direct deals make today a one-day shopping sprint for headsets, monitors, and TCG bundles.",
    104953: "Nvidia's GPUs are now critical AI infrastructure. Here's how Jensen Huang turned a gaming graphics trick into the backbone powering modern AI.",
    104943: "Optimize your Steam Deck for 2026 with tested settings, FPS vs battery tips, and per-game presets for Stardew Valley, Hades 2, and BG3.",
    104944: "The same 10 forever games are crushing every new release in 2026. Here's why evergreen titles dominate, why publishers love it, and why it's a problem.",
    104935: "March's PS Plus lineup pairs PGA Tour 2K25, Monster Hunter Rise, Slime Rancher 2, and ESO: Gold Road for four distinct player types. Full breakdown.",
    104923: "IGN Fan Fest Day 1 revealed a Mortal Kombat II trailer with a May 8 date, Kenny Omega's Street Fighter 6 mocap DLC, and more gaming announcements.",
    104925: "New York AG Letitia James sued Valve, alleging CS2, TF2, and Dota 2 loot boxes are illegal gambling. The case could reshape Steam's item economy.",
    104921: "Pokopia's Treehouse demo reveals Ditto-led building and Omega Force's Builders DNA beneath its cozy Pokemon life-sim surface. Here's what stood out.",
    104911: "Director Paul W.S. Anderson argues filmmakers must play the games they adapt to capture camera language and tone, not just copy the plot.",
    104913: "Reigns: The Witcher turns Geralt's world into swipe-sized chaos with Dandelion's tall tales, tricky Inspirations, and twitchy tile-based combat.",
    104909: "Ninja Gaiden 4's The Two Masters DLC lands March 4 with three chapters, two brutal weapons, trials, and Abyssal Road for PS5, Xbox, and PC.",
    104848: "Capcom treated Switch 2 as a first-class platform for Resident Evil Requiem, earning high marks for performance and visuals despite an uneven second act.",
    104867: "Square re-released Final Fantasy VII on Steam with modern QoL features but shipped a broken build with doubled battle speed and stuttering audio.",
    104873: "New York AG Letitia James is suing Valve over Counter-Strike loot boxes, calling them illegal gambling and seeking restitution plus treble damages.",
    104790: "New York's AG is suing Valve over CS2 loot boxes and the Steam market. Here's what the lawsuit means for gamers, skins trading, and the industry.",
    104871: "Veteran creative director Clint Hocking left Ubisoft amid restructuring, spotlighting the leadership churn and talent flight plaguing Assassin's Creed.",
    104869: "ConcernedApe will reveal two new Stardew Valley 1.7 marriage candidates during the 10th-anniversary video. Here's why it matters for the game's future.",
    104865: "PC and console revenue jumped 13% in 2026 as Battlefield 6 and viral indies drive sales, while mobile gaming grew just 1%. Sensor Tower data inside.",
    104861: "TT Games trims Lego Batman to a seven-character cast to fund Arkham-inspired combat and bespoke progression. The May 29 launch will prove the bet.",
    104858: "Far Far West's Steam Next Fest demo pairs spells, hovertrains, and procedural missions into a tight co-op FPS loop with Deep Rock Galactic-sized hooks.",
    104839: "ARK's Astraeos Mega Update adds an amphibious mobile fortress, a five-headed Hydra raid boss, and a scorching desert that will reshape the late-game meta.",
    104856: "Monster Hunter Stories 3 reveals Azuria, Shepharden, and Galyad plus a habitat-restoration system tying rare eggs to dual-element Monsties.",
    104854: "Going Medieval leaves Early Access on March 12 with 1M sales and a real endgame: Renown and six Grand Objectives that give the sandbox lasting purpose.",
    104852: "PS Direct accessories, a $0.99 AMC month, and MTG Universes Beyond preorders line up for a rare cluster of limited-time deals across three stores.",
    104850: "Creative Assembly's 25th-anniversary interview traces Total War's evolution through accidental pivots and reveals plans for Medieval III and Warhammer 40K.",
    104846: "At EUIC 2026, 70+ players pooled 18,508 encounters in a one-hour full-odds shiny hunt using retro handhelds. It was about community, not just shinies.",
    104799: "After a full playthrough of Resident Evil Requiem, its dual heroes, tight gun economy, and fan-service story deliver real scares and genuine heartbreak.",
    104796: "Nacon filed for insolvency days before Nacon Connect and weeks ahead of GreedFall 2's 1.0 launch, putting release timing and studio futures at risk.",
    104793: "Windrose hit 1M wishlists after its Steam Next Fest demo exploded, but the devs still refuse to announce a release date. Here's what we know so far.",
    104792: "13 PS5 and PS4 games worth grabbing from the Dealmania sale before prices bounce back. These picks deliver genuine value across every genre.",
    104798: "The Creality Halot-X1's twist plate, raised vat, and resin feed turned messy resin 3D printing into a genuinely beginner-friendly experience.",
    104795: "The MSI Katana with RTX 5060 and QHD+ display just replaced the Asus TUF as my top budget gaming laptop pick. Here's why it hits above its price.",
    104785: "BitCraft Online launches Early Access 2 on Feb 26 with a full wipe, revised onboarding, settlement upgrades, and a new pricing structure.",
    104783: "Konami's 1992 X-Men arcade returns with six-player online co-op, rollback netcode, and save states in Limited Run's MARVEL MaXimum Collection.",
    104781: "Limited Run repackages six Konami-era Marvel arcade classics with online play, archives, and filters. Great for collectors, sparse on details so far.",
    104747: "March 2026 leans hard on remasters and legacy collections from Marvel to Mega Man, while new indie Far Far West tries to steal the spotlight.",
    104745: "AMD will deploy roughly 6GW of custom GPUs in Meta's data centers and issued performance warrants to lock in the partnership. Here's what it means.",
    104742: "Amazon is bundling a free Crimson Desert code with the Radeon RX 9070 XT. The GPU is a top-rated 4K card, but is the bundle deal truly worth it?",
    104738: "Battlesector's Black Legion DLC brings 15 new units and a planetary-supremacy map, delivering meaningful late-life support for the 5-year-old tactics game.",
    104736: "Starting March 3, Pokemon GO shifts weekend events to Saturdays, boosts shiny rates in raids and eggs, and brings back a free plus Deluxe GO Pass.",
    104741: "Discord delayed age verification to H2 2026 after a privacy backlash, promising vendor transparency and on-device checks. Here's what changed.",
    104735: "New York's loot-box suit against Valve demands studios rethink dark patterns in game UIs. Here's what developers need to change right now.",
    104708: "Astrobuilder's Steam Next Fest demo features 600+ AI NPCs with memory and goals, promising emergent politics and real consequences in a sandbox world.",
    104706: "Restoration's Shatterpoint update gives its volunteer-run Star Wars Galaxies server a cyclical Civil War with permanent map scars and open-world PvP.",
    104695: "Automobilista 2's 2026 roadmap outlines a phased career mode arriving H2 2026, plus update 1.7's AI improvements and steady content drops.",
    104693: "WANDERBURG's surprise Steam Next Fest demo lets you test the 250K-wishlist roguelike where you grow and fight from inside a castle on wheels.",
    104691: "Switch 2 delivers a real generational jump in display, power, and storage, but its higher price and patchwork ports keep the OLED model a smart buy.",
    104689: "Throne and Liberty merges NA and SA into one Americas region on March 12, splits PlayStation servers, and resets leaderboards. Full details inside.",
    104687: "CyberConnect2 reclaimed the .hack franchise and will self-publish .hack//Z.E.R.O. as a studio-led action RPG. Here's why that changes everything.",
    104711: "Games and mods are exploiting real-world scandals for clicks. This breakdown separates the ethical releases from the cynical cash grabs.",
    104685: "G2A data shows Fallout's TV series created a durable PC sales halo: Season 1 lifted baseline demand and Season 2 drove a 78% pre-launch surge.",
    104683: "Battlesector's Black Legion DLC drops Feb 24 with 15 Chaos units including Helbrute, Heldrake, and Terminators. A major content push for tactics fans.",
    104680: "BitCraft shifts to Early Access 2 with an optional account wipe, faster XP, a price cut, and 24-hour downtime starting Feb 25. Here's what it means.",
    104675: "Vampire Crawlers grafts Vampire Survivors' addictive loop onto a deck-driven first-person roguelite. The Steam Next Fest demo already clicks.",
    104673: "New Blood will eat console certification costs to ship Dungeons of Dusk on every platform, including Switch 2. Community access beats pure profit.",
    104590: "Dead by Daylight's All-Kill: Comeback reworks the Trickster with a new Style Rank system that could flip the meta. Neon map and survivor included.",
    104571: "Rainbow Six Siege hits 100M players after a decade of live-ops, esports, and smart onboarding. Here's what the milestone reveals about its future.",
    104626: "A new Evangelion series written by NieR creator Yoko Taro and scored by Keiichi Okabe was revealed at the 30th-anniversary festival.",
    104624: "Housemarque's Saros is a PS5-exclusive Returnal spiritual successor launching April 30 at a bold price point. Here's what the previews show.",
    104622: "Like a Dragon: Infinite Wealth sharpens combat and world design over its predecessor. A 70% Steam sale makes this tactical RPG a must-buy right now.",
    104620: "Age of Empires II's The Last Chieftains DLC adds three South American civs, branching campaigns, and hero passives that boost replayability.",
    104617: "Best Buy has an open-box ROG Zephyrus G14 with RTX 5080 for $2,014.99. Big performance in a sub-3.5 lb chassis, but expect heat under heavy loads.",
    104615: "Aimlabs launched its first in-app matchmaking and a two-player duos mode with MSI QD-OLED monitor prizes. Solo aim drills just became a team sport.",
    104613: "PS Direct, Amazon, and Best Buy all dropped one-hit deals today. Samsung G5 OLED, PS5 accessories, and game bargains converge for a rare sales mashup.",
    104611: "Blizzard scheduled weeks of timed balance patches around WoW Midnight's March rollout to manage sweeping class, Apex Talents, and raid tuning changes.",
    104602: "AI.VI blends FPS combat with tower-defense strategy as a retired warbot fights P.A.S.C.A.L. hordes using elemental loadouts and permanent upgrades.",
    104594: "Humble Bundle's Witcher x Cyberpunk deal drops 25 PDFs including rare Polish comics and artbooks. A cheap lore refresh before upcoming game releases.",
    104592: "Asus' Kojima-branded ROG Flow Z13 adds carbon-fiber trim and exclusive swag but costs $400-$900 more than the identical non-branded hardware.",
    104588: "Guerrilla's closed Horizon Hunters beta (Feb 27-Mar 1) stress-tests 3-player co-op on PS5 and PC. Expect systems data, not launch-day answers.",
    104587: "Prime Video taps Science SARU to reboot Ghost in the Shell for July 2026, making the anime classic the centerpiece of its streaming anime strategy.",
    104585: "Life is Strange: Reunion brings back Max, Chloe, Rewind, and Backtalk with playable swaps and photo tools. PS5 launch confirmed with hands-on details.",
    104583: "Splintered Fate adds Alopex as its first female fighter on Feb 24, plus paid artifacts and a free prestige system with Pepper Runs and new bosses.",
    104581: "Scott Pilgrim EX's Casa Vania preview teases Goth Neil and boss Lady Envy, showing how the brawling adventure shift could pay off without losing focus.",
    104573: "Hori's Gengar and Mimikyu Switch 2 accessories blend ghost-type art with sturdy builds, turning your console into wearable Pokemon streetwear.",
    104578: "Overwatch Rush is a top-down, touch-first mobile hero shooter built for short sessions, not a port. Blizzard rethinks aim, verticality, and pacing.",
    104576: "Battlefield 6 cut Battle Pass XP and rewired challenges after player backlash, shifting to near-24/7 cross-studio hotfixes. Here's what changed.",
}


def update_wordpress(post_id: int, meta_desc: str) -> tuple:
    """Push meta description to WordPress via REST API."""
    url = f"{WP_BASE}/{post_id}"
    data = json.dumps({"meta": {"_yoast_wpseo_metadesc": meta_desc}}).encode("utf-8")

    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", AUTH_HEADER)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if resp.status in (200, 201):
                return True, "ok"
            return False, f"HTTP {resp.status}"
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode()[:200]
        except:
            pass
        return False, f"HTTP {e.code}: {body}"
    except urllib.error.URLError as e:
        return False, f"URLError: {e.reason}"
    except Exception as e:
        return False, str(e)


def main():
    with open(INPUT_FILE, "r") as f:
        articles = json.load(f)

    print(f"Loaded {len(articles)} articles from {INPUT_FILE}")

    # Validate all metas before sending
    print("\n--- Validating meta descriptions ---")
    errors = []
    for article in articles:
        aid = article["id"]
        has_yoast = article.get("has_yoast", False)
        if has_yoast:
            continue
        if aid not in META_MAP:
            errors.append(f"Missing meta for id={aid} slug={article['slug']}")
            continue
        meta = META_MAP[aid]
        if len(meta) > 155:
            errors.append(f"id={aid}: meta too long ({len(meta)} chars): {meta}")
        if meta.startswith("This article") or meta.startswith("In this post") or meta.startswith("Learn about"):
            errors.append(f"id={aid}: bad opening phrase")

    if errors:
        print("VALIDATION ERRORS:")
        for e in errors:
            print(f"  - {e}")
        print(f"\nFix {len(errors)} errors before proceeding.")
        return

    print("All meta descriptions validated OK.\n")

    results = []
    ok_count = 0
    skip_count = 0
    err_count = 0

    for i, article in enumerate(articles):
        aid = article["id"]
        slug = article["slug"]
        title = article["title"]
        excerpt = article.get("excerpt", "")
        has_yoast = article.get("has_yoast", False)
        yoast_desc = article.get("yoast_desc", "")

        # Skip if already has Yoast meta
        if has_yoast and yoast_desc:
            results.append({
                "id": aid,
                "slug": slug,
                "title": title,
                "old_excerpt": excerpt,
                "new_meta": yoast_desc,
                "status": "skipped"
            })
            skip_count += 1
            print(f"[{i+1:3d}/100] SKIP  id={aid}")
            continue

        meta = META_MAP[aid]

        # Push to WordPress
        success, msg = update_wordpress(aid, meta)

        status = "ok" if success else "error"
        if success:
            ok_count += 1
        else:
            err_count += 1

        result = {
            "id": aid,
            "slug": slug,
            "title": title,
            "old_excerpt": excerpt,
            "new_meta": meta,
            "status": status
        }
        if not success:
            result["error"] = msg

        results.append(result)
        print(f"[{i+1:3d}/100] {status.upper():5s} id={aid} ({len(meta):3d}c) {meta[:70]}...")

        # Gentle pacing
        if (i + 1) % 10 == 0:
            time.sleep(0.3)

    # Save results
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nDone! Results saved to {OUTPUT_FILE}")
    print(f"  OK: {ok_count}  Skipped: {skip_count}  Errors: {err_count}")


if __name__ == "__main__":
    main()
