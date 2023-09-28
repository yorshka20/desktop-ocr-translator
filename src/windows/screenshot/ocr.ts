type Lang = 'jpn' | 'eng' | 'zh';

const translateLangMap: Record<Lang, string> = {
  jpn: 'ja',
  eng: 'en',
  zh: 'zh',
};

export async function handleOCR(img: string, lang: Lang = 'zh') {
  const textContent = await window.api.ocrTextOnline(img, 'ja');

  console.log('textContent');
  console.log(textContent);

  const result = await window.api.translateText(
    textContent,
    translateLangMap[lang] as any
  );

  console.log('translate result', result);
}
