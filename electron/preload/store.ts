type StorageValueType = string | number | boolean | undefined;

const storage = new Map();

export const store = {
  get(key: string): StorageValueType {
    return storage.get(key);
  },
  set(property: string, val: StorageValueType): void {
    // ipcRenderer.send('electron-store-set', property, val);
    storage.set(property, val);
  },
};
