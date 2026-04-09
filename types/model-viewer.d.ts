// Type declarations for <model-viewer> web component
// https://modelviewer.dev

import type React from 'react';

type ModelViewerProps = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  'ios-src'?: string;
  alt?: string;
  ar?: boolean | string;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'ar-placement'?: string;
  'camera-controls'?: boolean | string;
  'auto-rotate'?: boolean | string;
  'auto-rotate-delay'?: number | string;
  'rotation-per-second'?: string;
  'shadow-intensity'?: string;
  'shadow-softness'?: string;
  'environment-image'?: string;
  exposure?: string;
  loading?: string;
  reveal?: string;
  poster?: string;
  style?: React.CSSProperties;
  class?: string;
};

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': ModelViewerProps;
      }
    }
  }
}
