import { ipcRenderer } from 'electron';
import { writeFileSync } from 'fs';

import { EVENTS } from '../constants';

export const setDisplayScreenshotWindow = (show: boolean) => {
  ipcRenderer.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', show);
};

export const getScreenScaleFactor = async () => {
  const factor = await ipcRenderer.invoke(EVENTS.TASK_GET_SCREEN_SCALE_FACTOR);
  return factor;
};

export function saveImg(dataURI: string) {
  if (!dataURI) return;

  const binary = atob(dataURI.split(',')[1]);
  const array: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  new Promise(() =>
    writeFileSync(`screenshot/${Date.now()}.png`, new Uint8Array(array))
  );
}
