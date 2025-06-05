const TRELLO_API_KEY = 'c931bcb711be7cca600a6b2dfcc60f58';

async function authenticateWithTrello() {
    const authUrl = `https://trello.com/1/authorize?expiration=never&name=Random%20Card%20Extension&scope=read&response_type=token&key=${TRELLO_API_KEY}`;
    
    try {
        const token = await new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({
                url: authUrl,
                interactive: true
            }, (responseUrl) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                // The token is in the hash of the URL
                const token = new URLSearchParams(new URL(responseUrl).hash.substr(1)).get('token');
                resolve(token);
            });
        });

        if (!token) throw new Error('No token received');

        // Get user's boards
        const boardsResponse = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_API_KEY}&token=${token}`);
        const boards = await boardsResponse.json();

        // Populate board selector
        const boardSelect = document.getElementById('boardSelect');
        boardSelect.innerHTML = '<option value="">Select a board...</option>' + 
            boards.map(board => `<option value="${board.id}">${board.name}</option>`).join('');

        // Show board selector and handle selection
        document.getElementById('boardSelector').classList.remove('hidden');
        document.getElementById('apiKey').value = TRELLO_API_KEY;
        document.getElementById('token').value = token;

        boardSelect.addEventListener('change', (e) => {
            document.getElementById('boardId').value = e.target.value;
        });

        return { token, boards };
    } catch (error) {
        console.error('Authentication error:', error);
        document.getElementById('error').textContent = 'Authentication failed. Please try again.';
        document.getElementById('error').classList.remove('hidden');
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

    // Close on overlay click
    overlay.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    // Toggle settings panel
    settingsButton.addEventListener('click', async () => {
        const currentSettings = await loadSettings();
        document.getElementById('apiKey').value = currentSettings.apiKey;
        document.getElementById('token').value = currentSettings.token;
        document.getElementById('boardId').value = currentSettings.boardId;
        
        // Set active theme
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === currentSettings.theme);
        });
        
        overlay.classList.remove('hidden');
        settingsPanel.classList.remove('hidden');
    });

    // Theme selection handling
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            applyTheme(option.dataset.theme);
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
