import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import {
  BrowserWindow,
  app,
  desktopCapturer,
  globalShortcut,
  ipcMain,
  shell,
  systemPreferences,
} from 'electron';
import { join } from 'path';

import { getScreenSize, setupScreenShot } from './screen-shot';

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist-electron/renderer');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 700,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      sandbox: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  ipcMain.handle('check-screen', async () => {
    const result = await systemPreferences.getMediaAccessStatus('screen');
    return result;
  });

  ipcMain.handle('desktop-capture', async () => {
    const result = await desktopCapturer.getSources({ types: ['screen'] });
    console.log('result', result);
    return result;
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && url) {
    // console.log('process.env', process.env);

    // default to open the index.html file.
    // in multiple pages, set specific html file path to the url.
    mainWindow.loadURL(url);

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtml);
  }

  registerGlobalShortcut();
}

function createScreenShotWindow(): void {
  const { width, height } = getScreenSize();
  const screenShotWindow = new BrowserWindow({
    width: width * 0.8,
    height: height * 0.8,
    minWidth: 700,
    show: false,
    autoHideMenuBar: true,
    frame: true, // no border
    titleBarStyle: 'hidden', // no title
    transparent: true,
    webPreferences: {
      preload,
      sandbox: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  // hide traffic light. you can only close the window by ctrl+w
  if (process.platform === 'darwin') {
    screenShotWindow.setWindowButtonVisibility(false);
  }

  // always to invoke window.show() when window ready
  screenShotWindow.once('ready-to-show', () => {
    screenShotWindow.show();
  });

  // add screen-shot listener
  setupScreenShot();

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && url) {
    screenShotWindow.loadURL(url + '/screenshot/index.html');
  } else {
    const htmlPath = join(process.env.PWD || '', 'screenshot/index.html');
    screenShotWindow.loadFile(htmlPath);
  }

  screenShotWindow.webContents.openDevTools();
}

function registerGlobalShortcut(): void {
  const ret = globalShortcut.register('Alt+D', () => {
    console.log('Alt+D is pressed');
    createScreenShotWindow();
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('Alt+D'));
}

function unregisterGlobalShortcut() {
  globalShortcut.unregisterAll();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  unregisterGlobalShortcut();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
