'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';

const WhereToSkeleton = () => {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Title skeleton with two parts */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Skeleton className="h-20 md:h-28 w-32" />
            <Skeleton className="h-20 md:h-28 w-24" />
          </div>
          {/* Subtitle skeleton */}
          <Skeleton className="h-6 w-80 mx-auto" />
          
          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Loading destinations... {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Grid Skeleton */}
      <div className="container mx-auto px-4 lg:py-8 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden bg-background border-0 border-border/50 animate-pulse"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                {/* Image skeleton with shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
                
                {/* Gradient overlay skeleton */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Text overlay skeleton */}
                <div className="absolute bottom-4 left-4 right-4 space-y-3">
                  {/* Title skeleton */}
                  <Skeleton className="h-7 w-32 bg-white/30" />
                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-white/20" />
                    <Skeleton className="h-3 w-3/4 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back button skeleton */}
        <div className="text-center mt-12">
          <Skeleton className="h-12 w-32 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default WhereToSkeleton;
