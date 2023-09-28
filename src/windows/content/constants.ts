import { WordType } from './language-analysis';

// add color padding for word block
export const colorMap = {
  [WordType.ADJ]: '#f0cae0',
  [WordType.ADV]: '#d696eb',
  [WordType.AUX]: '#7cdbdd',
  [WordType.AUX_VERB]: '#f6f7f4',
  [WordType.NOUN]: '#fff44d',
  [WordType.VERB]: '#aee07a',
  [WordType.MARK]: '',
  [WordType.PREX]: '#f6f7f4',
  [WordType.CONJ]: '#f6f7f4',
};

// show text type for text block
export const markMap = {
  [WordType.ADJ]: 'adj.',
  [WordType.ADV]: 'adv.',
  [WordType.AUX]: 'aux.',
  [WordType.AUX_VERB]: 'av.',
  [WordType.NOUN]: 'n.',
  [WordType.VERB]: 'v.',
  [WordType.MARK]: 'm.',
  [WordType.PREX]: 'pf.', // head connection
  [WordType.CONJ]: 'c.', // conjunction
};
