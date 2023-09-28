import styled from 'styled-components';

interface TextBlockProps {
  word: string;
  pronunciation: string;
  color: string;
  mark: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  position: relative;

  margin-right: 5px;

  .pronunciation {
    font-size: 12px;
  }

  .word-text {
    font-size: 16px;

    z-index: 2;

    &.empty {
      margin-top: 17px;
    }
  }

  .color-padding {
    width: 100%;
    height: 10px;

    z-index: 1;

    box-sizing: border-box;
    border-radius: 3px;

    margin-top: -10px;
  }

  .word-type {
    color: #c49263;
    font-size: 12px;
  }
`;

export function TextBlock(props: TextBlockProps) {
  const { word, pronunciation, color, mark } = props;

  return (
    <Container>
      <div className={'pronunciation'}>{pronunciation}</div>
      <div className={`word-text ${!pronunciation && 'empty'}`}>{word}</div>
      <div
        className={'color-padding'}
        style={{ background: color || 'inherit' }}
      />
      <div className={'word-type'} style={{ height: !mark ? 17 : 'auto' }}>
        {mark}
      </div>
    </Container>
  );
}
