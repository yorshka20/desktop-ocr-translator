import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface Position {
  x: number;
  y: number;
}

const ContentWrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  visibility: hidden;

  user-select: none;

  &.show {
    visibility: visible;
  }

  canvas {
    width: 100%;
    height: 100%;

    background-color: transparent;
  }

  .tool {
    position: absolute;
    top: 50%;
    left: 50%;

    color: red;
    font-size: 18px;
  }
`;

const CanvasContainer = styled.div`
  width: 100vw;
  height: 100vh;

  position: absolute;

  top: 0;
  left: 0;
`;

interface RectCutAreaProps {
  handleCut: (start: Position, end: Position) => void;
  readyToCutPromise: Promise<undefined> | undefined;
  quit: () => void;
}

`
todo: make a more general canvas rendering methods set.
`;

export function RectCutArea({
  handleCut,
  readyToCutPromise,
  quit,
}: RectCutAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startRef = useRef<Position>({ x: 0, y: 0 });
  const endRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    // create a mask after screenshot. otherwise screenshot will take the mask in.
    readyToCutPromise?.then(() => {
      makeMask();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      if (canvasRef.current === null) return;
      extendCanvas(canvasRef.current);
    });
  }, [readyToCutPromise]);

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

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
  }

  function makeMask() {
    const context = getContext();
    if (!context) return;

    // make a mask
    context.clearRect(0, 0, screen.width, screen.height);
    context.fillStyle = 'rgba(102, 102, 102, 0.6)';
    context.fillRect(0, 0, screen.width, screen.height);
  }

  function handleMouseMove(e: MouseEvent) {
    const context = getContext();
    if (!context) return;

    const start = startRef.current;

    const [x, y, w, h] = [start.x, start.y, e.x - start.x, e.y - start.y];

    makeMask();

    context.clearRect(x, y, w, h);

    context.strokeStyle = 'red';
    context.lineWidth = 2;

    context.strokeRect(x, y, w, h);
  }

  function handleMouseUp(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = e;
    endRef.current = { x, y };

    // stop listen to mousemove
    canvas.removeEventListener('mousemove', handleMouseMove);
    // start listen to mousedown again
    canvas.addEventListener('mousedown', handleMouseDown);

    document.addEventListener('keydown', handleEnter);
  }

  function handleEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  }

  function handleConfirm() {
    console.log('handleConfirm', startRef.current, endRef.current);

    // calculate the clip rect and send it to original img source.
    handleCut(startRef.current, endRef.current);

    document.removeEventListener('keydown', handleEnter);
    canvasRef.current?.removeEventListener('mousedown', handleMouseDown);

    quitScreenshot();
  }

  function quitScreenshot() {
    clearRect();
    quit();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    // right click to quit. or you can use esc key to quit screenshot mode.
    canvas.addEventListener('contextmenu', quitScreenshot);

    return () => {
      clearRect();
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('contextmenu', quitScreenshot);
    };
  }, []);

  return (
    <CanvasContainer>
      <ContentWrapper className={'show'}>
        <canvas width={screen.width} height={screen.height} ref={canvasRef} />
        {/* <div className="tool">screen show area</div> */}
      </ContentWrapper>
    </CanvasContainer>
  );
}

`
extends the prototype of canvas and canvas context.
and add a click event listener to canvas.

delegate the click event to the canvas component and compute the element interacted with the click event.
`;

function extendCanvas(canvas: HTMLCanvasElement) {
  new CanvasExtension(canvas);
}

class CanvasExtension {
  constructor(private canvas: HTMLCanvasElement) {
    //
    this.extendPrototype();
  }

  private extendPrototype = () => {
    if (!this.canvas) {
      return;
    }
    const canvasProto = Object.getPrototypeOf(this.canvas);
    const context = this.canvas.getContext('2d');
    if (!context) {
      return;
    }
    const ctxProto = Object.getPrototypeOf(context) as CanvasRenderingContext2D;
    console.log('fn', canvasProto, ctxProto);

    const stroke = ctxProto.stroke;
    ctxProto.stroke = function (
      args: Parameters<CanvasRenderingContext2D['stroke']>
    ) {
      console.log('stroke', args);
      if (args === undefined) {
        return stroke.apply(this);
      }

      return stroke.apply(this, args);
    };

    const strokeRect = ctxProto.strokeRect;
    ctxProto.strokeRect = (...args: Parameters<CanvasRect['strokeRect']>) => {
      console.log('stroke rect,', args);
      return strokeRect.apply(this, args);
    };

    this.canvas.addEventListener('click', this.handleClick);
  };

  private handleClick = (e: MouseEvent) => {
    console.log('click canvas', e);
  };
}
