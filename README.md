# Flight Control Tower

A lightweight macOS native-styled application leveraging Electron to display live FlightRadar24 tracking data, while simultaneously streaming background Air Traffic Control (ATC) audio without interruptions from subscription timeout modals.

## Features
- **Live Flight Tracking:** Displays the regional aviation map over Taiwan.
- **Continuous ATC Audio:** Streams the local ATC feed in a hidden background view.
- **UI Mute Controls:** Floating, glassmorphic UI toggle that effortlessly mutes/unmutes the background audio.
- **Day/Night Theme:** Automatically responds to the native macOS system preferences.
- **Anti-Timeout Zapper:** Automatically injects a `MutationObserver` that intercepts and destroys the FlightRadar24 30-minute session timeout modal, allowing for indefinite continuous monitoring.

## Architecture

```mermaid
graph TD
    subgraph Electron Main Process ["Main Process (src/main.js)"]
        BW["BrowserWindow\n(frameless, hiddenInset)"]
        BV_MAP["BrowserView: Map\n(flightradar24.com)"]
        BV_AUD["BrowserView: Audio\n(youtube ATC — 0×0 size)"]
        IPC["ipcMain.handle('toggle-audio')"]
        OBS["MutationObserver Injection\n(anti-timeout zapper)"]
    end

    subgraph Renderer ["Renderer Process (src/renderer/)"]
        UI["index.html + styles.css\n(transparent glass overlay)"]
        RJS["renderer.js\n(mute button logic)"]
    end

    subgraph Preload ["Preload Bridge (src/preload.js)"]
        CB["contextBridge\nexposeInMainWorld('electronAPI')"]
    end

    BW --> BV_MAP
    BW --> BV_AUD
    BW --> UI
    UI --> RJS
    RJS -- "invoke('toggle-audio')" --> CB
    CB --> IPC
    IPC --> BV_AUD
    BV_MAP -- "after loadURL resolves" --> OBS
    nativeTheme["nativeTheme (system)"] --> UI
```

## IPC Flow

| Direction | Event | Action |
|---|---|---|
| Renderer → Main | `invoke('toggle-audio')` | Reads + flips `webContents.isAudioMuted()` |
| Main → Renderer | return value (`boolean`) | Updates mute button icon and `.muted` CSS class |

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
To run the automated test suite (Jest unit tests + Playwright system tests):
```bash
npm test
```

> **Note:** The Playwright system tests (`test/system.spec.js`) require a live macOS GUI session — they launch the full Electron app and interact with real windows.

## Audio Source

ATC audio is streamed from a public YouTube Live feed (`youtube.com/watch?v=NOZVUBsCDEI`), loaded in a hidden zero-size `BrowserView` with `autoplayPolicy: 'no-user-gesture-required'` to allow playback without user interaction.
