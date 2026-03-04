# Flight Control Tower

A lightweight macOS native-styled application leveraging Electron to display live FlightRadar24 tracking data, while simultaneously streaming background Air Traffic Control (ATC) audio without interruptions from subscription timeout modals.

## Features
- **Live Flight Tracking:** Displays the regional aviation map over Taiwan.
- **Continuous ATC Audio:** Streams the local ATC feed in a hidden background view.
- **UI Mute Controls:** Floating, glassmorphic UI toggle that effortlessly mutes/unmutes the background audio.
- **Day/Night Theme:** Automatically responds to the native macOS system preferences.
- **Anti-Timeout Zapper:** Automatically injects a `MutationObserver` that intercepts and destroys the FlightRadar24 30-minute session timeout modal, allowing for indefinite continuous monitoring.

## Getting Started

### Prerequisites
- Node.js > 18.x
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
To start the app locally in development mode:
```bash
npm start
```

### Testing
To run the automated test suite (Jest + Playwright):
```bash
npm test
```

## Architecture
- **Framework:** Electron
- **Views:** Multiple `BrowserView`s attached to a single frameless `BrowserWindow`.
- **Styling:** CSS natively reading `@media (prefers-color-scheme: dark)`
- **Inter-Process Communication:** Secure `contextBridge` linking the UI shell to the background audio state.
