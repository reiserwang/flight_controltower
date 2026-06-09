// Pure audio-mute toggle logic, shared by the main-process IPC handler
// and the unit tests so both exercise the same code path.
function toggleAudioMuted(webContents) {
    const isCurrentlyMuted = webContents.isAudioMuted();
    webContents.setAudioMuted(!isCurrentlyMuted);
    return !isCurrentlyMuted; // new muted state
}

module.exports = { toggleAudioMuted };
