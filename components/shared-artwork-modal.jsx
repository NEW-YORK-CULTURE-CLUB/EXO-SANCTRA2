"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { HeartIcon, CalendarIcon, EyeOpenIcon, ChatBubbleIcon } from "@radix-ui/react-icons"

const sharedArtworks = [
    {
        title: "The Starry Night",
        artist: "Vincent van Gogh",
        sharedDate: "2023-10-06",
        imageUrl: "/vault/The-Starry-Night.jpg",
        liked: true,
    },
    {
        title: "Guernica",
        artist: "Pablo Picasso",
        sharedDate: "2023-06-05",
        imageUrl: "/vault/Guernica.jpg",
        liked: true,
    }
]

export function SharedArtworkModal({ open, onOpenChange, patronName, sharedArtworks: sharedArtworksProp }) {
  const artworks = sharedArtworksProp || sharedArtworks;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Shared Artwork</DialogTitle>
          <DialogDescription>
            Artwork shared by {patronName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {artworks.map(artwork => (
                <div key={artwork.title} className="rounded-lg overflow-hidden">
                    <div className="relative h-64 bg-muted flex items-center justify-center">
                        <Image src={artwork.imageUrl} alt={artwork.title} layout="fill" objectFit="contain" />
                        <Badge className="absolute top-2 right-2">
                            <HeartIcon className="mr-1"/> Liked
                        </Badge>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold">{artwork.title}</h3>
                        <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center">
                           <CalendarIcon className="mr-1" /> Shared on {new Date(artwork.date || artwork.sharedDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <div className="flex-grow" />
            <Button variant="ghost"><EyeOpenIcon className="mr-2"/> View Artwork</Button>
            <Button><ChatBubbleIcon className="mr-2"/> Contact About</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 