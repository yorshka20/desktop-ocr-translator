import { ipcRenderer } from 'electron';

import { EVENTS } from '../constants';

export const setDisplayScreenshotWindow = (show: boolean) => {
  ipcRenderer.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', show);
};

export const getScreenScaleFactor = async () => {
  const factor = await ipcRenderer.invoke(EVENTS.TASK_GET_SCREEN_SCALE_FACTOR);
  return factor;
};
