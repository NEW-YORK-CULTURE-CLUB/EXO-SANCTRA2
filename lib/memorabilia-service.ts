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
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { SecureImageService, ProcessedImage } from './secure-image-service';

export interface Memorabilia {
  id?: string;
  sku: string;
  title: string;
  associatedPersons: string;
  associatedTeamOrganization?: string;
  eventNameDate?: string;
  autographDetails?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  historicalSignificanceNotes?: string;
  eraPeriod?: string;
  ticketPassNumber?: string;
  commemorativeEditionDetails?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  // Dimensions and weight (stored in mm and kg)
  width: number;
  height: number;
  depth?: number | null;
  weight?: number | null;
  // Frame dimensions (stored in mm)
  hasFrame: boolean;
  frameWidth?: number | null;
  frameHeight?: number | null;
  frameDepth?: number | null;
  // Unit preference for display
  unitPreference: string;
  price: number;
  priceType: 'Fixed' | 'By Request' | 'Auction';
  location: string;
  digitalFloor: 'Active' | 'Inactive';
  status: 'active' | 'inactive' | 'sold' | 'on-hold';
  description?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No';
  images?: ProcessedImage[];
  certificates?: Array<{
    id: string;
    name: string;
    type: string;
    typeLabel: string;
    url: string;
    uploadedAt: string;
  }>;
  distributionType?: string;
  createdBy?: {
    email: string;
    uid: string;
  };
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
  createdAt: any;
  updatedAt: any;
}

export interface MemorabiliaFormData {
  title: string;
  associatedPersons: string;
  associatedTeamOrganization?: string;
  eventNameDate?: string;
  autographDetails?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  historicalSignificanceNotes?: string;
  eraPeriod?: string;
  ticketPassNumber?: string;
  commemorativeEditionDetails?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  // Dimensions and weight
  unitSystem: string;
  width: string;
  height: string;
  depth?: string;
  weight?: string;
  hasFrame: boolean;
  frameWidth?: string;
  frameHeight?: string;
  frameDepth?: string;
  price: number;
  priceType: 'Fixed' | 'By Request' | 'Auction';
  location: string;
  digitalFloor: boolean;
  description?: string;
  internalNotes?: string;
  matureContent?: 'Yes' | 'No';
  images?: File[];
  certificates?: Array<{
    id: string;
    file: File;
    name: string;
    type: string;
    typeLabel: string;
    uploadedAt: string;
  }>;
  distributionType?: string;
  createdBy?: {
    email: string;
    uid: string;
  };
}

export class MemorabiliaService {
  private static COLLECTION_NAME = 'Memorabilia';

  // Generate SKU
  private static generateSKU(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `MEM-${timestamp}-${random}`;
  }

  // Unit conversion functions
  private static convertToMillimeters(value: number, unitSystem: string): number {
    if (!value || isNaN(value)) return 0;
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round(value * 25.4); // inches to mm
      case 'metric':
        return Math.round(value * 10); // cm to mm
      case 'millimeters':
        return Math.round(value); // already in mm
      default:
        return Math.round(value * 25.4); // default to inches
    }
  }

  private static convertToKilograms(value: number, unitSystem: string): number {
    if (!value || isNaN(value)) return 0;
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round((value * 0.453592) * 1000) / 1000; // lbs to kg, keep 3 decimal places
      case 'metric':
      case 'millimeters':
        return Math.round(value * 1000) / 1000; // already in kg, keep 3 decimal places
      default:
        return Math.round((value * 0.453592) * 1000) / 1000; // default to lbs
    }
  }

  // Create a new memorabilia
  static async createMemorabilia(memorabiliaData: MemorabiliaFormData, galleryData?: any): Promise<string> {
    try {
      console.log('MemorabiliaService: Starting memorabilia creation...');
      console.log('MemorabiliaService: Input data:', memorabiliaData);
      console.log('MemorabiliaService: Gallery data:', galleryData);
      
      // 1. Process and upload images securely
      let processedImages: ProcessedImage[] = [];
      if (memorabiliaData.images && memorabiliaData.images.length > 0) {
        console.log('MemorabiliaService: Processing', memorabiliaData.images.length, 'images securely...');
        // Generate a temporary ID for image processing
        const tempMemorabiliaId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        for (const image of memorabiliaData.images) {
          console.log('MemorabiliaService: Processing image:', image.name);
          try {
            const processedImage = await SecureImageService.processArtworkImage(image, tempMemorabiliaId);
            processedImages.push(processedImage);
            console.log('MemorabiliaService: Image processed successfully:', processedImage.id);
          } catch (error) {
            console.error('MemorabiliaService: Failed to process image:', image.name, error);
            // Continue with other images if one fails
          }
        }
      } else {
        console.log('MemorabiliaService: No images to process');
      }

      // 2. Upload certificates if provided
      let certificateUrls: Array<{ id: string; name: string; type: string; typeLabel: string; url: string; uploadedAt: string }> = [];
      if (memorabiliaData.certificates && memorabiliaData.certificates.length > 0) {
        console.log('MemorabiliaService: Uploading', memorabiliaData.certificates.length, 'certificates...');
        for (const cert of memorabiliaData.certificates) {
          if (cert.file) {
            console.log('MemorabiliaService: Uploading certificate:', cert.file.name);
            const certRef = ref(storage, `memorabilia-certificates/${Date.now()}-${cert.file.name}`);
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
            console.log('MemorabiliaService: Certificate uploaded successfully:', url);
          }
        }
      } else {
        console.log('MemorabiliaService: No certificates to upload');
      }

      // 3. Prepare memorabilia document data
      const memorabiliaDoc: Memorabilia = {
        sku: this.generateSKU(),
        title: memorabiliaData.title,
        associatedPersons: memorabiliaData.associatedPersons,
        associatedTeamOrganization: memorabiliaData.associatedTeamOrganization,
        eventNameDate: memorabiliaData.eventNameDate,
        autographDetails: memorabiliaData.autographDetails,
        authenticationProvider: memorabiliaData.authenticationProvider,
        certificateOfAuthenticityNumber: memorabiliaData.certificateOfAuthenticityNumber,
        historicalSignificanceNotes: memorabiliaData.historicalSignificanceNotes,
        eraPeriod: memorabiliaData.eraPeriod,
        ticketPassNumber: memorabiliaData.ticketPassNumber,
        commemorativeEditionDetails: memorabiliaData.commemorativeEditionDetails,
        // Dimensions and weight (stored in mm and kg)
        width: this.convertToMillimeters(parseFloat(memorabiliaData.width), memorabiliaData.unitSystem) || 0,
        height: this.convertToMillimeters(parseFloat(memorabiliaData.height), memorabiliaData.unitSystem) || 0,
        depth: memorabiliaData.depth ? this.convertToMillimeters(parseFloat(memorabiliaData.depth), memorabiliaData.unitSystem) : null,
        weight: memorabiliaData.weight ? this.convertToKilograms(parseFloat(memorabiliaData.weight), memorabiliaData.unitSystem) : null,
        // Frame dimensions (stored in mm)
        hasFrame: memorabiliaData.hasFrame,
        frameWidth: memorabiliaData.hasFrame && memorabiliaData.frameWidth ? this.convertToMillimeters(parseFloat(memorabiliaData.frameWidth), memorabiliaData.unitSystem) : null,
        frameHeight: memorabiliaData.hasFrame && memorabiliaData.frameHeight ? this.convertToMillimeters(parseFloat(memorabiliaData.frameHeight), memorabiliaData.unitSystem) : null,
        frameDepth: memorabiliaData.hasFrame && memorabiliaData.frameDepth ? this.convertToMillimeters(parseFloat(memorabiliaData.frameDepth), memorabiliaData.unitSystem) : null,
        // Unit preference for display
        unitPreference: memorabiliaData.unitSystem,
        price: memorabiliaData.price,
        priceType: memorabiliaData.priceType,
        location: memorabiliaData.location,
        digitalFloor: memorabiliaData.digitalFloor ? 'Active' : 'Inactive',
        status: 'active',
        description: memorabiliaData.description || '',
        internalNotes: memorabiliaData.internalNotes || '',
        matureContent: memorabiliaData.matureContent || 'No',
        distributionType: memorabiliaData.distributionType,
        createdBy: memorabiliaData.createdBy,
        galleryData: galleryData || {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add processedImages and certificateUrls if they exist
      if (processedImages.length > 0) {
        memorabiliaDoc.images = processedImages;
      }
      if (certificateUrls.length > 0) {
        memorabiliaDoc.certificates = certificateUrls;
      }

      console.log('MemorabiliaService: Saving to Firestore...');
      console.log('MemorabiliaService: Final memorabilia document:', memorabiliaDoc);
      
      // 4. Save to Memorabilia collection
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), memorabiliaDoc);
      console.log('MemorabiliaService: Memorabilia saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('MemorabiliaService: Error creating memorabilia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
      throw new Error(`Failed to create memorabilia: ${errorMessage} (Code: ${errorCode})`);
    }
  }

  // Get memorabilia by ID
  static async getMemorabiliaById(id: string): Promise<Memorabilia | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Memorabilia;
      } else {
        return null;
      }
    } catch (error) {
      console.error('MemorabiliaService: Error getting memorabilia by ID:', error);
      throw new Error('Failed to get memorabilia');
    }
  }

  // Get memorabilia by gallery ID
  static async getMemorabiliaByGalleryId(galleryId: string): Promise<Memorabilia[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where(`galleryData.${galleryId}.galleryId`, '==', galleryId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const memorabilia: Memorabilia[] = [];
      
      querySnapshot.forEach((doc) => {
        memorabilia.push({ id: doc.id, ...doc.data() } as Memorabilia);
      });
      
      return memorabilia;
    } catch (error) {
      console.error('MemorabiliaService: Error getting memorabilia by gallery ID:', error);
      throw new Error('Failed to get memorabilia');
    }
  }

  // Update memorabilia
  static async updateMemorabilia(id: string, updates: Partial<Memorabilia>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('MemorabiliaService: Error updating memorabilia:', error);
      throw new Error('Failed to update memorabilia');
    }
  }

  // Delete memorabilia
  static async deleteMemorabilia(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('MemorabiliaService: Error deleting memorabilia:', error);
      throw new Error('Failed to delete memorabilia');
    }
  }
}
