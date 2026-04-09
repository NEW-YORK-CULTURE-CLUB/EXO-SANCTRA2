'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LockScreen() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const lockRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const checkCollision = () => {
      if (!lockRef.current || !keyRef.current) return;

      const lockRect = lockRef.current.getBoundingClientRect();
      const keyRect = keyRef.current.getBoundingClientRect();

      // Calculate centers
      const lockCenterX = lockRect.left + lockRect.width / 2;
      const lockCenterY = lockRect.top + lockRect.height / 2;
      const keyCenterX = keyRect.left + keyRect.width / 2;
      const keyCenterY = keyRect.top + keyRect.height / 2;

      // Calculate distance between centers
      const distance = Math.sqrt(
        Math.pow(lockCenterX - keyCenterX, 2) + Math.pow(lockCenterY - keyCenterY, 2)
      );

      // Threshold for collision (adjust based on your image sizes)
      const threshold = 80; // pixels

      if (distance < threshold && !isUnlocked) {
        setIsUnlocked(true);
      } else if (distance >= threshold && isUnlocked) {
        setIsUnlocked(false);
      }
    };

    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  const handleLockClick = () => {
    if (isUnlocked) {
      router.push('/home');
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ cursor: 'none' }}>
      {/* Background GIF */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/vault/bg.gif"
          alt="Background"
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {/* Lock - Centered */}
      <div
        ref={lockRef}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
          isUnlocked
            ? 'scale-110 cursor-pointer hover:scale-115'
            : 'scale-100'
        }`}
        onClick={handleLockClick}
        style={{ cursor: isUnlocked ? 'none' : 'none' }}
      >
        <Image
          src="/vault/lock.avif"
          alt="Lock"
          width={200}
          height={200}
          className={`transition-all duration-300 ${
            isUnlocked ? 'brightness-110 drop-shadow-2xl' : ''
          }`}
          priority
        />
        {/* {isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white text-xl font-bold drop-shadow-lg animate-pulse">
              ENTER
            </span>
          </div>
        )} */}
      </div>

      {/* Key - Follows Mouse */}
      <div
        ref={keyRef}
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Image
          src="/vault/key.png"
          alt="Key"
          width={200}
          height={200}
          className="drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
