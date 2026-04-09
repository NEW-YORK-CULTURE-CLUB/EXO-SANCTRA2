'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useGallery } from '@/contexts/gallery-context';
import { StatsCard } from "@/components/stats-card";
import { FeaturedArtworks } from "@/components/featured-artworks";
import { RecentActivity } from "@/components/recent-activity";
import { TopArtists } from "@/components/top-artists";
import { QuickActions } from "@/components/quick-actions.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  statsData, 
  featuredArtworks as dummyFeaturedArtworks, 
  recentActivity, 
  topArtists,
  upcomingAuctions,
  topBidders,
  activeQRCodes,
  digitalFloorPerformance
} from "@/data/homePageData";
import { UpcomingAuctions } from "@/components/upcoming-auctions";
import { TopBidders } from "@/components/top-bidders";
import { ActiveQRCodes } from "@/components/active-qr-codes";
import { DigitalFloorPerformance } from "@/components/digital-floor-performance";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import ExhibitIQWelcome from '@/components/exhibitiq-welcome';
import { ArtworkService } from '@/lib/artwork-service';

export default function Dashboard() {
  const { user, loading, userData } = useAuth();
  const { gallery, loading: galleryLoading } = useGallery();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [featuredArtworks, setFeaturedArtworks] = useState(dummyFeaturedArtworks);
  const [loadingArtworks, setLoadingArtworks] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Fetch real gallery artwork data if not Demo gallery
  useEffect(() => {
    const fetchGalleryArtworks = async () => {
      // Check if we should show dummy data
      const shouldShowDummyData = 
        !gallery?.id || 
        gallery?.name === 'Demo' || 
        gallery?.id === '9WseUqPm3JgV3DmIrzm9OaMynKr1' ||
        user?.uid === '9WseUqPm3JgV3DmIrzm9OaMynKr1';

      console.log('Gallery context:', {
        galleryId: gallery?.id,
        galleryName: gallery?.name,
        userId: user?.uid,
        shouldShowDummyData
      });

      if (shouldShowDummyData) {
        console.log('Using dummy data for:', { 
          galleryId: gallery?.id, 
          galleryName: gallery?.name, 
          userId: user?.uid,
          reason: !gallery?.id ? 'No gallery ID' : 
                  gallery?.name === 'Demo' ? 'Demo gallery' : 
                  gallery?.id === '9WseUqPm3JgV3DmIrzm9OaMynKr1' ? 'Specific gallery ID' : 
                  user?.uid === '9WseUqPm3JgV3DmIrzm9OaMynKr1' ? 'Specific user ID' : 'Unknown'
        });
        setFeaturedArtworks(dummyFeaturedArtworks);
        return;
      }

      // Fetch real gallery artwork data
      try {
        setLoadingArtworks(true);
        console.log('Fetching artworks for gallery:', gallery.id);
        const artworks = await ArtworkService.getArtworkByGalleryId(gallery.id);
        console.log('Fetched artworks:', artworks.length);
        
        // Debug: Log the first artwork structure
        if (artworks.length > 0) {
          console.log('Sample artwork structure:', {
            id: artworks[0].id,
            title: artworks[0].title,
            hasImages: !!artworks[0].images,
            imagesLength: artworks[0].images?.length,
            firstImageType: typeof artworks[0].images?.[0]
          });
        }
        
        // Take first 2 artworks and format them for the component
        const formattedArtworks = artworks.slice(0, 2).map(artwork => {
          // Use the ArtworkService method to get secure image URL
          let imageUrl = '/placeholder.png';
          
          try {
            const secureUrl = ArtworkService.getSecureImageUrl(artwork, 1280);
            if (secureUrl && secureUrl !== '' && secureUrl.startsWith('http')) {
              imageUrl = secureUrl;
            }
          } catch (error) {
            console.warn('Error getting secure image URL for artwork:', artwork.title, error);
            // Fallback to placeholder
            imageUrl = '/placeholder.png';
          }
          
          console.log('Artwork image processing:', { title: artwork.title, imageUrl });

          return {
            id: typeof artwork.id === 'string' ? parseInt(artwork.id) || Math.random() : (artwork.id || Math.random()),
            sku: artwork.sku,
            image: imageUrl,
            title: artwork.title,
            artist: artwork.artist,
            price: artwork.priceType === 'Fixed' ? `$${artwork.price.toLocaleString()}` : artwork.priceType
          };
        });

        console.log('Formatted artworks:', formattedArtworks);
        
        // If we have real artworks, use them; otherwise fall back to dummy data
        if (formattedArtworks.length > 0) {
          setFeaturedArtworks(formattedArtworks);
        } else {
          console.log('No real artworks found, using dummy data');
          setFeaturedArtworks(dummyFeaturedArtworks);
        }
      } catch (error) {
        console.error('Error fetching gallery artworks:', error);
        // Fall back to dummy data on error
        setFeaturedArtworks(dummyFeaturedArtworks);
      } finally {
        setLoadingArtworks(false);
      }
    };

    if (gallery?.id && !galleryLoading) {
      fetchGalleryArtworks();
    }
  }, [gallery?.id, gallery?.name, user?.uid, galleryLoading]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (loading || galleryLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  // Show welcome screen first
  if (showWelcome) {
    return <ExhibitIQWelcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className=" space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Header Section */}
        <motion.div 
          className="flex flex-col -mt-5 gap-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="lg:text-[35px] text-[30px] font-bold">
            <span className="text-primary lg:inline hidden">{gallery?.name || 'Demo'} </span> 
            <span className="text-muted-foreground">Gallery </span>
            <span className="text-foreground">Dashboard</span>
          </h1>
          <h6 className="text-[14px] px-1 text-muted-foreground ">Welcome back to {gallery?.name || 'Gallery'}. Here's what's happening today.</h6>
        </motion.div>

        {/* Stats Grid - Full Width at Top */}
        <motion.div 
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ y: -5 }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeText={stat.changeText}
                trend={stat.trend}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Layout - Responsive */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Content Area */}
          <div className="flex-1 order-1 lg:order-1">
            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full max-w-full lg:max-w-[400px] grid-cols-3">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="auctions" className="text-sm">Auctions</TabsTrigger>
                <TabsTrigger value="digital-floor" className="text-sm">Digital Floor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Featured Artworks Section */}
                <FeaturedArtworks artworks={featuredArtworks} loading={loadingArtworks} />

                {/* Recent Activity Section - Shows before Quick Actions on mobile */}
                <div className="block lg:hidden">
                  <RecentActivity activities={recentActivity} />
                </div>

                {/* Quick Actions - Mobile only, shows after Recent Activity */}
                <div className="block lg:hidden">
                  <QuickActions />
                </div>

                {/* Top Artists - Mobile only */}
                <div className="block lg:hidden">
                  <TopArtists artists={topArtists} />
                </div>

                {/* Recent Activity - Desktop only */}
                <div className="hidden lg:block">
                  <RecentActivity activities={recentActivity} />
                </div>
              </TabsContent>
              
            
               <TabsContent value="auctions" className="space-y-6 mt-6">
                {/* Upcoming Auctions Section */}
                <UpcomingAuctions auctions={upcomingAuctions} />

                {/* Top Bidders Section - Shows before Quick Actions on mobile */}
                <div className="block lg:hidden">
                  <TopBidders bidders={topBidders} />
                </div>

                {/* Quick Actions - Mobile only */}
                <div className="block lg:hidden">
                  <QuickActions />
                </div>

                {/* Top Artists - Mobile only */}
                <div className="block lg:hidden">
                  <TopArtists artists={topArtists} />
                </div>

                {/* Top Bidders - Desktop only */}
                <div className="hidden lg:block">
                  <TopBidders bidders={topBidders} />
                </div>
              </TabsContent>
              
              <TabsContent value="digital-floor" className="space-y-6 mt-6">
                {/* Active QR Codes Section */}
                <ActiveQRCodes qrCodes={activeQRCodes} />

                {/* Digital Floor Performance Section */}
                <DigitalFloorPerformance performance={digitalFloorPerformance} />

                {/* Quick Actions - Mobile only */}
                <div className="block lg:hidden">
                  <QuickActions />
                </div>

                {/* Top Artists - Mobile only */}
                <div className="block lg:hidden">
                  <TopArtists artists={topArtists} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden lg:block w-80 space-y-6 order-2">
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Top Artists */}
            <TopArtists artists={topArtists} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 