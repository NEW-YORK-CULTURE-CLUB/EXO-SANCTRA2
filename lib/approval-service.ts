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

export interface ArtistApproval {
  id?: string;
  artistName: string;
  artistEmail: string;
  galleryName: string;
  galleryId: string;
  galleryLogo?: string;
  galleryDarkLogo?: string;
  invitationDate: any;
  terms: {
    commissionRate: number;
    paymentTerms: string;
    exhibitionOpportunities: boolean;
    marketingSupport: boolean;
    insuranceCoverage: boolean;
    transportationCoverage: boolean;
  };
  status: 'pending' | 'approved' | 'declined';
  signature?: string;
  signedDate?: any;
  agreements?: {
    termsAccepted: boolean;
    privacyPolicy: boolean;
    marketingConsent: boolean;
    dataProcessing: boolean;
  };
  createdAt: any;
  updatedAt: any;
}

export interface CreateApprovalData {
  artistName: string;
  artistEmail: string;
  galleryName: string;
  galleryId: string;
  galleryLogo?: string;
  galleryDarkLogo?: string;
  terms: {
    commissionRate: number;
    paymentTerms: string;
    exhibitionOpportunities: boolean;
    marketingSupport: boolean;
    insuranceCoverage: boolean;
    transportationCoverage: boolean;
  };
}

export class ApprovalService {
  private static COLLECTION_NAME = 'artist-approvals';

  // Create a new artist approval request
  static async createApproval(approvalData: CreateApprovalData): Promise<string> {
    try {
      const approvalDoc: ArtistApproval = {
        ...approvalData,
        invitationDate: serverTimestamp(),
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), approvalDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating artist approval:', error);
      throw error;
    }
  }

  // Get approval by ID
  static async getApproval(approvalId: string): Promise<ArtistApproval | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, approvalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ArtistApproval;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting approval:', error);
      throw error;
    }
  }

  // Get all approvals for a gallery
  static async getApprovalsByGallery(galleryId: string): Promise<ArtistApproval[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('galleryId', '==', galleryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistApproval[];
    } catch (error) {
      console.error('Error getting approvals by gallery:', error);
      throw error;
    }
  }

  // Get all approvals for an artist
  static async getApprovalsByArtist(artistEmail: string): Promise<ArtistApproval[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('artistEmail', '==', artistEmail),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistApproval[];
    } catch (error) {
      console.error('Error getting approvals by artist:', error);
      throw error;
    }
  }

  // Update approval status
  static async updateApprovalStatus(
    approvalId: string, 
    status: 'approved' | 'declined',
    signature?: string,
    agreements?: any
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, approvalId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'approved') {
        updateData.signature = signature;
        updateData.signedDate = serverTimestamp();
        updateData.agreements = agreements;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error;
    }
  }

  // Get pending approvals for a gallery
  static async getPendingApprovals(galleryId: string): Promise<ArtistApproval[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('galleryId', '==', galleryId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistApproval[];
    } catch (error) {
      console.error('Error getting pending approvals:', error);
      throw error;
    }
  }

  // Get all approvals with status filter
  static async getApprovalsByStatus(status: 'pending' | 'approved' | 'declined'): Promise<ArtistApproval[]> {
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
      })) as ArtistApproval[];
    } catch (error) {
      console.error('Error getting approvals by status:', error);
      throw error;
    }
  }

  // Delete approval (for cleanup purposes)
  static async deleteApproval(approvalId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, approvalId);
      await docRef.delete();
    } catch (error) {
      console.error('Error deleting approval:', error);
      throw error;
    }
  }

  // Check if artist has pending approval for gallery
  static async hasPendingApproval(artistEmail: string, galleryId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('artistEmail', '==', artistEmail),
        where('galleryId', '==', galleryId),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking pending approval:', error);
      throw error;
    }
  }
} 