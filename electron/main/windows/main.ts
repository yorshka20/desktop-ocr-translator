import { is } from '@electron-toolkit/utils';
import { BrowserWindow, ipcMain, shell } from 'electron';
import { join } from 'path';

import { DEV_SERVER_URL, EVENTS, preload } from '../../constants';
import { getWindowHtmlPath } from '../../utils';

export function createMainWindow(): BrowserWindow {
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
    // mainWindow.show();

    setupMainWindowListener(mainWindow);
  });

  mainWindow.on('close', (e) => {
    // do not really close the window. just hide the window.
    e.preventDefault();

    mainWindow.hide();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // ipcMain.handle('check-screen', async () => {
  //   const result = await systemPreferences.getMediaAccessStatus('screen');
  //   return result;
  // });

  const indexHtml = join(process.env.DIST || '', getWindowHtmlPath('main'));

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && DEV_SERVER_URL) {
    // console.log('process.env', process.env);

    // default to open the index.html file.
    // in multiple pages, set specific html file path to the url.
    mainWindow.loadURL(DEV_SERVER_URL + getWindowHtmlPath('main'));

    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtml);
  }

  return mainWindow;
}

function setupMainWindowListener(window: BrowserWindow) {
  ipcMain.on(EVENTS.WINDOW_DISPLAY_MAIN_WINDOW, (_, show: boolean) => {
    if (show) {
      window.show();
    } else {
      window.hide();
    }
  });
}
