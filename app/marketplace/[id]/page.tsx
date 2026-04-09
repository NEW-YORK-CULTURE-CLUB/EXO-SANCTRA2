'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, Eye, DollarSign, Calendar, MapPin, Palette, Ruler, Shield, Sparkles, Play, Pause, Building2, ExternalLink, Square, Link, FileText, Download, Plus, CheckCircle } from 'lucide-react';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArtworkService, Artwork } from '@/lib/artwork-service';
import { ArtworkInteractionService } from '@/lib/artwork-interaction-service';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageModal } from '@/components/image-modal';
import { ArtInquiryForm } from '@/components/art-inquiry-form';
import { useTheme } from 'next-themes';
import { useAnalytics } from '@/hooks/use-analytics';
import { QRCodeTracker } from '@/components/qr-code-tracker';
import { AgeVerificationModal } from '@/components/age-verification-modal';
import { WatermarkService } from '@/lib/watermark-service';
import { PatronSignupModal } from '@/components/patron-signup-modal';
import { toast } from 'sonner';

// Extended interface for marketplace display
interface MarketplaceItem {
  id: string;
  title?: string;
  // Artwork fields
  artist?: string;
  artistId?: string;
  year?: number;
  medium?: string;
  itemType?: string;
  nativeType?: string;
  size?: string;
  // Object fields
  makerManufacturer?: string;
  modelNameCode?: string;
  productionYearEra?: string;
  materialsComposition?: string;
  // Collectible fields
  seriesSetName?: string;
  modelVersionSku?: string;
  releaseYearEra?: string;
  manufacturerBrand?: string;
  // Memorabilia fields
  associatedPersons?: string;
  associatedTeamOrganization?: string;
  eventNameDate?: string;
  // Common fields
  price?: number;
  priceType?: string;
  condition?: string;
  framed?: string;
  location?: string;
  digitalFloor?: string;
  status?: string;
  description?: string;
  matureContent?: 'Yes' | 'No';
  createdAt?: any;
  images?: (string | any)[];
  certificates?: any[];
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
  // Additional fields
  imageUrl?: string;
  priceHistory?: string[];
  provenance?: string;
  exhibitionHistory?: string;
  // Dimensions
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  unitSystem?: string;
}

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const videoPatterns = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
  
  const lowerUrl = url.toLowerCase();
  
  // Check for video file extensions
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return true;
  }
  
  // Check for video platform URLs
  if (videoPatterns.some(pattern => lowerUrl.includes(pattern))) {
    return true;
  }
  
  return false;
};

// Helper function to get YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get Vimeo video ID
const getVimeoVideoId = (url: string): string | null => {
  const regExp = /vimeo\.com\/([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export default function ItemDetail() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [itemCollection, setItemCollection] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [memorabilia, setMemorabilia] = useState<MarketplaceItem[]>([]);
  const [loadingMemorabilia, setLoadingMemorabilia] = useState(false);
  const [inquiryFormOpen, setInquiryFormOpen] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [showPatronSignup, setShowPatronSignup] = useState(false);
  const [patronSignupTimer, setPatronSignupTimer] = useState<NodeJS.Timeout | null>(null);
  const { theme, resolvedTheme } = useTheme();
  // Alias to maintain backward compatibility with existing code using `artwork`
  const artwork = item;
  
  // Analytics tracking
  const {
    trackArtworkView,
    trackArtworkInquiry,
    trackFavoriteToggle,
    trackShareArtwork,
    trackImageZoom,
    trackVideoPlay,
    trackTimeSpent,
    resetViewTracking
  } = useAnalytics();
  
  const pageLoadTime = useRef<number>(Date.now());

     // Set the currentURL after component mounts (client-side)
     useEffect(() => {
        setCurrentURL(`${window.location.origin}/`);

    }, []);
  


  useEffect(() => {
    const fetchItem = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        
        // Try to fetch from different collections
        let itemData: MarketplaceItem | null = null;
        let collectionName = '';
        
        // Try Artwork collection first
        const artworkRef = doc(db, 'Artwork', params.id as string);
        const artworkSnap = await getDoc(artworkRef);
        
        if (artworkSnap.exists()) {
          itemData = {
            id: artworkSnap.id,
            ...artworkSnap.data()
          } as MarketplaceItem;
          collectionName = 'Artwork';
        } else {
          // Try Objects collection
          const objectRef = doc(db, 'Objects', params.id as string);
          const objectSnap = await getDoc(objectRef);
          
          if (objectSnap.exists()) {
            itemData = {
              id: objectSnap.id,
              ...objectSnap.data()
            } as MarketplaceItem;
            collectionName = 'Objects';
          } else {
            // Try Collectibles collection
            const collectibleRef = doc(db, 'Collectibles', params.id as string);
            const collectibleSnap = await getDoc(collectibleRef);
            
            if (collectibleSnap.exists()) {
              itemData = {
                id: collectibleSnap.id,
                ...collectibleSnap.data()
              } as MarketplaceItem;
              collectionName = 'Collectibles';
            }
          }
        }
        
        if (itemData) {
          console.log(`${collectionName} data:`, itemData);
          setItem(itemData);
          setItemCollection(collectionName);
          
          // Check if user has favorited or wishlisted this item
          if (user) {
            try {
              const itemType = getItemTypeFromCollection(collectionName);
              console.log('Using item type:', itemType, 'for collection:', collectionName);
              const [favorited, wishlisted] = await Promise.all([
                ArtworkInteractionService.isFavorited(user.uid, itemData.id, itemType),
                ArtworkInteractionService.isInWishlist(user.uid, itemData.id, itemType)
              ]);
              setIsFavorited(favorited);
              setIsInWishlist(wishlisted);
            } catch (err) {
              console.error('Error checking user interactions:', err);
            }
          }
          
          // Load memorabilia for this item (only for artworks)
          if (itemData.id && collectionName === 'Artwork') {
            await loadMemorabilia(itemData.id);
          }
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  // Refresh user interactions when user changes
  useEffect(() => {
    if (user && item) {
      refreshUserInteractions();
    }
  }, [user, item]);

  // Track item view when item loads
  useEffect(() => {
    if (item) {
      // Check if item has mature content and user needs age verification
      if (item.matureContent === 'Yes') {
        const ageVerified = localStorage.getItem('ageVerified');
        const verificationTimestamp = localStorage.getItem('ageVerificationTimestamp');
        
        // Check if verification is still valid (24 hours)
        const isVerificationValid = verificationTimestamp && 
          (Date.now() - parseInt(verificationTimestamp)) < (24 * 60 * 60 * 1000);
        
        if (!ageVerified || !isVerificationValid) {
          // Show age verification modal
          setShowAgeVerification(true);
          return; // Don't track view until verified
        }
      }
      
      const galleryInfo = item.galleryData ? Object.values(item.galleryData)[0] : null;
      
      trackArtworkView(
        galleryInfo?.galleryId || 'unknown',
        galleryInfo?.name || 'Unknown Gallery',
        item.id || '',
        item.title || 'Unknown Item',
        item.artistId || 'unknown',
        item.artist || item.makerManufacturer || item.manufacturerBrand || 'Unknown Creator'
      );

      // Start patron signup timer (20 seconds)
      if (user && galleryInfo && !showPatronSignup) {
        const timer = setTimeout(() => {
          // Check if user is already a patron of this gallery
          const userPatronTo = (userData as any)?.patronTo || [];
          const isAlreadyPatron = userPatronTo.some((patron: any) => patron.galleryId === galleryInfo.galleryId);
          
          if (!isAlreadyPatron) {
            setShowPatronSignup(true);
          }
        }, 5000); // 5 seconds
        
        setPatronSignupTimer(timer);
      }
    }

    // Cleanup timer on unmount or when item changes
    return () => {
      if (patronSignupTimer) {
        clearTimeout(patronSignupTimer);
        setPatronSignupTimer(null);
      }
    };
  }, [item, trackArtworkView, user, userData, showPatronSignup]);

  // Track time spent when component unmounts
  useEffect(() => {
    return () => {
      if (item) {
        const timeSpent = Math.floor((Date.now() - pageLoadTime.current) / 1000);
        
        // Only track if timeSpent is a valid positive number
        if (timeSpent > 0 && !isNaN(timeSpent)) {
          const galleryInfo = item.galleryData ? Object.values(item.galleryData)[0] : null;
          
          trackTimeSpent(
            galleryInfo?.galleryId || 'unknown',
            galleryInfo?.name || 'Unknown Gallery',
            item.id || '',
            item.title || 'Unknown Item',
            item.artistId || 'unknown',
            item.artist || item.makerManufacturer || item.manufacturerBrand || 'Unknown Creator',
            timeSpent
          );
        }
      }
    };
  }, [item, trackTimeSpent]);

  const loadMemorabilia = async (itemId: string) => {
    try {
      setLoadingMemorabilia(true);
      const memorabiliaData = await ArtworkService.getMemorabilia(itemId);
      setMemorabilia(memorabiliaData as MarketplaceItem[]);
    } catch (error) {
      console.error('Error loading memorabilia:', error);
    } finally {
      setLoadingMemorabilia(false);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'On request';
    return `$${price.toLocaleString()}`;
  };

  const handleAgeVerificationConfirm = () => {
    setShowAgeVerification(false);
    // The artwork view will now be tracked since the modal is closed
  };

  const handleAgeVerificationCancel = () => {
    setShowAgeVerification(false);
    // Redirect back to marketplace
    router.push('/marketplace');
  };

  // Get the images array, fallback to imageUrl if no images array
  const getImages = () => {
    if (item?.images && item.images.length > 0) {
      // Handle both old string URLs and new processed image objects
      return item.images.map(img => {
        if (typeof img === 'string') {
          return img;
        } else if (img && typeof img === 'object' && img.variants) {
          // Return the highest quality variant URL
          const highestQualityVariant = img.variants.reduce((prev: any, current: any) => 
            (current.width > prev.width) ? current : prev
          );
          return highestQualityVariant.url;
        }
        return '';
      }).filter(Boolean);
    }
    if (item?.imageUrl) {
      return [item.imageUrl];
    }
    return [];
  };

  const images = getImages();
  const currentImage = images[selectedImageIndex];
  const isCurrentItemVideo = currentImage ? isVideoUrl(currentImage) : false;

  // Helper function to determine item type based on actual collection
  const getItemTypeFromCollection = (collectionName: string): 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia' => {
    switch (collectionName) {
      case 'Objects': return 'Objects';
      case 'Collectibles': return 'Collectibles';
      case 'Memorabilia': return 'Memorabilia';
      case 'Artwork':
      default: return 'Artwork';
    }
  };

  // Helper function to determine item type (legacy - for backward compatibility)
  const getItemType = (item: MarketplaceItem): 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia' => {
    if (item.makerManufacturer) return 'Objects';
    if (item.seriesSetName || item.manufacturerBrand) return 'Collectibles';
    if (item.associatedPersons || item.associatedTeamOrganization) return 'Memorabilia';
    return 'Artwork';
  };

  const refreshUserInteractions = async () => {
    if (!user || !item || !itemCollection) return;
    
    try {
      const itemType = getItemTypeFromCollection(itemCollection);
      console.log('Refreshing interactions with collection:', itemCollection, 'itemType:', itemType);
      const [favorited, wishlisted] = await Promise.all([
        ArtworkInteractionService.isFavorited(user.uid, item.id, itemType),
        ArtworkInteractionService.isInWishlist(user.uid, item.id, itemType)
      ]);
      
      setIsFavorited(favorited);
      setIsInWishlist(wishlisted);
    } catch (err) {
      console.error('Error refreshing user interactions:', err);
    }
  };


  const toggleFavorite = async () => {
    if (!user || !item || !itemCollection || isLoadingFavorite) return;
    
    setIsLoadingFavorite(true);
    try {
      const galleryInfo = item.galleryData ? Object.values(item.galleryData)[0] : null;
      const itemType = getItemTypeFromCollection(itemCollection);
      
      if (isFavorited) {
        await ArtworkInteractionService.removeFromFavorites(user.uid, item.id, itemType);
        toast.success('Removed from favorites');
      } else {
        await ArtworkInteractionService.addToFavorites(
          user.uid,
          item.id,
          itemType,
          item,
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery'
        );
        toast.success('Added to favorites');
      }
      
      // Refresh the state to ensure accuracy
      await refreshUserInteractions();
      
      trackFavoriteToggle(
        galleryInfo?.galleryId || 'unknown',
        galleryInfo?.name || 'Unknown Gallery',
        item.id || '',
        item.title || 'Unknown Artwork',
        item.artistId || 'unknown',
        item.artist || 'Unknown Artist',
        !isFavorited
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user || !item || !itemCollection || isLoadingWishlist) return;
    
    setIsLoadingWishlist(true);
    try {
      const galleryInfo = item.galleryData ? Object.values(item.galleryData)[0] : null;
      const itemType = getItemTypeFromCollection(itemCollection);
      
      if (isInWishlist) {
        await ArtworkInteractionService.removeFromWishlist(user.uid, item.id, itemType);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await ArtworkInteractionService.addToWishlist(
          user.uid,
          item.id,
          itemType,
          item,
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery',
          'medium',
          undefined,
          undefined,
          undefined
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const handleShare = async () => {
    if (!user || !item) return;
    
    try {
      const galleryInfo = item.galleryData ? Object.values(item.galleryData)[0] : null;
      
      if (navigator.share) {
        await navigator.share({
          title: `${item.title}`,
          url: `${currentURL}/marketplace/${item.id}`,
        });
        
        // Record share in database
        await ArtworkInteractionService.recordShare(
          user.uid,
          item.id,
          getItemType(item),
          item,
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery',
          'gallery'
        );
        
        trackShareArtwork(
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery',
          item.id || '',
          item.title || 'Unknown Artwork',
          item.artistId || 'unknown',
          item.artist || 'Unknown Artist',
          'native_share'
        );
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${currentURL}/marketplace/${item.id}`);
        toast.success('Link copied to clipboard!');
        
        // Record share in database
        await ArtworkInteractionService.recordShare(
          user.uid,
          item.id,
          getItemType(item),
          item,
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery',
          'link'
        );
        
        trackShareArtwork(
          galleryInfo?.galleryId || 'unknown',
          galleryInfo?.name || 'Unknown Gallery',
          item.id || '',
          item.title || 'Unknown Artwork',
          item.artistId || 'unknown',
          item.artist || 'Unknown Artist',
          'link'
        );
      }
    } catch (error) {
      console.error('Error sharing artwork:', error);
      toast.error('Failed to share item');
    }
  };

  const handleDownload = async () => {
    // Only allow downloads for images
    if (!artwork || !currentImage || isCurrentItemVideo) return;
    
    try {
      setIsDownloading(true);
      
      // Create filename based on artwork title
      const baseFilename = artwork.title 
        ? artwork.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : 'artwork';
      
      const filename = `${baseFilename}.jpg`;
      
      // Handle image download with watermark
      toast.info('Downloading image...');
      
      // Use the unified download method
      await WatermarkService.downloadWithWatermark(currentImage, filename);
      
      toast.success('Image downloaded successfully!');
      
      // Track download event
      if (artwork) {
        console.log('Image downloaded:', artwork.title);
      }
      
    } catch (error) {
      console.error('Error downloading artwork:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render video player based on platform
  const renderVideoPlayer = (videoUrl: string) => {
    const lowerUrl = videoUrl.toLowerCase();
    
    // YouTube
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="w-full h-full">
                            <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=${isVideoPlaying ? 1 : 0}&rel=0&modestbranding=1`}
                  title={artwork?.title || 'Artwork Video'}
                  className="w-full h-full rounded-2xl object-contain"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => {
                    if (isVideoPlaying && artwork) {
                      const galleryInfo = artwork.galleryData ? Object.values(artwork.galleryData)[0] : null;
                      
                      trackVideoPlay(
                        galleryInfo?.galleryId || 'unknown',
                        galleryInfo?.name || 'Unknown Gallery',
                        artwork.id || '',
                        artwork.title || 'Unknown Artwork',
                        artwork.artistId || 'unknown',
                        artwork.artist || 'Unknown Artist',
                        'youtube'
                      );
                    }
                  }}
                />
          </div>
        );
      }
    }
    
    // Vimeo
    if (lowerUrl.includes('vimeo.com')) {
      const videoId = getVimeoVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="w-full h-full">
                            <iframe
                  src={`https://player.vimeo.com/video/${videoId}?autoplay=${isVideoPlaying ? 1 : 0}&title=0&byline=0&portrait=0`}
                  title={artwork?.title || 'Artwork Video'}
                  className="w-full h-full rounded-2xl object-contain"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={() => {
                    if (isVideoPlaying && artwork) {
                      const galleryInfo = artwork.galleryData ? Object.values(artwork.galleryData)[0] : null;
                      
                      trackVideoPlay(
                        galleryInfo?.galleryId || 'unknown',
                        galleryInfo?.name || 'Unknown Gallery',
                        artwork.id || '',
                        artwork.title || 'Unknown Artwork',
                        artwork.artistId || 'unknown',
                        artwork.artist || 'Unknown Artist',
                        'vimeo'
                      );
                    }
                  }}
                />
          </div>
        );
      }
    }
    
    // Direct video file
    return (
      <div className="relative w-full h-full">
        <video
          src={videoUrl}
          className="w-full h-full object-cover rounded-2xl"
          autoPlay={isVideoPlaying}
          onLoadedMetadata={() => {
            const video = document.querySelector('video');
            if (video) {
              setVideoDuration(video.duration);
            }
          }}
          onTimeUpdate={() => {
            const video = document.querySelector('video');
            if (video) {
              setVideoCurrentTime(video.currentTime);
              setVideoProgress((video.currentTime / video.duration) * 100);
            }
          }}
          onPlay={() => {
            setIsVideoPlaying(true);
            
            // Track video play
            if (artwork) {
              const galleryInfo = artwork.galleryData ? Object.values(artwork.galleryData)[0] : null;
              
              trackVideoPlay(
                galleryInfo?.galleryId || 'unknown',
                galleryInfo?.name || 'Unknown Gallery',
                artwork.id || '',
                artwork.title || 'Unknown Artwork',
                artwork.artistId || 'unknown',
                artwork.artist || 'Unknown Artist',
                'direct'
              );
            }
          }}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Custom video controls without download */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex flex-col space-y-3">
            {/* Progress Bar */}
            <div className="w-full">
              <div className="relative">
                <div className="w-full bg-white/30 rounded-full h-1">
                  <div 
                    className="bg-white rounded-full h-1 transition-all duration-100"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                {/* Clickable progress bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={videoProgress}
                  onChange={(e) => {
                    const video = document.querySelector('video');
                    if (video) {
                      const newTime = (parseFloat(e.target.value) / 100) * video.duration;
                      video.currentTime = newTime;
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Play/Pause Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const video = document.querySelector('video');
                  if (video) {
                    if (video.paused) {
                      video.play();
                    } else {
                      video.pause();
                    }
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              {/* Time Display */}
              <div className="text-white text-xs font-medium">
                {(() => {
                  const formatTime = (seconds: number) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                  };
                  
                  return `${formatTime(videoCurrentTime)} / ${formatTime(videoDuration)}`;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted/20 rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted/20 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted/20 rounded"></div>
                <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                <div className="h-4 bg-muted/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The artwork you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/marketplace')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/marketplace')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-6">
              <ThemeToggle />

                <Heart 
                  onClick={toggleFavorite} 
                  className={`cursor-pointer w-5 h-5 transition-all ${isFavorited ? "fill-current" : "hover:fill-current"}`}
                />
                
                {isInWishlist ? (
                  <CheckCircle 
                    onClick={toggleWishlist}
                    className="cursor-pointer w-5 h-5 hover:text-blue-500 transition-colors"
                  />
                ) : isLoadingWishlist ? (
                  <span className="text-sm text-muted-foreground">
                    Adding...
                  </span>
                ) : (
                  <Plus 
                    onClick={toggleWishlist} 
                    className="cursor-pointer w-5 h-5 hover:text-blue-500 transition-colors"
                  />
                )}
               
             
                <Share2 onClick={handleShare} className="cursor-pointer w-5 h-5" />
                
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Image/Video */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/40 border">
              {currentImage ? (
                isCurrentItemVideo ? (
                  <div className="w-full h-full">
                    {renderVideoPlayer(currentImage)}
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img 
                      src={currentImage} 
                      alt={artwork.title || 'Artwork'} 
                      className={`w-full h-full object-contain cursor-zoom-in transition-all duration-300 ${
                        artwork.matureContent === 'Yes' && showAgeVerification ? 'filter blur-lg scale-110' : ''
                      }`}
                      onClick={() => {
                        // Don't allow zoom if age verification is needed
                        if (artwork.matureContent === 'Yes' && showAgeVerification) {
                          return;
                        }
                        
                        setModalImage(currentImage);
                        setModalOpen(true);
                        
                        // Track image zoom
                        if (artwork) {
                          const galleryInfo = artwork.galleryData ? Object.values(artwork.galleryData)[0] : null;
                          
                          trackImageZoom(
                            galleryInfo?.galleryId || 'unknown',
                            galleryInfo?.name || 'Unknown Gallery',
                            artwork.id || '',
                            artwork.title || 'Unknown Artwork',
                            artwork.artistId || 'unknown',
                            artwork.artist || 'Unknown Artist'
                          );
                        }
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {artwork.matureContent === 'Yes' && showAgeVerification && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white text-center p-4">
                        <div className="text-3xl mb-3">🔞</div>
                        <div className="text-lg font-medium mb-2">Mature Content</div>
                        <div className="text-sm opacity-80 mb-3">Age verification required to view</div>
                        <div className="text-xs opacity-60">Please confirm you are 18+ to proceed</div>
                      </div>
                    )}
                  </div>
                )
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${currentImage ? 'hidden' : ''}`}>
                <div className="text-8xl opacity-20">🎨</div>
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-4 right-4 space-x-2">
                {/* <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'} className='cursor-pointer'>
                 Do Something Fun
                </Badge> */}
                <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'} className='cursor-pointer'>
                 View in 3D
                </Badge>
                {/* <Badge variant="outline" className="bg-background/80">
                  {artwork.digitalFloor}
                </Badge> */}
              </div>
              
              {/* Download Button - Only show for images */}
              {currentImage && !isCurrentItemVideo && (
                <div className="absolute bottom-4 right-4 space-y-2">
                <div className="flex space-x-2">
                  
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className=" bg-primary hover:bg-primary/90 text-xs rounded-lg border-0 w-full"
                    title="Download"
                  >
                    <Download className="w-3 h-3 mr-0" />
                    {/* {isDownloading ? 'Processing...' : 'Download'} */}
                  </Button>
                 
                </div>
                </div>
              )}
              
              {/* Video Info - Show when video is playing */}
              {/* {currentImage && isCurrentItemVideo && (
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/50 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Play className="w-3 h-3" />
                      <span>Video playback only</span>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => {
                  const isVideo = isVideoUrl(image);
                  return (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-shrink-0 relative ${
                        index === selectedImageIndex 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted bg-muted/20 hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setIsVideoPlaying(false);
                      }}
                    >
                                             {isVideo ? (
                         <video 
                           src={image}
                           className="w-full h-full object-cover rounded"
                           muted
                           preload="metadata"
                         />
                       ) : (
                         <div className="relative w-full h-full">
                           <img 
                             src={image} 
                             alt={`${artwork.title} - Image ${index + 1}`}
                             className={`w-full h-full object-cover rounded cursor-zoom-in transition-all duration-300 ${
                               artwork.matureContent === 'Yes' && showAgeVerification ? 'filter blur-md scale-110' : ''
                             }`}
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.style.display = 'none';
                               target.parentElement?.classList.add('bg-muted/40');
                             }}
                           />
                           {artwork.matureContent === 'Yes' && showAgeVerification && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                               <div className="text-lg">🔞</div>
                             </div>
                           )}
                         </div>
                       )}
                      {isVideo && (
                        <div className="absolute top-1 right-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                            <Play className="w-1.5 h-1.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="space-y-4 -mt-3 sm:mt-0">
            {/* Title and Artist */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{artwork.title} • {artwork.year}</h1>
              <p className="text-sm text-muted-foreground mb-2">
                {artwork.itemType === 'Artwork' ? 'Artist: ' : 'By: '}
                <button 
                  onClick={() => router.push(`/marketplace/artist/${artwork.artistId || encodeURIComponent(artwork.artist || '')}`)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {artwork.artist}
                </button>
              </p>
         
              <div className="flex items-center space-x-2">

    {/* Gallery Information */}
    {artwork.galleryData && Object.keys(artwork.galleryData).length > 0 && (
                        <div className="flex items-center justify-center space-x-2">
                        <p className="text-muted-foreground text-sm">
                          Gallery:
                        </p>
                          {(() => {
                            const galleryInfo = Object.values(artwork.galleryData)[0];
                            const logoUrl = (resolvedTheme || theme) === "dark" ? (galleryInfo?.darkLogo || galleryInfo?.lightLogo) : (galleryInfo?.lightLogo || galleryInfo?.darkLogo);
                            
                            return logoUrl ? (
                              <img 
                                src={logoUrl} 
                                alt={`${galleryInfo?.name || 'Gallery'} logo`}
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <Building2 className="w-3 h-3 text-muted-foreground" />
                            );
                          })()}
                          <button 
                            onClick={() => {
                              const galleryData = artwork.galleryData;
                              if (galleryData && Object.keys(galleryData).length > 0) {
                                const galleryInfo = Object.values(galleryData)[0];
                                router.push(`/marketplace/gallery/${galleryInfo.galleryId}`);
                              }
                            }}
                            className="text-primary text-sm hover:text-primary/80 transition-colors"
                          >
                            {Object.values(artwork.galleryData)[0]?.name || 'Gallery'}
                          </button>
                        </div>
                      )}

              <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'}>
                  {artwork.status}
                </Badge>
                
              </div>

            <p className="text-sm flex items-center text-muted-foreground mt-2">
              <span className="mr-1">Certificate Of Authenticity:</span> 
              {artwork.certificates && artwork.certificates.some(cert => cert.type === 'certificate_of_authenticity') ? (
                <span className="inline-flex items-center">
                  <RiVerifiedBadgeFill className="w-4 h-4 text-blue-600 mr-1" />
                </span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </p>
            <p className="text-sm flex items-center text-muted-foreground mt-2">
              <span className="mr-1">Artist Statement:</span> 
              {artwork.certificates && artwork.certificates.some(cert => cert.type === 'artist_statement') ? (
                <span className="inline-flex items-center">
                  <RiVerifiedBadgeFill className="w-4 h-4 text-blue-600 mr-1" />
                </span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </p>
            <p className="text-sm flex items-center text-muted-foreground mt-2">
              <span className="mr-1">Provenance:</span> 
              {artwork.certificates && artwork.certificates.some(cert => cert.type === 'provenance') ? (
                <span className="inline-flex items-center">
                  <RiVerifiedBadgeFill className="w-4 h-4 text-blue-600 mr-1" />
                </span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </p>
            <p className="text-sm flex items-center text-muted-foreground mt-2">
              <span className="mr-1">Insurance Records:</span> 
              {artwork.certificates && artwork.certificates.some(cert => cert.type === 'insurance_records') ? (
                <span className="inline-flex items-center">
                  <RiVerifiedBadgeFill className="w-4 h-4 text-blue-600 mr-1" />
                </span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </p>
            </div>

            {/* Price */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(artwork.price)}
                    </p>
                    {artwork.priceType && (
                      <p className="text-sm text-muted-foreground">{artwork.priceType}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Button 
                      size="lg" 
                      onClick={() => {
                        setInquiryFormOpen(true);
                        
                        // Track inquiry click
                        if (artwork) {
                          const galleryInfo = artwork.galleryData ? Object.values(artwork.galleryData)[0] : null;
                          
                          trackArtworkInquiry(
                            galleryInfo?.galleryId || 'unknown',
                            galleryInfo?.name || 'Unknown Gallery',
                            artwork.id || '',
                            artwork.title || 'Unknown Artwork',
                            artwork.artistId || 'unknown',
                            artwork.artist || 'Unknown Artist',
                            artwork.price || 0
                          );
                        }
                      }} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Inquire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artwork Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Artwork Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Medium</p>
                      <p className="text-sm text-muted-foreground">{artwork.medium || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">{artwork.size || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Condition</p>
                      <p className="text-sm text-muted-foreground">{artwork.condition || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Square className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Framed</p>
                      <p className="text-sm text-muted-foreground">{artwork.framed || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{artwork.location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


               {/* Description */}
               {artwork.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {artwork.description && (
                      <>
                        {(() => {
                          // Check if the description contains HTML tags
                          const hasHtml = /<[^>]*>/.test(artwork.description);
                          
                          if (hasHtml) {
                            // If it's HTML content, render it directly
                            if (showFullDescription) {
                              return (
                                <div 
                                  className="prose prose-sm max-w-none text-muted-foreground"
                                  dangerouslySetInnerHTML={{ __html: artwork.description }}
                                />
                              );
                            } else {
                              // Create a temporary div to parse HTML and get text content for word count
                              const tempDiv = document.createElement('div');
                              tempDiv.innerHTML = artwork.description;
                              const textContent = tempDiv.textContent || tempDiv.innerText || '';
                              const wordCount = textContent.split(' ').length;
                              
                              if (wordCount <= 150) {
                                return (
                                  <div 
                                    className="prose prose-sm max-w-none text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: artwork.description }}
                                  />
                                );
                              } else {
                                // Truncate HTML content for preview
                                const truncatedHtml = artwork.description.substring(0, 500) + '...';
                                return (
                                  <>
                                    <div 
                                      className="prose prose-sm max-w-none text-muted-foreground"
                                      dangerouslySetInnerHTML={{ __html: truncatedHtml }}
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setShowFullDescription(true)}
                                      className="mt-4"
                                    >
                                      Read More
                                    </Button>
                                  </>
                                );
                              }
                            }
                          } else {
                            // Fallback to the old sentence-based approach for plain text
                            const sentences = artwork.description.split('.').filter(sentence => sentence.trim());
                            const wordCount = artwork.description.split(' ').length;
                            
                            if (wordCount <= 150 || showFullDescription) {
                              return sentences.map((sentence, index) => (
                                <p key={index} className="text-muted-foreground text-sm leading-relaxed">
                                  {sentence.trim()}.
                                </p>
                              ));
                            } else {
                              // Show only first few sentences that fit within 150 words
                              let currentWordCount = 0;
                              const visibleSentences = [];
                              
                              for (let i = 0; i < sentences.length; i++) {
                                const sentenceWordCount = sentences[i].split(' ').length;
                                if (currentWordCount + sentenceWordCount <= 50) {
                                  visibleSentences.push(sentences[i]);
                                  currentWordCount += sentenceWordCount;
                                } else {
                                  break;
                                }
                              }
                              
                              return (
                                <>
                                  {visibleSentences.map((sentence, index) => (
                                    <p key={index} className="text-muted-foreground text-sm leading-relaxed">
                                      {sentence.trim()}.
                                    </p>
                                  ))}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setShowFullDescription(true)}
                                    className="mt-4"
                                  >
                                    Read More
                                  </Button>
                                </>
                              );
                            }
                          }
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

                {/* Memorabilia Details - Only show if there is memorabilia */}
                {!loadingMemorabilia && memorabilia.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="w-5 h-5" />
                        <span>Memorabilia Details</span>
                      </CardTitle>
                      {/* <CardDescription>
                        Associated items to get related to this piece
                      </CardDescription> */}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {memorabilia.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                {/* <Badge variant="outline" className="text-xs">{item.medium}</Badge>
                                {item.year && (
                                  <Badge variant="secondary" className="text-xs">{item.year}</Badge>
                                )} */}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                by {item.artist}
                              </p>
                              
                              {item.description && (
                                <div 
                                  className="text-sm text-muted-foreground mb-3 line-clamp-2 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                              )}
                              
                              {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">SKU:</span> {item.sku}
                                </span>
                                {item.price && (
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Value:</span> {formatPrice(item.price)}
                                  </span>
                                )}
                                <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {item.status}
                                </Badge>
                              </div> */}
                            </div>
                            
                            {/* Show first image if available */}
                            {item.images && item.images.length > 0 && (
                              <div className="mt-3">
                                <img 
                                  src={(() => {
                                    const img = item.images[0];
                                    if (typeof img === 'string') {
                                      return img;
                                    } else if (img && typeof img === 'object' && img.variants) {
                                      // Return the highest quality variant URL
                                      const highestQualityVariant = img.variants.reduce((prev: any, current: any) => 
                                        (current.width > prev.width) ? current : prev
                                      );
                                      return highestQualityVariant.url;
                                    }
                                    return '';
                                  })()} 
                                  alt={`${item.title} preview`}
                                  className="w-full object-cover rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Button positioned under the image */}
                            <div className="flex justify-center mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/marketplace/${item.id}`)}
                                className="text-sm w-full"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}



            {/* Price History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Price History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {artwork.priceHistory ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Current Price</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(artwork.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Price Views</p>
                        <p className="text-sm text-muted-foreground">1,247 views</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Listed Date</p>
                        <p className="text-sm text-muted-foreground">
                          {artwork.createdAt ? new Date(artwork.createdAt.toDate()).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Price Type</p>
                        <p className="text-sm text-muted-foreground">{artwork.priceType || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Price history not available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

         

            {/* Gallery Information */}
            {artwork.galleryData && Object.keys(artwork.galleryData).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Gallery Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(artwork.galleryData).map(([galleryId, galleryInfo]) => (
                    <div key={galleryId} className="flex items-center space-x-4">
                      {/* Gallery Logo */}
                      <div className="w-16 h-16 rounded-lg border bg-muted/20 flex items-center justify-center overflow-hidden">
                        {galleryInfo.lightLogo || galleryInfo.darkLogo ? (
                          <img 
                            key={(resolvedTheme || theme)}
                            src={(resolvedTheme || theme) === "dark" ? galleryInfo.darkLogo : galleryInfo.lightLogo} 
                            alt={`${galleryInfo.name} logo`}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${galleryInfo.lightLogo || galleryInfo.darkLogo ? 'hidden' : ''}`}>
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                      
                      {/* Gallery Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{galleryInfo.name}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => router.push(`/marketplace/gallery/${galleryInfo.galleryId}`)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Gallery
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artwork.provenance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{artwork.provenance}</p>
                  </CardContent>
                </Card>
              )}
              
              {artwork.exhibitionHistory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exhibition History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{artwork.exhibitionHistory}</p>
                  </CardContent>
                </Card>
              )}
            </div>

        
          </div>
        </div>
      </div>
      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={modalImage || ''}
        alt={artwork.title || 'Artwork'}
      />

      {/* Art Inquiry Form */}
      <ArtInquiryForm
        isOpen={inquiryFormOpen}
        onClose={() => setInquiryFormOpen(false)}
        artworkTitle={artwork?.title}
      />

      {/* QR Code Tracker */}
      {artwork && (
        <QRCodeTracker
          galleryId={artwork.galleryData ? Object.values(artwork.galleryData)[0]?.galleryId || 'unknown' : 'unknown'}
          galleryName={artwork.galleryData ? Object.values(artwork.galleryData)[0]?.name || 'Unknown Gallery' : 'Unknown Gallery'}
          artworkId={artwork.id || ''}
          artworkTitle={artwork.title || 'Unknown Artwork'}
          artistId={artwork.artistId || 'unknown'}
          artistName={artwork.artist || 'Unknown Artist'}
        />
      )}

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onConfirm={handleAgeVerificationConfirm}
        onCancel={handleAgeVerificationCancel}
        artworkTitle={artwork?.title}
      />

      {/* Patron Signup Modal */}
      {artwork?.galleryData && Object.keys(artwork.galleryData).length > 0 && (
        <PatronSignupModal
          isOpen={showPatronSignup}
          onClose={() => {
            setShowPatronSignup(false);
            if (patronSignupTimer) {
              clearTimeout(patronSignupTimer);
              setPatronSignupTimer(null);
            }
          }}
          galleryData={{
            id: Object.values(artwork.galleryData)[0].galleryId,
            name: Object.values(artwork.galleryData)[0].name,
            email: '', // We don't have email in galleryData, so we'll use empty string
            darkLogo: Object.values(artwork.galleryData)[0].darkLogo,
            lightLogo: Object.values(artwork.galleryData)[0].lightLogo
          }}
          artworkTitle={artwork?.title}
        />
      )}
    </div>
  );
}
