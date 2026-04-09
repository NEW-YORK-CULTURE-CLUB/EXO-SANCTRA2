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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useGallery } from "@/contexts/gallery-context"
import { ArtworkService } from "@/lib/artwork-service"
import { ObjectService } from "@/lib/object-service"
import { CollectibleService } from "@/lib/collectible-service"
import { MemorabiliaService } from "@/lib/memorabilia-service"
import { ArtworkInteractionService } from "@/lib/artwork-interaction-service"
import { toast } from "sonner"
import { useConfetti } from "@/hooks/use-confetti"

export function AssignArtworkModal({ open, onOpenChange, patronName, patronId, patronEmail }) {
    const { user } = useAuth();
    const { gallery } = useGallery();
    const { triggerSuccessConfetti } = useConfetti();
    const [searchQuery, setSearchQuery] = useState("");
    const [privateOnly, setPrivateOnly] = useState(true);
    const [selectedArtworks, setSelectedArtworks] = useState({});
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    // Fetch all gallery items when modal opens
    useEffect(() => {
        if (open && gallery?.id) {
            fetchGalleryItems();
        }
    }, [open, gallery?.id]);

    const fetchGalleryItems = async () => {
        if (!gallery?.id) return;
        
        setIsLoading(true);
        try {
            // Fetch all item types from the gallery
            const [artworkData, objectData, collectibleData, memorabiliaData] = await Promise.all([
                ArtworkService.getArtworkByGalleryId(gallery.id),
                ObjectService.getObjectsByGalleryId(gallery.id),
                CollectibleService.getCollectiblesByGalleryId(gallery.id),
                MemorabiliaService.getMemorabiliaByGalleryId(gallery.id)
            ]);

            // Transform and combine all items with their types
            const allItems = [
                ...artworkData.map(item => ({ ...item, itemType: 'Artwork' })),
                ...objectData.map(item => ({ ...item, itemType: 'Objects' })),
                ...collectibleData.map(item => ({ ...item, itemType: 'Collectibles' })),
                ...memorabiliaData.map(item => ({ ...item, itemType: 'Memorabilia' }))
            ];

            setAllItems(allItems);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
            toast.error('Failed to load gallery items');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredArtworks = allItems.filter(item => {
        const matchesSearch = 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.makerManufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.associatedPersons?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPrivate = privateOnly ? item.status === 'active' : true;
        
        return matchesSearch && matchesPrivate;
    });

    const toggleArtworkSelection = (id) => {
        setSelectedArtworks(prev => ({...prev, [id]: !prev[id]}));
    }

    const selectedCount = Object.values(selectedArtworks).filter(Boolean).length;


    const handleAssignArtworks = async () => {
        if (!user || !gallery || !patronId || selectedCount === 0) return;

        setIsAssigning(true);
        try {
            const selectedItems = allItems.filter(item => selectedArtworks[item.id]);
            
            // Assign each selected item
            for (const item of selectedItems) {
                console.log('Assigning item:', item.id, item.title, item.itemType);
                
                await ArtworkInteractionService.assignItem(
                    user.uid,
                    user.displayName || user.email,
                    patronId,
                    patronName,
                    item.id,
                    item.itemType,
                    item,
                    gallery.id,
                    gallery.name,
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    `Assigned by ${user.displayName || user.email}`,
                    'This artwork has been assigned for your exclusive viewing.'
                );

                // Also add to wishlist subcollection under the item
                const patronItemData = {
                    ...item,
                    userName: patronName,
                    userEmail: patronEmail
                };
                
                console.log('Adding to wishlist subcollection:', item.id, patronId, item.itemType);
                
                await ArtworkInteractionService.addToWishlist(
                    patronId,
                    item.id,
                    item.itemType,
                    patronItemData,
                    gallery.id,
                    gallery.name,
                    'high', // High priority for assigned items
                    item.price,
                    'Assigned for exclusive viewing',
                    ['assigned', 'exclusive']
                );
                
                console.log('Successfully processed item:', item.id);
            }

            // Trigger confetti celebration
            triggerSuccessConfetti();

            toast.success(`Successfully assigned ${selectedCount} item(s) to ${patronName}`);
            setSelectedArtworks({});
            onOpenChange(false);
        } catch (error) {
            console.error('Error assigning artworks:', error);
            toast.error('Failed to assign artworks');
        } finally {
            setIsAssigning(false);
        }
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Assign Private Artwork</DialogTitle>
          <DialogDescription>
            Assign private artwork to {patronName} for exclusive viewing.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <div className="flex justify-between items-center mb-4">
                <Input 
                    placeholder="Search artworks..." 
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                    <Switch id="private-only" checked={privateOnly} onCheckedChange={setPrivateOnly}/>
                    <Label htmlFor="private-only">Active Only</Label>
                </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="text-sm text-muted-foreground">Loading gallery items...</div>
                    </div>
                ) : filteredArtworks.length > 0 ? (
                    filteredArtworks.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden relative">
                                    <Image 
                                        src={item.images?.[0]?.url || item.imageUrl || '/placeholder.svg'} 
                                        alt={item.title} 
                                        layout="fill" 
                                        objectFit="cover" 
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.artist || item.makerManufacturer || item.associatedPersons}, 
                                        {item.year || item.productionYearEra || item.releaseYearEra}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.itemType} • ${item.price?.toLocaleString() || 'Price on request'}
                                    </p>
                                </div>
                            </div>
                            <Checkbox 
                                checked={selectedArtworks[item.id] || false}
                                onCheckedChange={() => toggleArtworkSelection(item.id)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-sm text-muted-foreground">No items found</div>
                    </div>
                )}
            </div>
        </div>
        <DialogFooter>
            <div className="flex-grow text-sm text-muted-foreground">
                {selectedCount} item(s) selected
            </div>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAssigning}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignArtworks} 
            disabled={selectedCount === 0 || isAssigning}
          >
            {isAssigning ? 'Assigning...' : `Assign ${selectedCount} Item(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 