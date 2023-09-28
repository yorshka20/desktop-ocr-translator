const defaultStoreValue = {
  'screen-scale-factor': 1,
  'google-translate-api-key': '',
  'ocr-content': '',
  'translate-content': '',
};

type StorageType = typeof defaultStoreValue;

const storage = { ...defaultStoreValue };

export const store = {
  get<T extends keyof StorageType>(key: T): StorageType[T] {
    return storage[key];
  },
  set<T extends keyof StorageType>(key: T, val: StorageType[T]): void {
    storage[key] = val;
  },
};
