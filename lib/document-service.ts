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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface DocumentRecord {
  id: string;
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
  galleryId: string;
  galleryName: string;
  documentType: string;
  documentName: string;
  documentUrl: string;
  documentSize: string;
  documentDate: string;
  description?: string;
  tags: string[];
  status: 'active' | 'archived';
  uploadedBy: {
    email: string;
    uid: string;
  };
  createdAt: any;
  updatedAt: any;
}

export interface DocumentCompleteness {
  itemId: string;
  itemTitle: string;
  itemType: 'Artwork' | 'Objects' | 'Collectibles' | 'Memorabilia';
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
  galleryId: string;
  galleryName: string;
  thumbnail?: string;
  totalDocuments: number;
  missingDocuments: number;
  completeDocuments: number;
  documentTypes: string[];
  missingDocumentTypes: string[];
  status: 'Complete' | 'Incomplete' | 'Missing';
  lastUpdated: string;
}

export interface DocumentType {
  id: string;
  name: string;
  category: 'Authentication' | 'Provenance' | 'Condition' | 'Valuation' | 'Exhibition' | 'Conservation' | 'Other';
  required: boolean;
  description: string;
}

export class DocumentService {
  private static COLLECTION_NAME = 'Documents';
  private static REQUIRED_DOCUMENT_TYPES = [
    'Certificate of Authenticity',
    'Provenance',
    'Condition Report'
  ];

  // Get all documents for a specific gallery
  static async getGalleryDocuments(galleryId: string): Promise<DocumentRecord[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('galleryId', '==', galleryId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentRecord[];
    } catch (error) {
      console.error('Error fetching gallery documents:', error);
      throw error;
    }
  }

  // Get document completeness for all items in a gallery
  static async getGalleryDocumentCompleteness(galleryId: string): Promise<DocumentCompleteness[]> {
    try {
      // Get all documents for the gallery
      const documents = await this.getGalleryDocuments(galleryId);
      
      // Group documents by item
      const itemDocuments = new Map<string, DocumentRecord[]>();
      documents.forEach(doc => {
        if (!itemDocuments.has(doc.itemId)) {
          itemDocuments.set(doc.itemId, []);
        }
        itemDocuments.get(doc.itemId)!.push(doc);
      });

      // Calculate completeness for each item
      const completeness: DocumentCompleteness[] = [];
      
      for (const [itemId, docs] of itemDocuments) {
        const firstDoc = docs[0];
        const documentTypes = docs.map(d => d.documentType);
        const missingDocumentTypes = this.REQUIRED_DOCUMENT_TYPES.filter(
          requiredType => !documentTypes.includes(requiredType)
        );

        let status: 'Complete' | 'Incomplete' | 'Missing';
        if (missingDocumentTypes.length === 0) {
          status = 'Complete';
        } else if (docs.length === 0) {
          status = 'Missing';
        } else {
          status = 'Incomplete';
        }

        const lastUpdated = docs.length > 0 
          ? docs.sort((a, b) => new Date(b.updatedAt?.toDate?.() || 0).getTime() - new Date(a.updatedAt?.toDate?.() || 0).getTime())[0].updatedAt?.toDate?.()?.toLocaleDateString() || '-'
          : '-';

        completeness.push({
          itemId,
          itemTitle: firstDoc.itemTitle,
          itemType: firstDoc.itemType,
          itemArtist: firstDoc.itemArtist,
          itemYear: firstDoc.itemYear,
          itemMedium: firstDoc.itemMedium,
          itemMakerManufacturer: firstDoc.itemMakerManufacturer,
          itemDesignAttribution: firstDoc.itemDesignAttribution,
          itemProductionYearEra: firstDoc.itemProductionYearEra,
          itemSeriesSetName: firstDoc.itemSeriesSetName,
          itemManufacturerBrand: firstDoc.itemManufacturerBrand,
          itemAssociatedPersons: firstDoc.itemAssociatedPersons,
          itemAssociatedTeamOrganization: firstDoc.itemAssociatedTeamOrganization,
          itemEventNameDate: firstDoc.itemEventNameDate,
          galleryId: firstDoc.galleryId,
          galleryName: firstDoc.galleryName,
          totalDocuments: docs.length,
          missingDocuments: missingDocumentTypes.length,
          completeDocuments: this.REQUIRED_DOCUMENT_TYPES.length - missingDocumentTypes.length,
          documentTypes,
          missingDocumentTypes,
          status,
          lastUpdated
        });
      }

      return completeness.sort((a, b) => {
        // Sort by status priority: Missing > Incomplete > Complete
        const statusPriority = { 'Missing': 0, 'Incomplete': 1, 'Complete': 2 };
        const aPriority = statusPriority[a.status];
        const bPriority = statusPriority[b.status];
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // Then sort by last updated date
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
    } catch (error) {
      console.error('Error calculating document completeness:', error);
      throw error;
    }
  }

  // Get document completeness for a specific item
  static async getItemDocumentCompleteness(itemId: string): Promise<DocumentCompleteness | null> {
    try {
      const documents = await this.getItemDocuments(itemId);
      
      if (documents.length === 0) {
        return null;
      }

      const firstDoc = documents[0];
      const documentTypes = documents.map(d => d.documentType);
      const missingDocumentTypes = this.REQUIRED_DOCUMENT_TYPES.filter(
        requiredType => !documentTypes.includes(requiredType)
      );

      let status: 'Complete' | 'Incomplete' | 'Missing';
      if (missingDocumentTypes.length === 0) {
        status = 'Complete';
      } else if (documents.length === 0) {
        status = 'Missing';
      } else {
        status = 'Incomplete';
      }

      const lastUpdated = documents.length > 0 
        ? documents.sort((a, b) => new Date(b.updatedAt?.toDate?.() || 0).getTime() - new Date(a.updatedAt?.toDate?.() || 0).getTime())[0].updatedAt?.toDate?.()?.toLocaleDateString() || '-'
        : '-';

      return {
        itemId,
        itemTitle: firstDoc.itemTitle,
        itemType: firstDoc.itemType,
        itemArtist: firstDoc.itemArtist,
        itemYear: firstDoc.itemYear,
        itemMedium: firstDoc.itemMedium,
        itemMakerManufacturer: firstDoc.itemMakerManufacturer,
        itemDesignAttribution: firstDoc.itemDesignAttribution,
        itemProductionYearEra: firstDoc.itemProductionYearEra,
        itemSeriesSetName: firstDoc.itemSeriesSetName,
        itemManufacturerBrand: firstDoc.itemManufacturerBrand,
        itemAssociatedPersons: firstDoc.itemAssociatedPersons,
        itemAssociatedTeamOrganization: firstDoc.itemAssociatedTeamOrganization,
        itemEventNameDate: firstDoc.itemEventNameDate,
        galleryId: firstDoc.galleryId,
        galleryName: firstDoc.galleryName,
        totalDocuments: documents.length,
        missingDocuments: missingDocumentTypes.length,
        completeDocuments: this.REQUIRED_DOCUMENT_TYPES.length - missingDocumentTypes.length,
        documentTypes,
        missingDocumentTypes,
        status,
        lastUpdated
      };
    } catch (error) {
      console.error('Error calculating item document completeness:', error);
      throw error;
    }
  }

  // Get all documents for a specific item
  static async getItemDocuments(itemId: string): Promise<DocumentRecord[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('itemId', '==', itemId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentRecord[];
    } catch (error) {
      console.error('Error fetching item documents:', error);
      throw error;
    }
  }

  // Add a new document
  static async addDocument(documentData: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...documentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Update a document
  static async updateDocument(documentId: string, updates: Partial<DocumentRecord>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(documentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Get all document types
  static getDocumentTypes(): DocumentType[] {
    return [
      {
        id: 'certificate-of-authenticity',
        name: 'Certificate of Authenticity',
        category: 'Authentication',
        required: true,
        description: 'Official document certifying the authenticity of the item'
      },
      {
        id: 'provenance',
        name: 'Provenance',
        category: 'Provenance',
        required: true,
        description: 'Documentation of the item\'s ownership history'
      },
      {
        id: 'condition-report',
        name: 'Condition Report',
        category: 'Condition',
        required: true,
        description: 'Detailed assessment of the item\'s current condition'
      },
      {
        id: 'insurance-valuation',
        name: 'Insurance Valuation',
        category: 'Valuation',
        required: false,
        description: 'Professional appraisal for insurance purposes'
      },
      {
        id: 'exhibition-documentation',
        name: 'Exhibition Documentation',
        category: 'Exhibition',
        required: false,
        description: 'Records of exhibitions where the item was displayed'
      },
      {
        id: 'conservation-report',
        name: 'Conservation Report',
        category: 'Conservation',
        required: false,
        description: 'Documentation of any conservation or restoration work'
      },
      {
        id: 'appraisal',
        name: 'Appraisal',
        category: 'Valuation',
        required: false,
        description: 'Professional valuation of the item'
      },
      {
        id: 'exhibition-history',
        name: 'Exhibition History',
        category: 'Exhibition',
        required: false,
        description: 'Complete history of exhibitions and displays'
      },
      {
        id: 'historical-documentation',
        name: 'Historical Documentation',
        category: 'Other',
        required: false,
        description: 'Historical records and research materials'
      }
    ];
  }

  // Get required document types
  static getRequiredDocumentTypes(): string[] {
    return this.REQUIRED_DOCUMENT_TYPES;
  }
}
