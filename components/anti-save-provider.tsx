'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAntiSave } from '@/hooks/use-anti-save';

interface AntiSaveContextType {
  enableImageInteraction: (imageElement: HTMLImageElement) => void;
  disableImageInteraction: (imageElement: HTMLImageElement) => void;
}

const AntiSaveContext = createContext<AntiSaveContextType | undefined>(undefined);

interface AntiSaveProviderProps {
  children: ReactNode;
  options?: {
    preventRightClick?: boolean;
    preventDrag?: boolean;
    preventSelect?: boolean;
    preventKeyboard?: boolean;
    preventDevTools?: boolean;
    message?: string;
  };
}

export function AntiSaveProvider({ children, options = {} }: AntiSaveProviderProps) {
  const {
    enableImageInteraction,
    disableImageInteraction
  } = useAntiSave({
    preventRightClick: false,
    preventDrag: false,
    preventSelect: false,
    preventKeyboard: false,
    preventDevTools: false, // Allow dev tools for development
    message: 'This content is protected from saving.',
    ...options
  });

  const contextValue: AntiSaveContextType = {
    enableImageInteraction,
    disableImageInteraction
  };

  return (
    <AntiSaveContext.Provider value={contextValue}>
      {children}
    </AntiSaveContext.Provider>
  );
}

export function useAntiSaveContext() {
  const context = useContext(AntiSaveContext);
  if (context === undefined) {
    throw new Error('useAntiSaveContext must be used within an AntiSaveProvider');
  }
  return context;
}

// Higher-order component for pages that need anti-save protection
export function withAntiSave<T extends object>(
  Component: React.ComponentType<T>,
  options?: AntiSaveProviderProps['options']
) {
  return function WrappedComponent(props: T) {
    return (
      <AntiSaveProvider options={options}>
        <Component {...props} />
      </AntiSaveProvider>
    );
  };
}
