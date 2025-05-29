# Contributing to Show a Random Trello Card

We love your input! We want to make contributing to this extension as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Setup

### Project Structure

```
├── icons/              # Extension icons and SVGs
├── manifest.json       # Extension manifest and configuration
├── newtab.html        # New tab page template
├── script.js          # Main extension logic
├── styles.css         # Styling for new tab page
├── PRIVACY.md         # Privacy policy
└── README.md          # Documentation
```

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/brittanyjoiner15/trello-random-card-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned repository folder

5. Make your changes - Chrome will automatically reload the extension

### Building for Production

To create a ZIP file for Chrome Web Store submission:

```bash
zip -r extension.zip . -x "*.git*" "*.md" ".DS_Store"
```

## We Develop with Github
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)
Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](../../issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.
