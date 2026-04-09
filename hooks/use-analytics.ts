import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import AnalyticsService, { AnalyticsEventType } from '@/lib/analytics-service';

export const useAnalytics = () => {
  const { user, userData } = useAuth();
  const analyticsService = AnalyticsService.getInstance();
  const pageLoadTime = useRef<number>(Date.now());
  const isTrackingEnabled = useRef<boolean>(true);
  const hasTrackedView = useRef<boolean>(false);

  // Get user type based on auth context
  const getUserType = useCallback((): 'anonymous' | 'registered' | 'gallery_owner' | 'artist' => {
    if (!user) return 'anonymous';
    
    // Check if user has userData with userType array
    if (userData?.userType && Array.isArray(userData.userType)) {
      if (userData.userType.includes('gallery')) return 'gallery_owner';
      if (userData.userType.includes('artist')) return 'artist';
      if (userData.userType.includes('collectors') || userData.userType.includes('patron')) return 'registered';
    }
    
    return 'registered';
  }, [user, userData]);

  // Track QR Code Scan
  const trackQRScan = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackQRScan(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking QR scan:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Artwork View - with deduplication
  const trackArtworkView = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string
  ) => {
    if (!isTrackingEnabled.current || hasTrackedView.current) return;
    
    try {
      await analyticsService.trackArtworkView(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        user?.uid,
        getUserType()
      );
      hasTrackedView.current = true;
    } catch (error) {
      console.error('Error tracking artwork view:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Artwork Inquiry
  const trackArtworkInquiry = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    inquiryValue: number
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackArtworkInquiry(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        inquiryValue,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking artwork inquiry:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Gallery View
  const trackGalleryView = useCallback(async (
    galleryId: string,
    galleryName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackGalleryView(
        galleryId,
        galleryName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking gallery view:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Artist View
  const trackArtistView = useCallback(async (
    galleryId: string,
    galleryName: string,
    artistId: string,
    artistName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackArtistView(
        galleryId,
        galleryName,
        artistId,
        artistName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking artist view:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Marketplace View
  const trackMarketplaceView = useCallback(async (
    galleryId: string,
    galleryName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackMarketplaceView(
        galleryId,
        galleryName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking marketplace view:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Digital Floor View
  const trackDigitalFloorView = useCallback(async (
    galleryId: string,
    galleryName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackDigitalFloorView(
        galleryId,
        galleryName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking digital floor view:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Favorite Toggle
  const trackFavoriteToggle = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    isFavorited: boolean
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackFavoriteToggle(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        isFavorited,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking favorite toggle:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Share Artwork
  const trackShareArtwork = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    shareMethod: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackShareArtwork(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        shareMethod,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking share artwork:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Image Zoom
  const trackImageZoom = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackImageZoom(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking image zoom:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Video Play
  const trackVideoPlay = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    videoPlatform: string
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackVideoPlay(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        videoPlatform,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking video play:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Track Time Spent
  const trackTimeSpent = useCallback(async (
    galleryId: string,
    galleryName: string,
    artworkId: string,
    artworkTitle: string,
    artistId: string,
    artistName: string,
    duration: number
  ) => {
    if (!isTrackingEnabled.current) return;
    
    try {
      await analyticsService.trackTimeSpent(
        galleryId,
        galleryName,
        artworkId,
        artworkTitle,
        artistId,
        artistName,
        duration,
        user?.uid,
        getUserType()
      );
    } catch (error) {
      console.error('Error tracking time spent:', error);
    }
  }, [analyticsService, user?.uid, getUserType]);

  // Force flush events
  const forceFlush = useCallback(async () => {
    try {
      await analyticsService.forceFlush();
    } catch (error) {
      console.error('Error forcing flush:', error);
    }
  }, [analyticsService]);

  // Track page exit and time spent
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - pageLoadTime.current) / 1000);
      
      // Get current page info from URL
      const path = window.location.pathname;
      const artworkId = path.match(/\/marketplace\/([^\/]+)/)?.[1];
      
      if (artworkId && isTrackingEnabled.current && hasTrackedView.current) {
        // We'll need to get artwork details from the page or pass them as props
        // For now, we'll track a generic time spent event
        trackTimeSpent(
          'unknown', // galleryId - would need to be passed from component
          'Unknown Gallery', // galleryName - would need to be passed from component
          artworkId,
          'Unknown Artwork', // artworkTitle - would need to be passed from component
          'unknown', // artistId - would need to be passed from component
          'Unknown Artist', // artistName - would need to be passed from component
          timeSpent
        );
      }
      
      // Force flush any remaining events
      forceFlush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackTimeSpent, forceFlush]);

  // Enable/Disable tracking
  const enableTracking = useCallback(() => {
    isTrackingEnabled.current = true;
  }, []);

  const disableTracking = useCallback(() => {
    isTrackingEnabled.current = false;
  }, []);

  // Reset view tracking for new pages
  const resetViewTracking = useCallback(() => {
    hasTrackedView.current = false;
    pageLoadTime.current = Date.now();
  }, []);

  return {
    trackQRScan,
    trackArtworkView,
    trackArtworkInquiry,
    trackGalleryView,
    trackArtistView,
    trackMarketplaceView,
    trackDigitalFloorView,
    trackFavoriteToggle,
    trackShareArtwork,
    trackImageZoom,
    trackVideoPlay,
    trackTimeSpent,
    forceFlush,
    enableTracking,
    disableTracking,
    resetViewTracking,
    isTrackingEnabled: isTrackingEnabled.current
  };
}; 