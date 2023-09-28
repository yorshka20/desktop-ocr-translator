import { ipcMain, ipcRenderer } from 'electron';
import { writeFileSync } from 'fs';

import { EVENTS } from '../constants';

export const setDisplayScreenshotWindow = (show: boolean) => {
  ipcRenderer.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT_WINDOW, '', show);
};

export const getScreenScaleFactor = async () => {
  const factor = await ipcRenderer.invoke(EVENTS.TASK_GET_SCREEN_SCALE_FACTOR);
  return factor;
};

export function saveImg(dataURI: string): string {
  if (!dataURI) return '';

  const binary = atob(dataURI.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  const name = `${Date.now()}`;
  writeFileSync(`screenshot/${name}.png`, new Uint8Array(array));
  return name;
}

export function quitScreenShot() {
  ipcRenderer.send(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT_WINDOW, '', false);
}

export async function doScreenshot() {
  return await ipcRenderer.invoke(EVENTS.TASK_DO_SCREEN_SHOT);
}

export function showContentWindow() {
  ipcMain.emit(EVENTS.WINDOW_DISPLAY_CONTENT_WINDOW);
}
