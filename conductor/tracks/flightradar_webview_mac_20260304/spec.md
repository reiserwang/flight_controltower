# Specification: FlightRadar24 Webview Mac App

## Overview

Build a lightweight, native-styled macOS desktop app using Electron that embeds FlightRadar24 live flight tracking and an ATC audio stream, with a floating glassmorphic UI overlay. The app must run indefinitely without session timeouts and support mute control.

## Goals

- Display the live FlightRadar24 map (Taiwan region) in a full-screen embedded `BrowserView`.
- Stream ATC audio continuously in a hidden `BrowserView` (zero-size, no user interaction required).
- Provide a floating, glassmorphic "Live ATC" mute/unmute button anchored to the top-right.
- Automatically inject a `MutationObserver` to intercept and destroy any FlightRadar24 session-timeout or premium modals.
- Adapt appearance to macOS system light/dark mode automatically.

## Non-Goals

- No local data storage or persistence.
- No user accounts or authentication.
- No cross-platform support (macOS only in v1).

## Success Criteria

- [ ] App launches via `npm start` on macOS with no errors.
- [ ] FlightRadar24 map renders and loads exactly once per launch (no double-fetch).
- [ ] ATC audio starts playing automatically on launch.
- [ ] Mute button toggles audio mute state with visual feedback (icon + red glass tint).
- [ ] Timeout modal is intercepted and removed within 30 minutes of session start.
- [ ] App responds to macOS light/dark mode switch without requiring restart.
- [ ] `npm test` passes all Jest unit tests and Playwright system tests.

## Architecture

- **Main Process** (`src/main.js`): creates a frameless `BrowserWindow`, attaches `BrowserView`s for map and audio, handles IPC.
- **Preload** (`src/preload.js`): exposes `electronAPI.toggleAudio()` to the renderer via `contextBridge`.
- **Renderer** (`src/renderer/`): transparent HTML/CSS/JS overlay with the glassmorphic mute button.
- **Anti-Timeout Observer**: injected via `executeJavaScript` after the map `BrowserView` finishes loading.
