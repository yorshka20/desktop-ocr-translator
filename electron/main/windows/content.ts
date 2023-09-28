import { is } from '@electron-toolkit/utils';
import { BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';

import { DEV_SERVER_URL, EVENTS, preload } from '../../constants';
import { getWindowHtmlPath } from '../../utils';

export function createContentWindow(
  getWindow: (name: string) => BrowserWindow
): BrowserWindow {
  const contentWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 400,
    minHeight: 600,
    frame: true,
    autoHideMenuBar: true,
    titleBarStyle: 'default',
    show: false, // do not show window by default
    webPreferences: {
      preload,
      sandbox: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  // todo:
  getWindow;

  // hide traffic light. you can only close the window by ctrl+w
  if (process.platform === 'darwin') {
    contentWindow.setWindowButtonVisibility(false);
  }

  // using command to show and hide window. do not show window by default
  contentWindow.once('ready-to-show', () => {
    setupShowWindowListener(contentWindow);
    contentWindow.show();
  });

  contentWindow.on('close', (e) => {
    // do not really close the window. just hide the window.
    e.preventDefault();

    contentWindow.hide();
  });

  // add screen-shot listener
  setupContentWindowListener(contentWindow);

  const htmlPath = getWindowHtmlPath('content');

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && DEV_SERVER_URL) {
    contentWindow.loadURL(DEV_SERVER_URL + htmlPath);
  } else {
    contentWindow.loadFile(join(process.env.PWD || '', htmlPath));
  }

  contentWindow.webContents.openDevTools();

  return contentWindow;
}

export function setupContentWindowListener(window: BrowserWindow): void {
  ipcMain.on(EVENTS.CHANNEL_OCT_CONTENT_EMIT, (_, text: string) => {
    console.log('ocr content in content window');
    window.webContents.send('ocr-content-received', text);
  });
}

export function setupShowWindowListener(window: BrowserWindow): void {
  ipcMain.on(EVENTS.WINDOW_DISPLAY_CONTENT_WINDOW, (_, show: boolean) => {
    if (show) {
      window.show();
    } else {
      window.hide();
    }
  });

  ipcMain.on(EVENTS.WINDOW_TOGGLE_CONTENT_WINDOW, () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });
}
