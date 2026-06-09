// Unit test for the audio mute-toggle logic that the main-process IPC handler
// (`ipcMain.handle('toggle-audio')`) actually calls.
const { toggleAudioMuted } = require('../src/toggleAudio');

describe('toggleAudioMuted', () => {
    let mockWebContents;
    let isMutedState;

    beforeEach(() => {
        isMutedState = false;
        mockWebContents = {
            isAudioMuted: jest.fn(() => isMutedState),
            setAudioMuted: jest.fn((mute) => { isMutedState = mute; })
        };
    });

    it('mutes when currently unmuted and returns the new state', () => {
        const result = toggleAudioMuted(mockWebContents);

        expect(mockWebContents.setAudioMuted).toHaveBeenCalledWith(true);
        expect(isMutedState).toBe(true);
        expect(result).toBe(true);
    });

    it('unmutes when currently muted and returns the new state', () => {
        isMutedState = true;

        const result = toggleAudioMuted(mockWebContents);

        expect(mockWebContents.setAudioMuted).toHaveBeenCalledWith(false);
        expect(isMutedState).toBe(false);
        expect(result).toBe(false);
    });
});
