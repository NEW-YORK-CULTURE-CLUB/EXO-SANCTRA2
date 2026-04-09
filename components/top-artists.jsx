// components/top-artists.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HiMiniArrowUpRight } from "react-icons/hi2";


export function TopArtists({ artists }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Top Artists</h2>
          <p className="text-sm text-muted-foreground">Most popular artists in your gallery</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex items-center space-x-3 py-2"
            >
              <Avatar className="h-10 w-10 bg-muted">
                <AvatarFallback className="bg-muted text-foreground font-medium text-sm">
                  {artist.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{artist.name}</p>
                <p className="text-xs text-muted-foreground">{artist.style}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/artist-profiles">
          <Button variant="ghost" className="w-full group mt-4" size="sm">
            View All Artists
            <HiMiniArrowUpRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}