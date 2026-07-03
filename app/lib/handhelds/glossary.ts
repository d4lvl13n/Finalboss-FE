// Handheld glossary — A-Z explainers for the terms that actually affect a handheld
// gaming PC purchase. These are the internal-link targets product/category pages
// point at. Static + ISR, cloned from app/lib/laptops/glossary.ts.

export interface GlossaryTerm {
  slug: string;            // url slug, kebab-case
  term: string;            // display name, e.g. "TDP"
  aliases: string[];       // other spellings for auto-linking
  short: string;           // one-sentence definition (<= ~140 chars)
  body: string[];          // 1-3 short plain-text paragraphs (NO markdown)
  buying: string;          // one short paragraph: why it matters when buying
  related: string[];       // 2-3 other term slugs in this file
  relatedCategorySlug?: string; // a /handhelds/best/<slug> page, ONLY from the allowed list
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'tdp',
    term: 'TDP',
    aliases: ['tdp', 'tdp modes', 'thermal design power', 'power limit', 'watt limit'],
    short:
      'The wattage a handheld feeds its APU; lower TDP stretches battery life, higher TDP unlocks more frames.',
    body: [
      'TDP (Thermal Design Power) is the sustained power budget, in watts, that a handheld allows its APU to draw. Most handhelds expose adjustable TDP modes, often ranging from around 5-8W on the low end to 25-40W or more at the top, letting you trade performance for battery life on the fly.',
      'Dropping TDP a few watts often costs surprisingly little frame rate while adding real minutes of battery life, because handheld APUs are usually power-limited rather than thermally maxed out at their low and mid settings. Pushing the top TDP mode usually needs a game plugged in or a big battery to sustain it.',
    ],
    buying:
      'Check how granular a handheld TDP slider is and whether it is set in the vendor app or firmware/BIOS. A device with a wide, easily adjustable TDP range lets you dial in the right performance-versus-battery balance per game instead of being stuck with one profile.',
    related: ['apu', 'rdna', 'z1-extreme'],
  },
  {
    slug: 'hall-effect-sticks',
    term: 'Hall-Effect Sticks',
    aliases: ['hall effect sticks', 'hall effect', 'hall sensor sticks', 'magnetic sticks', 'tmr sticks'],
    short:
      'Analog sticks that use magnets instead of physical contacts, so they resist the drift that plagues older sticks.',
    body: [
      'Traditional analog sticks use a potentiometer with a physical wiper sliding over resistive material, which wears down over time and causes stick drift. Hall-effect sticks instead read the position of a magnet with a contactless sensor, so there is nothing to physically wear out from normal use.',
      'A newer variant, TMR (tunneling magnetoresistance), improves on Hall-effect further with better precision and even less power draw. Both are now common upgrades on 2026 handhelds that previously used cheaper potentiometer sticks.',
    ],
    buying:
      'If you plan to keep a handheld for years, Hall-effect (or TMR) sticks are worth prioritizing since they largely eliminate the drift that eventually plagues potentiometer sticks. Many manufacturers now advertise this spec directly, so check it before buying a device you intend to keep long-term.',
    related: ['gyro-aiming', 'trackpads'],
    relatedCategorySlug: 'hall-effect-sticks',
  },
  {
    slug: 'steamos',
    term: 'SteamOS',
    aliases: ['steamos', 'steam os', 'valve steamos'],
    short: "Valve's Linux-based, console-like handheld OS built around Steam and Proton, optimized for battery and simplicity.",
    body: [
      'SteamOS is a Linux distribution built by Valve specifically for the Steam Deck and, more recently, licensed to third-party handhelds like the Lenovo Legion Go S. It boots straight into a controller-friendly, console-style interface rather than a Windows desktop, and runs Windows games through the Proton compatibility layer.',
      'Because it strips away background Windows services, telemetry and update churn, SteamOS handhelds typically get noticeably better battery life and more consistent frame pacing than the same hardware running Windows. The trade-off is that non-Steam storefronts and some anti-cheat-protected multiplayer games either need workarounds or do not work at all.',
    ],
    buying:
      "Choose SteamOS if most of your library is on Steam and you value battery life, quick suspend/resume and a clean console-like UI over broad storefront support. It is the default choice for buyers who mainly play single-player or non-anti-cheat multiplayer games.",
    related: ['proton', 'windows-handheld', 'fsr'],
    relatedCategorySlug: 'steamos',
  },
  {
    slug: 'windows-handheld',
    term: 'SteamOS vs Windows',
    aliases: ['windows handheld', 'windows vs steamos', 'steamos vs windows', 'windows 11 handheld'],
    short:
      'The core handheld OS decision: SteamOS trades some game and launcher compatibility for battery life and a cleaner UI; Windows trades those back for universal compatibility.',
    body: [
      'Windows handhelds run full Windows 11, so every storefront (Epic, Battle.net, Xbox/Game Pass, EA) and every anti-cheat system works exactly as it would on a desktop PC. The cost is a desktop OS never designed for a small touchscreen and a gamepad, plus background processes that eat into battery life and can cause stutter unless a vendor overlay (like Asus Armoury Crate SE or the Windows-native Xbox full-screen experience) smooths it over.',
      'SteamOS flips that trade: it boots into a purpose-built, controller-first interface with better power management and faster suspend/resume, but its Linux foundation via Proton cannot run every Windows game, and several major anti-cheat-protected online games remain blocked or unreliable.',
    ],
    buying:
      'If your library leans heavily on Game Pass, Epic exclusives, or anti-cheat multiplayer titles, a Windows handheld is the safer buy. If you mostly play Steam games and single-player titles, SteamOS (or a Windows handheld you flash to SteamOS, where supported) usually delivers better battery life and a smoother day-to-day experience.',
    related: ['steamos', 'proton', 'fsr'],
    relatedCategorySlug: 'windows',
  },
  {
    slug: 'oculink',
    term: 'OCuLink',
    aliases: ['oculink', 'oculink port', 'oculink egpu'],
    short:
      'A high-bandwidth external PCIe port some handhelds include for connecting a full desktop GPU (an eGPU) at your desk.',
    body: [
      'OCuLink is a cable standard that carries PCI Express lanes outside the chassis, giving a handheld a direct, low-latency path to external hardware. On handhelds it is used almost exclusively to connect an external GPU (eGPU) enclosure, letting the same device that plays games on the go drive a full desktop graphics card when docked.',
      'Compared to USB4-based eGPU connections, OCuLink typically delivers noticeably higher and more consistent bandwidth to the external GPU, translating to less performance lost versus that GPU running in a desktop.',
    ],
    buying:
      'If you want one device that can be both a portable handheld and, at your desk, a GPU-boosted mini-PC, an OCuLink port is the feature to look for; it outperforms USB4 for eGPU use. It is not universal, so confirm the exact port and enclosure compatibility before buying into the ecosystem.',
    related: ['usb4', 'apu'],
    relatedCategorySlug: 'egpu',
  },
  {
    slug: 'usb4',
    term: 'USB4',
    aliases: ['usb4', 'usb 4', 'usb4 port', 'usb-c 40gbps'],
    short:
      'A fast USB-C standard (up to 40 Gbps) that also carries DisplayPort and, on many handhelds, eGPU traffic and charging.',
    body: [
      'USB4 is a USB-C-based standard that unifies USB and Thunderbolt-style architecture, supporting up to 40 Gbps of bandwidth, DisplayPort Alt Mode for external monitors, and USB Power Delivery for charging, all over one port. Many 2026 handhelds use a single USB4 port for charging, video out, external storage and, in supported devices, an eGPU enclosure.',
      'As an eGPU connection, USB4 works but generally carries lower effective, more variable bandwidth to the external card than a dedicated OCuLink port, so external GPU performance scales a bit less efficiently.',
    ],
    buying:
      'A USB4 port is genuinely versatile: it is your charger, your external monitor output and, in a pinch, your eGPU connection. If eGPU performance is a priority, treat OCuLink as the upgrade path and USB4 as the flexible, good-enough default.',
    related: ['oculink', 'apu'],
    relatedCategorySlug: 'egpu',
  },
  {
    slug: 'apu',
    term: 'APU',
    aliases: ['apu', 'accelerated processing unit', 'soc'],
    short:
      "The single chip combining CPU cores and a GPU that powers virtually every handheld gaming PC, most commonly AMD's Ryzen Z-series or Strix Point/Halo.",
    body: [
      'An APU (Accelerated Processing Unit) combines CPU cores and a GPU on one piece of silicon, sharing the same power budget and memory. Because a handheld has no room for a separate discrete graphics card, its entire gaming performance depends on how strong the APU integrated graphics are within a tight thermal and battery envelope.',
      'Almost every mainstream 2026 handheld uses an AMD APU, most commonly from the Ryzen Z-series (Z1, Z1 Extreme, Z2, Z2 Extreme) or the higher-end Strix Point/Strix Halo family, both built on RDNA graphics architecture. A handful of devices use Intel mobile chips instead, generally trailing AMD in efficiency for this form factor.',
    ],
    buying:
      "The APU model is the single biggest driver of a handheld's gaming performance, so compare APU generation and iGPU compute units before anything else. A newer or higher-tier APU at the same TDP will consistently outperform an older one, even if the rest of the spec sheet looks similar.",
    related: ['z1-extreme', 'rdna', 'tdp'],
  },
  {
    slug: 'vrr',
    term: 'VRR',
    aliases: ['vrr', 'variable refresh rate', 'freesync', 'adaptive sync'],
    short:
      "A display feature that syncs the screen's refresh rate to the game's frame rate, eliminating tearing and reducing stutter.",
    body: [
      'VRR (Variable Refresh Rate) lets the display change its refresh rate on the fly to match whatever frame rate the APU is actually producing, instead of forcing the GPU to hit a fixed refresh target. This removes screen tearing without the added input lag of traditional V-Sync, and on handhelds it is usually implemented as AMD FreeSync.',
      'VRR is especially valuable on handhelds because frame rates fluctuate a lot as you adjust TDP, resolution and upscaling settings on the fly; without it, those fluctuations show up as visible tearing or stutter.',
    ],
    buying:
      'VRR is increasingly standard on higher-end 2026 handheld screens but is still missing on some budget models, so check the spec sheet rather than assuming it. Pairing VRR with FSR upscaling is one of the most effective ways to keep a handheld feeling smooth as performance varies scene to scene.',
    related: ['oled', 'fsr'],
  },
  {
    slug: 'gyro-aiming',
    term: 'Gyro Aiming',
    aliases: ['gyro aiming', 'gyroscope aiming', 'motion aiming', 'gyro controls'],
    short:
      "Using a handheld's built-in motion sensor to fine-tune aim with small wrist movements, layered on top of stick input.",
    body: [
      'Gyro aiming uses the accelerometer and gyroscope built into a handheld to track small rotations of the device itself, translating them into fine cursor or camera movement. Rather than replacing the analog stick, it is typically used alongside it: the stick handles broad turns while gyro adds mouse-like precision for the final aim adjustment, a technique popularized by consoles and widely supported on PC via Steam Input.',
      'Because it relies on physically tilting the whole device, gyro works best on lighter handhelds and can feel awkward on very large or heavy ones where holding a steady precise angle is more tiring.',
    ],
    buying:
      'If you play shooters and want console-style precision aiming without a mouse, confirm the handheld has a gyroscope (most do) and check community Steam Input configs for your favorite titles. It is a free feature once present in hardware, so it rarely factors into a buying decision on its own but is a nice bonus for FPS players.',
    related: ['hall-effect-sticks', 'trackpads'],
  },
  {
    slug: 'trackpads',
    term: 'Trackpads',
    aliases: ['trackpads', 'touchpads', 'touch pads'],
    short:
      'Built-in touch surfaces (like on the Steam Deck) that emulate a mouse, useful for strategy games, older PC titles and desktop navigation.',
    body: [
      'Some handhelds, most notably the Steam Deck and Zotac Zone, include one or two small trackpads alongside the analog sticks and face buttons. These emulate mouse movement and clicks, letting you play games designed around a mouse cursor, precisely control camera aim in some shooters, and navigate the Windows or SteamOS desktop without attaching an external mouse.',
      'Trackpads add real value for strategy games, isometric RPGs, point-and-click titles and older PC games that never got proper controller support, all of which are otherwise painful to play with sticks alone.',
    ],
    buying:
      "If your library includes strategy, simulation or older PC games without native controller support, trackpads are a meaningful differentiator, not a gimmick. Handhelds without them can still use gyro-aiming or an external mouse, but neither fully replaces a built-in trackpad for desktop and mouse-driven games.",
    related: ['gyro-aiming', 'hall-effect-sticks'],
    relatedCategorySlug: 'with-trackpads',
  },
  {
    slug: 'oled',
    term: 'OLED (Handhelds)',
    aliases: ['oled', 'oled screen', 'oled panel', 'amoled handheld'],
    short:
      "A self-lit screen technology with perfect blacks and vivid color that also draws less power than LCD at typical handheld brightness levels.",
    body: [
      'OLED panels light each pixel individually, so black pixels turn fully off, producing near-infinite contrast, rich color and fast pixel response, the same benefits that make OLED popular in TVs and laptops. On a handheld, that translates to noticeably better-looking games, especially in dark scenes, compared to the LCD panels used in earlier and budget devices.',
      "OLED's other handheld-specific advantage is power: because black and dark pixels draw very little energy, OLED screens showing typical game content can actually sip less power than an LCD backlight at the same brightness, which helps offset their higher base cost against battery life.",
    ],
    buying:
      'An OLED screen is one of the most noticeable upgrades a handheld can have, and unlike on laptops it can also modestly help battery life rather than hurt it. Weigh it against price: OLED-equipped models (Steam Deck OLED, ROG Ally X, Legion Go S OLED variants) usually cost more than their LCD equivalents.',
    related: ['vrr', 'fsr'],
    relatedCategorySlug: 'oled',
  },
  {
    slug: 'fsr',
    term: 'FSR (FidelityFX Super Resolution)',
    aliases: ['fsr', 'fidelityfx super resolution', 'amd fsr', 'fsr upscaling', 'fsr 3', 'fsr 4'],
    short:
      "AMD's upscaling technology that renders games at a lower internal resolution and reconstructs a sharper image, boosting frame rate on handheld APUs.",
    body: [
      "FidelityFX Super Resolution (FSR) is AMD's answer to NVIDIA's DLSS: it renders a game at a lower internal resolution, then uses an algorithm to reconstruct a higher-resolution image, trading a small amount of visual fidelity for a meaningful frame-rate boost. Because handheld APUs have far less raw graphics power than a desktop GPU, FSR is often the difference between a game running smoothly and struggling to hold a playable frame rate.",
      'Newer FSR versions (FSR 3 and the machine-learning-based FSR 4) add frame generation and improved image reconstruction, though the most advanced modes are typically limited to the newest, most capable APUs. FSR is GPU-agnostic and works on non-AMD hardware too, unlike DLSS which is NVIDIA-exclusive, which matters little on handhelds since almost all of them use AMD graphics anyway.',
    ],
    buying:
      'FSR support is effectively universal across 2026 AMD-powered handhelds, so the real question is how well each game implements it, not whether the device supports it. Combining FSR with a lower TDP mode and VRR is one of the most effective ways to stretch battery life without sacrificing playability.',
    related: ['rdna', 'vrr', 'tdp'],
  },
  {
    slug: 'rdna',
    term: 'RDNA (3 / 3.5)',
    aliases: ['rdna', 'rdna 3', 'rdna 3.5', 'rdna architecture', 'amd rdna'],
    short:
      "AMD's graphics architecture powering the integrated GPU in nearly every modern handheld APU; RDNA 3.5 improves efficiency over RDNA 3 for battery-constrained devices.",
    body: [
      "RDNA is AMD's GPU architecture family, and the integrated graphics in handheld APUs are built on it. RDNA 3 powers the graphics in chips like the Ryzen Z1 Extreme, delivering a substantial jump over the previous RDNA 2-based Steam Deck APU. RDNA 3.5, used in newer Strix Point and Ryzen AI 300-series-derived handheld chips, focuses more on power efficiency than raw compute gains, which matters more for battery-powered devices than desktop-style performance jumps.",
      'The number of compute units (CUs) in the integrated GPU, combined with the memory bandwidth feeding it, largely determines how much raw graphics horsepower an APU has at a given TDP.',
    ],
    buying:
      'When comparing handhelds, check both the RDNA generation and the compute unit count of the integrated GPU rather than relying on the APU marketing name alone. A newer RDNA revision at a similar TDP generally means better performance-per-watt, which is the metric that actually matters in a battery-powered device.',
    related: ['apu', 'z1-extreme', 'ai-max'],
  },
  {
    slug: 'z1-extreme',
    term: 'Ryzen Z1 / Z2 (Extreme)',
    aliases: ['z1 extreme', 'ryzen z1', 'ryzen z2', 'z2 extreme', 'amd z1', 'amd z2'],
    short:
      "AMD's handheld-specific APU line, built with Valve and Microsoft partners, spanning the budget Z1 up to the flagship Z2 Extreme.",
    body: [
      'The Ryzen Z-series is a line of APUs AMD designed specifically for handheld gaming PCs, first launched with the Z1 and Z1 Extreme found in devices like the ROG Ally. The base Z1 uses fewer, older-architecture CPU and GPU cores for budget devices, while the Z1 Extreme pairs full Zen 4 CPU cores with a larger RDNA 3 iGPU for meaningfully higher gaming performance.',
      'The follow-up Ryzen Z2 and Z2 Extreme chips extend the line with newer CPU cores and improved iGPUs, becoming the default choice in most premium 2026 handhelds. Across the family, the "Extreme" suffix generally signals AMD full-fat configuration, while the plain name usually means a cut-down, lower-cost variant.',
    ],
    buying:
      "Don't assume all Z-series chips perform alike: an Extreme variant can meaningfully outperform its non-Extreme counterpart in the same generation. Check the exact model name (Z1, Z1 Extreme, Z2, Z2 Extreme) rather than just seeing 'Ryzen Z-series' on a spec sheet.",
    related: ['apu', 'rdna', 'ai-max'],
  },
  {
    slug: 'ai-max',
    term: 'Ryzen AI Max (Strix Halo)',
    aliases: ['ai max', 'ryzen ai max', 'strix halo', 'ai max 300', 'ai max+ 395'],
    short:
      "AMD's high-end Strix Halo APUs bring a much larger integrated GPU and huge unified memory bandwidth to premium, desktop-class handhelds.",
    body: [
      'Ryzen AI Max (codenamed Strix Halo) is a tier above the standard Z-series and Strix Point chips, pairing high core-count Zen 5 CPU cores with a substantially larger RDNA 3.5 integrated GPU, up to 40 compute units in the top Ryzen AI Max+ 395. It also supports much wider memory bandwidth via a wide LPDDR5X bus, which is the key ingredient that lets its large iGPU actually be fed enough data to perform.',
      'This class of APU shows up in premium, expensive handhelds and small desktop-class devices aimed at users who want near-laptop or even near-entry-desktop graphics performance in a handheld form factor, at the cost of higher power draw, heat and price than a standard Z-series device.',
    ],
    buying:
      'Ryzen AI Max handhelds cost significantly more than Z-series devices, so they make sense mainly for buyers chasing the highest possible handheld gaming performance or planning to use the device for other GPU-heavy work like local AI. For most buyers, a Z2 Extreme or comparable chip remains the better price-to-performance choice.',
    related: ['rdna', 'z1-extreme', 'apu'],
  },
  {
    slug: 'proton',
    term: 'Proton',
    aliases: ['proton', 'steam play', 'proton compatibility layer', 'protondb'],
    short:
      "Valve's compatibility layer that lets Windows games run on Linux-based SteamOS, translating Windows API calls on the fly.",
    body: [
      'Proton is a compatibility layer, built on Wine and maintained by Valve, that translates Windows game code and graphics API calls (DirectX, in particular) into something Linux and its graphics drivers can run. It is the technology that lets a Steam Deck or other SteamOS handheld play the vast majority of Windows-only Steam games without a native Linux port.',
      'Proton compatibility has improved enormously and now covers most single-player and many multiplayer games well, but titles using kernel-level anti-cheat (a common requirement for competitive online games) frequently do not work, since those anti-cheat systems are not designed to run under Linux. Community site ProtonDB tracks per-game compatibility ratings before you buy.',
    ],
    buying:
      'Before buying a SteamOS handheld, check ProtonDB for the specific games you play, especially competitive multiplayer titles, since anti-cheat compatibility is the main gap. For single-player and most co-op games, Proton compatibility today is strong enough that it rarely affects the buying decision.',
    related: ['steamos', 'windows-handheld'],
    relatedCategorySlug: 'steamos',
  },
];

export function getTerm(slug: string): GlossaryTerm | null {
  return GLOSSARY.find((t) => t.slug === slug) ?? null;
}
