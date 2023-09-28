import { is } from '@electron-toolkit/utils';
import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';
import { join } from 'path';

import { DEV_SERVER_URL, EVENTS, preload } from '../../constants';
import { getWindowHtmlPath } from '../../utils';

export function createScreenShotWindow(): void {
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

  const htmlPath = getWindowHtmlPath('screenshot');

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && DEV_SERVER_URL) {
    screenShotWindow.loadURL(DEV_SERVER_URL + htmlPath);
  } else {
    screenShotWindow.loadFile(join(process.env.PWD || '', htmlPath));
  }

  // screenShotWindow.webContents.openDevTools();
}

export function setupScreenShotListener(): void {
  // it's a sync method. return with a promise resolve.
  ipcMain.handle(EVENTS.TASK_DO_SCREEN_SHOT, async () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const { scaleFactor } = primaryDisplay;
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        height: height * scaleFactor,
        width: width * scaleFactor,
      },
    });

    const content = sources[0].thumbnail.toDataURL();

    return content;
  });

  ipcMain.handle(EVENTS.TASK_GET_SCREEN_SCALE_FACTOR, () => {
    return screen.getPrimaryDisplay().scaleFactor;
  });
}

export function getScreenSize(): Electron.Size {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return { width, height };
}

export function setupShowWindowListener(window: BrowserWindow): void {
  ipcMain.on(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT_WINDOW, (_, show: boolean) => {
    if (show) {
      window.setKiosk(true);
      window.show();
    } else {
      window.hide();
      window.setKiosk(false);
    }

    window.webContents.send('window-display', show);
  });

  ipcMain.on(EVENTS.WINDOW_TOGGLE_DISPLAY_SCREEN_SHOT_WINDOW, () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });
}
