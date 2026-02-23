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

    let isMounted = true;
    const canvas = new fabric.Canvas(canvasRef.current, { isDrawingMode: false });
    fabricCanvasRef.current = canvas;

    const initCanvas = async () => {
      if (!canvasRef.current?.parentElement) return;

      const { clientWidth, clientHeight } = canvasRef.current.parentElement;
      canvas.setDimensions({ width: clientWidth, height: clientHeight });

      try {
        // CORRECTED: Using modern async/await syntax for image loading
        const img = await fabric.Image.fromURL(media.url, undefined, { crossOrigin: 'anonymous' });
        
        if (!isMounted) return; // Prevent state updates if component is unmounted

        const scale = Math.min(clientWidth / (img.width || 1), clientHeight / (img.height || 1));
        img.scale(scale);
        img.set({
          originX: 'center',
          originY: 'center',
          left: clientWidth / 2,
          top: clientHeight / 2,
          selectable: false,
          evented: false,
        });

        // CORRECTED: Use the backgroundImage property and call renderAll() manually.
        canvas.backgroundImage = img;
        canvas.renderAll();

      } catch (error) {
        console.error("Error loading image into fabric canvas:", error);
      }
    };

    const handleResize = () => initCanvas();
    initCanvas();

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
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
