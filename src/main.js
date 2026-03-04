const { app, BrowserWindow, BrowserView, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');

let mainWindow;
let mapContent;
let audioContent;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load the transparent local UI overlay (Mute button & Drag region)
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

    setupMapBrowserView();
    setupAudioBrowserView();

    // Resize views when the main window resizes
    mainWindow.on('resize', updateViewBounds);

    nativeTheme.themeSource = 'system';
}

function setupMapBrowserView() {
    mapContent = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.addBrowserView(mapContent);
    updateViewBounds(); // Initial sizing based on titlebar height

    mapContent.webContents.loadURL('https://www.flightradar24.com/25.08,121.22/14');
    // Instead of just loading the URL, we listen for finish load to inject the script
    mapContent.webContents.loadURL('https://www.flightradar24.com/25.08,121.22/14')
        .then(() => {
            // Inject anti-timeout mutation observer
            const injectScript = `
        (function() {
          const zapper = new MutationObserver((mutations) => {
            for (let m of mutations) {
              m.addedNodes.forEach((n) => {
                if (n.nodeType === 1) { // ELEMENT_NODE
                  // Aggressively zap known timeout elements
                  if (n.id === 'premium-popup' || n.classList.contains('premium-popup') || n.classList.contains('fc-ab-root')) {
                    n.remove();
                    console.log('Zapped premium popup element!');
                  }
                  
                  // Sometimes FlightRadar overlays a dark background #overlay
                  if (n.id === 'overlay' && document.querySelector('#premium-popup')) {
                    n.remove();
                  }
                }
              });
            }
            
            // Fallback catch-all static check every time mutations happen
            const popup = document.getElementById('premium-popup');
            if (popup) popup.remove();
            const overlay = document.getElementById('overlay');
            if (overlay && window.getComputedStyle(overlay).display !== 'none') overlay.remove();
            
            // Note: some sites use body class to prevent scrolling when modal is open
            document.body.classList.remove('modal-open');
          });

          zapper.observe(document.body, { childList: true, subtree: true });
          console.log('Anti-timeout observer started.');
        })();
      `;
            mapContent.webContents.executeJavaScript(injectScript);
        })
        .catch(err => console.error("Failed to load map View:", err));
}

function setupAudioBrowserView() {
    audioContent = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    // Note: we do NOT add it to the mainWindow (keeps it completely hidden)
    // or we add it with 0x0 size depending on how Electron handles unmounted views playing audio.
    // For safety with audio playback, we attach it but give it a 0 size.
    mainWindow.addBrowserView(audioContent);
    audioContent.setBounds({ x: 0, y: 0, width: 0, height: 0 });

    audioContent.webContents.loadURL('https://www.flightradar24.com/25.15,121.10/10');
}

function updateViewBounds() {
    if (!mainWindow || !mapContent) return;
    const bounds = mainWindow.getBounds();
    // Leave top 40px for our custom transparent titlebar/controls
    const titleBarHeight = 40;
    mapContent.setBounds({
        x: 0,
        y: titleBarHeight,
        width: bounds.width,
        height: bounds.height - titleBarHeight
    });
}

// IPC Handlers
ipcMain.handle('toggle-audio', async () => {
    if (audioContent) {
        const isCurrentlyMuted = audioContent.webContents.isAudioMuted();
        audioContent.webContents.setAudioMuted(!isCurrentlyMuted);
        return !isCurrentlyMuted; // Return new state
    }
    return true;
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
