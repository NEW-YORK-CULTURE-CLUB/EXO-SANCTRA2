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

export interface Collectible {
  id?: string;
  sku: string;
  title: string;
  seriesSetName: string;
  editionRunSize?: string;
  variantParallel?: string;
  modelVersionSku: string;
  releaseYearEra: string;
  manufacturerBrand: string;
  serialLotNumber?: string;
  gradingService?: string;
  grade?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  specialFeatures?: string;
  originalPackagingStatus?: string;
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

export interface CollectibleFormData {
  title: string;
  seriesSetName: string;
  editionRunSize?: string;
  variantParallel?: string;
  modelVersionSku: string;
  releaseYearEra: string;
  manufacturerBrand: string;
  serialLotNumber?: string;
  gradingService?: string;
  grade?: string;
  authenticationProvider?: string;
  certificateOfAuthenticityNumber?: string;
  specialFeatures?: string;
  originalPackagingStatus?: string;
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

export class CollectibleService {
  private static COLLECTION_NAME = 'Collectibles';

  // Generate SKU
  private static generateSKU(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `COL-${timestamp}-${random}`;
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

  // Create a new collectible
  static async createCollectible(collectibleData: CollectibleFormData, galleryData?: any): Promise<string> {
    try {
      console.log('CollectibleService: Starting collectible creation...');
      console.log('CollectibleService: Input data:', collectibleData);
      console.log('CollectibleService: Gallery data:', galleryData);
      
      // 1. Process and upload images securely
      let processedImages: ProcessedImage[] = [];
      if (collectibleData.images && collectibleData.images.length > 0) {
        console.log('CollectibleService: Processing', collectibleData.images.length, 'images securely...');
        // Generate a temporary ID for image processing
        const tempCollectibleId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        for (const image of collectibleData.images) {
          console.log('CollectibleService: Processing image:', image.name);
          try {
            const processedImage = await SecureImageService.processArtworkImage(image, tempCollectibleId);
            processedImages.push(processedImage);
            console.log('CollectibleService: Image processed successfully:', processedImage.id);
          } catch (error) {
            console.error('CollectibleService: Failed to process image:', image.name, error);
            // Continue with other images if one fails
          }
        }
      } else {
        console.log('CollectibleService: No images to process');
      }

      // 2. Upload certificates if provided
      let certificateUrls: Array<{ id: string; name: string; type: string; typeLabel: string; url: string; uploadedAt: string }> = [];
      if (collectibleData.certificates && collectibleData.certificates.length > 0) {
        console.log('CollectibleService: Uploading', collectibleData.certificates.length, 'certificates...');
        for (const cert of collectibleData.certificates) {
          if (cert.file) {
            console.log('CollectibleService: Uploading certificate:', cert.file.name);
            const certRef = ref(storage, `collectible-certificates/${Date.now()}-${cert.file.name}`);
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
            console.log('CollectibleService: Certificate uploaded successfully:', url);
          }
        }
      } else {
        console.log('CollectibleService: No certificates to upload');
      }

      // 3. Prepare collectible document data
      const collectibleDoc: Collectible = {
        sku: this.generateSKU(),
        title: collectibleData.title,
        seriesSetName: collectibleData.seriesSetName,
        editionRunSize: collectibleData.editionRunSize,
        variantParallel: collectibleData.variantParallel,
        modelVersionSku: collectibleData.modelVersionSku,
        releaseYearEra: collectibleData.releaseYearEra,
        manufacturerBrand: collectibleData.manufacturerBrand,
        serialLotNumber: collectibleData.serialLotNumber,
        gradingService: collectibleData.gradingService,
        grade: collectibleData.grade,
        authenticationProvider: collectibleData.authenticationProvider,
        certificateOfAuthenticityNumber: collectibleData.certificateOfAuthenticityNumber,
        specialFeatures: collectibleData.specialFeatures,
        originalPackagingStatus: collectibleData.originalPackagingStatus,
        // Dimensions and weight (stored in mm and kg)
        width: this.convertToMillimeters(parseFloat(collectibleData.width), collectibleData.unitSystem) || 0,
        height: this.convertToMillimeters(parseFloat(collectibleData.height), collectibleData.unitSystem) || 0,
        depth: collectibleData.depth ? this.convertToMillimeters(parseFloat(collectibleData.depth), collectibleData.unitSystem) : null,
        weight: collectibleData.weight ? this.convertToKilograms(parseFloat(collectibleData.weight), collectibleData.unitSystem) : null,
        // Frame dimensions (stored in mm)
        hasFrame: collectibleData.hasFrame,
        frameWidth: collectibleData.hasFrame && collectibleData.frameWidth ? this.convertToMillimeters(parseFloat(collectibleData.frameWidth), collectibleData.unitSystem) : null,
        frameHeight: collectibleData.hasFrame && collectibleData.frameHeight ? this.convertToMillimeters(parseFloat(collectibleData.frameHeight), collectibleData.unitSystem) : null,
        frameDepth: collectibleData.hasFrame && collectibleData.frameDepth ? this.convertToMillimeters(parseFloat(collectibleData.frameDepth), collectibleData.unitSystem) : null,
        // Unit preference for display
        unitPreference: collectibleData.unitSystem,
        price: collectibleData.price,
        priceType: collectibleData.priceType,
        location: collectibleData.location,
        digitalFloor: collectibleData.digitalFloor ? 'Active' : 'Inactive',
        status: 'active',
        description: collectibleData.description || '',
        internalNotes: collectibleData.internalNotes || '',
        matureContent: collectibleData.matureContent || 'No',
        distributionType: collectibleData.distributionType,
        createdBy: collectibleData.createdBy,
        galleryData: galleryData || {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add processedImages and certificateUrls if they exist
      if (processedImages.length > 0) {
        collectibleDoc.images = processedImages;
      }
      if (certificateUrls.length > 0) {
        collectibleDoc.certificates = certificateUrls;
      }

      console.log('CollectibleService: Saving to Firestore...');
      console.log('CollectibleService: Final collectible document:', collectibleDoc);
      
      // 4. Save to Collectibles collection
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), collectibleDoc);
      console.log('CollectibleService: Collectible saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('CollectibleService: Error creating collectible:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
      throw new Error(`Failed to create collectible: ${errorMessage} (Code: ${errorCode})`);
    }
  }

  // Get collectible by ID
  static async getCollectibleById(id: string): Promise<Collectible | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Collectible;
      } else {
        return null;
      }
    } catch (error) {
      console.error('CollectibleService: Error getting collectible by ID:', error);
      throw new Error('Failed to get collectible');
    }
  }

  // Get collectibles by gallery ID
  static async getCollectiblesByGalleryId(galleryId: string): Promise<Collectible[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where(`galleryData.${galleryId}.galleryId`, '==', galleryId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const collectibles: Collectible[] = [];
      
      querySnapshot.forEach((doc) => {
        collectibles.push({ id: doc.id, ...doc.data() } as Collectible);
      });
      
      return collectibles;
    } catch (error) {
      console.error('CollectibleService: Error getting collectibles by gallery ID:', error);
      throw new Error('Failed to get collectibles');
    }
  }

  // Update collectible
  static async updateCollectible(id: string, updates: Partial<Collectible>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('CollectibleService: Error updating collectible:', error);
      throw new Error('Failed to update collectible');
    }
  }

  // Delete collectible
  static async deleteCollectible(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('CollectibleService: Error deleting collectible:', error);
      throw new Error('Failed to delete collectible');
    }
  }
}
