'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore'; // Disabled - using mock data
// import { db } from '@/lib/firebase'; // Disabled - using mock data

interface GalleryData {
  id: string;
  name: string;
  email: string;
  uid: string;
  darkLogo?: string;
  lightLogo?: string;
}

interface GalleryContextType {
  gallery: GalleryData | null;
  loading: boolean;
  error: string | null;
  setGalleryId: (galleryId: string) => void;
  refreshGallery: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [galleryId, setGalleryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock gallery data
  const mockGallery: GalleryData = {
    id: 'demo-gallery',
    name: 'Demo',
    email: 'demo@exhibitiq.com',
    uid: 'demo-user',
    darkLogo: '/dark.png',
    lightLogo: '/light.png'
  };

  const fetchGalleryData = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Gallery Context: Using mock gallery data for ID:', id);
      // Always return mock gallery data
      setGallery(mockGallery);
    } catch (err) {
      console.error('Gallery Context: Error with mock gallery data:', err);
      setError('Failed to load gallery data');
      setGallery(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = async () => {
    if (galleryId) {
      await fetchGalleryData(galleryId);
    }
  };

  // Load gallery from localStorage on mount
  useEffect(() => {
    const storedGallery = localStorage.getItem('selectedGallery');
    if (storedGallery) {
      try {
        const parsedGallery = JSON.parse(storedGallery);
        if (parsedGallery.galleryId) {
          setGalleryId(parsedGallery.galleryId);
        }
      } catch (err) {
        console.error('Gallery Context: Error parsing stored gallery:', err);
      }
    } else {
      // Set default mock gallery if no stored gallery
      setGalleryId('demo-gallery');
    }
  }, []);

  // Fetch gallery data when galleryId changes
  useEffect(() => {
    if (galleryId) {
      fetchGalleryData(galleryId);
    }
  }, [galleryId]);

  const handleSetGalleryId = (id: string) => {
    setGalleryId(id);
  };

  const value = {
    gallery,
    loading,
    error,
    setGalleryId: handleSetGalleryId,
    refreshGallery,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
} 