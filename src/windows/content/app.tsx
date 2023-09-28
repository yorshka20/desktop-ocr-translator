import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { Description } from '@renderer/components/description';
import { TextBlock } from '@renderer/components/text-block';
import { useRef } from 'react';
import styled from 'styled-components';

import Reset from '../../assets/styles/reset';
import { colorMap, markMap } from './constants';
import {
  useContentWindowInvoke,
  useOCRContent,
  useTextAnalyze,
  useTranslate,
} from './hooks';
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

const Container = styled.div`
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

  .setting-icon {
    position: absolute;
    top: 5px;
    right: 10px;

    font-size: 15px;

    cursor: pointer;
  }

  /* .close-icon {
    position: absolute;
    top: 5px;
    right: 5px;

    font-size: 15px;

    cursor: pointer;
  } */
`;

function ContentContainer({ show }: { show: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  show;

  const ocrText = useOCRContent();

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

  function handleSetting() {
    window.api.displayMainWindow(true);
  }

  return (
    <Container draggable={true} ref={containerRef}>
      <SettingOutlined
        onClick={handleSetting}
        className={'setting-icon'}
        rev={undefined}
      />

      {/* <CloseOutlined
        onClick={handleHideWindow}
        className={'close-icon'}
        rev={undefined}
      /> */}

      <Description
        text={ocrText}
        lang={'ja'}
        className="original-text"
        header={'original text'}
      >
        {textAnalyzed.length
          ? textAnalyzed.map((text, index) => (
              <TextBlock
                key={index}
                word={text.word}
                pronunciation={text.pronunciation}
                mark={getMark(text.pos)}
                color={getColor(text.pos)}
              />
            ))
          : undefined}
      </Description>

      <Description
        text={translatedText}
        lang={'zh'}
        className="chinese"
        header={'chinese'}
      >
        {translatedText}
      </Description>
    </Container>
  );
}

export default App;
