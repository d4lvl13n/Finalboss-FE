// Final Boss Game Lookup - Popup Script

// State
let currentResults = [];
let currentQuery = '';
let currentGame = null;
const MAX_HISTORY = 5;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const retryBtn = document.getElementById('retryBtn');
const backBtn = document.getElementById('backBtn');

// States
const initialState = document.getElementById('initialState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const resultsState = document.getElementById('resultsState');
const detailsState = document.getElementById('detailsState');
const noResultsState = document.getElementById('noResultsState');

const resultsList = document.getElementById('resultsList');
const gameDetails = document.getElementById('gameDetails');
const errorMessage = document.getElementById('errorMessage');
const noResultsQuery = document.getElementById('noResultsQuery');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Display version
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = `v${manifest.version}`;

  // Load and display search history
  loadSearchHistory();

  // Check for pending search from context menu
  chrome.runtime.sendMessage({ type: 'GET_PENDING_SEARCH' }, (response) => {
    if (response && response.query) {
      searchInput.value = response.query;
      performSearch(response.query);
    }
  });

  // Event listeners
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) performSearch(query);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) performSearch(query);
    }
  });

  retryBtn.addEventListener('click', () => {
    if (currentQuery) performSearch(currentQuery);
  });

  backBtn.addEventListener('click', showResults);

  // Focus search input
  searchInput.focus();
});

// Search History
async function loadSearchHistory() {
  const { searchHistory = [] } = await chrome.storage.local.get('searchHistory');
  const historyContainer = document.getElementById('searchHistory');

  if (searchHistory.length === 0) {
    historyContainer.classList.add('hidden');
    return;
  }

  historyContainer.classList.remove('hidden');
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = searchHistory.map(item => `
    <button class="history-item" data-query="${escapeHtml(item)}">
      ${escapeHtml(item)}
    </button>
  `).join('');

  historyList.querySelectorAll('.history-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      searchInput.value = query;
      performSearch(query);
    });
  });
}

async function saveToHistory(query) {
  const { searchHistory = [] } = await chrome.storage.local.get('searchHistory');

  // Remove if already exists, add to front
  const filtered = searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
  filtered.unshift(query);

  // Keep only last MAX_HISTORY items
  const updated = filtered.slice(0, MAX_HISTORY);

  await chrome.storage.local.set({ searchHistory: updated });
}

// State Management
function showState(stateElement) {
  [initialState, loadingState, errorState, resultsState, detailsState, noResultsState]
    .forEach(el => el.classList.add('hidden'));
  stateElement.classList.remove('hidden');
}

// Search
async function performSearch(query) {
  currentQuery = query;
  showState(loadingState);

  // Save to history
  saveToHistory(query);

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'SEARCH_GAMES',
      query: query
    });

    if (!response.success) {
      throw new Error(response.error || 'Search failed');
    }

    currentResults = response.data;

    if (currentResults.length === 0) {
      noResultsQuery.textContent = query;
      showState(noResultsState);
      return;
    }

    // If only one result, show details directly
    if (currentResults.length === 1) {
      await showGameDetails(currentResults[0].id);
      return;
    }

    renderResults();
    showState(resultsState);

  } catch (error) {
    console.error('Search error:', error);
    errorMessage.textContent = error.message || 'Something went wrong';
    showState(errorState);
  }
}

// Render Results
function renderResults() {
  resultsList.innerHTML = currentResults.map(game => `
    <div class="result-item" data-id="${game.id}">
      ${game.cover_url
        ? `<img class="result-cover" src="${game.cover_url}" alt="${escapeHtml(game.name)}">`
        : `<div class="result-cover no-cover">No Image</div>`
      }
      <div class="result-info">
        <div class="result-name">${escapeHtml(game.name)}</div>
        <div class="result-meta">
          ${game.rating ? `
            <span class="result-rating ${getRatingClass(game.rating)}">
              ★ ${game.rating}
            </span>
          ` : ''}
          ${game.release_date ? `
            <span>${formatDate(game.release_date)}</span>
          ` : ''}
        </div>
        ${game.platforms && game.platforms.length > 0 ? `
          <div class="result-platforms">${game.platforms.join(' · ')}</div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Add click handlers
  resultsList.querySelectorAll('.result-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id, 10);
      showGameDetails(id);
    });
  });
}

// Show Results
function showResults() {
  if (currentResults.length > 0) {
    renderResults();
    showState(resultsState);
  } else {
    showState(initialState);
  }
}

// Game Details
async function showGameDetails(id) {
  showState(loadingState);

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_GAME_DETAILS',
      id: id
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to load game details');
    }

    currentGame = response.data;
    renderGameDetails(response.data);
    showState(detailsState);

  } catch (error) {
    console.error('Details error:', error);
    errorMessage.textContent = error.message || 'Failed to load game details';
    showState(errorState);
  }
}

// Render Game Details
function renderGameDetails(game) {
  const platforms = game.platforms || [];
  const genres = game.genres || [];
  const companies = game.companies || [];
  const screenshots = game.screenshots || [];

  gameDetails.innerHTML = `
    <div class="game-header">
      ${game.cover_url
        ? `<img class="game-cover" src="${game.cover_url}" alt="${escapeHtml(game.name)}">`
        : `<div class="game-cover" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;">No Image</div>`
      }
      <div class="game-header-info">
        <h2 class="game-title">${escapeHtml(game.name)}</h2>
        ${game.rating ? `
          <div class="game-rating ${getRatingClass(game.rating)}">
            ★ ${game.rating}/100
          </div>
        ` : ''}
        ${game.release_date ? `
          <div class="game-release">Released: ${formatDate(game.release_date)}</div>
        ` : ''}
      </div>
    </div>

    ${platforms.length > 0 ? `
      <div class="game-tags">
        ${platforms.slice(0, 5).map(p => `<span class="tag platform">${escapeHtml(p)}</span>`).join('')}
      </div>
    ` : ''}

    ${genres.length > 0 ? `
      <div class="game-tags">
        ${genres.slice(0, 4).map(g => `<span class="tag">${escapeHtml(g)}</span>`).join('')}
      </div>
    ` : ''}

    ${game.description ? `
      <p class="game-description">${escapeHtml(game.description)}</p>
    ` : ''}

    ${screenshots.length > 0 ? `
      <div class="screenshots">
        ${screenshots.slice(0, 3).map(url => `
          <img class="screenshot" src="${url}" alt="Screenshot" loading="lazy" data-url="${url}">
        `).join('')}
      </div>
    ` : ''}

    ${companies.length > 0 ? `
      <p class="game-companies">By ${companies.slice(0, 2).map(c => escapeHtml(c)).join(', ')}</p>
    ` : ''}

    <div class="game-actions">
      <a href="${game.finalboss_url}" target="_blank" class="btn btn-primary">
        View on FinalBoss.io
      </a>
      <button class="btn btn-secondary share-btn" title="Share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    </div>

    <div class="share-menu hidden" id="shareMenu">
      <button class="share-option" data-platform="twitter">
        <span>𝕏 Twitter</span>
      </button>
      <button class="share-option" data-platform="reddit">
        <span>Reddit</span>
      </button>
      <button class="share-option" data-platform="copy">
        <span>Copy Link</span>
      </button>
    </div>
  `;

  // Add screenshot click listeners (open in new tab)
  gameDetails.querySelectorAll('.screenshot').forEach(img => {
    img.addEventListener('click', () => {
      window.open(img.dataset.url, '_blank');
    });
  });

  // Add share button listeners
  const shareBtn = gameDetails.querySelector('.share-btn');
  const shareMenu = gameDetails.querySelector('#shareMenu');

  if (shareBtn && shareMenu) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shareMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    gameDetails.addEventListener('click', (e) => {
      if (!e.target.closest('.share-btn') && !e.target.closest('.share-menu')) {
        shareMenu.classList.add('hidden');
      }
    });

    gameDetails.querySelectorAll('.share-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleShare(btn.dataset.platform, game);
      });
    });
  }
}

// Share functionality
function handleShare(platform, game) {
  const text = `Check out ${game.name} on FinalBoss.io`;
  const url = game.finalboss_url;

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'reddit':
      window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        const shareMenu = document.getElementById('shareMenu');
        const copyBtn = shareMenu.querySelector('[data-platform="copy"]');
        copyBtn.innerHTML = '<span>Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<span>Copy Link</span>';
        }, 2000);
      });
      break;
  }
}

// Helpers
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getRatingClass(rating) {
  if (rating >= 75) return 'rating-high';
  if (rating >= 50) return 'rating-mid';
  return 'rating-low';
}

function formatDate(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return isoDate;
  }
}
