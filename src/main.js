const { app, BrowserWindow, WebContentsView, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');
const { toggleAudioMuted } = require('./toggleAudio');

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
    mapContent = new WebContentsView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true // remote content — keep it sandboxed
        }
    });

    mainWindow.contentView.addChildView(mapContent);
    updateViewBounds(); // Initial sizing based on titlebar height

    // Listen for finish load to inject the anti-timeout script
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

            // Inject CSS to suppress known ad/promo elements
            mapContent.webContents.insertCSS(`
                ins.adsbygoogle,
                iframe[src*="doubleclick"],
                iframe[src*="googlesyndication"],
                iframe[src*="amazon-adsystem"] {
                    display: none !important;
                }
            `);

            // Inject a JS sweeper to find and remove the right-side promo panel.
            // FR24 uses minified class names, so we fingerprint by visible content + geometry.
            const panelSweeperScript = `
                (function() {
                    // Text strings visible in the right promotional panel
                    const PANEL_FINGERPRINTS = [
                        'flightradar24 on youtube',
                        'unlock 60+ premium features',
                        'try free for 7 days',
                        'b2b: explore our custom flight data',
                    ];

                    function findAndZapPanel() {
                        for (const fingerprint of PANEL_FINGERPRINTS) {
                            // Find any element whose direct text matches our fingerprint
                            const all = document.querySelectorAll('*');
                            for (const el of all) {
                                const text = el.textContent.trim().toLowerCase();
                                if (text.startsWith(fingerprint) && el.children.length <= 3) {
                                    // Walk up from the match to find a tall right-anchored container
                                    let target = el;
                                    for (let i = 0; i < 12; i++) {
                                        target = target.parentElement;
                                        if (!target || target === document.body) break;
                                        const r = target.getBoundingClientRect();
                                        // Panel signature: tall, at least 200px wide, 
                                        // anchored to the right side of the viewport
                                        if (r.width > 150 && r.height > 300 && r.right >= window.innerWidth - 50) {
                                            target.remove();
                                            console.log('Zapped FR24 promo panel.');
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    }

                    // Run immediately on load
                    findAndZapPanel();

                    // FR24's map fires DOM mutations constantly, and findAndZapPanel walks
                    // every element in the document. Coalesce bursts of mutations into a
                    // single scan per animation frame so we don't pin the CPU.
                    let scanScheduled = false;
                    const panelObserver = new MutationObserver(() => {
                        if (scanScheduled) return;
                        scanScheduled = true;
                        requestAnimationFrame(() => {
                            scanScheduled = false;
                            findAndZapPanel();
                        });
                    });
                    panelObserver.observe(document.body, { childList: true, subtree: true });
                })();
            `;
            mapContent.webContents.executeJavaScript(panelSweeperScript);
        })
        .catch(err => console.error("Failed to load map View:", err));
}

function setupAudioBrowserView() {
    audioContent = new WebContentsView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true, // remote content — keep it sandboxed
            // Allow autoplaying unmuted audio
            autoplayPolicy: 'no-user-gesture-required'
        }
    });
    // Attach the view but give it a 0x0 size so it stays completely hidden
    // while its webContents keeps playing audio.
    mainWindow.contentView.addChildView(audioContent);
    audioContent.setBounds({ x: 0, y: 0, width: 0, height: 0 });

    // Use a YouTube Live ATC stream as requested by the user.
    // The /embed/ player honors autoplay=1 under autoplayPolicy: 'no-user-gesture-required'
    // and skips the watch-page cookie/consent/ad chrome, so it starts unmuted reliably.
    audioContent.webContents.loadURL('https://www.youtube.com/embed/NOZVUBsCDEI?autoplay=1');
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
        return toggleAudioMuted(audioContent.webContents);
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
