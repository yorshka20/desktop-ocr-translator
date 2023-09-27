const defaultStoreValue = {
  'screen-scale-factor': 1,
  'google-translate-api-key': '',
};

type StorageType = typeof defaultStoreValue;

const storage = { ...defaultStoreValue };

export const store = {
  get<T extends keyof StorageType>(key: T): StorageType[T] {
    return storage[key];
  },
  set<T extends keyof StorageType>(property: T, val: StorageType[T]): void {
    // ipcRenderer.send('electron-store-set', property, val);
    storage[property] = val;
  },
};
