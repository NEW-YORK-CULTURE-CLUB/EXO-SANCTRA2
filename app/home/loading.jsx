import React from 'react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center justify-center px-8 pt-16 pb-10 text-center">
          {/* Tagline Skeleton */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-4 bg-muted rounded animate-pulse w-2"></div>
            <div className="h-5 bg-muted rounded animate-pulse w-48"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-2"></div>
          </div>
          
          {/* Main Headline Skeleton */}
          <div className="max-w-5xl">
            <div className="h-12 lg:h-20 bg-muted rounded mb-4 animate-pulse w-full"></div>
            <div className="h-12 lg:h-20 bg-muted rounded mb-4 animate-pulse w-3/4"></div>
            <div className="h-12 lg:h-20 bg-muted rounded animate-pulse w-2/3"></div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="lg:px-20 px-8 lg:pb-20 pb-10">
          <div className="w-full h-96 bg-muted rounded-2xl animate-pulse"></div>
        </div>
      </section>

      {/* Carousel Section Skeleton */}
      <section className="relative min-h-[500px]">
        <div className="w-full">
          <div className="lg:h-[650px] h-[600px]">
            <div className="absolute inset-0 flex flex-col lg:flex-row">
              {/* Left Content Skeleton */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="h-4 bg-muted rounded mb-2 animate-pulse w-32"></div>
                <div className="h-12 lg:h-20 bg-muted rounded mb-6 animate-pulse w-3/4"></div>
                <div className="h-6 bg-muted rounded mb-8 animate-pulse w-full"></div>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                </div>
                <div className="h-10 bg-muted rounded animate-pulse w-32"></div>
              </div>
              
              {/* Right Image/Video Skeleton */}
              <div className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full bg-muted animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Skeleton */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                <div className="h-8 bg-muted rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-muted rounded mb-4 animate-pulse w-2/3"></div>
                <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks Skeleton */}
      <section className="py-10 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="h-12 lg:h-20 bg-muted rounded animate-pulse w-64 mb-4 sm:mb-0"></div>
            <div className="h-10 bg-muted rounded animate-pulse w-24"></div>
          </div>
          
          {/* Filter Buttons Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-8 bg-muted rounded animate-pulse w-20"></div>
            ))}
          </div>
          
          {/* Artwork Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800">
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell Fast on ExhibitIQ Section Skeleton */}
      <section className="text-center lg:pt-20 pt-10 pb-10 px-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-14 lg:w-20 h-14 lg:h-20 bg-muted rounded animate-pulse"></div>
          <div className="h-12 lg:h-20 bg-muted rounded animate-pulse w-64"></div>
        </div>
        <div className="h-4 bg-muted rounded animate-pulse w-96 mx-auto mt-4"></div>
      </section>

      {/* Video Section Skeleton */}
      <section className="relative flex justify-center z-0 lg:pb-10">
        <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[85%] h-96 bg-muted rounded-2xl animate-pulse"></div>
      </section>

      {/* Featured Artists Skeleton */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="h-12 lg:h-20 bg-muted rounded animate-pulse w-64 mb-4 sm:mb-0"></div>
            <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="h-48 rounded-xl mb-4 overflow-hidden bg-muted animate-pulse"></div>
                <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded mb-3 animate-pulse"></div>
                <div className="h-3 bg-muted rounded mb-3 animate-pulse"></div>
                <div className="h-6 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 