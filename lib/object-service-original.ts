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

export interface Object {
  id?: string;
  sku: string;
  title: string;
  makerManufacturer: string;
  designAttribution?: string;
  modelNameCode: string;
  productionYearEra: string;
  materialsComposition: string;
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
  serialNumber?: string;
  functionalStatus?: string;
  patentsMarksHallmarks?: string;
  originalPurposeUse?: string;
  modificationRestorationNotes?: string;
  licensingIpHolder?: string;
  culturalGeographicOrigin?: string;
  technicalSpecifications?: string;
  customFeatures?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
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

export interface ObjectFormData {
  title: string;
  makerManufacturer: string;
  designAttribution?: string;
  modelNameCode: string;
  productionYearEra: string;
  materialsComposition: string;
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
  serialNumber?: string;
  functionalStatus?: string;
  patentsMarksHallmarks?: string;
  originalPurposeUse?: string;
  modificationRestorationNotes?: string;
  licensingIpHolder?: string;
  culturalGeographicOrigin?: string;
  technicalSpecifications?: string;
  customFeatures?: string;
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
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

export class ObjectService {
  private static COLLECTION_NAME = 'Objects';

  // Generate SKU
  private static generateSKU(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `OBJ-${timestamp}-${random}`;
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

  // Create a new object
  static async createObject(objectData: ObjectFormData, galleryData?: any): Promise<string> {
    try {
      console.log('ObjectService: Starting object creation...');
      console.log('ObjectService: Input data:', objectData);
      console.log('ObjectService: Gallery data:', galleryData);
      
      // 1. Process and upload images securely
      let processedImages: ProcessedImage[] = [];
      if (objectData.images && objectData.images.length > 0) {
        console.log('ObjectService: Processing', objectData.images.length, 'images securely...');
        // Generate a temporary ID for image processing
        const tempObjectId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        for (const image of objectData.images) {
          console.log('ObjectService: Processing image:', image.name);
          try {
            const processedImage = await SecureImageService.processArtworkImage(image, tempObjectId);
            processedImages.push(processedImage);
            console.log('ObjectService: Image processed successfully:', processedImage.id);
          } catch (error) {
            console.error('ObjectService: Failed to process image:', image.name, error);
            // Continue with other images if one fails
          }
        }
      } else {
        console.log('ObjectService: No images to process');
      }

      // 2. Upload certificates if provided
      let certificateUrls: Array<{ id: string; name: string; type: string; typeLabel: string; url: string; uploadedAt: string }> = [];
      if (objectData.certificates && objectData.certificates.length > 0) {
        console.log('ObjectService: Uploading', objectData.certificates.length, 'certificates...');
        for (const cert of objectData.certificates) {
          if (cert.file) {
            console.log('ObjectService: Uploading certificate:', cert.file.name);
            const certRef = ref(storage, `object-certificates/${Date.now()}-${cert.file.name}`);
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
            console.log('ObjectService: Certificate uploaded successfully:', url);
          }
        }
      } else {
        console.log('ObjectService: No certificates to upload');
      }

      // 3. Prepare object document data
      const objectDoc: Object = {
        sku: this.generateSKU(),
        title: objectData.title,
        makerManufacturer: objectData.makerManufacturer,
        designAttribution: objectData.designAttribution,
        modelNameCode: objectData.modelNameCode,
        productionYearEra: objectData.productionYearEra,
        materialsComposition: objectData.materialsComposition,
        // Dimensions and weight (stored in mm and kg)
        width: this.convertToMillimeters(parseFloat(objectData.width), objectData.unitSystem) || 0,
        height: this.convertToMillimeters(parseFloat(objectData.height), objectData.unitSystem) || 0,
        depth: objectData.depth ? this.convertToMillimeters(parseFloat(objectData.depth), objectData.unitSystem) : null,
        weight: objectData.weight ? this.convertToKilograms(parseFloat(objectData.weight), objectData.unitSystem) : null,
        // Frame dimensions (stored in mm)
        hasFrame: objectData.hasFrame,
        frameWidth: objectData.hasFrame && objectData.frameWidth ? this.convertToMillimeters(parseFloat(objectData.frameWidth), objectData.unitSystem) : null,
        frameHeight: objectData.hasFrame && objectData.frameHeight ? this.convertToMillimeters(parseFloat(objectData.frameHeight), objectData.unitSystem) : null,
        frameDepth: objectData.hasFrame && objectData.frameDepth ? this.convertToMillimeters(parseFloat(objectData.frameDepth), objectData.unitSystem) : null,
        // Unit preference for display
        unitPreference: objectData.unitSystem,
        serialNumber: objectData.serialNumber,
        functionalStatus: objectData.functionalStatus,
        patentsMarksHallmarks: objectData.patentsMarksHallmarks,
        originalPurposeUse: objectData.originalPurposeUse,
        modificationRestorationNotes: objectData.modificationRestorationNotes,
        licensingIpHolder: objectData.licensingIpHolder,
        culturalGeographicOrigin: objectData.culturalGeographicOrigin,
        technicalSpecifications: objectData.technicalSpecifications,
        customFeatures: objectData.customFeatures,
        price: objectData.price,
        priceType: objectData.priceType,
        location: objectData.location,
        digitalFloor: objectData.digitalFloor ? 'Active' : 'Inactive',
        status: 'active',
        description: objectData.description || '',
        internalNotes: objectData.internalNotes || '',
        matureContent: objectData.matureContent || 'No',
        distributionType: objectData.distributionType,
        createdBy: objectData.createdBy,
        galleryData: galleryData || {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add processedImages and certificateUrls if they exist
      if (processedImages.length > 0) {
        objectDoc.images = processedImages;
      }
      if (certificateUrls.length > 0) {
        objectDoc.certificates = certificateUrls;
      }

      console.log('ObjectService: Saving to Firestore...');
      console.log('ObjectService: Final object document:', objectDoc);
      
      // 4. Save to Objects collection
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), objectDoc);
      console.log('ObjectService: Object saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('ObjectService: Error creating object:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
      throw new Error(`Failed to create object: ${errorMessage} (Code: ${errorCode})`);
    }
  }

  // Get object by ID
  static async getObjectById(id: string): Promise<Object | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Object;
      } else {
        return null;
      }
    } catch (error) {
      console.error('ObjectService: Error getting object by ID:', error);
      throw new Error('Failed to get object');
    }
  }

  // Get objects by gallery ID
  static async getObjectsByGalleryId(galleryId: string): Promise<Object[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where(`galleryData.${galleryId}.galleryId`, '==', galleryId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const objects: Object[] = [];
      
      querySnapshot.forEach((doc) => {
        objects.push({ id: doc.id, ...doc.data() } as Object);
      });
      
      return objects;
    } catch (error) {
      console.error('ObjectService: Error getting objects by gallery ID:', error);
      throw new Error('Failed to get objects');
    }
  }

  // Update object
  static async updateObject(id: string, updates: Partial<Object>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('ObjectService: Error updating object:', error);
      throw new Error('Failed to update object');
    }
  }

  // Delete object
  static async deleteObject(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('ObjectService: Error deleting object:', error);
      throw new Error('Failed to delete object');
    }
  }
}
