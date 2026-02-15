const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1100, height: 750,
        frame: false, 
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    win.loadFile('index.html');

    ipcMain.on('win-minimize', () => win.minimize());
    ipcMain.on('win-maximize', () => win.isMaximized() ? win.unmaximize() : win.maximize());
    ipcMain.on('win-close', () => app.quit());
}

app.whenReady().then(createWindow);
