// Database calls disabled - using mock service
// import { 
//   collection, 
//   doc, 
//   setDoc, 
//   getDoc, 
//   getDocs, 
//   query, 
//   where, 
//   updateDoc,
//   addDoc,
//   deleteDoc,
//   serverTimestamp,
//   orderBy 
// } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from './firebase';
import { MockService } from './mock-service';
import { SecureImageService, ProcessedImage } from './secure-image-service';

export interface Artwork {
  id?: string;
  sku: string;
  title: string;
  artist: string;
  artistId?: string; // Reference to artist profile
  year: number;
  medium: string;
  itemType?: string;
  nativeType?: string;
  size: string;
  price: number;
  priceType: 'Fixed' | 'By Request' | 'Auction';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  framed: 'Framed' | 'Unframed';
  location: string;
  digitalFloor: 'Active' | 'Inactive';
  status: 'active' | 'inactive' | 'sold' | 'on-hold';
  description?: string;
  artworkHistory?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No'; // New field for mature content flag
  images?: ProcessedImage[]; // Processed image data with secure variants
  certificates?: Array<{
    id: string;
    name: string;
    type: string;
    typeLabel: string;
    url: string;
    uploadedAt: string;
  }>;
  memorabilia?: string[]; // Array of artwork IDs that are memorabilia for this artwork
  createdBy?: {
    email: string;
    uid: string;
  };
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
  createdAt: any;
  updatedAt: any;
}

export interface ArtworkFormData {
  title: string;
  artist: string;
  artistId?: string;
  year: number;
  medium: string;
  itemType?: string;
  nativeType?: string;
  size: string;
  price: number;
  priceType: 'Fixed' | 'By Request' | 'Auction';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  framed: 'Framed' | 'Unframed';
  location: string;
  digitalFloor: boolean;
  description?: string;
  artworkHistory?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No'; // New field for mature content flag
  images?: File[];
  certificates?: Array<{
    id: string;
    file: File;
    name: string;
    type: string;
    typeLabel: string;
    uploadedAt: string;
  }>;
  createdBy?: {
    email: string;
    uid: string;
  };
}

export class ArtworkService {
  private static COLLECTION_NAME = 'Artwork';

  // Generate SKU
  private static generateSKU(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ART-${timestamp}-${random}`;
  }

  // Create a new artwork
  static async createArtwork(artworkData: ArtworkFormData, galleryData?: any): Promise<string> {
    try {
      console.log('ArtworkService: Starting artwork creation...');
      console.log('ArtworkService: Input data:', artworkData);
      console.log('ArtworkService: Gallery data:', galleryData);
      
      // 1. Process and upload images securely
      let processedImages: ProcessedImage[] = [];
      if (artworkData.images && artworkData.images.length > 0) {
        console.log('ArtworkService: Processing', artworkData.images.length, 'images securely...');
        // Generate a temporary ID for image processing
        const tempArtworkId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        for (const image of artworkData.images) {
          console.log('ArtworkService: Processing image:', image.name);
          try {
            const processedImage = await SecureImageService.processArtworkImage(image, tempArtworkId);
            processedImages.push(processedImage);
            console.log('ArtworkService: Image processed successfully:', processedImage.id);
          } catch (error) {
            console.error('ArtworkService: Failed to process image:', image.name, error);
            // Continue with other images if one fails
          }
        }
      } else {
        console.log('ArtworkService: No images to process');
      }

      // 2. Upload certificates if provided
      let certificateUrls: Array<{ id: string; name: string; type: string; typeLabel: string; url: string; uploadedAt: string }> = [];
      if (artworkData.certificates && artworkData.certificates.length > 0) {
        console.log('ArtworkService: Uploading', artworkData.certificates.length, 'certificates...');
        for (const cert of artworkData.certificates) {
          if (cert.file) {
            console.log('ArtworkService: Uploading certificate:', cert.file.name);
            const certRef = ref(storage, `artwork-certificates/${Date.now()}-${cert.file.name}`);
            const snapshot = await uploadBytes(certRef, cert.file);
            const url = await getDownloadURL(snapshot.ref);
            certificateUrls.push({
              id: cert.id,
              name: cert.name,
              type: cert.type,
              typeLabel: cert.typeLabel,
              url: url,
              uploadedAt: cert.uploadedAt
            });
            console.log('ArtworkService: Certificate uploaded successfully:', url);
          }
        }
      } else {
        console.log('ArtworkService: No certificates to upload');
      }

      // 3. Prepare artwork document data
      const artworkDoc: Artwork = {
        sku: this.generateSKU(),
        title: artworkData.title,
        artist: artworkData.artist,
        artistId: artworkData.artistId,
        year: artworkData.year,
        medium: artworkData.medium,
        itemType: artworkData.itemType,
        nativeType: artworkData.nativeType,
        size: artworkData.size,
        price: artworkData.price,
        priceType: artworkData.priceType,
        condition: artworkData.condition,
        framed: artworkData.framed,
        location: artworkData.location,
        digitalFloor: artworkData.digitalFloor ? 'Active' : 'Inactive',
        status: 'active',
        description: artworkData.description || '',
        artworkHistory: artworkData.artworkHistory || '',
        internalNotes: artworkData.internalNotes || '',
        createdBy: artworkData.createdBy,
        galleryData: galleryData || {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add processedImages and certificateUrls if they exist
      if (processedImages.length > 0) {
        artworkDoc.images = processedImages;
      }
      if (certificateUrls.length > 0) {
        artworkDoc.certificates = certificateUrls;
      }

      console.log('ArtworkService: Saving to Firestore...');
      console.log('ArtworkService: Final artwork document:', artworkDoc);
      
      // 4. Save to Artwork collection
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), artworkDoc);
      console.log('ArtworkService: Artwork saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('ArtworkService: Error creating artwork:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
      const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
      
      console.error('ArtworkService: Error details:', {
        message: errorMessage,
        code: errorCode,
        stack: errorStack
      });
      throw error;
    }
  }

  // Get artwork by ID
  static async getArtwork(artworkId: string): Promise<Artwork | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Artwork;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artwork:', error);
      throw error;
    }
  }

  // Get artwork by SKU
  static async getArtworkBySKU(sku: string): Promise<Artwork | null> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where('sku', '==', sku));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Artwork;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artwork by SKU:', error);
      throw error;
    }
  }

  // Get all artwork
  static async getAllArtwork(): Promise<Artwork[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('Error getting all artwork:', error);
      throw error;
    }
  }

  // Get artwork by gallery ID
  static async getArtworkByGalleryId(galleryId: string): Promise<Artwork[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      // Filter artwork that belongs to the specified gallery
      const filteredArtwork = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Artwork))
        .filter(artwork => {
          // Check if the artwork has gallery data and if the specified galleryId exists in it
          return artwork.galleryData && artwork.galleryData[galleryId];
        });
      
      return filteredArtwork;
    } catch (error) {
      console.error('Error getting artwork by gallery ID:', error);
      throw error;
    }
  }

  // Get artwork by artist
  static async getArtworkByArtist(artistId: string): Promise<Artwork[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('artistId', '==', artistId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('Error getting artwork by artist:', error);
      throw error;
    }
  }

  // Get secure image URL for display
  static getSecureImageUrl(artwork: Artwork, preferredWidth: number = 1280): string | null {
    if (!artwork.images || artwork.images.length === 0) {
      return null;
    }

    // For backward compatibility, check if images are old string format
    if (typeof artwork.images[0] === 'string') {
      return artwork.images[0] as unknown as string;
    }

    // Use the first processed image
    const processedImage = artwork.images[0] as unknown as ProcessedImage;
    return SecureImageService.getSecureImageUrl(processedImage, preferredWidth);
  }

  // Get all secure image URLs for an artwork
  static getSecureImageUrls(artwork: Artwork): string[] {
    if (!artwork.images || artwork.images.length === 0) {
      return [];
    }

    // For backward compatibility, check if images are old string format
    if (typeof artwork.images[0] === 'string') {
      return artwork.images as unknown as string[];
    }

    // Return URLs from processed images
    const processedImages = artwork.images as unknown as ProcessedImage[];
    return processedImages.map(img => 
      SecureImageService.getSecureImageUrl(img, 1280)
    );
  }

  // Clean up artwork images when deleting
  static async cleanupArtworkImages(artworkId: string): Promise<void> {
    try {
      const artwork = await this.getArtwork(artworkId);
      if (artwork && artwork.images) {
        // For backward compatibility, check if images are old string format
        if (typeof artwork.images[0] === 'string') {
          // Old format - no cleanup needed as they're direct URLs
          return;
        }

        // Clean up processed images
        const processedImages = artwork.images as unknown as ProcessedImage[];
        for (const processedImage of processedImages) {
          await SecureImageService.cleanupArtworkImages(artworkId, processedImage);
        }
      }
    } catch (error) {
      console.error('Error cleaning up artwork images:', error);
    }
  }

  // Update artwork
  static async updateArtwork(artworkId: string, updates: Partial<Artwork>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  }

  // Search artwork
  static async searchArtwork(searchTerm: string): Promise<Artwork[]> {
    try {
      // Get all artwork and filter client-side for now
      // In production, you might want to use Algolia or similar for better search
      const allArtwork = await this.getAllArtwork();
      const searchLower = searchTerm.toLowerCase();
      
      return allArtwork.filter(artwork => 
        artwork.title.toLowerCase().includes(searchLower) ||
        artwork.artist.toLowerCase().includes(searchLower) ||
        artwork.medium.toLowerCase().includes(searchLower) ||
        artwork.sku.toLowerCase().includes(searchLower) ||
        artwork.location.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching artwork:', error);
      throw error;
    }
  }

  // Get artwork by status
  static async getArtworkByStatus(status: string): Promise<Artwork[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('Error getting artwork by status:', error);
      throw error;
    }
  }

  // Get artwork by digital floor status
  static async getArtworkByDigitalFloor(digitalFloor: 'Active' | 'Inactive'): Promise<Artwork[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('digitalFloor', '==', digitalFloor),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('Error getting artwork by digital floor status:', error);
      throw error;
    }
  }

  // Check if SKU exists
  static async isSKUExists(sku: string): Promise<boolean> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where('sku', '==', sku));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking SKU existence:', error);
      throw error;
    }
  }

  // Get storage locations with counts
  static async getStorageLocations(): Promise<Array<{ name: string; count: number }>> {
    try {
      const allArtwork = await this.getAllArtwork();
      const locations: { [key: string]: number } = {};
      
      allArtwork.forEach(artwork => {
        if (artwork.location) {
          locations[artwork.location] = (locations[artwork.location] || 0) + 1;
        }
      });
      
      return Object.entries(locations).map(([name, count]) => ({ name, count }));
    } catch (error) {
      console.error('Error getting storage locations:', error);
      throw error;
    }
  }

  // Add memorabilia relationship
  static async addMemorabilia(artworkId: string, memorabiliaArtworkId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Artwork not found');
      }
      
      const currentData = docSnap.data();
      const memorabilia = currentData.memorabilia || [];
      
      // Check if memorabilia already exists
      if (memorabilia.includes(memorabiliaArtworkId)) {
        throw new Error('Memorabilia already associated with this artwork');
      }
      
      // Add the memorabilia artwork ID
      memorabilia.push(memorabiliaArtworkId);
      
      await updateDoc(docRef, {
        memorabilia,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding memorabilia:', error);
      throw error;
    }
  }

  // Remove memorabilia relationship
  static async removeMemorabilia(artworkId: string, memorabiliaArtworkId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Artwork not found');
      }
      
      const currentData = docSnap.data();
      const memorabilia = currentData.memorabilia || [];
      
      // Remove the memorabilia artwork ID
      const updatedMemorabilia = memorabilia.filter((id: string) => id !== memorabiliaArtworkId);
      
      await updateDoc(docRef, {
        memorabilia: updatedMemorabilia,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing memorabilia:', error);
      throw error;
    }
  }

  // Get memorabilia for an artwork
  static async getMemorabilia(artworkId: string): Promise<Artwork[]> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return [];
      }
      
      const currentData = docSnap.data();
      const memorabiliaIds = currentData.memorabilia || [];
      
      if (memorabiliaIds.length === 0) {
        return [];
      }
      
      // Get all memorabilia artworks
      const memorabiliaArtworks: Artwork[] = [];
      for (const id of memorabiliaIds) {
        try {
          const memorabiliaDoc = await getDoc(doc(db, this.COLLECTION_NAME, id));
          if (memorabiliaDoc.exists()) {
            memorabiliaArtworks.push({ id: memorabiliaDoc.id, ...memorabiliaDoc.data() } as Artwork);
          }
        } catch (error) {
          console.error(`Error fetching memorabilia artwork ${id}:`, error);
        }
      }
      
      return memorabiliaArtworks;
    } catch (error) {
      console.error('Error getting memorabilia:', error);
      throw error;
    }
  }

  // Search artwork for memorabilia selection (excludes current artwork)
  static async searchArtworkForMemorabilia(searchTerm: string, excludeArtworkId: string): Promise<Artwork[]> {
    try {
      const allArtwork = await this.getAllArtwork();
      const searchLower = searchTerm.toLowerCase();
      
      return allArtwork.filter(artwork => 
        artwork.id !== excludeArtworkId && // Exclude current artwork
        (artwork.title.toLowerCase().includes(searchLower) ||
        artwork.artist.toLowerCase().includes(searchLower) ||
        artwork.medium.toLowerCase().includes(searchLower) ||
        artwork.sku.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching artwork for memorabilia:', error);
      throw error;
    }
  }

  // Get all artwork IDs that are used as memorabilia in other artworks
  static async getMemorabiliaArtworkIds(): Promise<string[]> {
    try {
      const allArtwork = await this.getAllArtwork();
      const memorabiliaIds = new Set<string>();
      
      // Collect all memorabilia IDs from all artworks
      allArtwork.forEach(artwork => {
        if (artwork.memorabilia && Array.isArray(artwork.memorabilia)) {
          artwork.memorabilia.forEach((memorabiliaId: string) => {
            memorabiliaIds.add(memorabiliaId);
          });
        }
      });
      
      return Array.from(memorabiliaIds);
    } catch (error) {
      console.error('Error getting memorabilia artwork IDs:', error);
      throw error;
    }
  }

  // Delete artwork
  static async deleteArtwork(artworkId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, artworkId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  }
} 