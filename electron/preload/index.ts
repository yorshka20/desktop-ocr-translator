import { contextBridge, desktopCapturer, systemPreferences } from 'electron';

import { electronAPI } from '@electron-toolkit/preload';
import { store } from './store';

// Custom APIs for renderer
const api = {
  store,
  systemPreferences,
};

export type API = typeof api;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('desktopCapturer', desktopCapturer);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electronApi = electronAPI;
  // @ts-ignore (define in dts)
  window.desktopCapturer = desktopCapturer;
  // @ts-ignore (define in dts)
  window.api = api;
}
