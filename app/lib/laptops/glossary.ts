export interface GlossaryTerm {
  slug: string;            // url slug, kebab-case
  term: string;            // display name, e.g. "MUX Switch"
  aliases: string[];       // other spellings for auto-linking, e.g. ["mux", "advanced optimus"]
  short: string;           // one-sentence definition (<= ~140 chars)
  body: string[];          // 1-3 short plain-text paragraphs (NO markdown)
  buying: string;          // one short paragraph: why it matters when buying
  related: string[];       // 2-3 other term slugs in this file
  relatedCategorySlug?: string; // a /gaming-laptops/best/<slug> page, ONLY from the allowed list below
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'mux-switch',
    term: 'MUX Switch',
    aliases: ['mux', 'mux switch', 'multiplexer switch', 'graphics switch'],
    short:
      'A hardware switch that routes the discrete GPU straight to the display, bypassing the iGPU to boost gaming frame rates.',
    body: [
      'A MUX (multiplexer) switch lets a laptop send the discrete NVIDIA GPU output directly to the internal screen instead of routing it through the integrated graphics. Bypassing the iGPU removes a layer of latency and copying that can otherwise cost roughly 5-15% of your frame rate.',
      'On most gaming laptops you toggle the MUX in the vendor app (Armoury Crate, Lenovo Vantage, Omen Gaming Hub) and then reboot. Discrete mode gives the best performance and unlocks G-SYNC on many panels, while hybrid mode falls back to the iGPU to save battery.',
    ],
    buying:
      'Almost every 2026 RTX 50-series gaming laptop has a MUX switch; the better ones use Advanced Optimus so you never have to reboot. If you want maximum frames, confirm the laptop has at least a basic MUX rather than being locked to hybrid mode.',
    related: ['advanced-optimus', 'g-sync', 'gpu-tgp'],
    relatedCategorySlug: 'mux-switch',
  },
  {
    slug: 'advanced-optimus',
    term: 'Advanced Optimus',
    aliases: ['advanced optimus', 'nvidia advanced optimus', 'dynamic mux'],
    short:
      "NVIDIA's automatic, no-reboot MUX that switches between the iGPU and discrete GPU on the fly.",
    body: [
      'Advanced Optimus is the smarter version of a MUX switch. A hardware multiplexer driven by the GPU driver detects when you launch a game and routes the discrete GPU directly to the display, then switches back to the integrated GPU for desktop work, all without a reboot.',
      'Because the switch is automatic, you get the frame-rate and G-SYNC benefits of direct GPU output while still keeping long battery life when you are just browsing or on video calls.',
    ],
    buying:
      'Look for Advanced Optimus if you hate rebooting to change graphics modes. A plain MUX still works but forces a restart each time; Advanced Optimus handles it seamlessly and is common on premium 2026 models.',
    related: ['mux-switch', 'g-sync', 'dynamic-boost'],
    relatedCategorySlug: 'mux-switch',
  },
  {
    slug: 'dlss-4',
    term: 'DLSS 4',
    aliases: ['dlss', 'dlss4', 'dlss 4', 'deep learning super sampling'],
    short:
      "NVIDIA's AI upscaling suite for RTX 50-series laptops, adding Multi Frame Generation and a transformer-based image model.",
    body: [
      'DLSS (Deep Learning Super Sampling) renders a game at a lower internal resolution and uses AI to reconstruct a sharp, higher-resolution image, raising frame rates with little visible quality loss. DLSS 4 is the version that launched alongside the RTX 50 series in 2025.',
      "DLSS 4's headline feature is Multi Frame Generation, which can generate up to three AI frames for every traditionally rendered frame. It also moved Super Resolution, Ray Reconstruction and DLAA to a new transformer-based model that improves stability and detail. The later DLSS 4.5 update pushes frame generation up to a 6X mode on RTX 50 GPUs.",
    ],
    buying:
      'Multi Frame Generation is exclusive to RTX 50-series hardware, so a 2026 RTX 50 laptop is required to use it. The wider DLSS 4 transformer-model upgrades also benefit older RTX cards, but only the newest Blackwell GPUs get the highest multi-frame modes.',
    related: ['multi-frame-generation', 'g-sync', 'rtx-5080-vs-rtx-5090'],
  },
  {
    slug: 'multi-frame-generation',
    term: 'Multi Frame Generation',
    aliases: ['multi frame generation', 'mfg', 'frame generation', 'frame gen'],
    short:
      'A DLSS 4 feature exclusive to RTX 50-series GPUs that inserts up to three AI-generated frames between rendered frames.',
    body: [
      'Frame Generation uses AI to create entirely new frames in between the ones your GPU actually renders. The original DLSS 3 added one generated frame; DLSS 4 Multi Frame Generation can add up to three, multiplying smoothness on high-refresh displays.',
      'Because the extra frames are interpolated rather than rendered, they boost perceived fluidity but add a little latency, which NVIDIA Reflex works to offset. It shines most when your base frame rate is already reasonably high.',
    ],
    buying:
      "Multi Frame Generation only runs on RTX 50-series (Blackwell) laptops. If buttery motion on a 240Hz panel matters to you, it is a major reason to choose a 2026 RTX 50 machine, but treat the marketing 'up to 8X' numbers as best-case rather than typical.",
    related: ['dlss-4', 'rtx-5080-vs-rtx-5090', 'g-sync'],
  },
  {
    slug: 'gpu-tgp',
    term: 'GPU TGP',
    aliases: ['tgp', 'total graphics power', 'gpu wattage', 'graphics power', 'max graphics power'],
    short:
      'The wattage a laptop feeds its GPU; higher TGP usually means more performance from the same GPU model.',
    body: [
      'TGP (Total Graphics Power) is the maximum sustained power, in watts, that a laptop delivers to its discrete GPU. The same RTX 5080, for example, can be configured anywhere from roughly 95W in a thin chassis to 150W or more in a thick gaming model, and the higher-wattage version is meaningfully faster.',
      "NVIDIA stopped printing TGP on the box, so two laptops with the identical GPU name can differ by 20-30% in gaming performance. Reviewers and spec sheets usually list the configured wattage, sometimes shown as 'Max Graphics Power'.",
    ],
    buying:
      'Always check the configured TGP, not just the GPU name. For desktop-class performance look for GPUs near their maximum rated wattage paired with strong cooling; in thin-and-light laptops a lower TGP is the trade-off for portability.',
    related: ['dynamic-boost', 'vapor-chamber', 'mux-switch'],
  },
  {
    slug: 'dynamic-boost',
    term: 'Dynamic Boost',
    aliases: ['dynamic boost', 'nvidia dynamic boost', 'dynamic boost 2.0'],
    short:
      'NVIDIA tech that shifts spare power between the CPU and GPU in real time to add extra GPU wattage when gaming.',
    body: [
      'Dynamic Boost lets the system move power that the CPU is not using over to the GPU, adding up to around 25W on top of the base TGP. A controller rebalances this many times per second based on what the game needs.',
      'The result is higher effective graphics power in GPU-bound games without exceeding the laptop overall thermal and power budget. It works alongside, not instead of, the base TGP figure.',
    ],
    buying:
      "When a spec sheet lists something like '150W + 25W Dynamic Boost', the second number is the headroom. Dynamic Boost only helps if the cooling can handle the extra heat, so it pairs best with vapor-chamber laptops.",
    related: ['gpu-tgp', 'advanced-optimus', 'vapor-chamber'],
  },
  {
    slug: 'oled',
    term: 'OLED',
    aliases: ['oled', 'oled panel', 'oled display', 'amoled'],
    short:
      'A self-lit display tech with perfect blacks and per-pixel contrast, prized for image quality on premium gaming laptops.',
    body: [
      'OLED panels light each pixel individually, so black pixels switch fully off. That delivers effectively infinite contrast, rich saturated color and near-instant pixel response, which means very little motion blur in fast games.',
      'Modern gaming OLEDs reach high refresh rates (240Hz and beyond) with excellent HDR thanks to high peak brightness in small highlights. The trade-offs are a risk of burn-in from static elements over time and lower full-screen brightness than Mini LED.',
    ],
    buying:
      'Choose OLED if you want the best black levels, color and response time for games and media. For laptops used outdoors or showing static taskbars all day, weigh the burn-in risk; many 2026 panels include pixel-shifting and refresh routines to mitigate it.',
    related: ['mini-led', 'oled-vs-mini-led', 'ips'],
    relatedCategorySlug: 'oled',
  },
  {
    slug: 'mini-led',
    term: 'Mini LED',
    aliases: ['mini led', 'mini-led', 'miniled', 'mini led display'],
    short:
      'An LCD backlight made of thousands of tiny LEDs in local-dimming zones for very high brightness and deep blacks.',
    body: [
      'Mini LED is still an LCD, but its backlight is broken into thousands of tiny LEDs grouped into hundreds or thousands of local-dimming zones. Each zone can dim or brighten independently, giving much deeper blacks and stronger contrast than a conventional LCD.',
      "Its big advantage over OLED is brightness: Mini LED can sustain very high full-screen brightness for punchy HDR without any burn-in risk. The downside is 'blooming', a faint halo around bright objects on dark backgrounds where the dimming zones are coarser than OLED per-pixel control.",
    ],
    buying:
      'Pick Mini LED if you want extreme brightness, HDR highlights and zero burn-in worry, especially for long work sessions or bright rooms. More dimming zones mean less blooming, so check the zone count where it is published.',
    related: ['oled', 'oled-vs-mini-led', 'ips'],
    relatedCategorySlug: 'mini-led',
  },
  {
    slug: 'ips',
    term: 'IPS',
    aliases: ['ips', 'ips panel', 'ips display', 'ips lcd'],
    short:
      'A common LCD panel type offering wide viewing angles and accurate color, but weaker contrast than OLED or Mini LED.',
    body: [
      'IPS (In-Plane Switching) is the mainstream LCD technology used in most mid-range gaming laptops. It offers wide viewing angles, consistent color and fast refresh rates at a lower cost than OLED or Mini LED.',
      "Its main weakness is contrast: a standard edge-lit IPS panel cannot fully block its backlight, so blacks look grey and HDR is limited. Fast 'IPS-level' panels can still hit 165-300Hz with low response times, which is why competitive players often favor them.",
    ],
    buying:
      'IPS is the value choice and is great for high-refresh competitive gaming on a budget. If contrast and HDR matter more than price, step up to Mini LED or OLED; if you mostly play fast multiplayer titles, a high-refresh IPS is plenty.',
    related: ['oled', 'mini-led', 'g-sync'],
  },
  {
    slug: 'oled-vs-mini-led',
    term: 'OLED vs Mini LED',
    aliases: ['oled vs mini led', 'oled vs miniled', 'mini led vs oled'],
    short:
      "How to choose between OLED's perfect blacks and per-pixel contrast and Mini LED's higher brightness and no burn-in.",
    body: [
      'Both are premium choices that beat ordinary IPS, but they win in different ways. OLED gives perfect per-pixel blacks, the best contrast, the widest color and the fastest pixel response, making it superb for dark-scene games and movies.',
      'Mini LED counters with much higher sustained brightness and no burn-in risk, which suits bright rooms, HDR highlights and all-day productivity. Its weakness is blooming around bright objects, while OLED weaknesses are lower full-screen brightness and long-term burn-in.',
    ],
    buying:
      'Pick OLED for the best all-round image quality and dark-room gaming or media. Pick Mini LED for the brightest HDR, daylight use and worry-free static content. Either way, prioritize a high refresh rate and good factory color calibration.',
    related: ['oled', 'mini-led', 'ips'],
    relatedCategorySlug: 'oled',
  },
  {
    slug: 'vapor-chamber',
    term: 'Vapor Chamber',
    aliases: ['vapor chamber', 'vapour chamber', 'vapor-chamber cooling'],
    short:
      'A flat sealed cooling chamber that spreads GPU and CPU heat over a wide area for better sustained performance.',
    body: [
      'A vapor chamber is a thin, sealed metal plate containing a fluid that evaporates over hot components and condenses at cooler edges, rapidly spreading heat across a large surface. It moves heat more evenly than traditional copper heat pipes, especially across wide CPU-plus-GPU layouts.',
      'Better heat spreading lets a laptop sustain higher clocks and TGP before throttling, often with quieter fans because the cooling is more efficient. It is a common feature on higher-wattage RTX 50-series gaming laptops.',
    ],
    buying:
      'If you want a high-TGP RTX 5080 or 5090 to hold its performance during long sessions, look for vapor-chamber cooling. It is one of the clearest signs a laptop is built to actually feed and sustain a powerful GPU.',
    related: ['liquid-metal', 'gpu-tgp', 'coil-whine'],
    relatedCategorySlug: 'best-cooling',
  },
  {
    slug: 'liquid-metal',
    term: 'Liquid Metal',
    aliases: ['liquid metal', 'liquid-metal', 'liquid metal thermal compound', 'conductonaut'],
    short:
      'A gallium-based thermal compound that conducts heat far better than paste, lowering CPU and GPU temperatures.',
    body: [
      'Liquid metal is a gallium-based thermal interface applied between the chip and the heatsink instead of conventional paste. It conducts heat several times better, often dropping CPU temperatures by 5-15C and allowing higher sustained clocks or quieter fans.',
      'Because gallium is electrically conductive and can corrode aluminum, factory application requires careful sealing, so it is mostly used on premium machines (notably Asus ROG models) where the maker applies and warranties it.',
    ],
    buying:
      'Factory liquid metal is a plus on high-end gaming laptops, helping a hot CPU like an Arrow Lake-HX chip run cooler. You rarely need to apply it yourself; treat it as a bonus that signals a performance-focused thermal design.',
    related: ['vapor-chamber', 'gpu-tgp', 'dynamic-boost'],
    relatedCategorySlug: 'best-cooling',
  },
  {
    slug: 'coil-whine',
    term: 'Coil Whine',
    aliases: ['coil whine', 'coil noise', 'electrical whine'],
    short:
      "A high-pitched electrical noise from a laptop's power components, most noticeable at very high frame rates.",
    body: [
      'Coil whine is a faint, high-pitched buzzing or squealing caused by electrical components (inductors or coils) vibrating as current passes through them. It is most common when the GPU is pushing very high, uncapped frame rates, such as in menus or simple games.',
      'It is an electrical phenomenon, not a fan or mechanical fault, and is usually harmless. Its severity varies from unit to unit even within the same model, and capping frame rates or enabling V-Sync often reduces or eliminates it.',
    ],
    buying:
      'Coil whine is hard to predict before buying, but you can minimize it: cap frame rates with G-SYNC plus a frame limiter rather than running thousands of FPS uncapped. If a review unit whines badly, it is worth checking the return policy.',
    related: ['vapor-chamber', 'g-sync', 'gpu-tgp'],
  },
  {
    slug: 'g-sync',
    term: 'G-SYNC',
    aliases: ['g-sync', 'gsync', 'g sync', 'nvidia g-sync', 'variable refresh rate'],
    short:
      "NVIDIA's variable refresh rate tech that syncs the display to the GPU to eliminate screen tearing and stutter.",
    body: [
      'G-SYNC synchronizes the laptop display refresh rate to the GPU actual frame rate in real time. By matching the two, it removes the screen tearing you get without sync and the stutter or lag you get with traditional V-Sync.',
      'On laptops, G-SYNC typically works through the panel variable refresh range and is most effective when the discrete GPU drives the display directly, which is why it often depends on a MUX switch or Advanced Optimus being in discrete mode.',
    ],
    buying:
      'Most quality gaming-laptop panels support G-SYNC or the compatible VESA Adaptive-Sync standard. To get it you usually need the laptop in discrete-GPU (MUX) mode, so pair it with a MUX-equipped machine for tear-free, smooth gameplay.',
    related: ['mux-switch', 'dlss-4', 'oled'],
  },
  {
    slug: 'arrow-lake-hx',
    term: 'Arrow Lake-HX',
    aliases: ['arrow lake', 'arrow lake-hx', 'arrow lake hx', 'core ultra 200hx', 'core ultra 9 275hx'],
    short:
      "Intel's Core Ultra 200HX-series, the high-performance mobile CPUs powering many 2025-2026 flagship gaming laptops.",
    body: [
      'Arrow Lake-HX is the codename for Intel Core Ultra 200HX processors, the top-tier mobile chips aimed at gaming and workstation laptops. They combine performance (P) cores and efficient (E) cores, drop Hyper-Threading, and add an NPU for on-device AI tasks.',
      'Top parts like the Core Ultra 9 275HX offer up to 24 cores and high boost clocks, delivering strong multi-threaded and gaming performance when paired with an RTX 50-series GPU. They run hot under sustained load, so they depend on serious cooling.',
    ],
    buying:
      'Arrow Lake-HX is the chip to expect inside 2026 flagship 16- and 18-inch gaming laptops. For pure gaming the CPU rarely bottlenecks a good GPU, so prioritize cooling and GPU TGP; the HX chip mainly pays off in heavy creation and streaming workloads.',
    related: ['panther-lake', 'gpu-tgp', 'dynamic-boost'],
  },
  {
    slug: 'panther-lake',
    term: 'Panther Lake',
    aliases: ['panther lake', 'core ultra 300', 'core ultra series 3', 'intel 18a'],
    short:
      "Intel's Core Ultra 300 mobile CPUs built on the 18A process, launched at CES 2026 with big efficiency and battery gains.",
    body: [
      'Panther Lake is Intel Core Ultra 300 (Core Ultra Series 3) generation, launched at CES 2026 and built on Intel own 18A process node. It pairs new Cougar Cove P-cores and Darkmont E-cores with Xe3 (Celestial) integrated graphics and a much stronger NPU for AI.',
      'Intel positions Panther Lake around large efficiency and battery-life improvements alongside better integrated graphics and AI performance. Early chips target thin-and-light and mainstream laptops, with higher-wattage versions rolling out through 2026.',
    ],
    buying:
      'Panther Lake matters most for thin, long-battery laptops rather than 175W gaming flagships, which still lean on Arrow Lake-HX. If all-day battery, a strong NPU and capable integrated graphics appeal to you, a 2026 Core Ultra 300 machine is worth considering.',
    related: ['arrow-lake-hx', 'wifi-7', 'thunderbolt-5'],
  },
  {
    slug: 'wifi-7',
    term: 'Wi-Fi 7',
    aliases: ['wi-fi 7', 'wifi 7', 'wifi7', '802.11be'],
    short:
      'The latest Wi-Fi standard (802.11be), adding wider channels and Multi-Link Operation for faster, lower-latency wireless.',
    body: [
      'Wi-Fi 7 (802.11be) is the newest wireless networking standard. It widens channels to 320MHz, adds 4096-QAM for denser data, and introduces Multi-Link Operation (MLO), which lets a device use multiple bands at once for higher throughput and lower, more stable latency.',
      'For gaming, the headline benefit is reduced and more consistent latency rather than raw speed, provided you also have a Wi-Fi 7 router. It is backward compatible, so a Wi-Fi 7 laptop still works on older networks.',
    ],
    buying:
      'Wi-Fi 7 is standard on most 2026 gaming laptops and is a small but nice future-proofing feature. You only see the full benefit with a Wi-Fi 7 router; for competitive play, wired Ethernet still gives the most consistent latency.',
    related: ['thunderbolt-5', 'panther-lake', 'arrow-lake-hx'],
  },
  {
    slug: 'thunderbolt-5',
    term: 'Thunderbolt 5',
    aliases: ['thunderbolt 5', 'thunderbolt5', 'tb5', 'thunderbolt'],
    short:
      "Intel's latest port standard: 80 Gbps two-way (up to 120 Gbps for displays) plus up to 240W charging over USB-C.",
    body: [
      'Thunderbolt 5 is the newest version of Intel high-speed USB-C connection. It doubles Thunderbolt 4 to 80 Gbps of bidirectional bandwidth, and its Bandwidth Boost mode can dedicate up to 120 Gbps to displays for multiple 4K/8K or high-refresh monitors.',
      'It also raises USB Power Delivery to as much as 240W, enough to charge some gaming laptops over a single cable, and supports fast external SSDs and external GPUs.',
    ],
    buying:
      'Thunderbolt 5 is a strong future-proofing feature if you plan to drive multiple high-refresh monitors, use an eGPU, or attach very fast external storage. Confirm the port is genuine Thunderbolt 5 (not just USB4) and check whether the laptop supports charging over it.',
    related: ['wifi-7', 'soldered-vs-so-dimm-ram', 'panther-lake'],
    relatedCategorySlug: 'thunderbolt',
  },
  {
    slug: 'soldered-vs-so-dimm-ram',
    term: 'Soldered vs SO-DIMM RAM',
    aliases: ['soldered ram', 'so-dimm', 'sodimm', 'so-dimm ram', 'soldered memory', 'lpcamm2'],
    short:
      "Whether a laptop's memory is fixed to the board (soldered) or installed in upgradeable SO-DIMM slots.",
    body: [
      'Soldered RAM is fixed permanently to the motherboard. It enables thinner designs and faster low-power memory (LPDDR5X), but you can never add or replace it, so you must buy enough at purchase. SO-DIMM RAM sits in removable slots, letting you upgrade or repair the memory yourself later.',
      'Many thin-and-light and efficiency-focused laptops solder their RAM, while traditional gaming laptops favor two SO-DIMM slots. A newer middle ground, LPCAMM2, offers low-power memory in a removable module, but it is not yet common.',
    ],
    buying:
      'If upgradeability and repair matter to you, look for SO-DIMM (or LPCAMM2) slots, ideally two of them for dual-channel performance. If a laptop has soldered RAM, configure at least 32GB up front, because you will be stuck with whatever you buy.',
    related: ['thunderbolt-5', 'arrow-lake-hx', 'panther-lake'],
    relatedCategorySlug: 'ram-upgradeable',
  },
  {
    slug: 'rtx-5080-vs-rtx-5090',
    term: 'RTX 5080 vs RTX 5090',
    aliases: ['rtx 5080 vs 5090', 'rtx 5090 vs 5080', '5080 vs 5090', 'rtx 5080 vs rtx 5090'],
    short:
      'The laptop RTX 5090 adds 24GB VRAM and ~37% more cores than the 5080, but shared power limits narrow the real gaming gap.',
    body: [
      'In laptops, the RTX 5090 has 10,496 CUDA cores and 24GB of GDDR7, while the RTX 5080 has 7,680 cores and 16GB of GDDR7. On paper that is around 37% more cores and 50% more memory for the 5090.',
      "Both GPUs share a similar power ceiling (up to about 150W plus Dynamic Boost), so the laptop 5090 cannot fully stretch its lead the way a desktop card can. In real games the gap is often a more modest 10-20%, with the 5090's extra VRAM mattering most for 4K, heavy ray tracing, creation work and local AI.",
    ],
    buying:
      'For most gamers the RTX 5080 is the smarter value, since 16GB is plenty for current titles and the performance gap is small for the price. Choose the RTX 5090 if you need its 24GB for 4K, demanding ray tracing, content creation or AI workloads, and pair it with strong cooling to feed it.',
    related: ['dlss-4', 'multi-frame-generation', 'gpu-tgp'],
    relatedCategorySlug: 'rtx-5090',
  },
];

export function getTerm(slug: string): GlossaryTerm | null {
  return GLOSSARY.find((t) => t.slug === slug) ?? null;
}
