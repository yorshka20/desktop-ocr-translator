import { colorMap, markMap } from './constants';
import { WordType } from './language-analysis';

export const getColor = (wordType: string) => colorMap[wordType];

export const getMark = (wordType: string) => {
  if (wordType === WordType.MARK) {
    return '';
  }
  return markMap[wordType];
};
