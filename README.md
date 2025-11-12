# Cointrust Bot (Demo)

**Disclaimer: This extension is for demonstration and educational purposes only. Do not use for unauthorized or unethical activities.**
**Note: CoinTrust.ai is a fictitious webpage for testing only managed by MirrorTab Corp for demonstration only.**

## Overview
This Chrome extension simulates a malicious browser extension that performs bot-like behaviors for security research and demonstration. It showcases how browser extensions can interact with web pages, automate actions, and potentially exfiltrate or manipulate data. This extension is designed to work against https://cointrust.ai/ and associated links which MirrorTab Corp manages, and will not work against any other site. 

## Features
- Injects a popup UI on allowed hostnames
- Automates account creation and password reset flows
- Performs bitcoin transfer unbeknownst to the user 
- Stores and displays created account credentials in the popup
- Demonstrates DOM manipulation and event simulation

## File Descriptions
- `inject.js`: Main content script. Handles DOM injection, automation bots, and popup UI logic.
- `background.js`: Background script for extension event handling.
- `manifest.json`: Chrome extension manifest configuration.

## Usage against https://cointrust.ai/
1. **Load the extension in Chrome:**
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" and select this folder
2. **Navigate to a supported site:**
   - The popup will appear on allowed hostnames (see `MALICIOUS_EXT_HOSTS` in `inject.js`) when
     the extension icon is clicked. 
   - The popup will display default credentials to log in. These can be 
3. **Use the popup:**
   - Run the Create Account or Password Reset bots
   - View generated credentials in the popup

## Usage against https://mt.cointrust.ai/ 
   - Like above, the extension popup will appear when the extension icon is clicked. 
   - However, since https://mt.cointrust.ai/ does not have DOM elements accessible, the
     extension is unable to fill out forms or fields.

## Educational Value
- Demonstrates risks of over-permissive browser extensions
- Shows how extensions can automate and manipulate web apps
- Useful for security awareness and red team demos

## Warning
This code is intentionally unsafe and should **never** be used in production or on real user data. Only use in controlled, isolated environments for learning or demonstration.

## Contact
For any questions please email sales@mirrortab.com
