// Final Boss Game Lookup - Background Service Worker
const API_BASE = 'https://finalboss.io/api/extension';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'finalboss-lookup',
    title: 'Search "%s" on FinalBoss.io',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'finalboss-lookup' && info.selectionText) {
    const query = info.selectionText.trim();

    // Store the search query for the popup
    await chrome.storage.local.set({
      pendingSearch: query,
      searchTimestamp: Date.now()
    });

    // Open the popup programmatically
    chrome.action.openPopup();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SEARCH_GAMES') {
    searchGames(request.query)
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }

  if (request.type === 'GET_GAME_DETAILS') {
    getGameDetails(request.id)
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.type === 'GET_PENDING_SEARCH') {
    chrome.storage.local.get(['pendingSearch', 'searchTimestamp'], (result) => {
      // Only return if search is recent (within 5 seconds)
      if (result.pendingSearch && result.searchTimestamp &&
          Date.now() - result.searchTimestamp < 5000) {
        sendResponse({ query: result.pendingSearch });
        // Clear the pending search
        chrome.storage.local.remove(['pendingSearch', 'searchTimestamp']);
      } else {
        sendResponse({ query: null });
      }
    });
    return true;
  }
});

async function searchGames(query) {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=5`);
  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }
  return response.json();
}

async function getGameDetails(id) {
  const response = await fetch(`${API_BASE}/game/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to get game details: ${response.status}`);
  }
  return response.json();
}
