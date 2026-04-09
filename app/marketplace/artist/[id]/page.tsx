'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, Eye, DollarSign, Calendar, MapPin, Palette, Ruler, Shield, Sparkles, Play, Pause, Building2, ExternalLink, Mail, Phone, Globe, Award, Users, TrendingUp, Star, ArrowRight, Camera } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageModal } from '@/components/image-modal';
import { useTheme } from 'next-themes';
import { ReputationBadge } from '@/components/reputation-score';
import { isArtist } from '@/lib/utils';

interface Artist {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  location?: string;
  status?: string;
  biography?: string;
  nationality?: string;
  birthYear?: number;
  deathYear?: number;
  photoURL?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  awards?: string[];
  exhibitions?: string[];
  collections?: string[];
  education?: string[];
  createdAt?: any;
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
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
}

interface AdditionalField {
  label: string;
  value: string;
}

export default function ArtistDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentURL, setCurrentURL] = useState<string | null>(null);
  const [showFullBiography, setShowFullBiography] = useState(false);
  const { theme } = useTheme();

  // Set the currentURL after component mounts (client-side)
  useEffect(() => {
    setCurrentURL(`${window.location.origin}/`);
  }, []);

  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        console.log('Fetching artist with ID:', params.id);
        
        // Check if this looks like a Firebase UID (28 characters, alphanumeric)
        const isFirebaseUID = /^[a-zA-Z0-9]{28}$/.test(params.id as string);
        console.log('Is Firebase UID:', isFirebaseUID);
        
        // First try to fetch artist from Users collection (where artist profiles are stored)
        const userRef = doc(db, 'users', params.id as string);
        let userSnap = await getDoc(userRef);
        
        console.log('User found in Users collection:', userSnap.exists());
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log('User data:', userData);
          
          // Check if this user is an artist
          if (isArtist(userData)) {
            // Create artist object from user data
            const artistData: Artist = {
              id: userSnap.id,
              name: userData.name || userData.displayName || 'Unknown Artist',
              email: userData.email,
              phone: userData.phone,
              specialty: userData.specialty,
              location: userData.city && userData.state ? `${userData.city}, ${userData.state}` : userData.city || userData.state,
              status: userData.status || 'active',
              biography: userData.biography,
              nationality: userData.nationality,
              birthYear: userData.birthYear ? parseInt(userData.birthYear) : undefined,
              deathYear: userData.deathYear ? parseInt(userData.deathYear) : undefined,
              photoURL: userData.photoURL,
              website: userData.additionalFields?.find((field: AdditionalField) => field.label === 'Website')?.value,
              socialMedia: {
                instagram: userData.additionalFields?.find((field: AdditionalField) => field.label === 'Instagram')?.value,
              },
              createdAt: userData.createdAt
            };
            console.log('Created artist from user data:', artistData);
            setArtist(artistData);
            
            // Fetch artist's artworks by name
            const artworksQuery = query(
              collection(db, 'Artwork'),
              where('artist', '==', artistData.name),
              limit(12)
            );
            const artworksSnap = await getDocs(artworksQuery);
            const artworksData = artworksSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Artwork[];
            console.log('Found artworks:', artworksData.length);
            setArtworks(artworksData);
            return;
          }
        }
        
        // If not found in Users, try Artists collection (for backward compatibility)
        const artistRef = doc(db, 'Artists', params.id as string);
        let artistSnap = await getDoc(artistRef);
        
        console.log('Artist found in Artists collection:', artistSnap.exists());
        
        // If not found by ID and it's not a Firebase UID, try to search by name
        if (!artistSnap.exists() && !isFirebaseUID) {
          const decodedName = decodeURIComponent(params.id as string);
          console.log('Searching by name:', decodedName);
          
          const artistsQuery = query(
            collection(db, 'Artists'),
            where('name', '==', decodedName)
          );
          const artistsSnap = await getDocs(artistsQuery);
          
          console.log('Artists found by name:', artistsSnap.size);
          
          if (!artistsSnap.empty) {
            const artistDoc = artistsSnap.docs[0];
            artistSnap = { exists: () => true, data: () => artistDoc.data(), id: artistDoc.id } as any;
          }
        }
        
        if (artistSnap.exists()) {
          const artistData = {
            id: artistSnap.id,
            ...artistSnap.data()
          } as Artist;
          console.log('Setting artist data:', artistData);
          setArtist(artistData);
          
          // Fetch artist's artworks by name
          const artworksQuery = query(
            collection(db, 'Artwork'),
            where('artist', '==', artistData.name),
            limit(12)
          );
          const artworksSnap = await getDocs(artworksQuery);
          const artworksData = artworksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Artwork[];
          console.log('Found artworks:', artworksData.length);
          setArtworks(artworksData);
        } else {
          // If artist not found in any collection, create a basic artist object from the name
          const decodedName = isFirebaseUID ? 'Unknown Artist' : decodeURIComponent(params.id as string);
          console.log('Creating basic artist from name:', decodedName);
          
          const basicArtist: Artist = {
            id: params.id as string,
            name: decodedName,
            status: 'active'
          };
          setArtist(basicArtist);
          
          // Still fetch artworks by name
          const artworksQuery = query(
            collection(db, 'Artwork'),
            where('artist', '==', decodedName),
            limit(12)
          );
          const artworksSnap = await getDocs(artworksQuery);
          const artworksData = artworksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Artwork[];
          console.log('Found artworks for basic artist:', artworksData.length);
          setArtworks(artworksData);
        }
      } catch (err) {
        console.error('Error fetching artist:', err);
        setError('Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndArtworks();
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
          title: `${artist?.name}`,
          url: `${currentURL}/marketplace/artist/${artist?.id}`,
        });
      } catch (error) {
        console.error('Error sharing artist:', error);
      }
    }
  };

  const handleContact = () => {
    if (artist?.email) {
      window.open(`mailto:${artist.email}`, '_blank');
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

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The artist you are looking for does not exist.'}</p>
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
          {/* Artist Profile - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artist Photo and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/40 border">
                  {artist.photoURL ? (
                    <img 
                      src={artist.photoURL} 
                      alt={artist.name || 'Artist'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                                <div className={`absolute inset-0 flex items-center justify-center ${artist.photoURL ? 'hidden' : ''}`}>
                <Palette className="w-24 h-24 opacity-20" />
              </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant={artist.status === 'active' ? 'default' : 'secondary'}>
                      {artist.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
                  <div className="mb-3">
                    <ReputationBadge userId={artist.id} userType="artist" />
                  </div>
                  <p className="text-xl text-muted-foreground mb-4">{artist.specialty}</p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    {artist.birthYear && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {artist.birthYear}{artist.deathYear ? ` - ${artist.deathYear}` : ''}
                        </span>
                      </div>
                    )}
                    {artist.nationality && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{artist.nationality}</span>
                      </div>
                    )}
                    {artist.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{artist.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact and Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleContact} className="bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Artist
                  </Button>
                  {artist.website && (
                    <Button variant="outline" onClick={() => window.open(artist.website, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {artist.socialMedia?.instagram && (
                    <Button variant="outline" onClick={() => window.open(artist.socialMedia?.instagram, '_blank')}>
                      <Camera className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Biography */}
            {artist.biography && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Biography</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const sentences = artist.biography.split('.').filter(sentence => sentence.trim());
                      const wordCount = artist.biography.split(' ').length;
                      
                      if (wordCount <= 200 || showFullBiography) {
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
                              onClick={() => setShowFullBiography(true)}
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

            {/* Awards and Recognition */}
            {artist.awards && artist.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Awards & Recognition</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artist.awards.map((award, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">{award}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {artist.education && artist.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Education</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artist.education.map((edu, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{edu}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collections */}
            {artist.collections && artist.collections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Collections</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artist.collections.map((collection, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{collection}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Artist's Artworks - Right Column */}
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
                          <p className="text-xs text-muted-foreground mb-2">{artwork.medium}</p>
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
                    onClick={() => router.push(`/marketplace?artist=${artist.name}`)}
                  >
                    View All Artworks
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Palette className="w-16 h-16 mb-4 opacity-20 mx-auto" />
                  <h3 className="font-semibold mb-2">No Artworks Available</h3>
                  <p className="text-sm text-muted-foreground">
                    This artist doesn't have any artworks listed yet.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Artist Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Artist Stats</span>
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
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-semibold">
                      {artist.createdAt ? new Date(artist.createdAt.toDate()).getFullYear() : 'N/A'}
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
                  {artist.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{artist.email}</span>
                    </div>
                  )}
                  {artist.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{artist.phone}</span>
                    </div>
                  )}
                  {artist.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{artist.location}</span>
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
        alt={artist.name || 'Artist'}
      />
    </div>
  );
} 