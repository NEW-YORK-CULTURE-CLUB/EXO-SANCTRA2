import { useEffect, useCallback } from 'react';

interface UseAntiSaveOptions {
  preventRightClick?: boolean;
  preventDrag?: boolean;
  preventSelect?: boolean;
  preventKeyboard?: boolean;
  preventDevTools?: boolean;
  message?: string;
}

export function useAntiSave(options: UseAntiSaveOptions = {}) {
  const {
    preventRightClick = false,
    preventDrag = false,
    preventSelect = false,
    preventKeyboard = false,
    preventDevTools = false,
    message = 'This content is protected from saving.'
  } = options;

  // Prevent right-click context menu
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (preventRightClick) {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }
  }, [preventRightClick, message]);

  // Prevent drag and drop
  const handleDragStart = useCallback((e: DragEvent) => {
    if (preventDrag && e.target instanceof HTMLImageElement) {
      e.preventDefault();
      return false;
    }
  }, [preventDrag]);

  // Prevent text selection
  const handleSelectStart = useCallback((e: Event) => {
    if (preventSelect) {
      e.preventDefault();
      return false;
    }
  }, [preventSelect]);

  // Prevent keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!preventKeyboard) return;

    // Prevent Ctrl+S (Save)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }

    // Prevent Ctrl+Shift+S (Save As)
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }

    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }

    // Prevent F12 (DevTools)
    if (e.key === 'F12') {
      if (preventDevTools) {
        e.preventDefault();
        if (message) {
          alert(message);
        }
        return false;
      }
    }

    // Prevent Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      if (preventDevTools) {
        e.preventDefault();
        if (message) {
          alert(message);
        }
        return false;
      }
    }

    // Prevent Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      if (preventDevTools) {
        e.preventDefault();
        if (message) {
          alert(message);
        }
        return false;
      }
    }
  }, [preventKeyboard, preventDevTools, message]);

  // Prevent copy operations
  const handleCopy = useCallback((e: ClipboardEvent) => {
    if (preventSelect) {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }
  }, [preventSelect, message]);

  // Prevent cut operations
  const handleCut = useCallback((e: ClipboardEvent) => {
    if (preventSelect) {
      e.preventDefault();
      if (message) {
        alert(message);
      }
      return false;
    }
  }, [preventSelect, message]);

  // Apply global CSS to prevent image saving
  const applyGlobalStyles = useCallback(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'anti-save-styles';
      
      // Remove existing styles if they exist
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Prevent image saving globally */
        img {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }
        
        /* Allow pointer events for interactive images */
        img[data-interactive="true"] {
          pointer-events: auto !important;
        }
        
        /* Prevent text selection on images */
        img::selection {
          background: transparent !important;
        }
        
        img::-moz-selection {
          background: transparent !important;
        }
        
        /* Disable image context menu */
        img {
          -webkit-context-menu: none !important;
          -moz-context-menu: none !important;
          context-menu: none !important;
        }
        
        /* Prevent image dragging */
        img {
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        /* Disable image saving in print */
        @media print {
          img {
            display: none !important;
          }
        }
      `;
      
      document.head.appendChild(style);
    }
  }, []);

  // Remove global styles
  const removeGlobalStyles = useCallback(() => {
    if (typeof document !== 'undefined') {
      const style = document.getElementById('anti-save-styles');
      if (style) {
        style.remove();
      }
    }
  }, []);

  useEffect(() => {
    // Apply global styles
    applyGlobalStyles();

    // Add event listeners
    if (preventRightClick) {
      document.addEventListener('contextmenu', handleContextMenu);
    }
    
    if (preventDrag) {
      document.addEventListener('dragstart', handleDragStart);
    }
    
    if (preventSelect) {
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('cut', handleCut);
    }
    
    if (preventKeyboard) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function
    return () => {
      if (preventRightClick) {
        document.removeEventListener('contextmenu', handleContextMenu);
      }
      
      if (preventDrag) {
        document.removeEventListener('dragstart', handleDragStart);
      }
      
      if (preventSelect) {
        document.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('cut', handleCut);
      }
      
      if (preventKeyboard) {
        document.removeEventListener('keydown', handleKeyDown);
      }

      // Remove global styles
      removeGlobalStyles();
    };
  }, [
    preventRightClick,
    preventDrag,
    preventSelect,
    preventKeyboard,
    preventDevTools,
    handleContextMenu,
    handleDragStart,
    handleSelectStart,
    handleCopy,
    handleCut,
    handleKeyDown,
    applyGlobalStyles,
    removeGlobalStyles
  ]);

  // Function to enable pointer events for specific images (e.g., for zooming)
  const enableImageInteraction = useCallback((imageElement: HTMLImageElement) => {
    if (imageElement) {
      imageElement.setAttribute('data-interactive', 'true');
      imageElement.style.pointerEvents = 'auto';
    }
  }, []);

  // Function to disable image interaction
  const disableImageInteraction = useCallback((imageElement: HTMLImageElement) => {
    if (imageElement) {
      imageElement.removeAttribute('data-interactive');
      imageElement.style.pointerEvents = 'none';
    }
  }, []);

  return {
    enableImageInteraction,
    disableImageInteraction,
    applyGlobalStyles,
    removeGlobalStyles
  };
}
