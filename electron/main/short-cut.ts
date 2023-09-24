import { globalShortcut, ipcMain } from 'electron';

import { EVENTS } from '../constants';

type ShortCutPair = {
  key: string;
  func: () => void;
};

const shortCutList: ShortCutPair[] = [
  {
    key: 'Alt+D',
    func: () => {
      ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', true);

      globalShortcut.register('ESC', () => {
        ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', false);
        globalShortcut.unregister('ESC');
      });
    },
  },
  {
    key: 'Alt+Q',
    func: () => {
      ipcMain.emit(EVENTS.WINDOW_TOGGLE_DISPLAY_SCREEN_SHOT);
    },
  },
];

export function registerGlobalShortcut(): void {
  for (const { key, func } of shortCutList) {
    const ret = globalShortcut.register(key, func);

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
