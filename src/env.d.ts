/// <reference types="vite/client" />

declare module 'mecab-wasm' {
  export function waitReady(): Promise<any>;
  export function query(str: string): MecabQueryItem[];
}

interface MecabQueryItem {
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
