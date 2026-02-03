# Chrome Extension: Final Boss Quick Game Lookup

## Overview
A Chrome extension that lets users instantly search for any game name they see on the web and get a rich popup preview pulled from IGDB, without leaving their current tab.

## Architecture

### Components
1. **Manifest V3** - Modern Chrome extension format
2. **Background Service Worker** - Handles context menu creation and API calls
3. **Popup UI** - Displays game information in a styled popup
4. **Content Script** (future) - For hover tooltips

### API Strategy
- New Next.js API routes at `/api/extension/*` to proxy IGDB calls
- Handles CORS for extension requests
- Caches responses for performance

## File Structure
```
/chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for context menu & API
├── popup.html             # Main popup UI
├── popup.js               # Popup logic
├── popup.css              # Popup styling
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # Installation instructions

/app/api/extension/
├── search/route.ts        # Game search endpoint
└── game/[id]/route.ts     # Game details endpoint
```

## Features (MVP)

### Phase 1 - Core Functionality
- [x] Right-click selected text → "Search on FinalBoss.io" context menu
- [x] Popup displays: cover art, name, rating, release date, platforms, genres
- [x] Summary/description preview
- [x] "View on FinalBoss.io" button linking to /game/[slug]
- [x] Loading states and error handling

### Phase 2 - Enhancements (Future)
- [ ] Similar games section
- [ ] Hover tooltip on selected text
- [ ] Search history
- [ ] Keyboard shortcut (Ctrl+Shift+G)

## API Endpoints

### GET /api/extension/search?q={query}
Returns array of matching games with basic info.

### GET /api/extension/game/{id}
Returns full game details for popup display.

## Data Flow
1. User selects text on any webpage
2. Right-click → "Search on FinalBoss.io"
3. Extension calls `/api/extension/search?q={selectedText}`
4. If single result or user clicks a result → fetch full details
5. Display in popup with link to finalboss.io/game/{slug}

## Branding
- Primary color: #8B5CF6 (purple - matches finalboss.io)
- Dark theme to match gaming aesthetic
- FinalBoss.io logo in popup header

## Installation (Development)
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the /chrome-extension folder

## Chrome Web Store Listing
- **Name**: Final Boss - Quick Game Lookup
- **Short Description**: Instantly look up any game from IGDB. Right-click any game name for ratings, platforms, and reviews.
- **Category**: Entertainment
