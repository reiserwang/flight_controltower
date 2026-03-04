const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    toggleAudio: () => ipcRenderer.invoke('toggle-audio')
});
