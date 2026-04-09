import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = useCallback((options?: {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    duration?: number;
  }) => {
    const defaultOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ffd3a5'],
      duration: 3000
    };

    const confettiOptions = { ...defaultOptions, ...options };

    // Create confetti effect
    confetti(confettiOptions);

    // Optional: Create additional bursts for more celebration
    if (confettiOptions.duration && confettiOptions.duration > 2000) {
      setTimeout(() => {
        confetti({
          ...confettiOptions,
          particleCount: 50,
          spread: 100,
          origin: { x: 0.1, y: 0.6 }
        });
      }, 200);

      setTimeout(() => {
        confetti({
          ...confettiOptions,
          particleCount: 50,
          spread: 100,
          origin: { x: 0.9, y: 0.6 }
        });
      }, 400);
    }
  }, []);

  const triggerSuccessConfetti = useCallback(() => {
    triggerConfetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f0fdf4'],
      duration: 4000
    });
  }, [triggerConfetti]);

  const triggerDemoConfetti = useCallback(() => {
    triggerConfetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f0f9ff', '#1d4ed8'],
      duration: 5000
    });
  }, [triggerConfetti]);

  return {
    triggerConfetti,
    triggerSuccessConfetti,
    triggerDemoConfetti
  };
};
