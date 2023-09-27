// Imports the Google Cloud client library
import { v2 } from '@google-cloud/translate';

import { TRANSLATE_STORAGE_KEY } from '../../constants';

// Creates a client
const translate = new v2.Translate();

type Lang = 'zh' | 'ja' | 'en';

const storage = new Map<string, string>();

function initCache() {
  const content = localStorage.getItem(TRANSLATE_STORAGE_KEY);
  if (!content) {
    return;
  }

  const contentObj = JSON.parse(content);
  for (const pair of contentObj) {
    const [key, val] = [...pair];
    storage.set(key, val);
  }
}

function updateStorage(text: string, translations: string) {
  storage.set(text, translations);

  if (storage.size > 100) {
    const lens = [...storage.entries()].splice(0, 100);
    for (const [key, val] of lens) {
      storage.set(key, val);
    }
  }

  const content = [...storage.entries()];
  localStorage.setItem(TRANSLATE_STORAGE_KEY, JSON.stringify(content));
}

initCache();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'The target language, e.g. ru';

export async function translateText(text: string, target: Lang = 'zh') {
  if (storage.has(text)) {
    return storage.get(text);
  }

  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.

  const [translations] = await translate.translate(text, target);

  // do it in spare time.
  setTimeout(() => {
    updateStorage(text, translations);
  });

  return translations;
}
