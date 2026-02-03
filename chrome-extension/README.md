# Final Boss - Quick Game Lookup

A Chrome extension that lets you instantly look up any game from IGDB. Right-click any game name for ratings, platforms, and reviews from FinalBoss.io.

## Features

- **Right-Click Search**: Select any game name on a webpage, right-click, and choose "Search on FinalBoss.io"
- **Instant Previews**: See cover art, ratings, release dates, platforms, and genres without leaving your tab
- **Direct Links**: One click to view the full game page on FinalBoss.io
- **Keyboard Shortcut**: Press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac) to open the popup

## Installation (Development)

### Prerequisites
- The Next.js app must be running (for API endpoints)
- Chrome or Chromium-based browser

### Steps

1. **Generate Icons** (first time only):
   ```bash
   cd chrome-extension
   npm install sharp  # Optional, for icon generation
   node generate-icons.js
   ```

   Or manually convert `icons/icon.svg` to PNG at sizes 16x16, 48x48, and 128x128 using:
   - [CloudConvert](https://cloudconvert.com/svg-to-png)
   - [SVG to PNG](https://svgtopng.com/)

2. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `chrome-extension` folder

3. **Test It**:
   - Go to any webpage with game names (Reddit, IGN, etc.)
   - Select a game name like "Elden Ring"
   - Right-click and choose "Search 'Elden Ring' on FinalBoss.io"
   - The popup will show game details with a link to finalboss.io

## Development

### File Structure
```
chrome-extension/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker for context menu & API calls
├── popup.html         # Popup UI structure
├── popup.js           # Popup logic and rendering
├── popup.css          # Popup styles (dark theme)
├── icons/
│   ├── icon.svg       # Source icon
│   ├── icon16.png     # Toolbar icon
│   ├── icon48.png     # Extension management icon
│   └── icon128.png    # Chrome Web Store icon
└── generate-icons.js  # Icon generation script
```

### API Endpoints (Next.js)
The extension uses these endpoints from the main app:

- `GET /api/extension/search?q={query}&limit={limit}` - Search games
- `GET /api/extension/game/{id}` - Get game details

### Local Development
For local testing, update `background.js`:
```javascript
const API_BASE = 'http://localhost:3000/api/extension';
```

## Publishing to Chrome Web Store

1. **Create Icons**: Ensure all PNG icons are proper quality
2. **Update Version**: Increment version in `manifest.json`
3. **Create ZIP**:
   ```bash
   cd chrome-extension
   zip -r finalboss-extension.zip . -x "*.DS_Store" -x "generate-icons.js" -x "node_modules/*"
   ```
4. **Upload**: Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
5. **Add Listing**:
   - Short description (132 chars max): "Instantly look up any game from IGDB. Right-click any game name for ratings, platforms, and reviews."
   - Detailed description
   - Screenshots (1280x800 or 640x400)
   - Promotional images

## Chrome Web Store Listing Copy

### Short Description
Instantly look up any game from IGDB. Right-click any game name for ratings, platforms, and reviews.

### Detailed Description
**Final Boss Quick Game Lookup** brings game information to your fingertips.

🎮 **How It Works**
1. Select any game name on a webpage (Reddit, YouTube, news sites, forums)
2. Right-click and choose "Search on FinalBoss.io"
3. Instantly see ratings, platforms, genres, and release info
4. Click through to read full reviews and guides

⭐ **Features**
• IGDB-powered database with 200,000+ games
• Ratings, platforms, genres, and release dates at a glance
• Beautiful dark theme designed for gamers
• Keyboard shortcut: Ctrl+Shift+G (Cmd+Shift+G on Mac)
• No account required

🔒 **Privacy**
• No personal data collected
• No tracking or analytics
• Only fetches game info when you search

Powered by FinalBoss.io - Your Ultimate Gaming Hub

## License

MIT License - See main project LICENSE file.
