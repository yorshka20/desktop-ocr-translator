import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';

import { EVENTS } from '../constants';

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
