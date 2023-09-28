import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import {
  BrowserWindow,
  app,
  ipcMain,
  shell,
  systemPreferences,
} from 'electron';
import { join } from 'path';

import {
  getScreenSize,
  setupScreenShotListener,
  setupShowWindowListener,
} from './screen-shot';
import { registerGlobalShortcut, unregisterGlobalShortcut } from './short-cut';

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist-electron/renderer');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, '/src/windows/main/index.html');

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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && url) {
    // console.log('process.env', process.env);

    // default to open the index.html file.
    // in multiple pages, set specific html file path to the url.
    mainWindow.loadURL(url + '/src/windows/main/index.html');

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtml);
  }

  registerGlobalShortcut();
}

function createScreenShotWindow(): void {
  const { width, height } = getScreenSize();
  const screenShotWindow = new BrowserWindow({
    width,
    height,
    minWidth: 700,
    minHeight: 600,
    show: false, // do not show window by default
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

  // using command to show and hide window. do not show window by default
  screenShotWindow.once('ready-to-show', () => {
    setupShowWindowListener(screenShotWindow);
  });

  // add screen-shot listener
  setupScreenShotListener();

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && url) {
    screenShotWindow.loadURL(url + '/src/windows/screenshot/index.html');
  } else {
    const htmlPath = join(
      process.env.PWD || '',
      '/src/windows/screenshot/index.html'
    );
    screenShotWindow.loadFile(htmlPath);
  }

  screenShotWindow.webContents.openDevTools();
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

  // create and show main window.
  createWindow();

  // prepare for screenshot window
  createScreenShotWindow();

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
