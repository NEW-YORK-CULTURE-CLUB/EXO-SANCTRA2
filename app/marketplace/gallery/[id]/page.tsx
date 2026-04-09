'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, Eye, DollarSign, Calendar, MapPin, Palette, Ruler, Shield, Sparkles, Play, Pause, Building2, ExternalLink, Mail, Phone, Globe, Award, Users, TrendingUp, Star, ArrowRight, Camera, Clock, Users2, MapPinIcon } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageModal } from '@/components/image-modal';
import { useTheme } from 'next-themes';
import { ReputationBadge } from '@/components/reputation-score';

interface Gallery {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  status?: string;
  logo?: string;
  darkLogo?: string;
  lightLogo?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  specialties?: string[];
  artists?: string[];
  exhibitions?: string[];
  createdAt?: any;
  galleryId?: string;
}

interface Artwork {
  id: string;
  title?: string;
  artist?: string;
  year?: number;
  medium?: string;
  size?: string;
  price?: number;
  priceType?: string;
  condition?: string;
  framed?: string;
  location?: string;
  status?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: any;
  images?: string[];
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

export default function GalleryDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Set the currentURL after component mounts (client-side)
  useEffect(() => {
    setCurrentURL(`${window.location.origin}/`);
  }, []);

  useEffect(() => {
    const fetchGalleryAndArtworks = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        console.log('Fetching gallery with ID:', params.id);
        
        // Check if this looks like a Firebase UID (28 characters, alphanumeric)
        const isFirebaseUID = /^[a-zA-Z0-9]{28}$/.test(params.id as string);
        console.log('Is Firebase UID:', isFirebaseUID);
        
        // First try to fetch gallery from Galleries collection
        const galleryRef = doc(db, 'Gallery', params.id as string);
        let gallerySnap = await getDoc(galleryRef);
        
        console.log('Gallery found in Galleries collection:', gallerySnap.exists());
        
        // If not found in Galleries, try Users collection (for gallery accounts)
        if (!gallerySnap.exists()) {
          console.log('Trying Users collection...');
          const userRef = doc(db, 'Users', params.id as string);
          const userSnap = await getDoc(userRef);
          
          console.log('User found in Users collection:', userSnap.exists());
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('User data:', userData);
            
            // Check if this user is a gallery
            if (userData.gallery === true || userData.type === 'gallery') {
              // Create gallery object from user data
              const galleryData: Gallery = {
                id: userSnap.id,
                name: userData.name || userData.displayName || userData.galleryName || 'Unknown Gallery',
                email: userData.email,
                phone: userData.phone,
                address: userData.address1,
                city: userData.city,
                state: userData.state,
                country: userData.country,
                website: userData.website,
                description: userData.description || userData.bio,
                foundedYear: userData.foundedYear ? parseInt(userData.foundedYear) : undefined,
                status: userData.status || 'active',
                logo: userData.logo || userData.photoURL,
                darkLogo: userData.darkLogo,
                lightLogo: userData.lightLogo,
                socialMedia: {
                  instagram: userData.instagram,
                  twitter: userData.twitter,
                  facebook: userData.facebook,
                },
                specialties: userData.specialties || [],
                artists: userData.artists || [],
                exhibitions: userData.exhibitions || [],
                createdAt: userData.createdAt
              };
              console.log('Created gallery from user data:', galleryData);
              setGallery(galleryData);
              
              // Fetch gallery's artworks by gallery ID
              const artworksQuery = query(
                collection(db, 'Artwork'),
                where('galleryData', '!=', null),
                limit(12)
              );
              const artworksSnap = await getDocs(artworksQuery);
              const artworksData = artworksSnap.docs
                .map(doc => ({
                  id: doc.id,
                  ...doc.data()
                } as Artwork))
                .filter(artwork => 
                  artwork.galleryData && 
                  Object.values(artwork.galleryData).some((gallery: any) => gallery.galleryId === userSnap.id)
                );
              console.log('Found artworks:', artworksData.length);
              setArtworks(artworksData);
              return;
            }
          }
        }
        
        // If not found by ID and it's not a Firebase UID, try to search by name
        if (!gallerySnap.exists() && !isFirebaseUID) {
          const decodedName = decodeURIComponent(params.id as string);
          console.log('Searching by name:', decodedName);
          
          const galleriesQuery = query(
            collection(db, 'Gallery'),
            where('name', '==', decodedName)
          );
          const galleriesSnap = await getDocs(galleriesQuery);
          
          console.log('Galleries found by name:', galleriesSnap.size);
          
          if (!galleriesSnap.empty) {
            const galleryDoc = galleriesSnap.docs[0];
            gallerySnap = { exists: () => true, data: () => galleryDoc.data(), id: galleryDoc.id } as any;
          }
        }
        
        if (gallerySnap.exists()) {
          const galleryData = {
            id: gallerySnap.id,
            ...gallerySnap.data()
          } as Gallery;
          console.log('Setting gallery data:', galleryData);
          setGallery(galleryData);
          
          // Fetch gallery's artworks by gallery ID
          const artworksQuery = query(
            collection(db, 'Artwork'),
            where('galleryData', '!=', null),
            limit(12)
          );
          const artworksSnap = await getDocs(artworksQuery);
          const artworksData = artworksSnap.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Artwork))
            .filter(artwork => 
              artwork.galleryData && 
              Object.values(artwork.galleryData).some((gallery: any) => gallery.galleryId === gallerySnap.id)
            );
          console.log('Found artworks:', artworksData.length);
          setArtworks(artworksData);
        } else {
          // If gallery not found in any collection, create a basic gallery object from the name
          const decodedName = isFirebaseUID ? 'Unknown Gallery' : decodeURIComponent(params.id as string);
          console.log('Creating basic gallery from name:', decodedName);
          
          const basicGallery: Gallery = {
            id: params.id as string,
            name: decodedName,
            status: 'active'
          };
          setGallery(basicGallery);
          
          // Still fetch artworks by gallery name
          const artworksQuery = query(
            collection(db, 'Artwork'),
            where('galleryData', '!=', null),
            limit(12)
          );
          const artworksSnap = await getDocs(artworksQuery);
          const artworksData = artworksSnap.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Artwork))
            .filter(artwork => 
              artwork.galleryData && 
              Object.values(artwork.galleryData).some((gallery: any) => gallery.name === decodedName)
            );
          console.log('Found artworks for basic gallery:', artworksData.length);
          setArtworks(artworksData);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryAndArtworks();
  }, [params.id]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price on request';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${Math.ceil(price / 100) / 10}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gallery?.name}`,
          url: `${currentURL}/marketplace/gallery/${gallery?.id}`,
        });
      } catch (error) {
        console.error('Error sharing gallery:', error);
      }
    }
  };

  const handleContact = () => {
    if (gallery?.email) {
      window.open(`mailto:${gallery.email}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted/20 rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-square bg-muted/20 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted/20 rounded"></div>
                  <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/20 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted/20 rounded-lg"></div>
                <div className="h-32 bg-muted/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The gallery you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()}>
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
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleFavorite}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Gallery Profile - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery Logo and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/40 border">
                  {gallery.logo || gallery.lightLogo || gallery.darkLogo ? (
                    <img 
                      key={(resolvedTheme || theme)}
                      src={(resolvedTheme || theme) === "dark" ? (gallery.darkLogo || gallery.lightLogo || gallery.logo) : (gallery.lightLogo || gallery.darkLogo || gallery.logo)} 
                      alt={gallery.name || 'Gallery'} 
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${gallery.logo || gallery.lightLogo || gallery.darkLogo ? 'hidden' : ''}`}>
                    <Building2 className="w-24 h-24 opacity-20" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant={gallery.status === 'active' ? 'default' : 'secondary'}>
                      {gallery.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{gallery.name}</h1>
                  <div className="mb-3">
                    <ReputationBadge userId={gallery.id} userType="gallery" />
                  </div>
                  <p className="text-xl text-muted-foreground mb-4">Art Gallery</p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    {gallery.foundedYear && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Founded {gallery.foundedYear}
                        </span>
                      </div>
                    )}
                    {gallery.city && (
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {[gallery.city, gallery.state, gallery.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact and Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleContact} className="bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Gallery
                  </Button>
                  {gallery.website && (
                    <Button variant="outline" onClick={() => window.open(gallery.website, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {gallery.socialMedia?.instagram && (
                    <Button variant="outline" onClick={() => window.open(gallery.socialMedia?.instagram, '_blank')}>
                      <Camera className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {gallery.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>About</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const sentences = gallery.description.split('.').filter(sentence => sentence.trim());
                      const wordCount = gallery.description.split(' ').length;
                      
                      if (wordCount <= 200 || showFullDescription) {
                        return sentences.map((sentence, index) => (
                          <p key={index} className="text-muted-foreground text-sm leading-relaxed">
                            {sentence.trim()}.
                          </p>
                        ));
                      } else {
                        let currentWordCount = 0;
                        const visibleSentences = [];
                        
                        for (let i = 0; i < sentences.length; i++) {
                          const sentenceWordCount = sentences[i].split(' ').length;
                          if (currentWordCount + sentenceWordCount <= 100) {
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
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialties */}
            {gallery.specialties && gallery.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Specialties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {gallery.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Artists */}
            {gallery.artists && gallery.artists.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Represented Artists</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gallery.artists.map((artist, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{artist}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exhibitions */}
            {gallery.exhibitions && gallery.exhibitions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Recent Exhibitions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gallery.exhibitions.map((exhibition, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">{exhibition}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Gallery's Artworks - Right Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Artworks</h2>
              <Badge variant="outline">{artworks.length} pieces</Badge>
            </div>

            {artworks.length > 0 ? (
              <div className="space-y-4">
                {artworks.map((artwork) => (
                  <Card 
                    key={artwork.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => router.push(`/marketplace/${artwork.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                          {artwork.imageUrl || (artwork.images?.[0]) ? (
                            <img 
                              src={artwork.imageUrl || artwork.images?.[0]} 
                              alt={artwork.title || 'Artwork'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement?.classList.add('bg-muted/40');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Palette className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">{artwork.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{artwork.artist}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">
                              {formatPrice(artwork.price)}
                            </span>
                            <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {artwork.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {artworks.length >= 12 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/marketplace?gallery=${gallery.name}`)}
                  >
                    View All Artworks
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-16 h-16 mb-4 opacity-20 mx-auto" />
                  <h3 className="font-semibold mb-2">No Artworks Available</h3>
                  <p className="text-sm text-muted-foreground">
                    This gallery doesn't have any artworks listed yet.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Gallery Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Gallery Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Artworks</span>
                    <span className="font-semibold">{artworks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Listings</span>
                    <span className="font-semibold">
                      {artworks.filter(a => a.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Represented Artists</span>
                    <span className="font-semibold">
                      {gallery.artists?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-semibold">
                      {gallery.createdAt ? new Date(gallery.createdAt.toDate()).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gallery.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{gallery.email}</span>
                    </div>
                  )}
                  {gallery.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{gallery.phone}</span>
                    </div>
                  )}
                  {gallery.address && (
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{gallery.address}</span>
                    </div>
                  )}
                  {gallery.city && (
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {[gallery.city, gallery.state, gallery.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={modalImage || ''}
        alt={gallery.name || 'Gallery'}
      />
    </div>
  );
} 