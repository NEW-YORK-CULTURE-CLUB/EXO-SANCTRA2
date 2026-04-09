'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, LogIn, Home, Heart, Eye, DollarSign, Pen, Palette, Building2, Mic, MicOff, X, User, HelpCircle, Settings, LogOut } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArtworkService } from '@/lib/artwork-service';
import { ObjectService } from '@/lib/object-service';
import { CollectibleService } from '@/lib/collectible-service';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from "next/image";
import { useTheme } from "next-themes"
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaWallet } from 'react-icons/fa'
import Navbar from '@/components/Navbar';
import { AgeVerificationModal } from '@/components/age-verification-modal';
import { SecureImage } from '@/components/secure-image';
import ItemCard from '@/components/ItemCard';



interface Artwork {
  id: string;
  title?: string;
  artist?: string;
  year?: number;
  medium?: string;
  itemType?: string;
  nativeType?: string;
  size?: string;
  price?: number;
  priceType?: string;
  condition?: string;
  framed?: string;
  location?: string;
  digitalFloor?: string;
  status?: string;
  imageUrl?: string;
  description?: string;
  matureContent?: 'Yes' | 'No'; // New field for mature content flag
  createdAt?: any;
  images?: (string | any)[]; // Support both old string URLs and new processed image objects
  certificates?: any[]; // Changed from string to any[] to support array operations
  memorabilia?: string[]; // Array of artwork IDs that are memorabilia for this artwork
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

interface Object {
  id: string;
  title?: string;
  makerManufacturer?: string;
  modelNameCode?: string;
  productionYearEra?: string;
  materialsComposition?: string;
  price?: number;
  priceType?: string;
  location?: string;
  digitalFloor?: string;
  status?: string;
  description?: string;
  matureContent?: 'Yes' | 'No';
  createdAt?: any;
  images?: (string | any)[];
  certificates?: any[];
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

interface Collectible {
  id: string;
  title?: string;
  seriesSetName?: string;
  modelVersionSku?: string;
  releaseYearEra?: string;
  manufacturerBrand?: string;
  price?: number;
  priceType?: string;
  location?: string;
  digitalFloor?: string;
  status?: string;
  description?: string;
  matureContent?: 'Yes' | 'No';
  createdAt?: any;
  images?: (string | any)[];
  certificates?: any[];
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

// Recording Wave Component
const RecordingWave = () => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,];
  
  return (
    <div className="flex items-center space-x-0.5">
      {bars.map((_, i) => (
        <div
          key={i}
          className="w-0.5 bg-primary rounded-full recording-wave-bar"
          style={{
            height: `${Math.random() * 24 + 6}px`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
};

// Generate initials from full name
const getInitials = (fullName: string): string => {
  if (!fullName) return '';
  
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export default function Marketplace() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<Object[]>([]);
  const [filteredCollectibles, setFilteredCollectibles] = useState<Collectible[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  // Mature content handling
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | undefined>(undefined);
  const [selectedArtworkTitle, setSelectedArtworkTitle] = useState<string | undefined>(undefined);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);



  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
          toast.success(`Voice search: "${transcript}"`);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error('Speech recognition failed. Please try again.');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!isSpeechSupported) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info('Voice search stopped');
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast.info('Voice search started. Speak now...');
    }
  };

  // Fetch all items from Firebase
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setLoading(true);
        
        // Fetch artworks
        const artworksRef = collection(db, 'Artwork');
        const artworksQuery = query(artworksRef, orderBy('createdAt', 'desc'));
        const artworksSnapshot = await getDocs(artworksQuery);
        
        const artworksData = artworksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Get all artwork IDs that are used as memorabilia in other artworks
        // This prevents artworks that are memorabilia from appearing in the marketplace
        let memorabiliaIds: string[] = [];
        try {
          memorabiliaIds = await ArtworkService.getMemorabiliaArtworkIds();
          console.log(`Found ${memorabiliaIds.length} artworks used as memorabilia`);
        } catch (error) {
          console.error('Error fetching memorabilia IDs:', error);
          // If we can't fetch memorabilia IDs, we'll show all artworks
        }
        
        // Filter out artworks that are used as memorabilia
        const filteredArtworksData = artworksData.filter(artwork => 
          !memorabiliaIds.includes(artwork.id)
        );
        
        // Fetch objects
        const objectsRef = collection(db, 'Objects');
        const objectsQuery = query(objectsRef, orderBy('createdAt', 'desc'));
        const objectsSnapshot = await getDocs(objectsQuery);
        
        const objectsData = objectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch collectibles
        const collectiblesRef = collection(db, 'Collectibles');
        const collectiblesQuery = query(collectiblesRef, orderBy('createdAt', 'desc'));
        const collectiblesSnapshot = await getDocs(collectiblesQuery);
        
        const collectiblesData = collectiblesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`Found ${filteredArtworksData.length} artworks, ${objectsData.length} objects, ${collectiblesData.length} collectibles`);
        
        setArtworks(filteredArtworksData);
        setObjects(objectsData);
        setCollectibles(collectiblesData);
        setFilteredArtworks(filteredArtworksData);
        setFilteredObjects(objectsData);
        setFilteredCollectibles(collectiblesData);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Filter items based on search query and active tab
  useEffect(() => {
    // Filter by search query - only when explicitly searching
    if (searchQuery.trim() && isSearching) {
      const searchLower = searchQuery.toLowerCase();
      
      // Filter artworks
      const filteredArtworks = artworks.filter(artwork =>
        artwork.title?.toLowerCase().includes(searchLower) ||
        artwork.artist?.toLowerCase().includes(searchLower) ||
        artwork.medium?.toLowerCase().includes(searchLower) ||
        artwork.year?.toString().includes(searchLower)
      );
      setFilteredArtworks(filteredArtworks);
      
      // Filter objects
      const filteredObjects = objects.filter(obj =>
        obj.title?.toLowerCase().includes(searchLower) ||
        obj.makerManufacturer?.toLowerCase().includes(searchLower) ||
        obj.materialsComposition?.toLowerCase().includes(searchLower) ||
        obj.productionYearEra?.toString().includes(searchLower)
      );
      setFilteredObjects(filteredObjects);
      
      // Filter collectibles
      const filteredCollectibles = collectibles.filter(collectible =>
        collectible.title?.toLowerCase().includes(searchLower) ||
        collectible.seriesSetName?.toLowerCase().includes(searchLower) ||
        collectible.manufacturerBrand?.toLowerCase().includes(searchLower) ||
        collectible.releaseYearEra?.toString().includes(searchLower)
      );
      setFilteredCollectibles(filteredCollectibles);
      
      // Don't reset isSearching here - let it stay true for the current search
    } else {
      // Reset to all items when not searching
      setFilteredArtworks(artworks);
      setFilteredObjects(objects);
      setFilteredCollectibles(collectibles);
    }
  }, [searchQuery, isSearching, artworks, objects, collectibles]);

  const handleArtworkClick = (artworkId: string, artworkTitle?: string, matureContent?: string) => {
    // Check if artwork has mature content
    if (matureContent === 'Yes') {
      // Check if user has already verified age
      const ageVerified = localStorage.getItem('ageVerified');
      const verificationTimestamp = localStorage.getItem('ageVerificationTimestamp');
      
      // Check if verification is still valid (24 hours)
      const isVerificationValid = verificationTimestamp && 
        (Date.now() - parseInt(verificationTimestamp)) < (24 * 60 * 60 * 1000);
      
      if (ageVerified && isVerificationValid) {
        // User has verified age, proceed to artwork
        router.push(`/marketplace/${artworkId}`);
      } else {
        // Show age verification modal
        setSelectedArtworkId(artworkId);
        setSelectedArtworkTitle(artworkTitle || 'Unknown Artwork');
        setShowAgeVerification(true);
      }
    } else {
      // No mature content, proceed normally
      router.push(`/marketplace/${artworkId}`);
    }
  };

  const handleExplicitSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setShowSuggestions(false);
  };

  const handleAgeVerificationConfirm = () => {
    setShowAgeVerification(false);
    if (selectedArtworkId) {
      router.push(`/marketplace/${selectedArtworkId}`);
    }
  };

  const handleAgeVerificationCancel = () => {
    setShowAgeVerification(false);
    setSelectedArtworkId(undefined);
    setSelectedArtworkTitle(undefined);
  };

  const generateSearchSuggestions = (query: string) => {
    if (!query.trim()) return [];
    
    const allSuggestions = [
      // Art styles
      'abstract art', 'contemporary paintings', 'impressionism', 'expressionism', 'cubism', 'surrealism',
      'realism', 'minimalism', 'pop art', 'modern art', 'classical art', 'renaissance',
      // Mediums
      'oil paintings', 'watercolor', 'acrylic', 'gouache', 'pastel', 'charcoal', 'pencil',
      'ink', 'mixed media', 'collage', 'printmaking', 'etching', 'lithography',
      // Categories
      'sculpture', 'photography', 'ceramics', 'jewelry', 'antiques', 'collectibles',
      'glass art', 'textile art', 'digital art', 'installation art', 'performance art',
      // Objects
      'furniture', 'lighting', 'decorative objects', 'industrial design', 'mid-century modern',
      'vintage electronics', 'scientific instruments', 'musical instruments',
      // Collectibles
      'trading cards', 'comics', 'action figures', 'model cars', 'stamps', 'coins',
      'vintage toys', 'limited editions', 'sports memorabilia',
      // Subjects
      'landscape', 'portrait', 'still life', 'figure', 'animals', 'nature', 'cityscape',
      'abstract', 'geometric', 'organic', 'floral', 'architectural'
    ];
    
    const filtered = allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 8); // Limit to 8 suggestions
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price on request';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${Math.ceil(price / 100) / 10}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
  <Navbar />

      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-4 lg:pt-24 pt-14 pb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
            {!searchQuery && (
                <>
          <h1 className="text-4xl md:text-6xl font-bold sm:mb-4 mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
             <span className="lg:block hidden">The Art Of Discovery</span> <span className="lg:hidden">Art Discovery</span>
          </h1>
          <p className="text-sm flex items-center justify-center text-muted-foreground mb-4 max-w-2xl mx-auto">
            <span className="hidden lg:block">Explore our collection of artwork, objects, and collectibles. </span> 
            <span className="lg:hidden">Collection of artwork, objects, and collectibles. </span> 
          </p>
                </>
            )}
            
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto relative" ref={searchRef}>
            <div className="relative rounded-2xl lg:shadow-lg shadow-primary/10">
              <Search className="absolute lg:left-6 left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={isListening ? "" : "Search artworks, artists, or mood..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.trim().length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleExplicitSearch(searchQuery);
                    setShowSuggestions(false);
                  }
                }}
                className="lg:pl-14 pl-10 py-10 text-sm border border-muted bg-muted rounded-2xl transition-all duration-200 focus:bg-muted/80 focus:ring-2 focus:ring-primary/20"
              />
              
              {/* Right side icons */}
              <div className="absolute lg:right-6 right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-0">
                 {/* Microphone Icon */}
                 <button
                  onClick={toggleSpeechRecognition}
                  disabled={!isSpeechSupported}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isListening 
                      ? 'text-primary  animate-pulse' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={isSpeechSupported ? (isListening ? 'Stop listening' : 'Start voice search') : 'Speech recognition not supported'}
                >
                  {isListening ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
               
                {/* Camera Icon for Image Search */}
                <button
                  onClick={() => {
                    // Handle image search - camera or upload
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        // Handle image upload for search
                        toast.info('Image search feature coming soon!');
                      }
                    };
                    input.click();
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                  title="Search by image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
              

                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setIsSearching(false);
                      setFilteredArtworks(artworks);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search Button */}
                {/* <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      handleExplicitSearch(searchQuery);
                    }
                  }}
                  disabled={!searchQuery.trim()}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button> */}
              </div>
            </div>
            {/* {isSearching && searchQuery.trim() && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
            )} */}
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-muted border border-muted rounded-2xl shadow-lg z-50">
                <div className="p-2 space-y-1">
                   {/* Search Button */}
                   <div className="pt-2 border-t border-muted/50">
                    <button
                      onClick={() => handleExplicitSearch(searchQuery)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/80 rounded-lg flex items-center space-x-2 transition-colors text-primary font-medium"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search for "{searchQuery}"</span>
                    </button>
                  </div>
                  
                  {/* Popular Searches */}
                  <div className="px-3 py-2 text-xs text-muted-foreground font-medium">
                    Popular searches
                  </div>
                  {[
                    'abstract art',
                    'contemporary paintings',
                    'sculpture',
                    'digital art',
                    'impressionism',
                    'furniture',
                    'collectibles',
                    'vintage'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleExplicitSearch(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/80 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 11-18 0z" />
                      </svg>
                      <span>{suggestion}</span>
                    </button>
                  ))}
                  
                  {/* Popular Categories */}
                  {/* <div className="px-3 py-2 text-xs text-muted-foreground font-medium mt-3">
                    Popular categories
                  </div>
                  {[
                    'oil paintings',
                    'watercolor',
                    'photography',
                    'ceramics',
                    'jewelry',
                    'antiques'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleExplicitSearch(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/80 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{suggestion}</span>
                    </button>
                  ))} */}
                  
                 
                </div>
              </div>
            )}
            
            {/* Speech recognition indicator */}
            {isListening && (
              <div className="absolute inset-0 bg-primary/10 rounded-2xl border-2 border-primary/30 animate-pulse">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-full text-xs">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <RecordingWave />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Join Buttons */}
          {!searchQuery && (
            <div className="flex sm:flex-row items-center justify-center sm:gap-4 gap-1 mt-6">
              <div className="sm:text-sm text-xs text-muted-foreground sm:mb-0 sm:mr-0 mr-1">Join as</div>
              <div className="flex flex-wrap justify-center sm:gap-3 gap-1">
                <Button 
                  variant="outline" 
                  className="transition-all text-xs sm:text-sm duration-300 rounded-2xl sm:rounded-lg hover:scale-105"
                  onClick={() => {user ? router.push('/dashboard') : router.push('/auth/login')}}
                >
                  <Palette className="w-4 h-4 sm:mr-2 mr-0" />
                  Gallery
                </Button>
                <Button 
                  variant="outline" 
                  className="transition-all text-xs sm:text-sm duration-300 rounded-2xl sm:rounded-lg hover:scale-105"
                  onClick={() => {user ? router.push('/dashboard') : router.push('/auth/login')}}
                >
                  <Pen className="w-4 h-4 sm:mr-2 mr-0" />
                  Artist
                </Button>
                <Button 
                  variant="outline" 
                  className="transition-all text-xs sm:text-sm duration-300 rounded-2xl sm:rounded-lg hover:scale-105"
                  onClick={() => {user ? router.push('/dashboard') : router.push('/auth/login')}}
                >
                  <Heart className="w-4 h-4 sm:mr-2 mr-0" />
                  Patron
                </Button>
              </div>
            </div>
          )}


        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="lg:space-y-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {
            searchQuery &&
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {searchQuery ? `Search Results (${filteredArtworks.length})` : null}
            </h2>
            {searchQuery && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                  setIsSearching(false);
                  setFilteredArtworks(artworks);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Search
              </Button>
            )}
          </div>
          }

          {/* Category Tabs */}
          {!searchQuery && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/90 data-[state=active]:text-background">
                  All Items
                </TabsTrigger>
                <TabsTrigger value="artworks" className="data-[state=active]:bg-primary/90 data-[state=active]:text-background">
                  Artworks
                </TabsTrigger>
                  <TabsTrigger value="collectibles" className="data-[state=active]:bg-primary/90 data-[state=active]:text-background">
                  Collectibles
                </TabsTrigger>
                <TabsTrigger value="objects" className="data-[state=active]:bg-primary/90 data-[state=active]:text-background">
                  Objects
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted/20 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted/20 rounded"></div>
                    <div className="h-3 bg-muted/20 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* All Items Tab */}
              {activeTab === 'all' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredArtworks.map((artwork, index) => (
                    <ItemCard 
                      key={artwork.id}
                      item={artwork}
                      index={index}
                      itemType="artwork"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                  {filteredObjects.map((obj, index) => (
                    <ItemCard 
                      key={obj.id}
                      item={obj}
                      index={filteredArtworks.length + index}
                      itemType="object"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                  {filteredCollectibles.map((collectible, index) => (
                    <ItemCard 
                      key={collectible.id}
                      item={collectible}
                      index={filteredArtworks.length + filteredObjects.length + index}
                      itemType="collectible"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                </motion.div>
              )}

              {/* Artworks Tab */}
              {activeTab === 'artworks' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredArtworks.map((artwork, index) => (
                    <ItemCard 
                      key={artwork.id}
                      item={artwork}
                      index={index}
                      itemType="artwork"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                </motion.div>
              )}

              {/* Objects Tab */}
              {activeTab === 'objects' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredObjects.map((obj, index) => (
                    <ItemCard 
                      key={obj.id}
                      item={obj}
                      index={index}
                      itemType="object"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                </motion.div>
              )}

              {/* Collectibles Tab */}
              {activeTab === 'collectibles' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredCollectibles.map((collectible, index) => (
                    <ItemCard 
                      key={collectible.id}
                      item={collectible}
                      index={index}
                      itemType="collectible"
                      handleArtworkClick={handleArtworkClick}
                      resolvedTheme={resolvedTheme}
                      theme={theme}
                      formatPrice={formatPrice}
                    />
                  ))}
                </motion.div>
              )}

              {/* No Results */}
              {((activeTab === 'all' && filteredArtworks.length === 0 && filteredObjects.length === 0 && filteredCollectibles.length === 0) ||
                (activeTab === 'artworks' && filteredArtworks.length === 0) ||
                (activeTab === 'objects' && filteredObjects.length === 0) ||
                (activeTab === 'collectibles' && filteredCollectibles.length === 0)) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse our featured collection.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-16 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>© 2025 ExhibitIQ. All rights reserved.</p>
        </motion.div>
      </motion.div>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onConfirm={handleAgeVerificationConfirm}
        onCancel={handleAgeVerificationCancel}
        artworkTitle={selectedArtworkTitle}
      />
    </motion.div>
  );
}
