## Architecture: FlightRadar Webview Mac App

### Components
| Component | Responsibility | Interface |
|-----------|---------------|-----------| 
| **Main Process (`main.js`)** | Electron lifecycle, window management, IPC routing. | Electron API, Node.js |
| **Main Window (`BrowserWindow`)** | Houses the UI controls and rendering context for `BrowserView`s. | Electron `BrowserWindow` |
| **Map View (`BrowserView`)** | Primary embedded web contents loading the FlightRadar24 map URL. | Electron `BrowserView` |
| **Audio View (`BrowserView`)** | Hidden web contents loading the FlightRadar24 ATC audio URL. | Electron `BrowserView` |
| **Preload Script (`preload.js`)** | Bridges Main Process and Renderer securely, exposing IPC for mute/unmute. | contextBridge, ipcRenderer |
| **Renderer UI (`index.html`/`renderer.js`)** | Renders the mute toggle button and sends IPC messages to Main Process. | DOM, Preload API |
| **Injection Script (`anti-timeout.js`)** | Injected via `webContents.executeJavaScript` to remove DOM timeout modals. | DOM MutationObserver |

### Data Flow
```mermaid
graph TD
    A[Electron Main Process] -->|Creates| B(Main Window)
    A -->|Attaches| C(Map BrowserView)
    A -->|Attaches| D(Hidden Audio BrowserView)
    
    B -->|Exposes UI| E[Mute Toggle Button]
    
    E -->|Click Event via IPC| A
    A -->|setAudioMuted(bool)| D
    
    A -->|Injects JS| F(anti-timeout.js)
    F -->|Modifies DOM| C
```

### Tech Stack
| Choice | Justification |
|--------|---------------|
| **Electron** | Requested by user. Excellent for composing multiple web views and injecting scripts. |
| **Vanilla JS / HTML / CSS** | UI is extremely minimal (just a mute button). Standard web techs avoid framework overhead. |
| **Electron Forge** | Standard tooling for packaging and distributing the Electron mac app. |
