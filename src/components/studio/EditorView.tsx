import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';

interface EditorViewProps {
  media: {
    url: string;
    type: 'image' | 'video';
  };
}

export interface EditorViewRef {
  getCanvas: () => fabric.Canvas | null;
}

const EditorView = forwardRef<EditorViewRef, EditorViewProps>(({ media }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricCanvasRef.current,
  }), []);

  useEffect(() => {
    if (!canvasRef.current || media.type !== 'image') return;

    const canvas = new fabric.Canvas(canvasRef.current, { isDrawingMode: false });
    fabricCanvasRef.current = canvas;

    const setCanvasSize = () => {
      if (canvasRef.current?.parentElement) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement;
        canvas.setDimensions({ width: clientWidth, height: clientHeight });

        fabric.Image.fromURL(media.url, (img) => {
          const scale = Math.min(clientWidth / img.width!, clientHeight / img.height!);
          img.scale(scale);
          img.set({
            originX: 'center',
            originY: 'center',
            left: clientWidth / 2,
            top: clientHeight / 2,
            selectable: false,
            evented: false,
          });
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        }, { crossOrigin: 'anonymous' });
      }
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [media]);

  return (
    <div className="w-full h-full relative bg-black/50 rounded-lg">
      {media.type === 'image' ? (
        <canvas ref={canvasRef} />
      ) : (
        <video src={media.url} controls autoPlay loop className="w-full h-full object-contain" />
      )}
    </div>
  );
});

export default EditorView;
