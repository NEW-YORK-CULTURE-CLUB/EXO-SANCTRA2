import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

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
  makerManufacturer?: string;
  designAttribution?: string;
  modelNameCode?: string;
  productionYearEra?: string;
  materialsComposition?: string;
  width?: number;
  height?: number;
  depth?: number | null;
  weight?: number | null;
  hasFrame?: boolean;
  frameWidth?: number | null;
  frameHeight?: number | null;
  frameDepth?: number | null;
  unitPreference?: string;
  serialNumber?: string;
  functionalStatus?: string;
  patentsMarksHallmarks?: string;
  originalPurposeUse?: string;
  modificationRestorationNotes?: string;
  licensingIpHolder?: string;
  culturalGeographicOrigin?: string;
  technicalSpecifications?: string;
  customFeatures?: string;
  
  // Collectible specific fields
  seriesSetName?: string;
  editionRunSize?: string;
  variantParallel?: string;
  modelVersionSku?: string;
  releaseYearEra?: string;
  manufacturerBrand?: string;
  serialLotNumber?: string;
  gradingService?: string;
  grade?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  specialFeatures?: string;
  originalPackagingStatus?: string;
  distributionType?: string;
  
  // Memorabilia specific fields
  associatedPersons?: string;
  associatedTeamOrganization?: string;
  eventNameDate?: string;
  autographDetails?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  historicalSignificanceNotes?: string;
  eraPeriod?: string;
  ticketPassNumber?: string;
  commemorativeEditionDetails?: string;
  
  // Collection source info
  collectionSource: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia';
}

export interface ItemSearchParams {
  searchTerm?: string;
  itemType?: string;
  status?: string;
  digitalFloor?: string;
  matureContent?: 'Yes' | 'No';
  priceRange?: { min: number; max: number };
  yearRange?: { min: number; max: number };
  medium?: string;
  artist?: string;
  location?: string;
}

export class UnifiedItemService {
  private static COLLECTIONS = ['Artwork', 'Objects', 'Collectibles', 'Memorabilia'];

  // Get item by ID from any collection
  static async getItemById(id: string): Promise<UnifiedItem | null> {
    for (const collectionName of this.COLLECTIONS) {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            collectionSource: collectionName as any,
            ...data
          } as UnifiedItem;
        }
      } catch (error) {
        console.error(`Error checking ${collectionName} collection:`, error);
      }
    }
    
    return null;
  }

  // Get item by SKU from any collection
  static async getItemBySKU(sku: string): Promise<UnifiedItem | null> {
    for (const collectionName of this.COLLECTIONS) {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where('sku', '==', sku));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          return {
            id: doc.id,
            collectionSource: collectionName as any,
            ...data
          } as UnifiedItem;
        }
      } catch (error) {
        console.error(`Error searching ${collectionName} collection:`, error);
      }
    }
    
    return null;
  }

  // Get all items from all collections with pagination
  static async getAllItems(
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    filters?: ItemSearchParams
  ): Promise<{ items: UnifiedItem[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> {
    const allItems: UnifiedItem[] = [];
    let lastDocument: QueryDocumentSnapshot<DocumentData> | null = null;
    let hasMore = false;

    for (const collectionName of this.COLLECTIONS) {
      try {
        let q = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );

        if (lastDoc) {
          q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              collectionSource: collectionName as any,
              ...data
            } as UnifiedItem;
          });

          allItems.push(...items);
          
          if (querySnapshot.docs.length === pageSize) {
            hasMore = true;
            lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${collectionName} collection:`, error);
      }
    }

    // Sort all items by creation date
    allItems.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    // Apply filters if provided
    const filteredItems = filters ? this.applyFilters(allItems, filters) : allItems;

    return {
      items: filteredItems.slice(0, pageSize),
      lastDoc: lastDocument,
      hasMore: hasMore && filteredItems.length >= pageSize
    };
  }

  // Search items across all collections
  static async searchItems(searchTerm: string, limit: number = 50): Promise<UnifiedItem[]> {
    const allItems: UnifiedItem[] = [];

    for (const collectionName of this.COLLECTIONS) {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(
          collectionRef,
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            collectionSource: collectionName as any,
            ...data
          } as UnifiedItem;
        });

        allItems.push(...items);
      } catch (error) {
        console.error(`Error searching ${collectionName} collection:`, error);
      }
    }

    // Filter items based on search term
    const searchLower = searchTerm.toLowerCase();
    const filteredItems = allItems.filter(item => {
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.artist?.toLowerCase().includes(searchLower) ||
        item.makerManufacturer?.toLowerCase().includes(searchLower) ||
        item.manufacturerBrand?.toLowerCase().includes(searchLower) ||
        item.medium?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.sku?.toLowerCase().includes(searchLower)
      );
    });

    return filteredItems.slice(0, limit);
  }

  // Get items by type
  static async getItemsByType(type: string, limit: number = 50): Promise<UnifiedItem[]> {
    const allItems: UnifiedItem[] = [];

    for (const collectionName of this.COLLECTIONS) {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(
          collectionRef,
          where('itemType', '==', type),
          orderBy('createdAt', 'desc'),
          limit(limit)
        );
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            collectionSource: collectionName as any,
            ...data
          } as UnifiedItem;
        });

        allItems.push(...items);
      } catch (error) {
        console.error(`Error fetching ${type} items from ${collectionName} collection:`, error);
      }
    }

    return allItems.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  // Get memorabilia for an item
  static async getMemorabilia(itemId: string): Promise<UnifiedItem[]> {
    const memorabilia: UnifiedItem[] = [];

    // Check if the item has memorabilia references
    const item = await this.getItemById(itemId);
    if (!item || !item.memorabilia || item.memorabilia.length === 0) {
      return memorabilia;
    }

    // Fetch each memorabilia item
    for (const memorabiliaId of item.memorabilia) {
      const memorabiliaItem = await this.getItemById(memorabiliaId);
      if (memorabiliaItem) {
        memorabilia.push(memorabiliaItem);
      }
    }

    return memorabilia;
  }

  // Delete item by ID from any collection
  static async deleteItemById(id: string): Promise<boolean> {
    for (const collectionName of this.COLLECTIONS) {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          await deleteDoc(docRef);
          console.log(`Successfully deleted item ${id} from ${collectionName} collection`);
          return true;
        }
      } catch (error) {
        console.error(`Error checking ${collectionName} collection:`, error);
      }
    }
    
    console.error(`Item with ID ${id} not found in any collection`);
    return false;
  }

  // Delete item by SKU from any collection
  static async deleteItemBySKU(sku: string): Promise<boolean> {
    for (const collectionName of this.COLLECTIONS) {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where('sku', '==', sku));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await deleteDoc(doc.ref);
          console.log(`Successfully deleted item with SKU ${sku} from ${collectionName} collection`);
          return true;
        }
      } catch (error) {
        console.error(`Error searching ${collectionName} collection:`, error);
      }
    }
    
    console.error(`Item with SKU ${sku} not found in any collection`);
    return false;
  }

  // Update item by ID in any collection
  static async updateItem(id: string, updates: Partial<UnifiedItem>): Promise<boolean> {
    for (const collectionName of this.COLLECTIONS) {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Add updatedAt timestamp
          const updateData = {
            ...updates,
            updatedAt: new Date()
          };
          
          await updateDoc(docRef, updateData);
          console.log(`Successfully updated item ${id} in ${collectionName} collection`);
          return true;
        }
      } catch (error) {
        console.error(`Error updating item in ${collectionName} collection:`, error);
      }
    }
    
    console.error(`Item with ID ${id} not found in any collection`);
    return false;
  }

  // Delete memorabilia by ID
  static async deleteMemorabilia(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'Memorabilia', id);
      await deleteDoc(docRef);
      console.log(`Successfully deleted memorabilia ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting memorabilia:', error);
      return false;
    }
  }

  // Apply filters to items
  private static applyFilters(items: UnifiedItem[], filters: ItemSearchParams): UnifiedItem[] {
    return items.filter(item => {
      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Digital floor filter
      if (filters.digitalFloor && item.digitalFloor !== filters.digitalFloor) {
        return false;
      }

      // Mature content filter
      if (filters.matureContent && item.matureContent !== filters.matureContent) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        if (item.price < filters.priceRange.min || item.price > filters.priceRange.max) {
          return false;
        }
      }

      // Year range filter
      if (filters.yearRange && item.year) {
        if (item.year < filters.yearRange.min || item.year > filters.yearRange.max) {
          return false;
        }
      }

      // Medium filter
      if (filters.medium && item.medium !== filters.medium) {
        return false;
      }

      // Artist filter
      if (filters.artist && item.artist !== filters.artist) {
        return false;
      }

      // Location filter
      if (filters.location && item.location !== filters.location) {
        return false;
      }

      return true;
    });
  }

  // Get item statistics
  static async getItemStats(): Promise<{
    totalItems: number;
    totalArtworks: number;
    totalObjects: number;
    totalCollectibles: number;
    totalMemorabilia: number;
    activeItems: number;
    totalValue: number;
  }> {
    const stats = {
      totalItems: 0,
      totalArtworks: 0,
      totalObjects: 0,
      totalCollectibles: 0,
      totalMemorabilia: 0,
      activeItems: 0,
      totalValue: 0
    };

    for (const collectionName of this.COLLECTIONS) {
      try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          stats.totalItems++;
          stats.totalValue += data.price || 0;
          
          if (data.status === 'active') {
            stats.activeItems++;
          }

          switch (collectionName) {
            case 'Artwork':
              stats.totalArtworks++;
              break;
            case 'Objects':
              stats.totalObjects++;
              break;
            case 'Collectibles':
              stats.totalCollectibles++;
              break;
            case 'Memorabilia':
              stats.totalMemorabilia++;
              break;
          }
        });
      } catch (error) {
        console.error(`Error getting stats from ${collectionName} collection:`, error);
      }
    }

    return stats;
  }
}
