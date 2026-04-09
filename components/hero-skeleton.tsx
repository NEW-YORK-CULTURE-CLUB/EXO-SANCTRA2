import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-16 pb-10 text-center">
      {/* Tagline Skeleton */}
      <div className="flex items-center space-x-4 mb-8">
        <Skeleton className="h-4 w-2" />
        <Skeleton className="lg:h-5 h-4 w-64" />
        <Skeleton className="h-4 w-2" />
      </div>
      
      {/* Main Headline Skeleton */}
      <div className="space-y-4 max-w-5xl">
        <div className="flex flex-wrap justify-center gap-2">
          <Skeleton className="h-8 lg:h-20 w-16 lg:w-24" />
          <Skeleton className="h-8 lg:h-20 w-20 lg:w-32" />
          <Skeleton className="h-8 lg:h-20 w-20 lg:w-28" />
          <Skeleton className="h-8 lg:h-20 w-20 lg:w-32" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Skeleton className="h-8 lg:h-20 w-24 lg:w-40" />
          <Skeleton className="h-8 lg:h-20 w-20 lg:w-32" />
          <Skeleton className="h-8 lg:h-20 w-20 lg:w-28" />
        </div>
      </div>
    </div>
  );
}

export function HeroImageSkeleton() {
  return (
    <div className="lg:px-20 px-8 pb-16">
      <Skeleton className="w-full h-96 lg:h-[500px] rounded-2xl" />
    </div>
  );
}
