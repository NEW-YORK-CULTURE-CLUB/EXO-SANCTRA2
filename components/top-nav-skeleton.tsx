import { Skeleton } from "@/components/ui/skeleton";

export function TopNavSkeleton() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="container flex h-14 items-center lg:justify-between justify-end px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-4 w-20" />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
} 