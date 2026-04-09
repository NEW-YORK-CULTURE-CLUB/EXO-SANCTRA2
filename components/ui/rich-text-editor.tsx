"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Quote,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className,
  rows = 4,
  disabled = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  // Ensure proper initialization
  useEffect(() => {
    if (editorRef.current) {
      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }
      
      // Ensure the editor is properly initialized and can receive focus
      const initializeEditor = () => {
        if (editorRef.current) {
          // Force a reflow to ensure the editor is properly rendered
          editorRef.current.style.display = 'none';
          editorRef.current.offsetHeight; // Force reflow
          editorRef.current.style.display = '';
          
          // Ensure the editor can receive focus
          editorRef.current.setAttribute('tabindex', '0');
          
          // Make sure the editor is ready for input
          editorRef.current.contentEditable = 'true';
        }
      };
      
      // Initialize immediately and after a short delay
      initializeEditor();
      const timer = setTimeout(initializeEditor, 50);
      
      // Handle visibility changes to restore focus (only on client side)
      const handleVisibilityChange = () => {
        if (typeof document !== 'undefined' && !document.hidden && editorRef.current && isFocused) {
          editorRef.current.focus();
        }
      };
      
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', handleVisibilityChange);
      }
      
      return () => {
        clearTimeout(timer);
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };
    }
  }, [isFocused]);

  const execCommand = (command: string, value?: string) => {
    // Ensure the editor has focus before executing commands
    ensureFocus();
    
    // Small delay to ensure focus is established (only on client side)
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.execCommand(command, false, value);
        updateValue();
      }
    }, 10);
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (typeof document !== 'undefined') {
      document.execCommand('insertText', false, text);
      updateValue();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ensure focus is maintained
    ensureFocus();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typeof document !== 'undefined') {
        document.execCommand('insertParagraph', false);
        updateValue();
      }
    }
    
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  const handleInput = () => {
    updateValue();
  };

  // Ensure the editor is always ready for input (only on client side)
  const ensureFocus = () => {
    if (typeof document !== 'undefined' && editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
      
      // If there's no selection, create one
      const selection = window.getSelection();
      if (selection && selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleClick = () => {
    // Ensure immediate focus when clicking anywhere in the editor
    ensureFocus();
    
    // Place cursor at the end if there's content, or at the beginning if empty (only on client side)
    if (typeof document !== 'undefined' && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        
        if (editorRef.current.innerHTML && editorRef.current.innerHTML.trim() !== '') {
          // If there's content, place cursor at the end
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
        } else {
          // If empty, place cursor at the beginning
          range.setStart(editorRef.current, 0);
          range.collapse(true);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ensure focus on mousedown for better responsiveness
    ensureFocus();
    
    // Prevent default to ensure our focus handling takes precedence
    e.preventDefault();
    
    // Force focus after preventing default
    setTimeout(() => {
      ensureFocus();
    }, 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Ensure focus on touchstart for mobile devices
    ensureFocus();
  };

  const isActive = (command: string) => {
    return typeof document !== 'undefined' ? document.queryCommandState(command) : false;
  };

  const toolbarButtons = [
    {
      command: 'bold',
      icon: Bold,
      label: 'Bold',
      shortcut: 'Ctrl+B'
    },
    {
      command: 'italic',
      icon: Italic,
      label: 'Italic',
      shortcut: 'Ctrl+I'
    },
    {
      command: 'underline',
      icon: Underline,
      label: 'Underline',
      shortcut: 'Ctrl+U'
    },
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
    { command: 'formatBlock', icon: Quote, label: 'Quote Block', value: 'blockquote' },
    { command: 'formatBlock', icon: Code, label: 'Code Block', value: 'pre' }
  ];

  return (
    <div className={cn("border rounded-md relative", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {toolbarButtons.map((button) => (
          <Button
            key={`${button.command}-${button.value || 'default'}`}
            type="button"
            variant={isActive(button.command) ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => execCommand(button.command, button.value)}
            title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            disabled={disabled}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        tabIndex={0}
        className={cn(
          "min-h-[120px] p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
          "prose prose-sm max-w-none",
          "prose-headings:font-semibold prose-headings:mb-2",
          "prose-p:mb-2 prose-p:last:mb-0",
          "prose-ul:mb-2 prose-ul:last:mb-0",
          "prose-ol:mb-2 prose-ol:last:mb-0",
          "prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded prose-pre:font-mono prose-pre:text-sm",
          isFocused ? "ring-2 ring-ring ring-offset-0" : ""
        )}
        style={{ 
          minHeight: `${rows * 24}px`,
          position: 'relative'
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
      
      {/* Placeholder text - positioned absolutely to not interfere with content */}
      {!value && !isFocused && (
        <div 
          className="absolute top-3 left-3 text-muted-foreground pointer-events-none select-none z-10"
          style={{ 
            top: '50px', 
            left: '12px',
            color: 'hsl(var(--muted-foreground))',
            fontSize: '14px'
          }}
        >
          {placeholder}
        </div>
      )}

      {/* Help text */}
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t">
        <span className="font-medium">Formatting Tips:</span> Use the toolbar above or keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U). 
        Press Enter for new paragraphs, Shift+Enter for line breaks.
      </div>
    </div>
  );
};

export { RichTextEditor };
