import { createWorker } from 'tesseract.js';

const worker = await createWorker({
  logger: (m) => console.log(m),
});

type Lang = 'jpn' | 'eng' | 'zh';

export async function init(lang: Lang = 'eng') {
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
}

export async function changeOCRLang(lang: Lang) {
  await worker.terminate();

  await worker.loadLanguage(lang);
  await worker.initialize(lang);
}

export async function ocrText(img: string) {
  const data = await worker.recognize(img);
  console.log(data);
  const {
    data: { text },
  } = data;
  const nText = postProcessText(text);

  return nText;
}

const replaceMap: Array<[string, string]> = [
  ['①', '1'],
  ['②', '2'],
  ['③', '3'],
  ['④', '4'],
  ['⑤', '5'],
  ['⑥', '6'],
  ['⑦', '7'],
  ['⑧', '8'],
  ['⑨', '9'],
];

function postProcessText(text: string) {
  for (const [key, value] of replaceMap) {
    text = text.replaceAll(key, value);
  }
  return text;
}

const translateLangMap: Record<Lang, string> = {
  jpn: 'ja',
  eng: 'en',
  zh: 'zh',
};

export async function handleOCR(img: string, lang: Lang = 'zh') {
  // const text = await window.api.ocrTextOnline(img);
  // console.log('ocrOnline', text);
  const textContent = await ocrText(img);

  console.log('textContent');
  console.log(textContent);

  const result = await window.api.translateText(
    textContent,
    translateLangMap[lang] as any
  );

  console.log('translate result', result);
}
