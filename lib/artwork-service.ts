// Mock Artwork Service - replaces all database calls with mock data
import { MockService } from './mock-service';

export interface Artwork {
  id?: string;
  sku: string;
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
  digitalFloor: 'Active' | 'Inactive';
  status: 'active' | 'inactive' | 'sold' | 'on-hold';
  description?: string;
  artworkHistory?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No';
  images?: any[];
  certificates?: any[];
  memorabilia?: string[];
  galleryData?: any;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: {
    email: string;
    uid: string;
  };
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
  digitalFloor?: boolean;
  description?: string;
  artworkHistory?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No';
  images?: File[];
  certificates?: Array<{
    id: string;
    name: string;
    type: string;
    typeLabel: string;
    file?: File;
    uploadedAt: string;
  }>;
  memorabilia?: string[];
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

  // Create a new artwork (mock implementation)
  static async createArtwork(artworkData: ArtworkFormData, galleryData?: any): Promise<string> {
    try {
      console.log('ArtworkService: Mock - Creating artwork...');
      
      // Mock artwork document data
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
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock save to database
      const result = await MockService.addArtwork(artworkDoc);
      console.log('ArtworkService: Mock - Artwork created with ID:', result.id);
      return result.id;
    } catch (error) {
      console.error('ArtworkService: Mock - Error creating artwork:', error);
      throw error;
    }
  }

  // Get artwork by ID (mock implementation)
  static async getArtwork(artworkId: string): Promise<Artwork | null> {
    try {
      const doc = await MockService.getArtwork(artworkId);
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Artwork;
      }
      return null;
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting artwork:', error);
      throw error;
    }
  }

  // Get artwork by SKU (mock implementation)
  static async getArtworkBySKU(sku: string): Promise<Artwork | null> {
    try {
      const querySnapshot = await MockService.getArtworks({ where: [{ field: 'sku', value: sku }] });
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Artwork;
      }
      return null;
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting artwork by SKU:', error);
      throw error;
    }
  }

  // Get all artwork (mock implementation)
  static async getAllArtwork(): Promise<Artwork[]> {
    try {
      const querySnapshot = await MockService.getArtworks({ orderBy: { field: 'createdAt', direction: 'desc' } });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting all artwork:', error);
      throw error;
    }
  }

  // Get artwork by gallery ID (mock implementation)
  static async getArtworkByGalleryId(galleryId: string): Promise<Artwork[]> {
    try {
      const querySnapshot = await MockService.getArtworks({ orderBy: { field: 'createdAt', direction: 'desc' } });
      const filteredArtwork = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Artwork))
        .filter(artwork => {
          return artwork.galleryData && artwork.galleryData[galleryId];
        });
      return filteredArtwork;
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting artwork by gallery ID:', error);
      throw error;
    }
  }

  // Get artwork by artist (mock implementation)
  static async getArtworkByArtist(artistId: string): Promise<Artwork[]> {
    try {
      const querySnapshot = await MockService.getArtworks({ 
        where: [{ field: 'artistId', value: artistId }],
        orderBy: { field: 'createdAt', direction: 'desc' }
      });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting artwork by artist:', error);
      throw error;
    }
  }

  // Update artwork (mock implementation)
  static async updateArtwork(artworkId: string, updateData: Partial<Artwork>): Promise<void> {
    try {
      await MockService.updateArtwork(artworkId, { ...updateData, updatedAt: new Date() });
      console.log('ArtworkService: Mock - Artwork updated:', artworkId);
    } catch (error) {
      console.error('ArtworkService: Mock - Error updating artwork:', error);
      throw error;
    }
  }

  // Delete artwork (mock implementation)
  static async deleteArtwork(artworkId: string): Promise<void> {
    try {
      await MockService.deleteArtwork(artworkId);
      console.log('ArtworkService: Mock - Artwork deleted:', artworkId);
    } catch (error) {
      console.error('ArtworkService: Mock - Error deleting artwork:', error);
      throw error;
    }
  }

  // Get memorabilia artwork IDs (mock implementation)
  static async getMemorabiliaArtworkIds(): Promise<string[]> {
    try {
      const querySnapshot = await MockService.getArtworks();
      const memorabiliaIds: string[] = [];
      
      querySnapshot.docs.forEach(doc => {
        const artwork = doc.data() as Artwork;
        if (artwork.memorabilia && artwork.memorabilia.length > 0) {
          memorabiliaIds.push(...artwork.memorabilia);
        }
      });
      
      return memorabiliaIds;
    } catch (error) {
      console.error('ArtworkService: Mock - Error getting memorabilia artwork IDs:', error);
      return [];
    }
  }

  // Search artwork (mock implementation)
  static async searchArtwork(searchTerm: string, filters?: any): Promise<Artwork[]> {
    try {
      const querySnapshot = await MockService.getArtworks();
      let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(artwork => 
          artwork.title.toLowerCase().includes(term) ||
          artwork.artist.toLowerCase().includes(term) ||
          artwork.medium.toLowerCase().includes(term) ||
          artwork.description?.toLowerCase().includes(term)
        );
      }
      
      // Apply additional filters
      if (filters) {
        if (filters.priceRange) {
          results = results.filter(artwork => 
            artwork.price >= filters.priceRange.min && 
            artwork.price <= filters.priceRange.max
          );
        }
        if (filters.medium) {
          results = results.filter(artwork => artwork.medium === filters.medium);
        }
        if (filters.status) {
          results = results.filter(artwork => artwork.status === filters.status);
        }
      }
      
      return results;
    } catch (error) {
      console.error('ArtworkService: Mock - Error searching artwork:', error);
      throw error;
    }
  }
}
