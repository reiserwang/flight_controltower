# Implementation Plan — FlightRadar24 Webview Mac App

## Phase 1: Project Scaffold
- [x] Initialise Electron project with `package.json` and `src/main.js` entry point.
- [x] Create `src/preload.js` with `contextBridge` exposing `toggleAudio`.
- [x] Create `src/renderer/index.html`, `renderer.js`, `styles.css` for the UI overlay.

## Phase 2: BrowserView Integration
- [x] Set up `mapContent` BrowserView at full window bounds minus titlebar.
- [x] Load `https://www.flightradar24.com/25.08,121.22/14` once, then inject anti-timeout `MutationObserver`.
- [x] Set up `audioContent` BrowserView at zero size for hidden ATC audio stream.
- [x] Configure `autoplayPolicy: 'no-user-gesture-required'` for audio autoplay.

## Phase 3: IPC & UI
- [x] Wire `ipcMain.handle('toggle-audio')` to read and flip `webContents.isAudioMuted()`.
- [x] Implement glassmorphic mute button with light/dark CSS variables.
- [x] Handle `mainWindow.on('resize')` to keep `mapContent` bounds synchronised.

## Phase 4: Testing
- [x] Write Jest unit tests for IPC toggle logic (`test/ipc.spec.js`).
- [x] Write Playwright system tests for launch, mute button visibility, and toggle (`test/system.spec.js`).
- [x] Configure `jest.config.js`.

## Phase 5: Bug Fixes (Retrospective)
- [x] Remove duplicate `loadURL` call in `setupMapBrowserView`.
- [x] Fix malformed YouTube URL (`?autoplay=1` → `&autoplay=1`).
- [x] Add missing `.glass-btn.muted` CSS rule for visual muted feedback.
- [x] Add `jest` and `playwright` to `devDependencies` in `package.json`.
