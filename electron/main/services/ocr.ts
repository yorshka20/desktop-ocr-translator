import vision from '@google-cloud/vision';

type LangHintType = 'ja' | 'en' | 'zh';

export async function ocrTextOnline(
  img: string,
  langHint: LangHintType = 'ja'
) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  return 'ocr content';

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = 'Local image file, e.g. /path/to/image.png';

  // Performs text detection on the local file
  const [result] = await client.textDetection({
    image: {
      // use base64 encode img. should cut out the head part.
      content: Buffer.from(img.replace('data:image/png;base64,', ''), 'base64'),
    },
    imageContext: {
      languageHints: [langHint],
    },
  });
  // there are textAnnotations and fullTextAnnotation. we only need full text.
  const detection = result.fullTextAnnotation;
  const text = detection?.text || '';

  return text;
}
