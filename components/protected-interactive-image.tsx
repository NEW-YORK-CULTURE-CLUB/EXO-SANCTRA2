'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAntiSaveContext } from './anti-save-provider';
import { ProcessedImage } from '@/lib/secure-image-service';

interface ProtectedInteractiveImageProps {
  processedImage: ProcessedImage;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  showWatermark?: boolean;
  maxWidth?: number;
  lazy?: boolean;
  allowZoom?: boolean;
  allowPan?: boolean;
}

export function ProtectedInteractiveImage({
  processedImage,
  alt,
  className = '',
  width,
  height,
  onClick,
  showWatermark = true,
  maxWidth = 1600,
  lazy = true,
  allowZoom = true,
  allowPan = true
}: ProtectedInteractiveImageProps) {
  const { enableImageInteraction, disableImageInteraction } = useAntiSaveContext();
  const [isInteractive, setIsInteractive] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enable interaction when needed
  useEffect(() => {
    if (imgRef.current && (allowZoom || allowPan)) {
      enableImageInteraction(imgRef.current);
      setIsInteractive(true);
    }

    return () => {
      if (imgRef.current) {
        disableImageInteraction(imgRef.current);
      }
    };
  }, [allowZoom, allowPan, enableImageInteraction, disableImageInteraction]);

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (!allowZoom) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    
    // Zoom towards mouse position
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newX = mouseX - (mouseX - position.x) * (newScale / scale);
      const newY = mouseY - (mouseY - position.y) * (newScale / scale);
      
      setPosition({ x: newX, y: newY });
    }
    
    setScale(newScale);
  };

  // Handle pan with mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!allowPan || scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !allowPan) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom and pan
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Get optimal image variant
  const getOptimalVariant = () => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const targetWidth = Math.min(width || 1280, maxWidth);
    const adjustedWidth = targetWidth * dpr;

    let variant = processedImage.variants.find(v => 
      v.format === 'webp' && v.width >= adjustedWidth
    );

    if (!variant) {
      variant = processedImage.variants.find(v => 
        v.format === 'jpeg' && v.width >= adjustedWidth
      );
    }

    return variant || processedImage.variants[0];
  };

  const variant = getOptimalVariant();

  if (!processedImage || processedImage.variants.length === 0) {
    return (
      <div 
        className={`bg-muted/20 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-4xl opacity-20">🎨</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Interactive Image */}
      <img
        ref={imgRef}
        src={variant?.url}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-200 ${
          onClick ? 'cursor-pointer' : ''
        } ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onClick={onClick}
        draggable={false}
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          pointerEvents: isInteractive ? 'auto' : 'none'
        }}
      />

      {/* Zoom Controls */}
      {allowZoom && (
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={() => setScale(Math.min(3, scale + 0.2))}
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            disabled={scale >= 3}
          >
            +
          </button>
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            disabled={scale <= 0.5}
          >
            −
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            disabled={scale === 1 && position.x === 0 && position.y === 0}
          >
            ↺
          </button>
        </div>
      )}

      {/* Zoom Indicator */}
      {scale > 1 && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Watermark Overlay */}
      {showWatermark && variant && variant.width >= 1280 && (
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <div className="bg-black/20 text-white/60 text-xs px-2 py-1 rounded backdrop-blur-sm">
            ExhibitIQ
          </div>
        </div>
      )}

      {/* Instructions */}
      {(allowZoom || allowPan) && scale > 1 && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white/70 text-xs px-2 py-1 rounded">
          {allowZoom && 'Scroll to zoom • '}
          {allowPan && 'Drag to pan • '}
          Right-click to reset
        </div>
      )}
    </div>
  );
}
