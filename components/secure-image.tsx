'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ProcessedImage } from '@/lib/secure-image-service';

interface SecureImageProps {
  processedImage: ProcessedImage;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
  showWatermark?: boolean;
  maxWidth?: number;
  lazy?: boolean;
  preventSave?: boolean;
}

export function SecureImage({
  processedImage,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onClick,
  showWatermark = true,
  maxWidth = 1600,
  lazy = true,
  preventSave = true
}: SecureImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine the best image variant based on container size and device pixel ratio
  const getOptimalVariant = () => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const targetWidth = Math.min(width || 1280, maxWidth);
    const adjustedWidth = targetWidth * dpr;

    // Find the best WebP variant
    let variant = processedImage.variants.find(v => 
      v.format === 'webp' && v.width >= adjustedWidth
    );

    // Fallback to JPEG if WebP not available
    if (!variant) {
      variant = processedImage.variants.find(v => 
        v.format === 'jpeg' && v.width >= adjustedWidth
      );
    }

    // Fallback to any available variant
    if (!variant) {
      variant = processedImage.variants[0];
    }

    return variant;
  };

  // Generate responsive srcset for optimal delivery
  const generateSrcset = () => {
    const webpVariants = processedImage.variants.filter(v => v.format === 'webp');
    const jpegVariants = processedImage.variants.filter(v => v.format === 'jpeg');

    let srcset = '';

    // WebP variants (modern browsers)
    if (webpVariants.length > 0) {
      srcset += webpVariants
        .map(v => `${v.url} ${v.width}w`)
        .join(', ');
    }

    // JPEG fallback (universal support)
    if (jpegVariants.length > 0) {
      if (srcset) srcset += ', ';
      srcset += jpegVariants
        .map(v => `${v.url} ${v.width}w`)
        .join(', ');
    }

    return srcset;
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    setError(false);
  };

  // Handle image error
  const handleImageError = () => {
    setError(true);
    setImageLoaded(false);
  };

  // Update image source when processedImage changes
  useEffect(() => {
    const variant = getOptimalVariant();
    if (variant) {
      setCurrentSrc(variant.url);
    }
  }, [processedImage, width, maxWidth]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const variant = getOptimalVariant();
            if (variant) {
              setCurrentSrc(variant.url);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [lazy, processedImage]);

  // If no processed image, show placeholder
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

  // If error, show error state
  if (error) {
    return (
      <div 
        className={`bg-muted/20 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl opacity-20 mb-2">⚠️</div>
          <div className="text-sm text-muted-foreground">Image failed to load</div>
        </div>
      </div>
    );
  }

  const variant = getOptimalVariant();
  const srcset = generateSrcset();

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
      onContextMenu={(e) => preventSave && e.preventDefault()}
      onDragStart={(e) => preventSave && e.preventDefault()}
      onMouseDown={(e) => preventSave && e.preventDefault()}
    >
      {/* Main Image */}
      <img
        ref={imgRef}
        src={currentSrc || variant?.url}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-pointer' : ''}`}
        srcSet={srcset}
        sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${maxWidth}px`}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageLoad}
        onClick={onClick}
        draggable={false}
        onContextMenu={(e) => preventSave && e.preventDefault()}
        onDragStart={(e) => preventSave && e.preventDefault()}
        onMouseDown={(e) => preventSave && e.preventDefault()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: preventSave ? 'none' : 'auto',
          WebkitUserSelect: preventSave ? 'none' : 'auto',
          MozUserSelect: preventSave ? 'none' : 'auto',
          pointerEvents: preventSave ? 'none' : 'auto'
        }}
      />

      {/* Loading Placeholder */}
      {!imageLoaded && !error && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="text-4xl opacity-20">🎨</div>
          </div>
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

      {/* Image Info (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
          <div>Size: {variant?.width}x{variant?.height}</div>
          <div>Format: {variant?.format}</div>
          <div>Quality: {variant?.quality}%</div>
        </div>
      )}
    </div>
  );
}

// Responsive Image Component with Picture Element
export function ResponsiveSecureImage({
  processedImage,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onClick,
  showWatermark = true,
  maxWidth = 1600,
  lazy = true,
  preventSave = true
}: SecureImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate picture element with multiple sources
  const generatePictureSources = () => {
    const webpVariants = processedImage.variants.filter(v => v.format === 'webp');
    const jpegVariants = processedImage.variants.filter(v => v.format === 'jpeg');

    return (
      <>
        {/* WebP source (modern browsers) */}
        {webpVariants.length > 0 && (
          <source
            type="image/webp"
            srcSet={webpVariants.map(v => `${v.url} ${v.width}w`).join(', ')}
            sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${maxWidth}px`}
          />
        )}
        
        {/* JPEG fallback */}
        {jpegVariants.length > 0 && (
          <source
            type="image/jpeg"
            srcSet={jpegVariants.map(v => `${v.url} ${v.width}w`).join(', ')}
            sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${maxWidth}px`}
          />
        )}
      </>
    );
  };

  // Get fallback image
  const getFallbackImage = () => {
    const jpegVariant = processedImage.variants.find(v => v.format === 'jpeg');
    return jpegVariant?.url || processedImage.variants[0]?.url;
  };

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

  if (error) {
    return (
      <div 
        className={`bg-muted/20 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl opacity-20 mb-2">⚠️</div>
          <div className="text-sm text-muted-foreground">Image failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
      onContextMenu={(e) => preventSave && e.preventDefault()}
      onDragStart={(e) => preventSave && e.preventDefault()}
      onMouseDown={(e) => preventSave && e.preventDefault()}
    >
      <picture>
        {generatePictureSources()}
        <img
          src={getFallbackImage()}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${onClick ? 'cursor-pointer' : ''}`}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setError(true)}
          onClick={onClick}
          draggable={false}
          onContextMenu={(e) => preventSave && e.preventDefault()}
          onDragStart={(e) => preventSave && e.preventDefault()}
          onMouseDown={(e) => preventSave && e.preventDefault()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            userSelect: preventSave ? 'none' : 'auto',
            WebkitUserSelect: preventSave ? 'none' : 'auto',
            MozUserSelect: preventSave ? 'none' : 'auto',
            pointerEvents: preventSave ? 'none' : 'auto'
          }}
        />
      </picture>

      {/* Loading Placeholder */}
      {!imageLoaded && !error && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="text-4xl opacity-20">🎨</div>
          </div>
        </div>
      )}

      {/* Watermark Overlay */}
      {showWatermark && (
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <div className="bg-black/20 text-white/60 text-xs px-2 py-1 rounded backdrop-blur-sm">
            ExhibitIQ
          </div>
        </div>
      )}
    </div>
  );
}
