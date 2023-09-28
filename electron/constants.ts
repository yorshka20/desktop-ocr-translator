import { join } from 'path';

export enum EVENTS {
  // main window
  WINDOW_DISPLAY_MAIN_WINDOW = 'display-main-window',
  WINDOW_TOGGLE_MAIN_WINDOW = 'toggle-main-window',

  // screenshot window
  WINDOW_DISPLAY_SCREEN_SHOT_WINDOW = 'display-screen-shot-window',
  WINDOW_TOGGLE_DISPLAY_SCREEN_SHOT_WINDOW = 'toggle-screen-shot-window',

  // content window
  WINDOW_DISPLAY_CONTENT_WINDOW = 'display-content-window',
  WINDOW_TOGGLE_CONTENT_WINDOW = 'toggle-content-window',

  // general task
  TASK_DO_SCREEN_SHOT = 'screen-shot',
  TASK_GET_SCREEN_SCALE_FACTOR = 'get-screen-scale-factor',

  // message channel
  CHANNEL_OCT_CONTENT_EMIT = 'ocr_content_channel',
  CHANNEL_OCT_CONTENT_EMIT_2 = 'ocr_content_channel-2',
}

export const TRANSLATE_STORAGE_KEY = 'translate-cache';

export const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

export const preload = join(__dirname, './preload/index.js');
