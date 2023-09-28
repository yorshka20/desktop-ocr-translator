import { useEffect, useState } from 'react';

import { type MecabQueryItem, analyzeSentence } from './language-analysis';

export function useTranslate(text: string) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    if (!text) {
      return;
    }

    window.api.translateText(text, 'ja').then((content) => {
      setContent(content);
    });
  }, [text]);

  return content;
}

export function useTextAnalyze(text: string) {
  const [textAnalyzed, setTextAnalyzed] = useState<MecabQueryItem[]>([]);
  useEffect(() => {
    if (!text) return;

    // do analyzeSentence
    const analyzedContent = analyzeSentence(text);
    setTextAnalyzed(analyzedContent);
  }, [text]);

  return textAnalyzed;
}
