document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settings');
    const saveSettingsButton = document.getElementById('saveSettings');
    const content = document.getElementById('content');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    // Toggle settings panel
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
        loadSettings();
    });

    // Save settings
    saveSettingsButton.addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKey').value;
        const token = document.getElementById('token').value;
        const boardId = document.getElementById('boardId').value;

        await chrome.storage.local.set({ apiKey, token, boardId });
        settingsPanel.classList.add('hidden');
        fetchRandomCard();
    });

    // Load settings
    async function loadSettings() {
        const settings = await chrome.storage.local.get(['apiKey', 'token', 'boardId']);
        document.getElementById('apiKey').value = settings.apiKey || '';
        document.getElementById('token').value = settings.token || '';
        document.getElementById('boardId').value = settings.boardId || '';
    }

    // Fetch random card
    async function fetchRandomCard() {
        loading.classList.remove('hidden');
        content.classList.add('hidden');
        error.classList.add('hidden');

        try {
            const settings = await chrome.storage.local.get(['apiKey', 'token', 'boardId']);
            
            if (!settings.apiKey || !settings.token || !settings.boardId) {
                throw new Error('Please configure your Trello API settings');
            }

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
    fetchRandomCard();
});
