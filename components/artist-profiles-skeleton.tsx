import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Artist Profiles Table Skeleton
export function ArtistProfilesTableSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b">
          <div className="col-span-1">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 py-4 border-b last:border-b-0">
            <div className="col-span-1">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Artist Profiles Page Skeleton
export function ArtistProfilesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-4 -mt-5 lg:mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Table */}
      <ArtistProfilesTableSkeleton />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

// Artist Detail Page Skeleton
export function ArtistDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background -mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Artist Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="w-full space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add New Artist Page Skeleton
export function AddNewArtistPageSkeleton() {
  return (
    <div className="min-h-screen bg-background -mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            
            {/* File Upload Section */}
            <div className="mt-6 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full border-2 border-dashed rounded-lg" />
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 