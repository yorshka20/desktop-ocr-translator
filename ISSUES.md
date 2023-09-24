## record some issues occurred in developing process.

- you should do the screen capture in main process because it's limited by electron.

- you cannot expose electron/main api to renderer process, even with preload script. the unsupported api will be undefined. instead, you can expose these api to preload and use it in preload script.

- content to be sent between main and renderer process should be able to be cloned by JSON.

- when capture screen in macos, you should get the access right of screen from system. you should do it by systemPreferences api. while in windows, there is no such a problem, you will always have the access right of screen capturing.
