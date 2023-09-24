import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';

import { EVENTS } from '../constants';

export function setupScreenShotListener(): void {
  // it's a sync method. return with a promise resolve.
  ipcMain.handle(EVENTS.TASK_DO_SCREEN_SHOT, async () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        height,
        width,
      },
    });

    const content = sources[0].thumbnail.toDataURL();
    return content;
  });
}

export function getScreenSize(): Electron.Size {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return { width, height };
}

export function setupShowWindowListener(window: BrowserWindow): void {
  ipcMain.on(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, (_, show: boolean) => {
    console.log('setupShowWindowListener', show);
    if (show) {
      window.show();
    } else {
      window.hide();
    }

    window.webContents.send('window-display', show);
  });

  ipcMain.on(EVENTS.WINDOW_TOGGLE_DISPLAY_SCREEN_SHOT, () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });
}
