// Imports the Google Cloud client library
import { v2 } from '@google-cloud/translate';

// Creates a client
const translate = new v2.Translate();

export type Lang = 'zh' | 'ja' | 'en';

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'The target language, e.g. ru';

export async function translateText(text: string, target: Lang = 'zh') {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.

  const [translations] = await translate.translate(text, target);

  return translations;
}
