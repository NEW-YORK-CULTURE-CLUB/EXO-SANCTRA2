import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  addDoc,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export interface CollectionItem {
  id?: string;
  userId: string;
  artworkId: string;
  title: string;
  artist: string;
  artistId?: string;
  year?: number;
  medium?: string;
  size?: string;
  purchasePrice: number;
  currentValue?: number;
  purchaseDate: any;
  location?: string;
  status: 'owned' | 'sold' | 'on-loan' | 'in-storage';
  imageUrl?: string;
  description?: string;
  provenance?: string;
  certificates?: string[];
  notes?: string;
  galleryId?: string;
  galleryName?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CollectionStats {
  totalItems: number;
  totalValue: number;
  totalSpent: number;
  averageValue: number;
  mostValuableItem?: CollectionItem;
  recentPurchases: CollectionItem[];
}

export class UserCollectionService {
  private static COLLECTION_NAME = 'user-collections';

  // Add item to user's collection
  static async addToCollection(userId: string, itemData: Omit<CollectionItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const collectionItem: CollectionItem = {
        ...itemData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), collectionItem);
      return docRef.id;
    } catch (error) {
      console.error('Error adding item to collection:', error);
      throw error;
    }
  }

  // Get user's collection
  static async getUserCollection(userId: string): Promise<CollectionItem[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('userId', '==', userId),
        orderBy('purchaseDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollectionItem[];
    } catch (error) {
      console.error('Error getting user collection:', error);
      throw error;
    }
  }

  // Get collection item by ID
  static async getCollectionItem(itemId: string): Promise<CollectionItem | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, itemId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CollectionItem;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting collection item:', error);
      throw error;
    }
  }

  // Update collection item
  static async updateCollectionItem(itemId: string, updates: Partial<CollectionItem>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, itemId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating collection item:', error);
      throw error;
    }
  }

  // Remove item from collection
  static async removeFromCollection(itemId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, itemId);
      await updateDoc(docRef, {
        status: 'sold',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing item from collection:', error);
      throw error;
    }
  }

  // Get collection statistics
  static async getCollectionStats(userId: string): Promise<CollectionStats> {
    try {
      const collection = await this.getUserCollection(userId);
      
      const totalItems = collection.length;
      const totalSpent = collection.reduce((sum, item) => sum + item.purchasePrice, 0);
      const totalValue = collection.reduce((sum, item) => sum + (item.currentValue || item.purchasePrice), 0);
      const averageValue = totalItems > 0 ? totalValue / totalItems : 0;
      
      const mostValuableItem = collection.reduce((max, item) => {
        const itemValue = item.currentValue || item.purchasePrice;
        const maxValue = max ? (max.currentValue || max.purchasePrice) : 0;
        return itemValue > maxValue ? item : max;
      }, null as CollectionItem | null);
      
      const recentPurchases = collection
        .filter(item => item.status === 'owned')
        .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
        .slice(0, 5);
      
      return {
        totalItems,
        totalValue,
        totalSpent,
        averageValue,
        mostValuableItem: mostValuableItem || undefined,
        recentPurchases
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw error;
    }
  }

  // Get collection by status
  static async getCollectionByStatus(userId: string, status: CollectionItem['status']): Promise<CollectionItem[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('purchaseDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollectionItem[];
    } catch (error) {
      console.error('Error getting collection by status:', error);
      throw error;
    }
  }

  // Search collection
  static async searchCollection(userId: string, searchTerm: string): Promise<CollectionItem[]> {
    try {
      const collection = await this.getUserCollection(userId);
      
      return collection.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medium?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching collection:', error);
      throw error;
    }
  }
} 