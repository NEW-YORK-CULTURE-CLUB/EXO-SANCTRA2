'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Download, Upload } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange?: (signatureData: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function SignaturePad({ 
  onSignatureChange, 
  width = 400, 
  height = 200, 
  className = '' 
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const maxWidth = Math.min(width, containerWidth - 32); // Account for padding
      const aspectRatio = width / height;
      const newHeight = maxWidth / aspectRatio;
      
      setCanvasSize({ width: maxWidth, height: newHeight });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setContext(ctx);
  }, [canvasSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setHasSignature(true);
    
    if (onSignatureChange) {
      const canvas = canvasRef.current;
      if (canvas) {
        onSignatureChange(canvas.toDataURL());
      }
    }
  };

  const clearSignature = () => {
    if (!context || !canvasRef.current) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
    
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  const downloadSignature = () => {
    if (!canvasRef.current || !hasSignature) return;

    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !context || !canvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        context.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        setHasSignature(true);
        
        if (onSignatureChange) {
          onSignatureChange(canvasRef.current!.toDataURL());
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className={className} style={{ border: 'none' }}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Digital Signature</h3>
            <p className="text-sm text-muted-foreground">
              Draw your signature below or upload an image
            </p>
          </div>
          
          <div 
            ref={containerRef}
            className="flex justify-center rounded-lg p-4 bg-muted/20"
          >
            <canvas
              ref={canvasRef}
              className="border border-border rounded bg-white cursor-crosshair touch-none"
              style={{ 
                width: `${canvasSize.width}px`, 
                height: `${canvasSize.height}px`,
                maxWidth: '100%'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSignature}
              disabled={!hasSignature}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="signature-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </label>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 