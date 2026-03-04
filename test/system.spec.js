const { _electron: electron } = require('playwright');
const path = require('path');

describe('Flight Control Tower - System Tests', () => {
    let electronApp;
    let window;

    beforeAll(async () => {
        electronApp = await electron.launch({
            args: ['src/main.js'],
            recordVideo: { dir: 'test-videos/' }
        });
        window = await electronApp.firstWindow();
    }, 30000);

    afterAll(async () => {
        if (electronApp) {
            await electronApp.close();
        }
    });

    it('Launches the app and title is correct', async () => {
        const title = await window.title();
        expect(title).toBe('Flight Control Tower');
    });

    it('Verifies the UI shell loads the mute button', async () => {
        const muteBtn = await window.locator('#mute-btn');
        await expect(muteBtn).toBeVisible();
        await expect(muteBtn).toHaveText(/Live ATC/);
    });

    // Note: We cannot easily inspect the contents of the BrowserViews from standard Playwright 
    // without digging into the electronApp context and finding the webContents manually, 
    // but we can test the IPC side of the mute toggle works.
    it('Toggles the mute state via UI click', async () => {
        const muteBtn = await window.locator('#mute-btn');
        const muteIcon = await window.locator('#mute-icon');

        // Default icon is unmuted 🔊
        let iconText = await muteIcon.innerText();
        expect(iconText).toBe('🔊');

        // Click to mute
        await muteBtn.click();
        iconText = await muteIcon.innerText();
        expect(iconText).toBe('🔇');

        // Click to unmute
        await muteBtn.click();
        iconText = await muteIcon.innerText();
        expect(iconText).toBe('🔊');
    });

});
