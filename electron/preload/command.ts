import { ipcRenderer } from 'electron';

import { EVENTS } from '../constants';

export const setDisplayScreenshotWindow = (show: boolean) => {
  ipcRenderer.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', show);
};
