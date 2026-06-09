const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

let electronApp;
let window;

test.beforeAll(async () => {
    electronApp = await electron.launch({
        args: [path.join(__dirname, '..', 'src', 'main.js')],
        recordVideo: { dir: 'test-videos/' }
    });
    window = await electronApp.firstWindow();
});

test.afterAll(async () => {
    if (electronApp) {
        await electronApp.close();
    }
});

test('launches the app with the correct title', async () => {
    await expect.poll(() => window.title()).toBe('Flight Control Tower');
});

test('renders the mute button in the UI shell', async () => {
    const muteBtn = window.locator('#mute-btn');
    await expect(muteBtn).toBeVisible();
    await expect(muteBtn).toHaveText(/Live ATC/);
});

// Note: we can't inspect the hidden BrowserView audio state from the renderer,
// but we can verify the mute toggle round-trips through IPC and updates the icon.
test('toggles the mute state via UI click', async () => {
    const muteBtn = window.locator('#mute-btn');
    const muteIcon = window.locator('#mute-icon');

    await expect(muteIcon).toHaveText('🔊'); // default: unmuted

    await muteBtn.click();
    await expect(muteIcon).toHaveText('🔇'); // muted

    await muteBtn.click();
    await expect(muteIcon).toHaveText('🔊'); // unmuted again
});
