import { type Lang } from 'electron/main/services/translate';
import { useEffect, useState } from 'react';

import { type MecabQueryItem, analyzeSentence } from './language-analysis';

export function useTranslate(text: string, lang: Lang) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!text) {
      return;
    }

    window.api.translateText(text, lang).then((content) => {
      setContent(content);
    });
  }, [text, lang]);

  return content;
}

export function useOCRContent() {
  const [ocrText, setOcrText] = useState('translate content');

  useEffect(() => {
    const handler = (_, content: string) => {
      setOcrText(content);

      window.api.displayContentWindow(true);
    };

    window.electronApi.ipcRenderer.on('ocr-content-received', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener(
        'ocr-content-received',
        handler
      );
    };
  }, []);

  return ocrText;
}

export function useTextAnalyze(text: string) {
  const [textAnalyzed, setTextAnalyzed] = useState<MecabQueryItem[]>([]);
  useEffect(() => {
    if (!text) return;

    // do analyzeSentence
    analyzeSentence(text).then((analyzedContent) => {
      setTextAnalyzed(analyzedContent);
    });
  }, [text]);

  return textAnalyzed;
}

export function useContentWindowInvoke() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = (_, show: boolean) => {
      setShow(show);
    };

    window.electronApi.ipcRenderer.on('window-display', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener('window-display', handler);
    };
  }, []);

  return show;
}
