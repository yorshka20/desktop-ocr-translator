import vision from '@google-cloud/vision';

export async function ocrTextOnline(img: string) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = 'Local image file, e.g. /path/to/image.png';

  // Performs text detection on the local file
  const [result] = await client.textDetection({
    image: {
      content: img,
    },
    imageContext: {
      languageHints: ['ja'],
    },
  });
  const detections = result.textAnnotations || [];
  console.log('Text:');
  detections.forEach((text) => console.log(text));

  return detections;
}
