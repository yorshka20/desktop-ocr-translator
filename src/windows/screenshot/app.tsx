import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { EVENTS } from '../../../electron/constants';

const Container = styled.div`
  margin: 0;

  background-color: transparent;

  width: 100vw;
  height: 100vh;

  position: relative;

  overflow: hidden;
`;

export default function App() {
  const [imgData, setImgData] = useState('');

  const [windowDisplay, setWindowDisplay] = useState(false);

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
      const result = await window.electronApi.ipcRenderer.invoke(
        'check-screen'
      );
      console.log('check screen ', result);

      // systemPreferences.askForMediaAccess(mediaType);

      try {
        const dataUrl: string = await window.electronApi.ipcRenderer.invoke(
          EVENTS.TASK_DO_SCREEN_SHOT
        );
        const canvas = document.getElementById(
          'source-image'
        ) as HTMLImageElement;
        console.log('dataurl', dataUrl.length);
        if (canvas) {
          // const img = new Image();
          // const context = canvas.getContext('2d');
          // context?.drawImage(img, 0, 0);
          canvas.src = dataUrl;
        }
      } catch (error) {
        console.log('error', error);
      }
    }

    console.log('windowDisplay', windowDisplay);

    if (windowDisplay) {
      screenshot();
    } else {
      //
    }
  }, [windowDisplay]);

  return (
    <Container>
      {/* <canvas id={'source-image'} width={screen.width} height={screen.height} /> */}
      <img id={'source-image'} width={screen.width} height={screen.height} />
      <RectCutArea show={windowDisplay} />
    </Container>
  );
}

interface Position {
  x: number;
  y: number;
}

function RectCutArea({ show }: { show: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [start, setStart] = useState<Position>({ x: 0, y: 0 });

  function getContext() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return canvas.getContext('2d');
  }

  function handleMouseDown(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = e;
    setStart({ x, y });

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    console.log('mousemove', e);
    const { x, y } = e;

    const context = getContext();
    if (!context) return;

    context.clearRect(0, 0, screen.width, screen.height);

    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.strokeRect(start.x, start.y, x - start.x, y - start.y);
  }

  function handleMouseUp(e: MouseEvent) {
    console.log('mouseup', e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.removeEventListener('mousemove', handleMouseMove);
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
