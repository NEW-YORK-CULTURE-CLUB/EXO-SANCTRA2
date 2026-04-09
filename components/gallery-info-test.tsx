'use client';

import { useGallery } from '@/contexts/gallery-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export function GalleryInfoTest() {
  const { gallery, loading, error } = useGallery();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gallery Context Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gallery Context Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!gallery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gallery Context Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No gallery data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Context Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {gallery.lightLogo && (
            <Image 
              src={gallery.lightLogo} 
              alt={`${gallery.name} Logo`} 
              width={64} 
              height={64} 
              className="rounded-lg"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{gallery.name}</h3>
            <p className="text-sm text-muted-foreground">{gallery.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Gallery ID:</span>
            <Badge variant="outline" className="ml-2">{gallery.id}</Badge>
          </div>
          <div>
            <span className="font-medium">UID:</span>
            <Badge variant="outline" className="ml-2">{gallery.uid}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-medium">Logos:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span>Light Logo:</span>
              <p className="text-muted-foreground truncate">{gallery.lightLogo || 'Not set'}</p>
            </div>
            <div>
              <span>Dark Logo:</span>
              <p className="text-muted-foreground truncate">{gallery.darkLogo || 'Not set'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 