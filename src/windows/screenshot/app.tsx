import { type Position, RectCutArea } from '@renderer/components/rect-cut-area';
import { createPromise, noop } from '@renderer/utils';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { handleOCR } from './ocr';

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

const scaleFactor = window.api.getScaleFactor();

export default function App() {
  const [windowDisplay, setWindowDisplay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [readyToCut, setReadyToCut] = useState<Promise<undefined>>();
  const resolveRef = useRef(noop);

  useEffect(() => {
    const handler = (_, show: boolean): void => {
      setWindowDisplay(show);
      if (show) {
        const [resolve, p] = createPromise();
        setReadyToCut(p);
        resolveRef.current = resolve;
      }
    };
    window.electronApi.ipcRenderer.on('screenshot-window-display', handler);

    return () => {
      window.electronApi.ipcRenderer.removeListener(
        'screenshot-window-display',
        handler
      );
    };
  }, []);

  useEffect(() => {
    async function screenshot(): Promise<void> {
      try {
        const dataUrl: string = await window.api.doScreenshot();

        // resolve promise to trigger mask rendering
        resolveRef.current();

        const canvas = canvasRef.current;
        if (canvas) {
          const img = new Image();
          const context = canvas.getContext('2d');
          img.onload = () => {
            context?.drawImage(img, 0, 0);
            // set transform to scale up pixel density
            context?.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
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

    console.log('handleCut', start, end);

    const [x, y, w, h] = [
      start.x,
      start.y,
      end.x - start.x,
      end.y - start.y,
    ].map((i) => i * scaleFactor); // restore by scaleFactor

    const imageData = context.getImageData(x, y, w, h);

    // draw clip content to a new canvas and export.
    const newCanvas = document.createElement('canvas');
    newCanvas.width = Math.abs(w);
    newCanvas.height = Math.abs(h);
    newCanvas.getContext('2d')?.putImageData(imageData, 0, 0);

    const img = newCanvas.toDataURL();

    handleOCR(img, 'ja');

    // window.api.saveImg(img);

    clearRect();

    quit();
  }

  function quit() {
    window.api.quitScreenShot();
  }

  return (
    <Container>
      <canvas
        ref={canvasRef}
        width={screen.width * scaleFactor}
        height={screen.height * scaleFactor}
      />
      {windowDisplay && (
        <RectCutArea
          readyToCutPromise={readyToCut}
          quit={quit}
          handleCut={handleCut}
        />
      )}
    </Container>
  );
}
