import { createPromise } from '@renderer/utils';
import Mecab from 'mecab-wasm';
import { toHiragana } from 'wanakana';

export interface MecabQueryItem {
  word: string;
  pos: string;
  pos_detail1: string;
  pos_detail2: string;
  pos_detail3: string;
  conjugation1: string;
  conjugation2: string;
  dictionary_form: string;
  reading: string;
  pronunciation: string;
}

const [resolve, p] = createPromise();

// to fix the production bundle error with parcel, we should fix the parcel/runtime-js in packageJson with resolutions.
Mecab.waitReady().then(() => resolve());

export async function analyzeSentence(content: string) {
  await p;

  const result = Mecab.query(content);

  return result.map((word) => {
    const obj = {
      ...word,
    };

    if (
      obj.pos === WordType.AUX ||
      obj.pos === WordType.AUX_VERB ||
      obj.pos === WordType.MARK
    ) {
      obj.pronunciation = '';
    }

    obj.pronunciation = toHiragana(obj.pronunciation);

    console.log('analyze', obj.word, obj.pos, obj.pronunciation);

    return obj;
  });
}

export enum WordType {
  NOUN = '名詞',
  AUX = '助詞',
  VERB = '動詞',
  AUX_VERB = '助動詞',
  ADJ = '形容詞',
  ADV = '副詞',
  MARK = '記号',
  PREX = '接頭詞',
  CONJ = '連体詞',
}
