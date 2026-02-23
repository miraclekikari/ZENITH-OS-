import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as fabric from 'fabric';

interface EditorViewProps {
  media: {
    url: string;
    type: 'image' | 'video';
  };
}

export interface EditorViewRef {
  getCanvas: () => fabric.Canvas | null;
  applyFilter: (filterType: 'brightness', value: number) => void;
}

const EditorView = forwardRef<EditorViewRef, EditorViewProps>(({ media }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricCanvasRef.current,
    applyFilter: (filterType: 'brightness', value: number) => {
      const canvas = fabricCanvasRef.current;
      const image = canvas?.backgroundImage as fabric.Image;
      if (!image) return;

      // Normalize value to be between -1 and 1
      const brightnessValue = Math.max(-1, Math.min(value, 1));

      if (filterType === 'brightness') {
        // Remove existing brightness filter to avoid stacking them
        image.filters = image.filters?.filter(
          (f) => !(f && (f as any).type === 'Brightness')
        ) || [];

        // Add new brightness filter if value is not neutral
        if (brightnessValue !== 0) {
            const filter = new fabric.Image.filters.Brightness({
                brightness: brightnessValue,
            });
            image.filters.push(filter);
        }
        
        image.applyFilters();
        canvas.renderAll();
      }
    },
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
        const img = await fabric.Image.fromURL(media.url, undefined, { crossOrigin: 'anonymous' });
        
        if (!isMounted) return;

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
