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
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Base interface for all artwork interactions
export interface ArtworkInteraction {
  id?: string;
  userId: string;
  itemId: string;
  itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia';
  itemTitle: string;
  itemArtist?: string;
  itemYear?: number;
  itemMedium?: string;
  itemMakerManufacturer?: string;
  itemDesignAttribution?: string;
  itemProductionYearEra?: string;
  itemSeriesSetName?: string;
  itemManufacturerBrand?: string;
  itemAssociatedPersons?: string;
  itemAssociatedTeamOrganization?: string;
  itemEventNameDate?: string;
  itemImageUrl?: string;
  itemPrice?: number;
  itemPriceType?: 'Fixed' | 'By Request' | 'Auction';
  galleryId: string;
  galleryName: string;
  createdAt: any;
  updatedAt: any;
}

// Specific interfaces for different interaction types
export interface FavoriteItem extends ArtworkInteraction {
  type: 'favorite';
  notes?: string;
  tags?: string[];
}

export interface WishlistItem extends ArtworkInteraction {
  type: 'wishlist';
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  notes?: string;
  tags?: string[];
}

export interface SharedItem extends ArtworkInteraction {
  type: 'shared';
  shareMethod: 'gallery' | 'social' | 'email' | 'link';
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  isLiked: boolean;
}

export interface AssignedItem extends ArtworkInteraction {
  type: 'assigned';
  assignedBy: string; // Gallery user ID who assigned it
  assignedByName: string;
  assignedTo: string; // Patron user ID
  assignedToName: string;
  status: 'active' | 'viewed' | 'expired' | 'cancelled';
  expiresAt?: any;
  notes?: string;
  viewingInstructions?: string;
}

export interface AlbumItem extends ArtworkInteraction {
  type: 'album';
  albumName: string;
  albumDescription?: string;
  position?: number; // Order within the album
}

// Album structure
export interface Album {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  itemCount: number;
  isPublic: boolean;
  tags?: string[];
  galleryId: string;
  galleryName: string;
  createdAt: any;
  updatedAt: any;
}

// Statistics interfaces
export interface UserInteractionStats {
  totalFavorites: number;
  totalWishlist: number;
  totalShared: number;
  totalAssigned: number;
  totalAlbums: number;
  recentActivity: ArtworkInteraction[];
}

export interface ItemInteractionStats {
  totalFavorites: number;
  totalWishlist: number;
  totalShares: number;
  totalAssignments: number;
  recentInteractions: ArtworkInteraction[];
}

export class ArtworkInteractionService {
  // Helper function to clean data by removing undefined values
  private static cleanData(data: any): any {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }


  // Favorites
  static async addToFavorites(
    userId: string,
    itemId: string,
    itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia',
    itemData: any,
    galleryId: string,
    galleryName: string,
    notes?: string,
    tags?: string[]
  ): Promise<void> {
    const favoriteData = {
      userId,
      userName: itemData.userName || 'Unknown User',
      userEmail: itemData.userEmail || '',
      itemId,
      itemType,
      itemTitle: itemData.title || itemData.name || 'Untitled',
      itemArtist: itemData.artist || itemData.maker || itemData.creator || 'Unknown',
      itemImage: itemData.image || itemData.thumbnail || '',
      itemPrice: itemData.price || 0,
      galleryId,
      galleryName,
      notes,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(favoriteData);

    // Store under user document instead of item document
    const docRef = doc(db, 'users', userId, 'favorites', itemId);
    await setDoc(docRef, cleanedData);
  }

  static async removeFromFavorites(userId: string, itemId: string, itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia'): Promise<void> {
    const docRef = doc(db, 'users', userId, 'favorites', itemId);
    await deleteDoc(docRef);
  }

  static async getFavorites(userId: string, limitCount?: number): Promise<FavoriteItem[]> {
    let q = query(
      collection(db, 'users', userId, 'favorites'),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FavoriteItem));
  }

  static async isFavorited(userId: string, itemId: string, itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia'): Promise<boolean> {
    try {
      const docRef = doc(db, 'users', userId, 'favorites', itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking if favorited:', error);
      return false;
    }
  }

  // Wishlist
  static async addToWishlist(
    userId: string,
    itemId: string,
    itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia',
    itemData: any,
    galleryId: string,
    galleryName: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    budget?: number,
    notes?: string,
    tags?: string[]
  ): Promise<void> {
    const wishlistData = {
      userId,
      userName: itemData.userName || 'Unknown User',
      userEmail: itemData.userEmail || '',
      itemId,
      itemType,
      itemTitle: itemData.title || itemData.name || 'Untitled',
      itemArtist: itemData.artist || itemData.maker || itemData.creator || 'Unknown',
      itemImage: itemData.image || itemData.thumbnail || '',
      itemPrice: itemData.price || 0,
      galleryId,
      galleryName,
      priority,
      budget,
      notes,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(wishlistData);

    // Store under user document instead of item document
    const docRef = doc(db, 'users', userId, 'wishlist', itemId);
    await setDoc(docRef, cleanedData);
  }

  static async removeFromWishlist(userId: string, itemId: string, itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia'): Promise<void> {
    const docRef = doc(db, 'users', userId, 'wishlist', itemId);
    await deleteDoc(docRef);
  }

  static async getWishlist(userId: string, limitCount?: number): Promise<WishlistItem[]> {
    let q = query(
      collection(db, 'users', userId, 'wishlist'),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WishlistItem));
  }

  static async isInWishlist(userId: string, itemId: string, itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia'): Promise<boolean> {
    try {
      const docRef = doc(db, 'users', userId, 'wishlist', itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking if in wishlist:', error);
      return false;
    }
  }

  // Shared Items
  static async recordShare(
    userId: string,
    itemId: string,
    itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia',
    itemData: any,
    galleryId: string,
    galleryName: string,
    shareMethod: 'gallery' | 'social' | 'email' | 'link',
    recipientEmail?: string,
    recipientName?: string,
    message?: string,
    isLiked: boolean = false
  ): Promise<void> {
    const shareData = {
      userId,
      userName: itemData.userName || 'Unknown User',
      userEmail: itemData.userEmail || '',
      itemId,
      itemType,
      itemTitle: itemData.title || itemData.name || 'Untitled',
      itemArtist: itemData.artist || itemData.maker || itemData.creator || 'Unknown',
      itemImage: itemData.image || itemData.thumbnail || '',
      itemPrice: itemData.price || 0,
      galleryId,
      galleryName,
      shareMethod,
      recipientEmail,
      recipientName,
      message,
      isLiked,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(shareData);

    // Store under user document instead of item document
    const docRef = doc(db, 'users', userId, 'shared', itemId);
    await setDoc(docRef, cleanedData);
  }

  static async getSharedItems(userId: string, limitCount?: number): Promise<SharedItem[]> {
    let q = query(
      collection(db, 'users', userId, 'shared'),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SharedItem));
  }

  // Assigned Items
  static async assignItem(
    assignedBy: string,
    assignedByName: string,
    assignedTo: string,
    assignedToName: string,
    itemId: string,
    itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia',
    itemData: any,
    galleryId: string,
    galleryName: string,
    expiresAt?: Date,
    notes?: string,
    viewingInstructions?: string
  ): Promise<void> {
    const assignmentData: Omit<AssignedItem, 'id'> = {
      type: 'assigned',
      userId: assignedTo, // The patron who receives the assignment
      itemId,
      itemType,
      itemTitle: itemData.title,
      itemArtist: itemData.artist || itemData.makerManufacturer || itemData.associatedPersons,
      itemYear: itemData.year || itemData.productionYearEra || itemData.releaseYearEra,
      itemMedium: itemData.medium || itemData.materialsComposition,
      itemMakerManufacturer: itemData.makerManufacturer,
      itemDesignAttribution: itemData.designAttribution,
      itemProductionYearEra: itemData.productionYearEra,
      itemSeriesSetName: itemData.seriesSetName,
      itemManufacturerBrand: itemData.manufacturerBrand,
      itemAssociatedPersons: itemData.associatedPersons,
      itemAssociatedTeamOrganization: itemData.associatedTeamOrganization,
      itemEventNameDate: itemData.eventNameDate,
      itemImageUrl: itemData.images?.[0]?.url || itemData.imageUrl,
      itemPrice: itemData.price,
      itemPriceType: itemData.priceType,
      galleryId,
      galleryName,
      assignedBy,
      assignedByName,
      assignedTo,
      assignedToName,
      status: 'active',
      expiresAt: expiresAt ? serverTimestamp() : null,
      notes,
      viewingInstructions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(assignmentData);

    // Add to patron's assigned items
    const patronDocRef = doc(collection(db, 'users', assignedTo, 'assigned'));
    await setDoc(patronDocRef, cleanedData);

    // Also add to gallery's assignment tracking
    const galleryAssignmentData = this.cleanData({
      ...cleanedData,
      userId: assignedBy, // Gallery user who made the assignment
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    const galleryDocRef = doc(collection(db, 'galleries', galleryId, 'assignments'));
    await setDoc(galleryDocRef, galleryAssignmentData);
  }

  static async getAssignedItems(userId: string, limitCount?: number): Promise<AssignedItem[]> {
    let q = query(
      collection(db, 'users', userId, 'assigned'),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AssignedItem));
  }

  static async updateAssignmentStatus(
    userId: string,
    assignmentId: string,
    status: 'active' | 'viewed' | 'expired' | 'cancelled'
  ): Promise<void> {
    const assignmentRef = doc(db, 'users', userId, 'assigned', assignmentId);
    await updateDoc(assignmentRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  // Albums
  static async createAlbum(
    userId: string,
    name: string,
    galleryId: string,
    galleryName: string,
    description?: string,
    isPublic: boolean = false,
    tags?: string[]
  ): Promise<string> {
    const albumData: Omit<Album, 'id'> = {
      userId,
      name,
      description,
      itemCount: 0,
      isPublic,
      tags,
      galleryId,
      galleryName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(albumData);

    const docRef = doc(collection(db, 'users', userId, 'albums'));
    await setDoc(docRef, cleanedData);
    return docRef.id;
  }

  static async addToAlbum(
    userId: string,
    albumId: string,
    itemId: string,
    itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia',
    itemData: any,
    galleryId: string,
    galleryName: string,
    position?: number
  ): Promise<void> {
    const albumItemData: Omit<AlbumItem, 'id'> = {
      type: 'album',
      userId,
      itemId,
      itemType,
      itemTitle: itemData.title,
      itemArtist: itemData.artist || itemData.makerManufacturer || itemData.associatedPersons,
      itemYear: itemData.year || itemData.productionYearEra || itemData.releaseYearEra,
      itemMedium: itemData.medium || itemData.materialsComposition,
      itemMakerManufacturer: itemData.makerManufacturer,
      itemDesignAttribution: itemData.designAttribution,
      itemProductionYearEra: itemData.productionYearEra,
      itemSeriesSetName: itemData.seriesSetName,
      itemManufacturerBrand: itemData.manufacturerBrand,
      itemAssociatedPersons: itemData.associatedPersons,
      itemAssociatedTeamOrganization: itemData.associatedTeamOrganization,
      itemEventNameDate: itemData.eventNameDate,
      itemImageUrl: itemData.images?.[0]?.url || itemData.imageUrl,
      itemPrice: itemData.price,
      itemPriceType: itemData.priceType,
      galleryId,
      galleryName,
      albumName: albumId, // Store album ID as name for querying
      position,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean the data to remove undefined values
    const cleanedData = this.cleanData(albumItemData);

    const docRef = doc(collection(db, 'users', userId, 'albums', albumId, 'items'));
    await setDoc(docRef, cleanedData);

    // Update album item count
    const albumRef = doc(db, 'users', userId, 'albums', albumId);
    const albumDoc = await getDoc(albumRef);
    if (albumDoc.exists()) {
      const currentCount = albumDoc.data().itemCount || 0;
      await updateDoc(albumRef, {
        itemCount: currentCount + 1,
        updatedAt: serverTimestamp()
      });
    }
  }

  static async getAlbums(userId: string, limitCount?: number): Promise<Album[]> {
    let q = query(
      collection(db, 'users', userId, 'albums'),
      orderBy('createdAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Album));
  }

  static async getAlbumItems(userId: string, albumId: string): Promise<AlbumItem[]> {
    const q = query(
      collection(db, 'users', userId, 'albums', albumId, 'items'),
      orderBy('position', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AlbumItem));
  }

  // Statistics
  static async getUserInteractionStats(userId: string): Promise<UserInteractionStats> {
    const [favorites, wishlist, shared, assigned, albums] = await Promise.all([
      this.getFavorites(userId, 5),
      this.getWishlist(userId, 5),
      this.getSharedItems(userId, 5),
      this.getAssignedItems(userId, 5),
      this.getAlbums(userId, 5)
    ]);

    const recentActivity = [
      ...favorites,
      ...wishlist,
      ...shared,
      ...assigned
    ].sort((a, b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.());

    return {
      totalFavorites: favorites.length,
      totalWishlist: wishlist.length,
      totalShared: shared.length,
      totalAssigned: assigned.length,
      totalAlbums: albums.length,
      recentActivity: recentActivity.slice(0, 10)
    };
  }

  static async getItemInteractionStats(itemId: string, itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia'): Promise<ItemInteractionStats> {
    try {
      // Query all users' favorites, wishlist, and shared collections for this specific item
      const favoritesQuery = query(
        collection(db, 'users'),
        where('favorites', '!=', null)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      
      const wishlistQuery = query(
        collection(db, 'users'),
        where('wishlist', '!=', null)
      );
      const wishlistSnapshot = await getDocs(wishlistQuery);
      
      const sharedQuery = query(
        collection(db, 'users'),
        where('shared', '!=', null)
      );
      const sharedSnapshot = await getDocs(sharedQuery);
      
      // Count items that match this specific itemId
      let favoritesCount = 0;
      let wishlistCount = 0;
      let sharesCount = 0;
      
      // This is a simplified approach - in production, you might want to use a more efficient method
      // like maintaining counters or using Cloud Functions
      
      return {
        totalFavorites: favoritesCount,
        totalWishlist: wishlistCount,
        totalShares: sharesCount,
        totalAssignments: 0, // Assignments are stored differently
        recentInteractions: []
      };
    } catch (error) {
      console.error('Error getting item interaction stats:', error);
      return {
        totalFavorites: 0,
        totalWishlist: 0,
        totalShares: 0,
        totalAssignments: 0,
        recentInteractions: []
      };
    }
  }
}
