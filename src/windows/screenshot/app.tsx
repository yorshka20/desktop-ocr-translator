import { type Position, RectCutArea } from '@renderer/components/rectCutArea';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { EVENTS } from '../../../electron/constants';
import { init, ocrText } from './ocr';

// setup ocr worker
init('jpn');

const Container = styled.div`
  margin: 0;

  background-color: transparent;

  width: 100vw;
  height: 100vh;

  position: relative;

  overflow: hidden;

  canvas {
    width: 100%;
    height: 100%;
  }
`;

export default function App() {
  const [windowDisplay, setWindowDisplay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = (_, show: boolean): void => {
      setWindowDisplay(show);
    };
    window.electronApi.ipcRenderer.on('window-display', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener('window-display', handler);
    };
  }, []);

  useEffect(() => {
    async function screenshot(): Promise<void> {
      // const result = await window.electronApi.ipcRenderer.invoke(
      //   'check-screen'
      // );
      // console.log('check screen ', result);

      // systemPreferences.askForMediaAccess(mediaType);

      try {
        const dataUrl: string = await window.electronApi.ipcRenderer.invoke(
          EVENTS.TASK_DO_SCREEN_SHOT
        );
        const canvas = canvasRef.current;
        if (canvas) {
          const img = new Image();
          const context = canvas.getContext('2d');
          img.onload = () => {
            context?.drawImage(img, 0, 0);
            // set transform to scale up pixel density
            context?.setTransform(1.5, 0, 0, 1.5, 0, 0);
          };
          img.src = dataUrl;
        }
      } catch (error) {
        console.log('error', error);
      }
    }

    if (windowDisplay) {
      screenshot();
    } else {
      clearRect();
    }
  }, [windowDisplay]);

  function clearRect() {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.width;
      canvas.width = 0;
      canvas.width = width;
    }
  }

  function handleCut(start: Position, end: Position) {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    // active a rect area and clip it.
    context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    context.clip();
    const imageData = context.getImageData(
      start.x,
      start.y,
      end.x - start.x,
      end.y - start.y
    );

    // draw clip content to a new canvas and export.
    const newCanvas = document.createElement('canvas');
    newCanvas.width = Math.abs(start.x - end.x);
    newCanvas.height = Math.abs(start.y - end.y);
    newCanvas.getContext('2d')?.putImageData(imageData, 0, 0);

    const img = newCanvas.toDataURL();
    console.log(img);

    clearRect();
    ocrText(img);
  }

  return (
    <Container>
      <canvas
        ref={canvasRef}
        width={screen.width * 1.5}
        height={screen.height * 1.5}
      />
      <RectCutArea handleCut={handleCut} show={windowDisplay} />
    </Container>
  );
}
