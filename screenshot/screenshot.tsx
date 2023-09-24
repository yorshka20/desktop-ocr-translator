import { Button } from 'antd';
import { nativeImage } from 'electron';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import styled from 'styled-components';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <App />
  </Router>
);

const Container = styled.div`
  border: 1px solid red;
  box-sizing: border-box;
  margin: 5px;

  background-color: transparent;

  width: 100vw;
  height: 100vh;
`;

function App() {
  const [imgData, setImgData] = useState('');

  const handleClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: 'screen1:0',
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });
    if (stream) {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (canvas) {
        const context = canvas.getContext('2d');
        context?.drawImage(stream, 0, 0);
      }
    }
  };

  return (
    <Container>
      screen shot page
      <Button onClick={handleClick}>screenshot </Button>
      <canvas id="canvas" width={1280} height={800} />
    </Container>
  );
}
