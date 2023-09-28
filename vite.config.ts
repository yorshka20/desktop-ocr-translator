import react from '@vitejs/plugin-react';
import { join, resolve } from 'path';
import { type UserConfig, defineConfig } from 'vite';
import electron from 'vite-electron-plugin';
import { customStart, loadViteEnv } from 'vite-electron-plugin/plugin';
import renderer from 'vite-plugin-electron-renderer';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command }) => {
  const sourcemap = command === 'serve' || !!process.env.VSCODE_DEBUG;
  console.log('rollupoptions', join(__dirname, 'src'));
  return {
    build: {
      outDir: 'dist-electron/renderer',
      rollupOptions: {
        input: {
          index: join(__dirname, 'src/windows/main/index.html'),
          screenshot: join(__dirname, 'src/windows/screenshot/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      svgr(),
      electron({
        include: ['electron'],
        transformOptions: {
          sourcemap,
        },
        plugins: [
          ...(process.env.VSCODE_DEBUG
            ? [
                // Will start Electron via VSCode Debug
                customStart(() =>
                  console.log(
                    /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
                  )
                ),
              ]
            : []),
          // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
          loadViteEnv(),
        ],
      }),
      // Use Node.js API in the Renderer-process
      renderer({
        nodeIntegration: false,
      }),
    ],
  };
}) as UserConfig;
