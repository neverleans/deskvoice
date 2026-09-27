import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'DeskVoice - Central de Atendimento & Telefonia',
    backgroundColor: '#020617', // slate-950
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = 'http://localhost:5173';
  const prodPath = path.join(__dirname, '../../web/build/index.html');

  // Em desenvolvimento carrega o Vite dev server; se falhar ou em prod carrega o build estático
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow?.loadFile(prodPath);
    });
  } else {
    mainWindow.loadFile(prodPath).catch(() => {
      mainWindow?.loadURL(devUrl);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers para o PlatformAdapter
ipcMain.on('app:bring-to-front', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.flashFrame(true); // Efeito visual na barra de tarefas do Windows
  }
});

ipcMain.on('app:notify', (_event, { title, options }) => {
  if (Notification.isSupported()) {
    new Notification({
      title,
      body: options?.body || '',
      silent: false,
    }).show();
  }
});

ipcMain.on('app:set-badge', (_event, count: number) => {
  if (app.setBadgeCount) {
    app.setBadgeCount(count);
  }
  if (mainWindow && count > 0) {
    mainWindow.flashFrame(true);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
