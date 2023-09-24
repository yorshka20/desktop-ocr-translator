import { createWorker } from 'tesseract.js';

const worker = await createWorker({
  logger: (m) => console.log(m),
});

export async function init(lang = 'eng') {
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
}

export async function changeOCRLang(lang: string) {
  await worker.terminate();

  await worker.loadLanguage(lang);
  await worker.initialize(lang);
}

export async function ocrText(img: string) {
  const {
    data: { text },
  } = await worker.recognize(img);
  console.log(text);
}
