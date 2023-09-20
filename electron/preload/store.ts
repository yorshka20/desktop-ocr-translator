import { ipcRenderer } from 'electron';

const storage = new Map<string, any>();

export default {
  get(key: string) {
    return storage.get(key);
  },
  set(property: string, val): void {
    ipcRenderer.send('electron-store-set', property, val);
    storage.set(property, val);
  },
};
