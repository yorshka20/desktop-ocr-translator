import { is } from '@electron-toolkit/utils';
import { BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';

import { DEV_SERVER_URL, EVENTS } from '../../constants';
import { preload } from '../../preload';
import { getWindowHtmlPath } from '../../utils';

export function createContentWindow(): void {
  const contentWindow = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    show: false, // do not show window by default
    webPreferences: {
      preload,
      sandbox: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  // hide traffic light. you can only close the window by ctrl+w
  if (process.platform === 'darwin') {
    contentWindow.setWindowButtonVisibility(false);
  }

  // using command to show and hide window. do not show window by default
  contentWindow.once('ready-to-show', () => {
    setupShowWindowListener(contentWindow);
  });

  // add screen-shot listener
  setupContentWindowListener();

  const htmlPath = getWindowHtmlPath('content');

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && DEV_SERVER_URL) {
    contentWindow.loadURL(DEV_SERVER_URL + htmlPath);
  } else {
    contentWindow.loadFile(join(process.env.PWD || '', htmlPath));
  }

  contentWindow.webContents.openDevTools();
}

export function setupContentWindowListener(): void {
  //
}

export function setupShowWindowListener(window: BrowserWindow): void {
  ipcMain.on(EVENTS.WINDOW_DISPLAY_CONTENT_WINDOW, (_, show: boolean) => {
    if (show) {
      window.show();
    } else {
      window.hide();
    }

    window.webContents.send('window-display', show);
  });

  ipcMain.on(EVENTS.WINDOW_TOGGLE_CONTENT_WINDOW, () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });
}
