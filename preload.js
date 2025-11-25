const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Listen for file opened from menu
  onFileOpened: (callback) => {
    ipcRenderer.on('file-opened', (event, data) => callback(data));
  },

  // Open file dialog
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),

  // Read file
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

  // Check if running in Electron
  isElectron: true
});
