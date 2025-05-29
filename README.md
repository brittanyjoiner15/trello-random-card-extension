# Show a Random Trello Card - Chrome Extension

Display a random card from your Trello board every time you open a new tab. Perfect for staying connected with your tasks and ideas!

## Installation Options

### Option 1: Chrome Web Store (Coming Soon)

1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/show-a-random-trello-card) (coming soon)
2. Click "Add to Chrome"
3. Click "Add extension" in the popup

### Option 2: Local Installation (For Developers)

1. Clone this repository:
   ```bash
   git clone https://github.com/brittanyjoiner15/trello-random-card-extension.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned repository folder

## Setup Instructions

1. After installation (either method), open a new tab
2. Click the gear icon (⚙️) in the top right
3. Get your Trello credentials:
   - Visit [Trello's API Key page](https://trello.com/app-key)
   - Copy your API Key
   - Click "Generate a Token" and copy the token
   - Get your Board ID from your Trello board URL (it's the string after /b/)
4. Enter these credentials in the extension settings
5. Click Save

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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for development setup instructions and guidelines.

## Security Note

Your Trello API credentials are stored locally in your browser using Chrome's storage API. They are never sent to any third-party servers.
