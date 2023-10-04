# Desktop-orc-translator

<img style="width: 100%;" src="./preview/ocr.png" />

> OCR screenshot mode. press `Alt+D` to invoke. press `Enter` to confirm clip.

<img style="width: 100%;" src="./preview/translate.png" />

> ocr and translate content show

## 🚀Tech Stacks

- Develop by react and built by vite.
- Format code style by prettier and eslint.
- Configured electron-builder and husky and commitlint.
- Using google cloud api for OCR and translating.

## 📖Usage

### Desktop OCR.

- [x] press `Alt+D` to invoke a screenshot screen.

- [x] press `Enter` to confirm screen content clip.

- [x] ocr results and translation will be shown in a popup window.

### Translation with OCR result

- [x] send OCR results to translation function.

### Dev

```shell
# Install
yarn
```

```shell
# Start
yarn dev
```

### Package

```shell
# ENV: dev | prod
yarn build:[ENV]
```

## TODO

- [] more UI implementation

- [] enable OCR and translate config

- [] more feature on screenshot stage. e.g. supporting a float toolbar aside the clip area for multiple post-process.
