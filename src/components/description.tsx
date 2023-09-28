import { CopyOutlined, SoundOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  header: string;
  className?: string;
  text?: string;
  lang?: string;
}

const Container = styled.div`
  .description {
    background-color: rgb(222, 222, 222);
    border-radius: 5px;
    margin-bottom: 30px;

    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    font-size: 14px;

    .header {
      width: 100%;
      height: 2rem;

      box-sizing: border-box;
      padding: 0 2px;

      border-radius: 5px 5px 0 0;

      align-items: center;

      background-color: rgb(212, 212, 212);
    }

    .content {
      font-size: 16px;

      padding: 2px;

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
    }

    .tool {
      margin: 10px 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      box-sizing: border-box;
      padding-left: 10px;

      svg {
        font-size: 16px;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
`;

export function Description({
  children,
  header,
  text,
  lang,
  className = '',
}: Props) {
  const handleSpeak = () => {
    if (!text || !lang) return;
    const content = new SpeechSynthesisUtterance(text);
    content.lang = lang;
    window.speechSynthesis.speak(content);
  };

  return (
    <Container className={`description ${className}`}>
      <div className={'header'}>{header}</div>
      <div className="content">{children}</div>

      <div className={'tool'}>
        <SoundOutlined
          onClick={handleSpeak}
          className={'speak'}
          rev={undefined}
        />
        <CopyOutlined className={'copy'} rev={undefined} />
      </div>
    </Container>
  );
}
