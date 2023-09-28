type Lang = 'ja' | 'en' | 'zh';

export async function handleOCR(img: string, lang: Lang = 'zh') {
  const textContent = await window.api.ocrTextOnline(img, lang as any);

  console.log('ocr textContent: ');
  console.log(textContent);

  // const result = await window.api.translateText(
  //   textContent,
  //   translateLangMap[lang] as any
  // );

  window.api.receiveOCRtext(textContent);
}
