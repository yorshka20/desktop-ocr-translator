import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { store } from './store';

// Custom APIs for renderer
const api = {
  store,
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
