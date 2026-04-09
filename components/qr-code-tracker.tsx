import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

interface QRCodeTrackerProps {
  galleryId: string;
  galleryName: string;
  artworkId: string;
  artworkTitle: string;
  artistId: string;
  artistName: string;
  autoTrack?: boolean; // Make auto-tracking optional
}

export const QRCodeTracker: React.FC<QRCodeTrackerProps> = ({
  galleryId,
  galleryName,
  artworkId,
  artworkTitle,
  artistId,
  artistName,
  autoTrack = false // Default to false to prevent abuse
}) => {
  const { trackQRScan } = useAnalytics();

  useEffect(() => {
    // Only track QR scan if autoTrack is enabled
    if (!autoTrack) return;

    const trackScan = async () => {
      try {
        await trackQRScan(
          galleryId,
          galleryName,
          artworkId,
          artworkTitle,
          artistId,
          artistName
        );
        console.log('QR scan tracked successfully');
      } catch (error) {
        console.error('Error tracking QR scan:', error);
      }
    };

    // Simulate a small delay to ensure the page has loaded
    const timer = setTimeout(trackScan, 1000);

    return () => clearTimeout(timer);
  }, [trackQRScan, galleryId, galleryName, artworkId, artworkTitle, artistId, artistName, autoTrack]);

  // This component doesn't render anything visible
  return null;
}; 