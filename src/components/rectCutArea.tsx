import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { EVENTS } from '../../electron/constants';

export interface Position {
  x: number;
  y: number;
}

export function RectCutArea({
  show,
  handleCut,
}: {
  show: boolean;
  handleCut: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startRef = useRef<Position>({ x: 0, y: 0 });
  const endRef = useRef<Position>({ x: 0, y: 0 });

  function getContext() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return canvas.getContext('2d');
  }

  function clearRect() {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, screen.width, screen.height);
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
    // console.log('mousemove', x, y);

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

      clearRect();

      window.electronApi.ipcRenderer.send(
        EVENTS.WINDOW_DISPLAY_SCREEN_SHOT,
        '',
        false
      );
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
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
