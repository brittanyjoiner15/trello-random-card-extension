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

## Development

### Project Structure

```
├── icons/              # Extension icons and SVGs
├── manifest.json       # Extension manifest and configuration
├── newtab.html        # New tab page template
├── script.js          # Main extension logic
├── styles.css         # Styling for new tab page
├── PRIVACY.md         # Privacy policy
└── README.md          # This file
```

### Making Changes

1. Follow the Local Installation steps above
2. Make your changes to the code
3. Chrome will automatically reload the extension when files change
4. Open a new tab to test your changes

### Building for Production

To create a ZIP file for Chrome Web Store submission:

```bash
zip -r extension.zip . -x "*.git*" "*.md" ".DS_Store"
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Security Note

Your Trello API credentials are stored locally in your browser using Chrome's storage API. They are never sent to any third-party servers.
