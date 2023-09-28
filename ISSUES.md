## record some issues occurred in developing process.

- for multiple windows app using vite.js, you should make separate folder for different window because vite.js will use the html file as the entry of your app.

- in this project, I put the original main page at the root of src, the main page of this app will start from index.html. the second page will start from screenshot/index.html, this is a different entry of this app.

- you should do the screen capture in main process because it's limited by electron.

- you cannot expose electron/main api to renderer process, even with preload script. the unsupported api will be undefined. instead, you can expose these api to preload and use it in preload script.

- content to be sent between main and renderer process should be able to be cloned by JSON.

- when capture screen in macos, you should get the access right of screen from system. you should do it by systemPreferences api. while in windows, there is no such a problem, you will always have the access right of screen capturing.

- google-cloud libs cannot be used in renderer process, put it in main process and expose the function via preload.

- it's better to keep all ipc methods in preload script. you don't need to do it in renderer process, so just do it in main process.

- circulated import is very annoying, and sometimes this error will occurred in the form of different error type.

- you can not use `ipcMain` in preload script.

- `ipcRenderer` use `send` method to emit message, not `emit`. you will not receive anything when using `ipcRenderer.emit`.
