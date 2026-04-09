// components/featured-artworks.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
export function FeaturedArtworks({ artworks, loading = false }) {
  const router = useRouter();
  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div>
            <h2 className="text-xl font-semibold">Featured Artworks</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Currently on display in the Main Gallery
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-4 px-4 lg:px-6">
          <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Featured Artworks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Currently on display in the Main Gallery
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4 lg:px-6">
        <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="group cursor-pointer"
              onClick={() => {
                router.push(`/inventory/${artwork.sku}`);
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    console.error('Image failed to load:', artwork.image);
                    // Fallback to placeholder on error
                    e.target.src = '/placeholder.png';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', artwork.image);
                  }}
                />
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="font-semibold text-base">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                <p className="text-base font-semibold">{artwork.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/inventory">
            <Button variant="ghost" className="group">
              View All Artworks
              <HiMiniArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}