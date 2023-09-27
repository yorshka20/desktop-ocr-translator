import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';
import { writeFileSync } from 'fs';

import { getScreenScaleFactor } from './command';
import { store } from './store';

// Custom APIs for renderer
const api = {
  store,
  saveImg: (dataURI: string) => {
    if (!dataURI) return;

    const binary = atob(dataURI.split(',')[1]);
    const array: number[] = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    new Promise(() =>
      writeFileSync(`screenshot/${Date.now()}.png`, new Uint8Array(array))
    );
  },
  getScaleFactor: () => store.get('screen-scale-factor'),
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

async function initConfig() {
  // get and store the screen scaleFactor. will be used in screenshot.
  const factor = await getScreenScaleFactor();
  store.set('screen-scale-factor', factor);
}

initConfig();
