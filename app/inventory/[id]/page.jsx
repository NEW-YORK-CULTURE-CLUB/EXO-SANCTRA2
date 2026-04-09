"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChevronLeft, Edit, Save, X, Loader2, Eye, Download, Plus, Trash2, Search, Play, Pause, GripVertical, Move, CheckCircle, AlertCircle, FileText, Shield, FileCheck, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArtworkService } from "@/lib/artwork-service";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ArtworkDetailPageSkeleton } from "@/components/artwork-inventory-skeleton";
import { BlueCheckBadge } from "@/components/blue-check-badge";
// import { useGallery } from "@/contexts/gallery-context"; // Disabled - using mock data
import { artworkInventoryData } from "@/data/artworkInventoryData";
// import { UnifiedItemService } from "@/lib/unified-item-service"; // Disabled - using mock data

const conditionOptions = ["Excellent", "Good", "Fair", "Poor"];
const priceTypeOptions = ["Fixed", "By Request", "Auction"];
const framedOptions = ["Framed", "Unframed"];
const statusOptions = ["active", "inactive", "sold", "on-hold"];
const digitalFloorOptions = ["Active", "Inactive"];
const itemTypeOptions = ["Artwork", "Collectibles", "Objects"];
const nativeTypeOptions = ["Physical Native", "Digital Native"];
const storageLocationOptions = [
  "Main Gallery",
  "Vault A",
  "Vault B",
  "Exhibition Hall",
  "Storage Room A"
];

// Document type options with icons and descriptions
const documentTypeOptions = [
  {
    value: "certificate_of_authenticity",
    label: "Certificate of Authenticity",
    icon: CheckCircle,
    description: "Official certificate verifying the artwork's authenticity",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    value: "artist_statement",
    label: "Artist Statement",
    icon: FileText,
    description: "Artist's statement about the artwork",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    value: "provenance",
    label: "Provenance",
    icon: FileCheck,
    description: "Documentation of artwork ownership history",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "insurance_records",
    label: "Insurance Records",
    icon: Shield,
    description: "Insurance documentation and appraisals",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    value: "miscellaneous",
    label: "Miscellaneous",
    icon: FileText,
    description: "Other relevant documentation",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-800"
  }
];

// Helper function to get document type info
const getDocumentTypeInfo = (typeValue) => {
  return documentTypeOptions.find(option => option.value === typeValue) || documentTypeOptions[4]; // Default to miscellaneous
};

// Helper function to check if URL is a video
const isVideoUrl = (url) => {
  // Check if url is a valid string
  if (!url || typeof url !== 'string') {
    return false;
  }
  
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
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get Vimeo video ID
const getVimeoVideoId = (url) => {
  const regExp = /vimeo\.com\/([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Helper function to safely set selected image index
const setSelectedImageIndexSafely = (newIndex, imagesArray) => {
  if (imagesArray && imagesArray.length > 0) {
    if (newIndex >= 0 && newIndex < imagesArray.length) {
      setSelectedImageIndex(newIndex);
    } else {
      setSelectedImageIndex(0);
    }
  } else {
    setSelectedImageIndex(-1);
  }
};

// Helper function to validate media URL
const isValidMediaUrl = (url) => {
  return url && typeof url === 'string' && url.trim() !== '';
};

// Helper function to get images array, handling both old string URLs and new processed image objects
const getImages = (artwork) => {
  if (artwork?.images && artwork.images.length > 0) {
    // Handle both old string URLs and new processed image objects
    const processedImages = artwork.images.map(img => {
      if (typeof img === 'string') {
        return img;
      } else if (img && typeof img === 'object' && img.variants) {
        // Return the highest quality variant URL
        const highestQualityVariant = img.variants.reduce((prev, current) => 
          (current.width > prev.width) ? current : prev
        );
        return highestQualityVariant.url;
      }
      return '';
    }).filter(Boolean);
    
    // If we have processed images, return them
    if (processedImages.length > 0) {
      return processedImages;
    }
  }
  
  // Fallback to imageUrl if no processed images
  if (artwork?.imageUrl) {
    return [artwork.imageUrl];
  }
  
  return [];
};

export default function ArtworkDetail({ params }) {
  const { id } = use(params);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [memorabilia, setMemorabilia] = useState([]);
  const [showAddMemorabilia, setShowAddMemorabilia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingMemorabilia, setLoadingMemorabilia] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [newCertificate, setNewCertificate] = useState({ name: '', type: '', file: null });
  const [showAddImages, setShowAddImages] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [movingImage, setMovingImage] = useState(false);
  const [matureContent, setMatureContent] = useState(false);
  const [isDemoGallery, setIsDemoGallery] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // const { gallery } = useGallery(); // Disabled - using mock data
  const gallery = { galleryId: 'demo-gallery', name: 'Demo Gallery' }; // Mock gallery

  // Get the processed images array
  const images = artwork ? getImages(artwork) : [];
  const currentImage = images[selectedImageIndex];
  const isCurrentItemVideo = currentImage ? isVideoUrl(currentImage) : false;

  // Debug logging
  useEffect(() => {
    if (artwork) {
      console.log('Artwork data:', artwork);
      console.log('Raw images:', artwork.images);
      console.log('Processed images:', images);
      console.log('Current image:', currentImage);
      console.log('Selected index:', selectedImageIndex);
    }
  }, [artwork, images, currentImage, selectedImageIndex]);

  // Load demo data immediately
  useEffect(() => {
    console.log('Loading demo data for inventory item:', id);
    setIsDemoGallery(true);
    loadDummyData();
  }, [id]);

  const loadDummyData = () => {
    try {
      setLoading(true);
      // Find the item in dummy data by ID or SKU
      const dummyItem = artworkInventoryData.find(item => 
        item.id === id || item.sku === id || item.title === id
      );
      
      if (dummyItem) {
        setArtwork(dummyItem);
        // Reset selectedImageIndex to 0 if there are images, otherwise set to -1
        const processedImages = getImages(dummyItem);
        if (processedImages.length > 0) {
          setSelectedImageIndex(0);
        } else {
          setSelectedImageIndex(-1);
        }
        
        // Initialize form based on dummy item
        setForm({
          title: dummyItem.title || '',
          artist: dummyItem.artist || '',
          year: dummyItem.year || '',
          medium: dummyItem.medium || '',
          itemType: dummyItem.itemType || '',
          nativeType: dummyItem.nativeType || '',
          size: dummyItem.size || '',
          price: dummyItem.price || '',
          priceType: dummyItem.priceType || '',
          condition: dummyItem.condition || '',
          framed: dummyItem.framed || '',
          location: dummyItem.location || '',
          status: dummyItem.status || 'active',
          digitalFloor: dummyItem.digitalFloor || 'Inactive',
          description: dummyItem.description || '',
          artworkHistory: dummyItem.artworkHistory || '',
          internalNotes: dummyItem.internalNotes || ''
        });
        setMatureContent(dummyItem.matureContent === 'Yes' || dummyItem.matureContent === true);
        setLoading(false);
      } else {
        toast({
          title: "Item Not Found",
          description: "The requested item could not be found in demo data.",
          variant: "destructive",
        });
        router.push("/inventory");
      }
    } catch (error) {
      console.error('Error loading dummy data:', error);
      toast({
        title: "Error",
        description: "Failed to load item details.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const loadArtwork = async () => {
    try {
      setLoading(true);
      // Try loading any item type by SKU first, then fall back to Firestore document ID
      let data = await UnifiedItemService.getItemBySKU(id);
      if (!data) {
        data = await UnifiedItemService.getItemById(id);
      }
      if (data) {
        setArtwork(data);
        // Reset selectedImageIndex to 0 if there are images, otherwise set to -1
        const processedImages = getImages(data);
        if (processedImages.length > 0) {
          setSelectedImageIndex(0);
        } else {
          setSelectedImageIndex(-1);
        }
        
        // Initialize form based on item type
        const baseForm = {
          title: data.title || '',
          price: data.price || '',
          priceType: data.priceType || '',
          condition: data.condition || '',
          location: data.location || '',
          status: data.status || 'active',
          digitalFloor: data.digitalFloor || 'Inactive',
          description: data.description || '',
          internalNotes: data.internalNotes || '',
          matureContent: data.matureContent === 'Yes' || data.matureContent === true
        };

        // Add type-specific fields based on collectionSource
        switch (data.collectionSource) {
          case 'Artwork':
            setForm({
              ...baseForm,
              artist: data.artist || '',
              year: data.year || '',
              medium: data.medium || '',
              itemType: data.itemType || '',
              nativeType: data.nativeType || '',
              size: data.size || '',
              framed: data.framed || '',
              artworkHistory: data.artworkHistory || ''
            });
            break;
          case 'Collectibles':
            setForm({
              ...baseForm,
              seriesSetName: data.seriesSetName || '',
              editionRunSize: data.editionRunSize || '',
              manufacturerBrand: data.manufacturerBrand || '',
              grade: data.grade || '',
              // Collectibles have dimensions instead of size
              width: data.width || '',
              height: data.height || '',
              depth: data.depth || '',
              weight: data.weight || '',
              hasFrame: data.hasFrame || false,
              frameWidth: data.frameWidth || '',
              frameHeight: data.frameHeight || '',
              frameDepth: data.frameDepth || '',
              unitPreference: data.unitPreference || 'Imperial'
            });
            break;
          case 'Objects':
            setForm({
              ...baseForm,
              makerManufacturer: data.makerManufacturer || '',
              modelNameCode: data.modelNameCode || '',
              productionYearEra: data.productionYearEra || '',
              materialsComposition: data.materialsComposition || '',
              // Objects have dimensions instead of size
              width: data.width || '',
              height: data.height || '',
              depth: data.depth || '',
              weight: data.weight || '',
              hasFrame: data.hasFrame || false,
              frameWidth: data.frameWidth || '',
              frameHeight: data.frameHeight || '',
              frameDepth: data.frameDepth || '',
              unitPreference: data.unitPreference || 'Imperial'
            });
            break;
          case 'Memorabilia':
            setForm({
              ...baseForm,
              associatedPersons: data.associatedPersons || '',
              eventNameDate: data.eventNameDate || '',
              eraPeriod: data.eraPeriod || '',
              // Memorabilia have dimensions instead of size
              width: data.width || '',
              height: data.height || '',
              depth: data.depth || '',
              weight: data.weight || '',
              hasFrame: data.hasFrame || false,
              frameWidth: data.frameWidth || '',
              frameHeight: data.frameHeight || '',
              frameDepth: data.frameDepth || '',
              unitPreference: data.unitPreference || 'Imperial'
            });
            break;
          default:
            setForm(baseForm);
        }

        // Set mature content as boolean for UI handling
        setMatureContent(data.matureContent === 'Yes' || data.matureContent === true);
        // Load memorabilia
        await loadMemorabilia(data.id);
      } else {
        toast({
          title: "Item Not Found",
          description: "The requested item could not be found.",
          variant: "destructive",
        });
        router.push("/inventory");
      }
    } catch (error) {
      console.error('Error loading item:', error);
      toast({
        title: "Error",
        description: "Failed to load item details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMemorabilia = async (itemId) => {
    try {
      setLoadingMemorabilia(true);
      const memorabiliaData = await UnifiedItemService.getMemorabilia(itemId);
      setMemorabilia(memorabiliaData);
    } catch (error) {
      console.error('Error loading memorabilia:', error);
      toast({
        title: "Error",
        description: "Failed to load memorabilia.",
        variant: "destructive",
      });
    } finally {
      setLoadingMemorabilia(false);
    }
  };

  const handleSearchArtwork = async (searchValue) => {
    setSearchTerm(searchValue);
    
    if (searchValue.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await UnifiedItemService.searchItemsForMemorabilia(searchValue, artwork.id);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching items:', error);
      toast({
        title: "Error",
        description: "Failed to search items.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleAddMemorabilia = async (selectedItem) => {
    try {
      await UnifiedItemService.addMemorabilia(artwork.id, selectedItem.id);
      
      // Reload memorabilia
      await loadMemorabilia(artwork.id);
      
      // Clear search
      setSearchTerm('');
      setSearchResults([]);
      setShowAddMemorabilia(false);

      toast({
        title: "Memorabilia Added",
        description: `${selectedItem.title} has been added as memorabilia.`,
      });
    } catch (error) {
      console.error('Error adding memorabilia:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add memorabilia.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMemorabilia = async (memorabiliaId) => {
    try {
      await UnifiedItemService.removeMemorabilia(artwork.id, memorabiliaId);
      
      // Reload memorabilia
      await loadMemorabilia(artwork.id);
      
      toast({
        title: "Memorabilia Removed",
        description: "Memorabilia has been removed from this item.",
      });
    } catch (error) {
      console.error('Error removing memorabilia:', error);
      toast({
        title: "Error",
        description: "Failed to remove memorabilia.",
        variant: "destructive",
      });
          }
  };

  const handleAddCertificate = async () => {
    try {
      if (!newCertificate.name || !newCertificate.type || !newCertificate.file) {
        toast({
          title: "Error",
          description: "Please fill in all certificate fields.",
          variant: "destructive",
        });
        return;
      }

      // Upload certificate file
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('@/lib/firebase');
      
      const certRef = ref(storage, `artwork-certificates/${Date.now()}-${newCertificate.file.name}`);
      const snapshot = await uploadBytes(certRef, newCertificate.file);
      const url = await getDownloadURL(snapshot.ref);

      // Get document type info
      const docTypeInfo = getDocumentTypeInfo(newCertificate.type);
      
      // Create certificate object
      const certificate = {
        id: Date.now().toString(),
        name: newCertificate.name,
        type: newCertificate.type,
        typeLabel: docTypeInfo.label,
        url: url,
        uploadedAt: new Date().toISOString()
      };

      // Update item with new certificate
      const updatedCertificates = [...(artwork.certificates || []), certificate];
      await UnifiedItemService.updateItem(artwork.id, { certificates: updatedCertificates });

      // Update local state
      setArtwork(prev => ({ ...prev, certificates: updatedCertificates }));

      // Reset form
      setNewCertificate({ name: '', type: '', file: null });
      setShowAddCertificate(false);

      toast({
        title: "Certificate Added",
        description: "Certificate has been successfully added to the artwork.",
      });
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast({
        title: "Error",
        description: "Failed to add certificate.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCertificate = async (index) => {
    try {
      const updatedCertificates = artwork.certificates.filter((_, i) => i !== index);
      await UnifiedItemService.updateItem(artwork.id, { certificates: updatedCertificates });

      // Update local state
      setArtwork(prev => ({ ...prev, certificates: updatedCertificates }));

      toast({
        title: "Certificate Removed",
        description: "Certificate has been removed from the artwork.",
      });
    } catch (error) {
      console.error('Error removing certificate:', error);
      toast({
        title: "Error",
        description: "Failed to remove certificate.",
        variant: "destructive",
      });
    }
  };

  const handleAddImages = async () => {
    try {
      if (newImages.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one image to upload.",
          variant: "destructive",
        });
        return;
      }

      setUploadingImages(true);

      // Upload images
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('@/lib/firebase');
      
      const uploadedUrls = [];
      
      for (const image of newImages) {
        // Generate unique filename to prevent duplicates
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const imageRef = ref(storage, `artwork-images/${timestamp}-${randomId}-${image.name}`);
        
        const snapshot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      // Check for duplicates before adding
      const existingUrls = artwork.images || [];
      const newUniqueUrls = uploadedUrls.filter(url => !existingUrls.includes(url));
      
      if (newUniqueUrls.length === 0) {
        toast({
          title: "No New Images",
          description: "All selected images are already uploaded.",
          variant: "destructive",
        });
        return;
      }

      // Update item with new images
      const updatedImages = [...existingUrls, ...newUniqueUrls];
      await UnifiedItemService.updateItem(artwork.id, { images: updatedImages });

      // Update local state
      setArtwork(prev => ({ ...prev, images: updatedImages }));

      // Reset form
      setNewImages([]);
      setShowAddImages(false);

      toast({
        title: "Images Added",
        description: `${newUniqueUrls.length} new image(s) have been successfully added to the artwork.`,
      });
    } catch (error) {
      console.error('Error adding images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (imageIndex) => {
    // Add confirmation dialog
    if (!confirm(`Are you sure you want to delete this image? This action cannot be undone.`)) {
      return;
    }

    // Prevent multiple delete operations
    if (deletingImage) return;

    try {
      setDeletingImage(true);
      const updatedImages = artwork.images.filter((_, i) => i !== imageIndex);
      await UnifiedItemService.updateItem(artwork.id, { images: updatedImages });

      // Update local state
      setArtwork(prev => ({ ...prev, images: updatedImages }));

      // Reset selected image index if needed
      if (selectedImageIndex >= updatedImages.length) {
        setSelectedImageIndex(Math.max(0, updatedImages.length - 1));
      }

      toast({
        title: "Image Removed",
        description: "Image has been removed from the artwork.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image.",
        variant: "destructive",
      });
    } finally {
      setDeletingImage(false);
    }
  };

  // Simple image reordering - move image to first position (make primary)
  const handleMakePrimary = async (imageIndex) => {
    if (movingImage) return;
    
    try {
      setMovingImage(true);
      const images = [...artwork.images];
      const item = images.splice(imageIndex, 1)[0];
      images.unshift(item); // Move to first position
      
      await UnifiedItemService.updateItem(artwork.id, { images });
      
      // Update local item state
      setArtwork(prev => ({ ...prev, images }));
      
      // Update selected image index to 0 (primary image)
      setSelectedImageIndex(0);
      
      toast({
        title: "Primary Image Updated",
        description: "Image has been set as the primary image.",
      });
    } catch (error) {
      console.error('Error updating primary image:', error);
      toast({
        title: "Error",
        description: "Failed to update primary image.",
        variant: "destructive",
      });
    } finally {
      setMovingImage(false);
    }
  };

  // Simple image reordering - move image up one position
  const handleMoveImageUp = async (imageIndex) => {
    if (imageIndex === 0 || movingImage) return; // Already at top or already moving
    
    try {
      setMovingImage(true);
      const images = [...artwork.images];
      const item = images.splice(imageIndex, 1)[0];
      images.splice(imageIndex - 1, 0, item);
      
      await UnifiedItemService.updateItem(artwork.id, { images });
      
      // Update local item state
      setArtwork(prev => ({ ...prev, images }));
      
      // Update selected image index
      setSelectedImageIndex(imageIndex - 1);
      
      toast({
        title: "Image Moved",
        description: "Image has been moved up one position.",
      });
    } catch (error) {
      console.error('Error moving image:', error);
      toast({
        title: "Error",
        description: "Failed to move image.",
        variant: "destructive",
      });
    } finally {
      setMovingImage(false);
    }
  };

  // Simple image reordering - move image down one position
  const handleMoveImageDown = async (imageIndex) => {
    if (imageIndex === artwork.images.length - 1 || movingImage) return; // Already at bottom or already moving
    
    try {
      setMovingImage(true);
      const images = [...artwork.images];
      const item = images.splice(imageIndex, 1)[0];
      images.splice(imageIndex + 1, 0, item);
      
      await UnifiedItemService.updateItem(artwork.id, { images });
      
      // Update local item state
      setArtwork(prev => ({ ...prev, images }));
      
      // Update selected image index
      setSelectedImageIndex(imageIndex + 1);
      
      toast({
        title: "Image Moved",
        description: "Image has been moved down one position.",
      });
    } catch (error) {
      console.error('Error moving image:', error);
      toast({
        title: "Error",
        description: "Failed to move image.",
        variant: "destructive",
      });
    } finally {
      setMovingImage(false);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Build updates based on item type
      let updates = {
        title: form.title,
        price: parseFloat(form.price) || 0,
        priceType: form.priceType,
        condition: form.condition,
        location: form.location,
        status: form.status,
        digitalFloor: form.digitalFloor,
        description: form.description,
        internalNotes: form.internalNotes,
        matureContent: matureContent ? 'Yes' : 'No'
      };

      // Add type-specific fields
      if (artwork.collectionSource === 'Artwork') {
        updates = {
          ...updates,
          artist: form.artist,
          year: parseInt(form.year) || 0,
          medium: form.medium,
          itemType: form.itemType,
          nativeType: form.nativeType,
          size: form.size,
          framed: form.framed,
          artworkHistory: form.artworkHistory
        };
      } else if (artwork.collectionSource === 'Collectibles') {
        updates = {
          ...updates,
          seriesSetName: form.seriesSetName,
          editionRunSize: form.editionRunSize,
          manufacturerBrand: form.manufacturerBrand,
          grade: form.grade,
          width: parseFloat(form.width) || 0,
          height: parseFloat(form.height) || 0,
          depth: form.depth ? parseFloat(form.depth) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          hasFrame: form.hasFrame,
          frameWidth: form.frameWidth ? parseFloat(form.frameWidth) : null,
          frameHeight: form.frameHeight ? parseFloat(form.frameHeight) : null,
          frameDepth: form.frameDepth ? parseFloat(form.frameDepth) : null,
          unitPreference: form.unitPreference
        };
      } else if (artwork.collectionSource === 'Objects') {
        updates = {
          ...updates,
          makerManufacturer: form.makerManufacturer,
          modelNameCode: form.modelNameCode,
          productionYearEra: form.productionYearEra,
          materialsComposition: form.materialsComposition,
          width: parseFloat(form.width) || 0,
          height: parseFloat(form.height) || 0,
          depth: form.depth ? parseFloat(form.depth) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          hasFrame: form.hasFrame,
          frameWidth: form.frameWidth ? parseFloat(form.frameWidth) : null,
          frameHeight: form.frameHeight ? parseFloat(form.frameHeight) : null,
          frameDepth: form.frameDepth ? parseFloat(form.frameDepth) : null,
          unitPreference: form.unitPreference
        };
      } else if (artwork.collectionSource === 'Memorabilia') {
        updates = {
          ...updates,
          associatedPersons: form.associatedPersons,
          eventNameDate: form.eventNameDate,
          eraPeriod: form.eraPeriod,
          width: parseFloat(form.width) || 0,
          height: parseFloat(form.height) || 0,
          depth: form.depth ? parseFloat(form.depth) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          hasFrame: form.hasFrame,
          frameWidth: form.frameWidth ? parseFloat(form.frameWidth) : null,
          frameHeight: form.frameHeight ? parseFloat(form.frameHeight) : null,
          frameDepth: form.frameDepth ? parseFloat(form.frameDepth) : null,
          unitPreference: form.unitPreference
        };
      }

      await UnifiedItemService.updateItem(artwork.id, updates);
      
      // Update local artwork state
      setArtwork(prev => ({ ...prev, ...updates }));
      
      toast({
        title: `${artwork.collectionSource || 'Item'} Updated`,
        description: `${artwork.collectionSource || 'Item'} details have been successfully updated.`,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: `Failed to update ${artwork.collectionSource || 'item'} details.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original item data based on type
    const baseForm = {
      title: artwork.title || '',
      price: artwork.price || '',
      priceType: artwork.priceType || '',
      condition: artwork.condition || '',
      location: artwork.location || '',
      status: artwork.status || 'active',
      digitalFloor: artwork.digitalFloor || 'Inactive',
      description: artwork.description || '',
      internalNotes: artwork.internalNotes || ''
    };

    if (artwork.collectionSource === 'Artwork') {
      setForm({
        ...baseForm,
        artist: artwork.artist || '',
        year: artwork.year || '',
        medium: artwork.medium || '',
        itemType: artwork.itemType || '',
        nativeType: artwork.nativeType || '',
        size: artwork.size || '',
        framed: artwork.framed || '',
        artworkHistory: artwork.artworkHistory || ''
      });
    } else if (artwork.collectionSource === 'Collectibles') {
      setForm({
        ...baseForm,
        seriesSetName: artwork.seriesSetName || '',
        editionRunSize: artwork.editionRunSize || '',
        manufacturerBrand: artwork.manufacturerBrand || '',
        grade: artwork.grade || '',
        width: artwork.width || '',
        height: artwork.height || '',
        depth: artwork.depth || '',
        weight: artwork.weight || '',
        hasFrame: artwork.hasFrame || false,
        frameWidth: artwork.frameWidth || '',
        frameHeight: artwork.frameHeight || '',
        frameDepth: artwork.frameDepth || '',
        unitPreference: artwork.unitPreference || 'Imperial'
      });
    } else if (artwork.collectionSource === 'Objects') {
      setForm({
        ...baseForm,
        makerManufacturer: artwork.makerManufacturer || '',
        modelNameCode: artwork.modelNameCode || '',
        productionYearEra: artwork.productionYearEra || '',
        materialsComposition: artwork.materialsComposition || '',
        width: artwork.width || '',
        height: artwork.height || '',
        depth: artwork.depth || '',
        weight: artwork.weight || '',
        hasFrame: artwork.hasFrame || false,
        frameWidth: artwork.frameWidth || '',
        frameHeight: artwork.frameHeight || '',
        frameDepth: artwork.frameDepth || '',
        unitPreference: artwork.unitPreference || 'Imperial'
      });
    } else if (artwork.collectionSource === 'Memorabilia') {
      setForm({
        ...baseForm,
        associatedPersons: artwork.associatedPersons || '',
        eventNameDate: artwork.eventNameDate || '',
        eraPeriod: artwork.eraPeriod || '',
        width: artwork.width || '',
        height: artwork.height || '',
        depth: artwork.depth || '',
        weight: artwork.weight || '',
        hasFrame: artwork.hasFrame || false,
        frameWidth: artwork.frameWidth || '',
        frameHeight: artwork.frameHeight || '',
        frameDepth: artwork.frameDepth || '',
        unitPreference: artwork.unitPreference || 'Imperial'
      });
    } else {
      setForm(baseForm);
    }
    
    setMatureContent(artwork.matureContent === 'Yes' || artwork.matureContent === true);
    setIsEditing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Render video player based on platform
  const renderVideoPlayer = (videoUrl) => {
    // Validate videoUrl before processing
    if (!isValidMediaUrl(videoUrl)) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <p>Invalid video URL</p>
        </div>
      );
    }
    
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
              className="w-full h-full rounded-lg object-contain"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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
              className="w-full h-full rounded-lg object-contain"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    // Direct video file
    return (
      <video
        src={videoUrl}
        className="w-full h-full object-cover rounded-lg"
        controls
        autoPlay={isVideoPlaying}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onEnded={() => setIsVideoPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  const handleViewFull = () => {
    const currentImages = images;
    if (currentImages && currentImages[selectedImageIndex]) {
      setShowFullScreenModal(true);
    }
  };

  const handleDownload = async () => {
    const currentImages = images;
    if (!currentImages || !currentImages[selectedImageIndex]) {
      toast({
        title: "Error",
        description: "No valid file to download.",
        variant: "destructive",
      });
      return;
    }

    const currentMedia = currentImages[selectedImageIndex];
    
    try {
      // For direct file URLs, we can download directly
      if (isVideoUrl(currentMedia) && !currentMedia.includes('youtube.com') && !currentMedia.includes('vimeo.com')) {
        // Direct video file download
        const link = document.createElement('a');
        link.href = currentMedia;
        link.download = `artwork-${artwork.sku}-video-${selectedImageIndex + 1}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (!isVideoUrl(currentMedia)) {
        // Image download
        const link = document.createElement('a');
        link.href = currentMedia;
        link.download = `artwork-${artwork.sku}-image-${selectedImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For YouTube/Vimeo videos, show a message
        toast({
          title: "Download Not Available",
          description: "Direct download is not available for YouTube or Vimeo videos. Please use the platform's download feature.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Download Started",
        description: "File download has been initiated.",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewCertificate = (certificate) => {
    if (certificate.url) {
      // Open certificate in new tab
      window.open(certificate.url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Certificate URL not available.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    if (!certificate.url) {
      toast({
        title: "Error",
        description: "Certificate URL not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = certificate.url;
      link.download = `${certificate.name || 'certificate'}-${artwork.sku}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `${certificate.name} download has been initiated.`,
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ArtworkDetailPageSkeleton />;
  }

  if (!artwork) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background -mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/inventory")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit {artwork.collectionSource || 'Item'}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Item Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <Badge variant="outline" className="ml-2">
              {artwork.collectionSource || 'Item'}
            </Badge>
            <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'}>
              {artwork.status}
            </Badge>
            {/* {artwork.matureContent && (
              <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Mature Content
              </Badge>
            )} */}
          </div>
          {artwork.collectionSource === 'Artwork' ? (
            <p className="text-xl text-muted-foreground">by {artwork.artist}</p>
          ) : artwork.collectionSource === 'Collectibles' ? (
            <p className="text-xl text-muted-foreground">Series: {artwork.seriesSetName || 'Not specified'}</p>
          ) : artwork.collectionSource === 'Objects' ? (
            <p className="text-xl text-muted-foreground">Maker: {artwork.makerManufacturer || 'Not specified'}</p>
          ) : artwork.collectionSource === 'Memorabilia' ? (
            <p className="text-xl text-muted-foreground">Event: {artwork.eventNameDate || 'Not specified'}</p>
          ) : (
            <p className="text-xl text-muted-foreground">Item Details</p>
          )}
          <p className="text-sm text-muted-foreground">SKU: {artwork.sku}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Item Assets</CardTitle>
                  
                    <Button 
                      onClick={() => setShowAddImages(true)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Assets
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                {images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Display */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/20">
                      {images[selectedImageIndex] && selectedImageIndex >= 0 && selectedImageIndex < images.length ? (
                        isVideoUrl(images[selectedImageIndex]) ? (
                          renderVideoPlayer(images[selectedImageIndex])
                        ) : (
                          <Image
                            src={images[selectedImageIndex]}
                            alt={`${artwork.title} - Image ${selectedImageIndex + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        )
                                  ) : (
              <div className="flex items-center justify-center h-full">
                <Image 
                  src="/vault/AndyWarhol_Soup-Cans.jpg" 
                  alt="Artwork placeholder" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-full rounded-lg" 
                />
              </div>
            )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {images.length > 1 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Asset Display Order</span>
                          <span className="text-xs text-muted-foreground">
                            First image is the primary display image
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {images.map((media, index) => {
                            const isVideo = isVideoUrl(media);
                            const isPrimary = index === 0;
                            return (
                              <div
                                key={index}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                                  index === selectedImageIndex 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-muted bg-muted/20 hover:border-primary/50'
                                }`}
                                onClick={() => {
                                  setSelectedImageIndex(index);
                                  setIsVideoPlaying(false);
                                }}
                              >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                                  {isVideo ? (
                                    <video 
                                      src={media}
                                      className="w-full h-full object-cover"
                                      muted
                                      preload="metadata"
                                    />
                                  ) : (
                                    <Image 
                                      src={media} 
                                      alt={`${artwork.title} - Image ${index + 1}`}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  
                                  {/* Video indicator */}
                                  {isVideo && (
                                    <div className="absolute top-1 right-1">
                                      <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                        <Play className="w-1.5 h-1.5 text-white" />
                                      </div>
                                    </div>
                                  )}

                                  {/* Primary image indicator */}
                                  {isPrimary && (
                                    <div className="absolute top-1 left-1">
                                      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-2 h-2 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Image info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">
                                      {isVideo ? 'Video' : 'Image'} {index + 1}
                                    </span>
                                    {isPrimary && (
                                      <Badge variant="default" className="text-xs bg-green-500">
                                        Primary
                                      </Badge>
                                    )}
                                    {index === selectedImageIndex && (
                                      <Badge variant="outline" className="text-xs border-primary text-primary">
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {isVideo ? 'Video file' : 'Image file'}
                                  </p>
                                </div>

                                {/* Simple controls */}
                                <div className="flex flex-col gap-1">
                                  {/* Make primary button */}
                                  {!isPrimary && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMakePrimary(index);
                                      }}
                                      disabled={movingImage}
                                      className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition-all duration-200 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Make primary image"
                                    >
                                      {movingImage ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                  
                                  {/* Move up */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveImageUp(index);
                                    }}
                                    disabled={index === 0 || movingImage}
                                    className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 touch-manipulation"
                                    title="Move up"
                                  >
                                    {movingImage ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <ChevronUp className="w-5 h-5" />
                                    )}
                                  </button>
                                  
                                  {/* Move down */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveImageDown(index);
                                    }}
                                    disabled={index === images.length - 1 || movingImage}
                                    className="p-2 rounded-lg hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 touch-manipulation"
                                    title="Move down"
                                  >
                                    {movingImage ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5" />
                                    )}
                                  </button>

                                  {/* Delete button - Always visible */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImage(index);
                                    }}
                                    disabled={deletingImage}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete image"
                                  >
                                    {deletingImage ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Use the arrow buttons to reorder images. The first image is displayed as primary. Click the checkmark to make any image primary.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={handleViewFull}
                        disabled={!images || !images[selectedImageIndex]}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Full
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={handleDownload}
                        disabled={!images || !images[selectedImageIndex]}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isDemoGallery ? (
                      <div className="space-y-4">
                        <Image 
                          src="/vault/AndyWarhol_Soup-Cans.jpg" 
                          alt="Demo artwork placeholder" 
                          width={200} 
                          height={200} 
                          className="mx-auto rounded-lg object-cover" 
                        />
                        {/* <p>Demo mode - using placeholder image</p> */}
                      </div>
                    ) : (
                      <>
                        <p>No images or videos available</p>
                        {artwork?.imageUrl && (
                          <p className="text-xs mt-2">Fallback imageUrl: {artwork.imageUrl}</p>
                        )}
                        {artwork?.images && artwork.images.length > 0 && (
                          <p className="text-xs mt-2">Raw images array length: {artwork.images.length}</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="memorabilia">Memorabilia</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        {isEditing ? (
                          <Input
                            name="title"
                            value={form.title}
                            onChange={handleInput}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{artwork.title}</p>
                        )}
                      </div>
                      
                      {/* Show different fields based on item type */}
                      {artwork.collectionSource === 'Artwork' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium">Artist</label>
                            {isEditing ? (
                              <Input
                                name="artist"
                                value={form.artist}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.artist}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Year</label>
                            {isEditing ? (
                              <Input
                                name="year"
                                value={form.year}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.year}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Medium</label>
                            {isEditing ? (
                              <Input
                                name="medium"
                                value={form.medium}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.medium}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Item Type</label>
                            {isEditing ? (
                              <select
                                name="itemType"
                                value={form.itemType}
                                onChange={handleInput}
                                className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">Select item type</option>
                                {itemTypeOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1 text-sm">{artwork.itemType || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Native Type</label>
                            {isEditing ? (
                              <select
                                name="nativeType"
                                value={form.nativeType}
                                onChange={handleInput}
                                className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">Select native type</option>
                                {nativeTypeOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1 text-sm">{artwork.nativeType || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Size</label>
                            {isEditing ? (
                              <Input
                                name="size"
                                value={form.size}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.size}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Framed</label>
                            {isEditing ? (
                              <select
                                name="framed"
                                value={form.framed}
                                onChange={handleInput}
                                className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                {framedOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1 text-sm">{artwork.framed || 'Not specified'}</p>
                            )}
                          </div>
                        </>
                      ) : artwork.collectionSource === 'Collectibles' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium">Series/Set Name</label>
                            {isEditing ? (
                              <Input
                                name="seriesSetName"
                                value={form.seriesSetName}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.seriesSetName || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Edition/Run Size</label>
                            {isEditing ? (
                              <Input
                                name="editionRunSize"
                                value={form.editionRunSize}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.editionRunSize || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Manufacturer/Brand</label>
                            {isEditing ? (
                              <Input
                                name="manufacturerBrand"
                                value={form.manufacturerBrand}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.manufacturerBrand || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Grade</label>
                            {isEditing ? (
                              <Input
                                name="grade"
                                value={form.grade}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.grade || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Dimensions (W × H × D)</label>
                            {isEditing ? (
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                <Input
                                  name="width"
                                  type="number"
                                  step="0.01"
                                  value={form.width}
                                  onChange={handleInput}
                                  placeholder="Width"
                                />
                                <Input
                                  name="height"
                                  type="number"
                                  step="0.01"
                                  value={form.height}
                                  onChange={handleInput}
                                  placeholder="Height"
                                />
                                <Input
                                  name="depth"
                                  type="number"
                                  step="0.01"
                                  value={form.depth}
                                  onChange={handleInput}
                                  placeholder="Depth"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm">
                                {[artwork.width, artwork.height, artwork.depth].filter(Boolean).join(' × ') || 'Not specified'}
                              </p>
                            )}
                          </div>
                        </>
                      ) : artwork.collectionSource === 'Objects' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium">Maker/Manufacturer</label>
                            {isEditing ? (
                              <Input
                                name="makerManufacturer"
                                value={form.makerManufacturer}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.makerManufacturer || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Model Name/Code</label>
                            {isEditing ? (
                              <Input
                                name="modelNameCode"
                                value={form.modelNameCode}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.modelNameCode || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Production Year/Era</label>
                            {isEditing ? (
                              <Input
                                name="productionYearEra"
                                value={form.productionYearEra}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.productionYearEra || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Materials/Composition</label>
                            {isEditing ? (
                              <Input
                                name="materialsComposition"
                                value={form.materialsComposition}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.materialsComposition || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Dimensions (W × H × D)</label>
                            {isEditing ? (
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                <Input
                                  name="width"
                                  type="number"
                                  step="0.01"
                                  value={form.width}
                                  onChange={handleInput}
                                  placeholder="Width"
                                />
                                <Input
                                  name="height"
                                  type="number"
                                  step="0.01"
                                  value={form.height}
                                  onChange={handleInput}
                                  placeholder="Height"
                                />
                                <Input
                                  name="depth"
                                  type="number"
                                  step="0.01"
                                  value={form.depth}
                                  onChange={handleInput}
                                  placeholder="Depth"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm">
                                {[artwork.width, artwork.height, artwork.depth].filter(Boolean).join(' × ') || 'Not specified'}
                              </p>
                            )}
                          </div>
                        </>
                      ) : artwork.collectionSource === 'Memorabilia' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium">Associated Persons</label>
                            {isEditing ? (
                              <Input
                                name="associatedPersons"
                                value={form.associatedPersons}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.associatedPersons || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Event Name/Date</label>
                            {isEditing ? (
                              <Input
                                name="eventNameDate"
                                value={form.eventNameDate}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.eventNameDate || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Era/Period</label>
                            {isEditing ? (
                              <Input
                                name="eraPeriod"
                                value={form.eraPeriod}
                                onChange={handleInput}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-sm">{artwork.eraPeriod || 'Not specified'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium">Dimensions (W × H × D)</label>
                            {isEditing ? (
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                <Input
                                  name="width"
                                  type="number"
                                  step="0.01"
                                  value={form.width}
                                  onChange={handleInput}
                                  placeholder="Width"
                                />
                                <Input
                                  name="height"
                                  type="number"
                                  step="0.01"
                                  value={form.height}
                                  onChange={handleInput}
                                  placeholder="Height"
                                />
                                <Input
                                  name="depth"
                                  type="number"
                                  step="0.01"
                                  value={form.depth}
                                  onChange={handleInput}
                                  placeholder="Depth"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm">
                                {[artwork.width, artwork.height, artwork.depth].filter(Boolean).join(' × ') || 'Not specified'}
                              </p>
                            )}
                          </div>
                        </>
                      ) : null}
                      
                      <div>
                        <label className="text-sm font-medium">Condition</label>
                        {isEditing ? (
                          <select
                            name="condition"
                            value={form.condition}
                            onChange={handleInput}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {conditionOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="mt-1 text-sm">{artwork.condition}</p>
                        )}
                      </div>
                    </div>

                    {/* Mature Content Selection */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <div>
                            <label className="text-sm font-medium">Mature Content</label>
                            <p className="text-xs text-muted-foreground">
                              Does this artwork contain mature or sensitive content?
                            </p>
                          </div>
                        </div>
                        {isEditing ? (
                          <div className="flex gap-4 ml-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="matureContent"
                                value="yes"
                                checked={matureContent === true}
                                onChange={() => setMatureContent(true)}
                                className="accent-primary cursor-pointer w-4 h-4"
                              />
                              <span className="text-sm">Yes, contains mature content</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="matureContent"
                                value="no"
                                checked={matureContent === false}
                                onChange={() => setMatureContent(false)}
                                className="accent-primary cursor-pointer w-4 h-4"
                              />
                              <span className="text-sm">No, suitable for general audience</span>
                            </label>
                          </div>
                        ) : (
                          <div className="ml-8">
                            <Badge 
                              variant={matureContent ? "destructive" : "secondary"}
                              className={matureContent ? "bg-orange-500 hover:bg-orange-600" : ""}
                            >
                              {matureContent ? 'Mature Content' : 'General Audience'}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Warning for mature content */}
                        {matureContent && (
                          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg ml-8">
                            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Mature Content Warning</span>
                            </div>
                            <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                              This artwork will be automatically age-gated and may have restricted visibility.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      {isEditing ? (
                        <RichTextEditor
                          value={form.description}
                          onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
                          placeholder="Enter artwork description"
                          rows={5}
                        />
                      ) : (
                        <div className="mt-1 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: artwork.description || 'No description available' }} />
                      )}
                </div>
                  </CardContent>
                </Card>

                {artwork.collectionSource === 'Artwork' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Artwork History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <RichTextEditor
                          value={form.artworkHistory}
                          onChange={(value) => setForm(prev => ({ ...prev, artworkHistory: value }))}
                          placeholder="Enter provenance and exhibition history..."
                          rows={6}
                        />
                      ) : (
                        <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: artwork.artworkHistory || 'No history available' }} />
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <RichTextEditor
                        value={form.internalNotes}
                        onChange={(value) => setForm(prev => ({ ...prev, internalNotes: value }))}
                        placeholder="Add internal notes (not visible to clients)..."
                        rows={6}
                      />
                    ) : (
                      <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: artwork.internalNotes || 'No internal notes' }} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                        <label className="text-sm font-medium">Price</label>
                        {isEditing ? (
                          <Input
                            name="price"
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={handleInput}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-lg font-semibold">{formatPrice(artwork.price)}</p>
                        )}
                </div>
                <div>
                        <label className="text-sm font-medium mr-2">Price Type</label>
                        {isEditing ? (
                          <select
                            name="priceType"
                            value={form.priceType}
                            onChange={handleInput}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {priceTypeOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge 
                            variant={artwork.priceType === "Fixed" ? "default" : "secondary"}
                            className={artwork.priceType === "Fixed" ? "bg-primary" : ""}
                          >
                            {artwork.priceType}
                          </Badge>
                        )}
                      </div>
                </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                        <label className="text-sm font-medium">Storage Location</label>
                        {isEditing ? (
                          <select
                            name="location"
                            value={form.location}
                            onChange={handleInput}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {storageLocationOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="mt-1 text-sm">{artwork.location}</p>
                        )}
                </div>
                <div>
                        <label className="text-sm font-medium mr-2">Status</label>
                        {isEditing ? (
                          <select
                            name="status"
                            value={form.status}
                            onChange={handleInput}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'}>
                            {artwork.status}
                          </Badge>
                        )}
                </div>
                <div>
                        <label className="text-sm font-medium mr-2">Digital Floor</label>
                        {isEditing ? (
                          <select
                            name="digitalFloor"
                            value={form.digitalFloor}
                            onChange={handleInput}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {digitalFloorOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge 
                            className={artwork.digitalFloor === "Active" 
                              ? "bg-green-500 hover:bg-green-600 text-white" 
                              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            }
                          >
                            {artwork.digitalFloor}
                          </Badge>
                        )}
                </div>
              </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="memorabilia" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Associated Memorabilia</CardTitle>
                      <Button 
                        onClick={() => setShowAddMemorabilia(true)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Memorabilia
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingMemorabilia ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading memorabilia...</p>
                      </div>
                    ) : memorabilia.length > 0 ? (
                      <div className="space-y-4">
                        {memorabilia.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Memorabilia Image */}
                                <div className="w-16 h-16 rounded-lg border overflow-hidden bg-muted/20 flex-shrink-0">
                                  {item.images && item.images.length > 0 ? (
                                    <Image
                                      src={item.images[0]}
                                      alt={item.title}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="text-2xl opacity-30">🎨</div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{item.title}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    by {item.artist}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                      SKU: {item.sku}
                                    </span>
                                    {item.price && (
                                      <span className="text-muted-foreground">
                                        Value: {formatPrice(item.price)}
                                      </span>
                                    )}
                                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                                      {item.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mx-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/inventory/${item.sku}`)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMemorabilia(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No memorabilia associated with this artwork</p>
                        <p className="text-sm mt-2">Click "Add Memorabilia" to associate other artworks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Memorabilia Modal */}
                {showAddMemorabilia && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Artwork as Memorabilia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Search Artworks</label>
                          <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              value={searchTerm}
                              onChange={(e) => handleSearchArtwork(e.target.value)}
                              placeholder="Search by title, artist, medium, or SKU..."
                              className="pl-10"
                            />
                          </div>
                          {searching && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Searching...
                            </div>
                          )}
                        </div>

                        {searchResults.length > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            <p className="text-sm font-medium text-muted-foreground">
                              Search Results ({searchResults.length})
                            </p>
                            {searchResults.map((result) => (
                              <div key={result.id} className="border rounded-lg p-3 hover:bg-muted/50">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    {/* Search Result Image */}
                                    <div className="w-12 h-12 rounded border overflow-hidden bg-muted/20 flex-shrink-0">
                                      {result.images && result.images.length > 0 ? (
                                        <Image
                                          src={result.images[0]}
                                          alt={result.title}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <div className="text-lg opacity-30">🎨</div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium">{result.title}</h4>
                                        <Badge variant="outline" className="text-xs">{result.medium}</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-1">
                                        by {result.artist} • {result.year}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        SKU: {result.sku} • {formatPrice(result.price)}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddMemorabilia(result)}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {searchTerm && searchResults.length === 0 && !searching && (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>No artworks found matching your search</p>
                            <p className="text-sm mt-1">Try different keywords or check the spelling</p>
                          </div>
                        )}

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddMemorabilia(false);
                              setSearchTerm('');
                              setSearchResults([]);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Certificates & Documentation</CardTitle>
                      {isEditing && (
                        <Button 
                          onClick={() => setShowAddCertificate(true)}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Certificate
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {artwork.certificates && artwork.certificates.length > 0 ? (
                      <div className="space-y-4">
                        {artwork.certificates.map((cert, index) => {
                          const docTypeInfo = getDocumentTypeInfo(cert.type);
                          const IconComponent = docTypeInfo.icon;
                          return (
                            <div key={index} className={`border rounded-lg p-4 ${docTypeInfo.bgColor} ${docTypeInfo.borderColor}`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 ${docTypeInfo.color}`} />
                                  <div>
                                    <div className="font-medium text-sm">{cert.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {cert.typeLabel || cert.type}
                                    </div>
                                    {cert.uploadedAt && (
                                      <div className="text-xs text-muted-foreground">
                                        Uploaded: {new Date(cert.uploadedAt).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleViewCertificate(cert)}
                                      disabled={!cert.url}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleDownloadCertificate(cert)}
                                      disabled={!cert.url}
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </Button>
                                    {isEditing && (
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => handleRemoveCertificate(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              

                            </div>
                          );
                        })}
                        

                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No certificates or documentation available</p>
                        {isEditing && (
                          <p className="text-sm mt-2">Click "Add Certificate" to upload documentation</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Certificate Modal */}
                {showAddCertificate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Certificate Name</label>
                          <Input
                            value={newCertificate.name}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Certificate of Authenticity"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Certificate Type</label>
                          <select
                            value={newCertificate.type}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Select certificate type</option>
                            {documentTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Certificate File</label>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setNewCertificate(prev => ({ ...prev, file }));
                              }
                            }}
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Accepted formats: PDF, DOC, DOCX, JPG, PNG, TIFF. Maximum file size: 10MB.
                          </p>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddCertificate(false);
                              setNewCertificate({ name: '', type: '', file: null });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddCertificate}
                            disabled={!newCertificate.name || !newCertificate.type || !newCertificate.file}
                          >
                            Add Certificate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Bottom Save Buttons - Only show when editing */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-40">
          <div className="max-w-6xl mx-auto flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Add Images Modal */}
      {showAddImages && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Images</h3>
              <button
                onClick={() => {
                  setShowAddImages(false);
                  setNewImages([]);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Images</label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setNewImages(files);
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can select multiple images and videos. Supported formats: JPG, PNG, GIF, MP4, MOV, etc.
                </p>
              </div>

              {newImages.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Selected Files ({newImages.length})</label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {newImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddImages(false);
                    setNewImages([]);
                  }}
                  disabled={uploadingImages}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddImages}
                  disabled={newImages.length === 0 || uploadingImages}
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Upload ${newImages.length} File${newImages.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      {showFullScreenModal && images && images[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setShowFullScreenModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentImages = images;
                    const newIndex = selectedImageIndex === 0 ? currentImages.length - 1 : selectedImageIndex - 1;
                    setSelectedImageIndexSafely(newIndex, currentImages);
                    setIsVideoPlaying(false);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    const currentImages = images;
                    const newIndex = selectedImageIndex === currentImages.length - 1 ? 0 : selectedImageIndex + 1;
                    setSelectedImageIndexSafely(newIndex, currentImages);
                    setIsVideoPlaying(false);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
              </>
            )}

            {/* Media Display */}
            <div className="w-full h-full flex items-center justify-center">
              {images[selectedImageIndex] && selectedImageIndex >= 0 && selectedImageIndex < images.length && isVideoUrl(images[selectedImageIndex]) ? (
                <div className="w-full h-full max-w-4xl">
                  {renderVideoPlayer(images[selectedImageIndex])}
                </div>
              ) : images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={`${artwork.title} - Full View`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No valid media to display</p>
                </div>
              )}
            </div>

            {/* Media Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} of {images.length}
              </div>
            )}

            {/* Download Button in Full Screen */}
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 