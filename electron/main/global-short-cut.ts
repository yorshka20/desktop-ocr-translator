import { globalShortcut, ipcMain } from 'electron';

import { EVENTS } from '../constants';

type ShortCutPair = {
  key: string;
  fn: () => void;
};

const shortCutList: ShortCutPair[] = [
  {
    key: 'Alt+D',
    fn: () => {
      ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT_WINDOW, '', true);

      globalShortcut.register('ESC', () => {
        ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT_WINDOW, '', false);
        globalShortcut.unregister('ESC');
      });
    },
  },
  {
    key: 'Alt+Q',
    fn: () => {
      ipcMain.emit(EVENTS.WINDOW_TOGGLE_DISPLAY_SCREEN_SHOT_WINDOW);
    },
  },
  {
    key: 'Alt+W',
    fn: () => {
      ipcMain.emit(EVENTS.WINDOW_TOGGLE_CONTENT_WINDOW);
    },
  },
];

export function registerGlobalShortcut(): void {
  for (const { key, fn } of shortCutList) {
    const ret = globalShortcut.register(key, fn);

    if (!ret) {
      console.log('registration failed: ', key);
    }

    // Check whether a shortcut is registered.
    console.log(
      `register shortcut: ${key}, `,
      globalShortcut.isRegistered(key)
    );
  }
}

export function unregisterGlobalShortcut(): void {
  globalShortcut.unregisterAll();
}
