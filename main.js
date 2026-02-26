const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "HEXA Ultimate",
    icon: path.join(__dirname, 'icon.png'), // Если есть иконка
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Укажи здесь ссылку на свой сайт на Vercel
  win.loadURL('https://electrik2-9f1c.vercel.app');
  
  // Убираем стандартное меню сверху
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
