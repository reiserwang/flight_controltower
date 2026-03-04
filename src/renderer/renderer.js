const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');

let isMuted = false; // Note: main process defaults to unmuted by WebContents initially

muteBtn.addEventListener('click', async () => {
    // Call the IPC handler
    isMuted = await window.electronAPI.toggleAudio();

    // Update local UI
    if (isMuted) {
        muteIcon.textContent = '🔇';
        muteBtn.classList.add('muted');
    } else {
        muteIcon.textContent = '🔊';
        muteBtn.classList.remove('muted');
    }
});
