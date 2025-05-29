# Trello Random Card Chrome Extension

This Chrome extension displays a random card from a specified Trello board every time you open a new tab.

## Setup Instructions

1. Get your Trello API credentials:
   - Visit https://trello.com/app-key to get your API Key
   - On the same page, click "Generate a Token" to get your Token
   - Get your Board ID from the URL of your Trello board (it's the string after /b/ in the URL)

2. Install the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this directory

3. Configure the extension:
   - Open a new tab
   - Click the gear icon (⚙️) in the top right
   - Enter your API Key, Token, and Board ID
   - Click Save

## Features

- Displays a random card from your Trello board in a beautiful, minimal interface
- Updates every time you open a new tab
- Secure storage of your Trello credentials
- Clean, modern design with smooth animations

## Security Note

Your Trello API credentials are stored locally in your browser using Chrome's storage API. They are never sent to any third-party servers.
