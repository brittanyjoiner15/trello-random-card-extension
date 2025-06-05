const TRELLO_API_KEY = 'c931bcb711be7cca600a6b2dfcc60f58';

async function authenticateWithTrello() {
    const authUrl = `https://trello.com/1/authorize?expiration=never&name=Random%20Card%20Extension&scope=read&response_type=token&key=${TRELLO_API_KEY}`;
    
    try {
        // Create and show the instructions modal
        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'auth-instructions';
        instructionsDiv.innerHTML = `
            <p>1. Click "Allow" in the Trello popup</p>
            <p>2. Copy the token that appears</p>
            <p>3. Paste it below:</p>
            <input type="text" id="tokenInput" placeholder="Paste your token here" class="token-input" />
            <button id="submitToken" class="submit-token">Submit Token</button>
        `;
        
        document.getElementById('boardSelector').insertAdjacentElement('beforebegin', instructionsDiv);
        
        // Open Trello authorization in a popup
        const popup = window.open(authUrl, 'TrelloAuth', 'width=500,height=600');
        
        // Handle token submission
        document.getElementById('submitToken').addEventListener('click', async () => {
            const token = document.getElementById('tokenInput').value.trim();
            if (!token) {
                alert('Please paste your Trello token');
                return;
            }
            
            try {
                // Save token and update UI
                chrome.storage.local.set({ token }, () => {
                    updateAuthUI(token);
                });

                // Save token and update UI
                chrome.storage.local.set({ token }, () => {
                    updateAuthUI(token);
                });
                
                // Remove instructions
                instructionsDiv.remove();
                
                // Close the popup if it's still open
                if (popup && !popup.closed) {
                    popup.close();
                }
            } catch (error) {
                console.error('Error fetching boards:', error);
                alert('Invalid token. Please try again.');
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        document.getElementById('error').textContent = 'Authentication failed. Please try again.';
        document.getElementById('error').classList.remove('hidden');
    }
}

async function fetchAndPopulateBoards(token) {
    try {
        const boardsResponse = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_API_KEY}&token=${token}`);
        const boards = await boardsResponse.json();
        
        const boardSelect = document.getElementById('boardSelect');
        boardSelect.innerHTML = '<option value="">Select a board...</option>' + 
            boards.map(board => `<option value="${board.id}" data-name="${board.name}">${board.name}</option>`).join('');
        
        // If we have a saved board ID, select it in the dropdown
        chrome.storage.local.get(['boardId'], (result) => {
            if (result.boardId) {
                boardSelect.value = result.boardId;
            }
        });

        // Handle board selection
        boardSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const boardId = e.target.value;
            const boardName = selectedOption.dataset.name;
            
            if (boardId) {
                chrome.storage.local.set({ boardId, boardName });
            }
        });
    } catch (error) {
        console.error('Error fetching boards:', error);
        document.getElementById('boardSelect').innerHTML = '<option value="">Error loading boards</option>';
    }
}

function updateAuthUI(token) {
    const authStatus = document.getElementById('authStatus');
    const authButton = document.getElementById('authButton');
    const boardSelector = document.getElementById('boardSelector');

    if (token) {
        authStatus.classList.remove('hidden');
        authButton.classList.add('hidden');
        boardSelector.classList.remove('hidden');
        fetchAndPopulateBoards(token);
    } else {
        authStatus.classList.add('hidden');
        authButton.classList.remove('hidden');
        boardSelector.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settings');
    const saveSettingsButton = document.getElementById('saveSettings');
    const content = document.getElementById('content');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    const overlay = document.getElementById('overlay');

    // Handle Trello authentication
    document.getElementById('authButton').addEventListener('click', authenticateWithTrello);

    // Close settings panel
    document.getElementById('closeSettings').addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    // Open settings panel
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.remove('hidden');
        overlay.classList.remove('hidden');

        // Update auth UI based on current token
        chrome.storage.local.get(['token'], (result) => {
            updateAuthUI(result.token);
        });
    });

    // Save settings
    saveSettingsButton.addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value;
        const token = document.getElementById('token').value;
        const boardId = document.getElementById('boardId').value;
        const activeTheme = document.querySelector('.theme-option.active')?.dataset.theme || 'purple-blue';

        await chrome.storage.sync.set({ apiKey, token, boardId, theme: activeTheme });
        settingsPanel.classList.add('hidden');
        location.reload();
    });

    // Load settings
    async function loadSettings() {
        const result = await chrome.storage.sync.get(['apiKey', 'token', 'boardId', 'theme']);
        return {
            apiKey: result.apiKey || '',
            token: result.token || '',
            boardId: result.boardId || '',
            theme: result.theme || 'purple-blue'
        };
    }

    // Apply theme
    function applyTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('purple-blue', 'sunset', 'ocean', 'forest');
        // Add the selected theme class
        document.body.classList.add(theme);
    }

    // Fetch random card
    async function fetchRandomCard(settings) {
        loading.classList.remove('hidden');
        content.classList.add('hidden');
        error.classList.add('hidden');

        try {
            const response = await fetch(
                `https://api.trello.com/1/boards/${settings.boardId}/cards?key=${settings.apiKey}&token=${settings.token}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch cards from Trello');
            }

            const cards = await response.json();

            if (cards.length === 0) {
                throw new Error('No cards found on this board');
            }

            const randomCard = cards[Math.floor(Math.random() * cards.length)];

            // Get the list name
            const listResponse = await fetch(
                `https://api.trello.com/1/lists/${randomCard.idList}?key=${settings.apiKey}&token=${settings.token}`
            );

            if (!listResponse.ok) {
                throw new Error('Failed to fetch list information');
            }

            const list = await listResponse.json();

            document.getElementById('cardTitle').textContent = randomCard.name;
            document.getElementById('cardDescription').textContent = `List: ${list.name}`;

            loading.classList.add('hidden');
            content.classList.remove('hidden');
            content.classList.add('visible');
        } catch (err) {
            loading.classList.add('hidden');
            error.classList.remove('hidden');
            error.textContent = err.message;
        }
    }

    // Initial load
    const initialSettings = await loadSettings();
    if (initialSettings.apiKey && initialSettings.token && initialSettings.boardId) {
        fetchRandomCard(initialSettings);
    } else {
        error.classList.remove('hidden');
        error.textContent = 'Please configure your Trello credentials in settings';
    }

    // Apply initial theme
    applyTheme(initialSettings.theme || 'purple-blue');
});
