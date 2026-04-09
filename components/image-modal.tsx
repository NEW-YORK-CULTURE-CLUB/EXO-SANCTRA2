"use client"

import { useState, useRef, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          e.preventDefault()
          setScale(prev => Math.min(prev * 1.2, 5))
          break
        case '-':
          e.preventDefault()
          setScale(prev => Math.max(prev / 1.2, 0.1))
          break
        case '0':
          e.preventDefault()
          setScale(1)
          setPosition({ x: 0, y: 0 })
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 1.1 : 0.9
    setScale(prev => Math.max(0.1, Math.min(5, prev * delta)))
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    // Check if the click target is the image or its container
    const target = e.target as HTMLElement
    const isImage = target === imageRef.current
    const isImageContainer = containerRef.current?.contains(target) && !isImage
    
    // If clicking outside the image but within the modal, close it
    if (!isImage && !isImageContainer) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleContainerClick}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-24 z-[10000] right-4 text-white hover:bg-white/20"
      >
        <X className="w-6" />
      </Button>

      {/* Controls */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-white hover:bg-white/20"
          disabled={scale >= 5}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-white hover:bg-white/20"
          disabled={scale <= 0.1}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-white hover:bg-white/20"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {Math.round(scale * 100)}%
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image container
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full select-none object-contain"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white/70 text-sm text-center">
        <p>Use mouse wheel to zoom • Drag to pan • Press ESC to close</p>
      </div>
    </div>
  )
} 