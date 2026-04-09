import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Profile Page Skeleton
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-12 w-12 rounded" />
            </div>
            
            <div className="flex items-center space-x-3">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Section - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Photo and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/40 border">
                  <Skeleton className="w-full h-full" />
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-6 w-32 mb-4" />
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  </div>
                  
                  <Skeleton className="h-9 w-9 rounded" />
                </div>

                {/* Contact and Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>

            {/* Biography */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Section - Right Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-11" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-36" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 