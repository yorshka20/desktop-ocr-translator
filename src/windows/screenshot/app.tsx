import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { EVENTS } from '../../../electron/constants';
import { init, ocrText } from './ocr';

// setup ocr worker
init('eng');

const Container = styled.div`
  margin: 0;

  background-color: transparent;

  width: 100vw;
  height: 100vh;

  position: relative;

  overflow: hidden;
`;

export default function App() {
  const [windowDisplay, setWindowDisplay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = (_, show: boolean): void => {
      console.log('shortcut', show);
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
          };
          img.src = dataUrl;
        }
      } catch (error) {
        console.log('error', error);
      }
    }

    console.log('windowDisplay', windowDisplay);

    if (windowDisplay) {
      screenshot();
    } else {
      clearRect();
    }
  }, [windowDisplay]);

  function clearRect() {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, screen.width, screen.height);
  }

  function handleCut(start: Position, end: Position) {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
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
      <canvas ref={canvasRef} width={screen.width} height={screen.height} />
      <RectCutArea handleCut={handleCut} show={windowDisplay} />
    </Container>
  );
}

interface Position {
  x: number;
  y: number;
}

function RectCutArea({ show, handleCut }: { show: boolean; handleCut: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startRef = useRef<Position>({ x: 0, y: 0 });
  const endRef = useRef<Position>({ x: 0, y: 0 });

  function getContext() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return canvas.getContext('2d');
  }

  function handleMouseDown(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = e;
    startRef.current = { x, y };
    console.log('mousedown', x, y);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const { x, y } = e;
    console.log('mousemove', x, y);

    const context = getContext();
    if (!context) return;

    context.clearRect(0, 0, screen.width, screen.height);

    context.strokeStyle = 'red';
    context.lineWidth = 2;

    const start = startRef.current;
    context.strokeRect(start.x, start.y, x - start.x, y - start.y);
  }

  function handleMouseUp(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = e;
    endRef.current = { x, y };

    console.log('mouseup', x, y);

    // stop listen to mousemove
    canvas.removeEventListener('mousemove', handleMouseMove);
    // start listen to mousedown again
    canvas.addEventListener('mousedown', handleMouseDown);

    document.addEventListener('keydown', handleEnter);
  }

  function handleEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleCut(startRef.current, endRef.current);

      document.removeEventListener('keydown', handleEnter);
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);

      window.electronApi.ipcRenderer.send(
        EVENTS.WINDOW_DISPLAY_SCREEN_SHOT,
        '',
        false
      );
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log('bind mousedown', canvas);
    if (!canvas) return;

    if (show) {
      canvas.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [show]);

  return (
    <CanvasContainer>
      <ContentWrapper className={show ? 'show' : ''}>
        <canvas width={screen.width} height={screen.height} ref={canvasRef} />
        <div className="tool">tools</div>
      </ContentWrapper>
    </CanvasContainer>
  );
}

const ContentWrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  visibility: hidden;

  &.show {
    visibility: visible;
  }

  canvas {
    width: 100%;
    height: 100%;
  }

  .tool {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const CanvasContainer = styled.div`
  width: 100vw;
  height: 100vh;

  position: absolute;

  top: 0;
  left: 0;
`;
