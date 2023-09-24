import { globalShortcut, ipcMain } from 'electron';

import { EVENTS } from '../constants';

const shortCutList = [
  {
    key: 'Alt+D',
    func: () => {
      console.log('show something');
      ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', true);

      globalShortcut.register('ESC', () => {
        console.log('esc keydown');
        ipcMain.emit(EVENTS.WINDOW_DISPLAY_SCREEN_SHOT, '', false);
        globalShortcut.unregister('ESC');
      });
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
