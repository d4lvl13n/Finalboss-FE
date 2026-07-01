// Product images — SELF-HOSTED under /public/handhelds to avoid third-party
// hotlink/referrer failures. Each was downloaded from the site named in `source`.
export interface HandheldImage { url: string; alt: string; source: string; }
export const HANDHELD_IMAGES: Record<string, HandheldImage> = {
  'valve-steam-deck-lcd': { url: '/handhelds/valve-steam-deck-lcd.jpg', alt: "Valve Steam Deck (LCD) handheld gaming PC", source: 'steamdeck.com' },
  'valve-steam-deck-oled': { url: '/handhelds/valve-steam-deck-oled.png', alt: "Valve Steam Deck OLED handheld gaming PC", source: 'steamdeck.com' },
  'asus-rog-ally-2023': { url: '/handhelds/asus-rog-ally-2023.png', alt: "ASUS ROG Ally (2023) handheld gaming PC", source: 'asus.com' },
  'asus-rog-ally-x': { url: '/handhelds/asus-rog-ally-x.png', alt: "ASUS ROG Ally X handheld gaming PC", source: 'asus.com' },
  'asus-rog-xbox-ally': { url: '/handhelds/asus-rog-xbox-ally.webp', alt: "ASUS ROG Xbox Ally handheld gaming PC", source: 'asus.com' },
  'asus-rog-xbox-ally-x': { url: '/handhelds/asus-rog-xbox-ally-x.webp', alt: "ASUS ROG Xbox Ally X handheld gaming PC", source: 'asus.com' },
  'lenovo-legion-go': { url: '/handhelds/lenovo-legion-go.jpg', alt: "Lenovo Legion Go (Gen 1) handheld gaming PC", source: 'wikimedia.org' },
  'lenovo-legion-go-s-windows': { url: '/handhelds/lenovo-legion-go-s-windows.webp', alt: "Lenovo Legion Go S (Windows) handheld gaming PC", source: 'b2c-contenthub.com' },
  'lenovo-legion-go-s-steamos': { url: '/handhelds/lenovo-legion-go-s-steamos.webp', alt: "Lenovo Legion Go S (SteamOS) handheld gaming PC", source: 'b2c-contenthub.com' },
  'lenovo-legion-go-2': { url: '/handhelds/lenovo-legion-go-2.webp', alt: "Lenovo Legion Go 2 handheld gaming PC", source: 'b2c-contenthub.com' },
  'msi-claw-a1m': { url: '/handhelds/msi-claw-a1m.png', alt: "MSI Claw A1M handheld gaming PC", source: 'wikimedia.org' },
  'msi-claw-8-ai-plus': { url: '/handhelds/msi-claw-8-ai-plus.jpg', alt: "MSI Claw 8 AI+ handheld gaming PC", source: 'club386.com' },
  'msi-claw-a8': { url: '/handhelds/msi-claw-a8.jpg', alt: "MSI Claw A8 handheld gaming PC", source: 'club386.com' },
  'acer-nitro-blaze-7': { url: '/handhelds/acer-nitro-blaze-7.webp', alt: "Acer Nitro Blaze 7 handheld gaming PC", source: 'acer.com' },
  'acer-nitro-blaze-8': { url: '/handhelds/acer-nitro-blaze-8.webp', alt: "Acer Nitro Blaze 8 handheld gaming PC", source: 'acer.com' },
  'acer-nitro-blaze-11': { url: '/handhelds/acer-nitro-blaze-11.webp', alt: "Acer Nitro Blaze 11 handheld gaming PC", source: 'acer.com' },
  'zotac-zone': { url: '/handhelds/zotac-zone.jpg', alt: "Zotac Zone handheld gaming PC", source: 'tomshardware.com' },
};
