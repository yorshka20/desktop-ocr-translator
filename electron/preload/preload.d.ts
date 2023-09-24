import { electronAPI } from '@electron-toolkit/preload';

import { type API } from './index';

declare global {
  interface Window {
    electronApi: typeof electronAPI;
    api: API;
  }
}
