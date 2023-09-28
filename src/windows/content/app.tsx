import { CloseOutlined } from '@ant-design/icons';
import { Description } from '@renderer/components/description';
import { TextBlock } from '@renderer/components/text-block';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { EVENTS } from '../../../electron/constants';
import Reset from '../../assets/styles/reset';
import { colorMap, markMap } from './constants';
import { useTextAnalyze, useTranslate } from './hooks';
import { WordType } from './language-analysis';

function App(): JSX.Element {
  const show = useContentWindowInvoke();

  return (
    <>
      <ContentContainer show={show} />
      <Reset />
    </>
  );
}

function useContentWindowInvoke() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = (_, show: boolean) => {
      console.log('window display in content');
      setShow(show);
    };

    window.electronApi.ipcRenderer.on('window-display', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener('window-display', handler);
    };
  }, []);

  return show;
}

const Container = styled.div`
  .modal-content {
    width: 100%;
    height: 100%;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    box-sizing: border-box;
    padding: 20px;

    padding-top: 30px;

    .original-text {
      font-size: 14px;
    }

    .chinese {
      font-size: 14px;
    }

    .close-icon {
      position: absolute;
      top: 5px;
      right: 5px;

      font-size: 15px;

      cursor: pointer;
    }
  }
`;

function ContentContainer({ show }: { show: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [ocrText, setOcrText] = useState('');

  useEffect(() => {
    const handler = () => {
      const content = window.api.getOCRtext();
      console.log('get ocr content', content);
      setOcrText(content);
    };

    console.log('register event', window.electronApi);

    window.electronApi.ipcRenderer.on('ocr-content-received', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener(
        'ocr-content-received',
        handler
      );
    };
  }, []);

  // do text analyze
  const textAnalyzed = useTextAnalyze(ocrText);

  // input originalText and output translated text
  const translatedText = useTranslate(ocrText);

  const getColor = (wordType: string) => colorMap[wordType];

  const getMark = (wordType: string) => {
    if (wordType === WordType.MARK) {
      return '';
    }
    return markMap[wordType];
  };

  function handleHideWindow() {
    window.api.displayContentWindow(false);
  }

  return (
    <Container ref={containerRef} className={`video-preview-translate-modal`}>
      <div className={'modal-content'}>
        <CloseOutlined
          onClick={() => handleHideWindow()}
          className={'close-icon'}
          rev={undefined}
        />

        <Description
          text={ocrText}
          lang={'ja'}
          className="original-text"
          header={'original text'}
        >
          {textAnalyzed.map((text, index) => (
            <TextBlock
              key={index}
              word={text.word}
              pronunciation={text.pronunciation}
              mark={getMark(text.pos)}
              color={getColor(text.pos)}
            />
          ))}
        </Description>

        <Description
          text={translatedText}
          lang={'zh'}
          className="chinese"
          header={'chinese'}
        >
          {translatedText}
        </Description>
      </div>
    </Container>
  );
}

export default App;
