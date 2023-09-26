import { createWorker } from 'tesseract.js';

const worker = await createWorker({
  logger: (m) => console.log(m),
});

type Lang = 'jpn' | 'eng';

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
  console.log('originText', text);
  const ntext = postProcessText(text);
  console.log(ntext);
}

const numList = '①②③④⑤⑥⑦⑧⑨'.split('');

function postProcessText(text: string) {
  for (const index in numList) {
    text = text.replaceAll(numList[index], index + 1);
  }
  return text;
}
