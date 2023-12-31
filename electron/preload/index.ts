import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { ocrTextOnline } from '../main/services/ocr';
import { translateText } from '../main/services/translate';
import {
  displayContentWindow,
  displayMainWindow,
  doScreenshot,
  getOCRtext,
  getScreenScaleFactor,
  quitScreenShot,
  receiveOCRtext,
  saveImg,
} from './command';
import { store } from './store';

// Custom APIs for renderer
const api = {
  doScreenshot,
  getScaleFactor,
  ocrTextOnline,
  quitScreenShot,
  saveImg,
  store,
  translateText,
  displayContentWindow,
  receiveOCRtext,
  getOCRtext,
  displayMainWindow,
};

export type API = typeof api;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electronApi = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

// prepare some config which is necessary for renderer process.

function getScaleFactor() {
  return store.get('screen-scale-factor');
}

async function initConfig() {
  // get and store the screen scaleFactor. will be used in screenshot.
  const factor = await getScreenScaleFactor();
  store.set('screen-scale-factor', factor);
}

initConfig();
