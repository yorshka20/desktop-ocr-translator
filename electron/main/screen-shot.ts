import { desktopCapturer, ipcMain, screen } from 'electron';

export function setupScreenShot(): void {
  ipcMain.handle('screenshot', async () => {
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
