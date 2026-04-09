// Mock Unified Item Service - replaces all database calls with mock data
import { MockService } from './mock-service';

// Unified interface for all item types
export interface UnifiedItem {
  id: string;
  sku: string;
  title: string;
  // Common fields
  price: number;
  priceType: 'Fixed' | 'By Request' | 'Auction';
  location: string;
  digitalFloor: 'Active' | 'Inactive';
  status: 'active' | 'inactive' | 'sold' | 'on-hold';
  description?: string;
  matureContent?: 'Yes' | 'No';
  images?: any[];
  certificates?: any[];
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
  createdAt?: any;
  updatedAt?: any;
  
  // Artwork specific fields
  artist?: string;
  artistId?: string;
  year?: number;
  medium?: string;
  itemType?: string;
  nativeType?: string;
  size?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  framed?: 'Framed' | 'Unframed';
  artworkHistory?: string;
  internalNotes?: string;
  memorabilia?: string[];
  
  // Object specific fields
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  provenance?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  
  // Collectible specific fields
  series?: string;
  edition?: string;
  rarity?: string;
  authenticity?: string;
  grading?: string;
  packaging?: string;
  
  // Memorabilia specific fields
  event?: string;
  date?: string;
  venue?: string;
  significance?: string;
  relatedArtwork?: string;
}

export interface ItemSearchParams {
  searchTerm?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  status?: string;
  location?: string;
  matureContent?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class UnifiedItemService {
  // Get all items (mock implementation)
  static async getAllItems(params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      console.log('UnifiedItemService: Mock - Getting all items...');
      
      // Get artwork data
      const artworksSnapshot = await MockService.getArtworks();
      const artworks = artworksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        itemType: 'artwork'
      })) as UnifiedItem[];
      
      // Get objects data (if available)
      const objectsSnapshot = await MockService.getCollection('Objects');
      const objects = objectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        itemType: 'object'
      })) as UnifiedItem[];
      
      // Get collectibles data (if available)
      const collectiblesSnapshot = await MockService.getCollection('Collectibles');
      const collectibles = collectiblesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        itemType: 'collectible'
      })) as UnifiedItem[];
      
      // Get memorabilia data (if available)
      const memorabiliaSnapshot = await MockService.getCollection('Memorabilia');
      const memorabilia = memorabiliaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        itemType: 'memorabilia'
      })) as UnifiedItem[];
      
      // Combine all items
      let allItems = [...artworks, ...objects, ...collectibles, ...memorabilia];
      
      // Apply search filters
      if (params) {
        if (params.searchTerm) {
          const term = params.searchTerm.toLowerCase();
          allItems = allItems.filter(item => 
            item.title.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term) ||
            (item.artist && item.artist.toLowerCase().includes(term)) ||
            (item.medium && item.medium.toLowerCase().includes(term))
          );
        }
        
        if (params.category) {
          allItems = allItems.filter(item => item.itemType === params.category);
        }
        
        if (params.priceRange) {
          allItems = allItems.filter(item => 
            item.price >= params.priceRange!.min && 
            item.price <= params.priceRange!.max
          );
        }
        
        if (params.status) {
          allItems = allItems.filter(item => item.status === params.status);
        }
        
        if (params.location) {
          allItems = allItems.filter(item => item.location === params.location);
        }
        
        if (params.matureContent !== undefined) {
          const matureFilter = params.matureContent ? 'Yes' : 'No';
          allItems = allItems.filter(item => item.matureContent === matureFilter);
        }
        
        // Apply sorting
        if (params.sortBy) {
          allItems.sort((a, b) => {
            const aValue = a[params.sortBy as keyof UnifiedItem];
            const bValue = b[params.sortBy as keyof UnifiedItem];
            
            if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1;
            if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1;
            return 0;
          });
        }
        
        // Apply pagination
        if (params.offset) {
          allItems = allItems.slice(params.offset);
        }
        if (params.limit) {
          allItems = allItems.slice(0, params.limit);
        }
      }
      
      return allItems;
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting all items:', error);
      throw error;
    }
  }

  // Get item by ID (mock implementation)
  static async getItemById(itemId: string): Promise<UnifiedItem | null> {
    try {
      // Try to find in different collections
      const collections = ['Artwork', 'Objects', 'Collectibles', 'Memorabilia'];
      
      for (const collection of collections) {
        const doc = await MockService.getDocument(collection, itemId);
        if (doc.exists) {
          return { id: doc.id, ...doc.data(), itemType: collection.toLowerCase() } as UnifiedItem;
        }
      }
      
      return null;
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting item by ID:', error);
      throw error;
    }
  }

  // Search items (mock implementation)
  static async searchItems(params: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      console.log('UnifiedItemService: Mock - Searching items...');
      return this.getAllItems(params);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error searching items:', error);
      throw error;
    }
  }

  // Get items by category (mock implementation)
  static async getItemsByCategory(category: string, params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      const searchParams = { ...params, category };
      return this.getAllItems(searchParams);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting items by category:', error);
      throw error;
    }
  }

  // Get featured items (mock implementation)
  static async getFeaturedItems(limit: number = 10): Promise<UnifiedItem[]> {
    try {
      const allItems = await this.getAllItems({ limit });
      return allItems.slice(0, limit);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting featured items:', error);
      throw error;
    }
  }

  // Get recent items (mock implementation)
  static async getRecentItems(limit: number = 10): Promise<UnifiedItem[]> {
    try {
      const allItems = await this.getAllItems({ 
        sortBy: 'createdAt', 
        sortOrder: 'desc', 
        limit 
      });
      return allItems;
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting recent items:', error);
      throw error;
    }
  }

  // Get items by price range (mock implementation)
  static async getItemsByPriceRange(min: number, max: number, params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      const searchParams = { ...params, priceRange: { min, max } };
      return this.getAllItems(searchParams);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting items by price range:', error);
      throw error;
    }
  }

  // Get items by status (mock implementation)
  static async getItemsByStatus(status: string, params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      const searchParams = { ...params, status };
      return this.getAllItems(searchParams);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting items by status:', error);
      throw error;
    }
  }

  // Get items by location (mock implementation)
  static async getItemsByLocation(location: string, params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      const searchParams = { ...params, location };
      return this.getAllItems(searchParams);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting items by location:', error);
      throw error;
    }
  }

  // Get items by artist (mock implementation)
  static async getItemsByArtist(artistId: string, params?: ItemSearchParams): Promise<UnifiedItem[]> {
    try {
      const allItems = await this.getAllItems(params);
      return allItems.filter(item => item.artistId === artistId);
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting items by artist:', error);
      throw error;
    }
  }

  // Update item (mock implementation)
  static async updateItem(itemId: string, updateData: Partial<UnifiedItem>): Promise<void> {
    try {
      // Try to update in different collections
      const collections = ['Artwork', 'Objects', 'Collectibles', 'Memorabilia'];
      
      for (const collection of collections) {
        try {
          await MockService.updateDocument(collection, itemId, { ...updateData, updatedAt: new Date() });
          console.log(`UnifiedItemService: Mock - Item updated in ${collection}:`, itemId);
          return;
        } catch (error) {
          // Continue to next collection if not found
        }
      }
      
      throw new Error('Item not found in any collection');
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error updating item:', error);
      throw error;
    }
  }

  // Delete item (mock implementation)
  static async deleteItem(itemId: string): Promise<void> {
    try {
      // Try to delete from different collections
      const collections = ['Artwork', 'Objects', 'Collectibles', 'Memorabilia'];
      
      for (const collection of collections) {
        try {
          await MockService.deleteDocument(collection, itemId);
          console.log(`UnifiedItemService: Mock - Item deleted from ${collection}:`, itemId);
          return;
        } catch (error) {
          // Continue to next collection if not found
        }
      }
      
      throw new Error('Item not found in any collection');
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error deleting item:', error);
      throw error;
    }
  }

  // Get item statistics (mock implementation)
  static async getItemStatistics(): Promise<{
    totalItems: number;
    activeItems: number;
    soldItems: number;
    onHoldItems: number;
    totalValue: number;
    averagePrice: number;
    categories: { [key: string]: number };
  }> {
    try {
      const allItems = await this.getAllItems();
      
      const stats = {
        totalItems: allItems.length,
        activeItems: allItems.filter(item => item.status === 'active').length,
        soldItems: allItems.filter(item => item.status === 'sold').length,
        onHoldItems: allItems.filter(item => item.status === 'on-hold').length,
        totalValue: allItems.reduce((sum, item) => sum + item.price, 0),
        averagePrice: 0,
        categories: {} as { [key: string]: number }
      };
      
      stats.averagePrice = stats.totalItems > 0 ? stats.totalValue / stats.totalItems : 0;
      
      // Count by category
      allItems.forEach(item => {
        const category = item.itemType || 'unknown';
        stats.categories[category] = (stats.categories[category] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('UnifiedItemService: Mock - Error getting item statistics:', error);
      throw error;
    }
  }
}
