// Mock Object Service - replaces all database calls with mock data
import { MockService } from './mock-service';

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
  status: 'active' | 'inactive' | 'sold' | 'archived';
  description?: string;
  objectHistory?: string;
  internalNotes?: string;
  createdBy: string;
  galleryData?: any;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  certificates?: any[];
}

export interface ObjectFormData {
  title: string;
  makerManufacturer: string;
  designAttribution?: string;
  modelNameCode: string;
  productionYearEra: string;
  materialsComposition: string;
  width: number;
  height: number;
  depth?: number | null;
  weight?: number | null;
  hasFrame: boolean;
  frameWidth?: number | null;
  frameHeight?: number | null;
  frameDepth?: number | null;
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
  digitalFloor: boolean;
  description?: string;
  objectHistory?: string;
  internalNotes?: string;
  createdBy: string;
}

export class ObjectService {
  private static COLLECTION_NAME = 'Objects';

  private static generateSKU(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `OBJ-${timestamp}-${random}`;
  }

  // Create a new object (mock implementation)
  static async createObject(objectData: ObjectFormData, galleryData?: any): Promise<string> {
    try {
      console.log('ObjectService: Mock - Creating object...');
      
      // Mock object document data
      const objectDoc: Object = {
        sku: this.generateSKU(),
        title: objectData.title,
        makerManufacturer: objectData.makerManufacturer,
        designAttribution: objectData.designAttribution,
        modelNameCode: objectData.modelNameCode,
        productionYearEra: objectData.productionYearEra,
        materialsComposition: objectData.materialsComposition,
        width: objectData.width,
        height: objectData.height,
        depth: objectData.depth,
        weight: objectData.weight,
        hasFrame: objectData.hasFrame,
        frameWidth: objectData.frameWidth,
        frameHeight: objectData.frameHeight,
        frameDepth: objectData.frameDepth,
        unitPreference: objectData.unitPreference,
        serialNumber: objectData.serialNumber,
        functionalStatus: objectData.functionalStatus,
        patentsMarksHallmarks: objectData.patentsMarksHallmarks,
        originalPurposeUse: objectData.originalPurposeUse,
        modificationRestorationNotes: objectData.modificationRestorationNotes,
        licensingIpHolder: objectData.licensingIpHolder,
        culturalGeographicOrigin: objectData.culturalGeographicOrigin,
        technicalSpecifications: objectData.technicalSpecifications,
        customFeatures: objectData.customFeatures,
        condition: objectData.condition,
        price: objectData.price,
        priceType: objectData.priceType,
        location: objectData.location,
        digitalFloor: objectData.digitalFloor ? 'Active' : 'Inactive',
        status: 'active',
        description: objectData.description || '',
        objectHistory: objectData.objectHistory || '',
        internalNotes: objectData.internalNotes || '',
        createdBy: objectData.createdBy,
        galleryData: galleryData || {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock save to database
      const result = await MockService.addObject(objectDoc);
      console.log('ObjectService: Mock - Object created with ID:', result.id);
      return result.id;
    } catch (error) {
      console.error('ObjectService: Mock - Error creating object:', error);
      throw error;
    }
  }

  // Get a single object by ID (mock implementation)
  static async getObject(objectId: string): Promise<Object | null> {
    try {
      console.log('ObjectService: Mock - Getting object:', objectId);
      
      const result = await MockService.getObject(objectId);
      return result;
    } catch (error) {
      console.error('ObjectService: Mock - Error getting object:', error);
      throw error;
    }
  }

  // Get all objects for a gallery (mock implementation)
  static async getObjectsByGalleryId(galleryId: string): Promise<Object[]> {
    try {
      console.log('ObjectService: Mock - Getting objects for gallery:', galleryId);
      
      const result = await MockService.getData('Objects');
      return result || [];
    } catch (error) {
      console.error('ObjectService: Mock - Error getting objects:', error);
      throw error;
    }
  }

  // Get all objects (mock implementation)
  static async getAllObjects(): Promise<Object[]> {
    try {
      console.log('ObjectService: Mock - Getting all objects...');
      
      const result = await MockService.getData('Objects');
      return result || [];
    } catch (error) {
      console.error('ObjectService: Mock - Error getting all objects:', error);
      throw error;
    }
  }

  // Update an object (mock implementation)
  static async updateObject(objectId: string, objectData: Partial<Object>): Promise<void> {
    try {
      console.log('ObjectService: Mock - Updating object:', objectId);
      
      await MockService.updateObject(objectId, {
        ...objectData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('ObjectService: Mock - Error updating object:', error);
      throw error;
    }
  }

  // Delete an object (mock implementation)
  static async deleteObject(objectId: string): Promise<void> {
    try {
      console.log('ObjectService: Mock - Deleting object:', objectId);
      
      await MockService.deleteObject(objectId);
    } catch (error) {
      console.error('ObjectService: Mock - Error deleting object:', error);
      throw error;
    }
  }

  // Search objects (mock implementation)
  static async searchObjects(searchTerm: string, galleryId?: string): Promise<Object[]> {
    try {
      console.log('ObjectService: Mock - Searching objects:', searchTerm);
      
      const allObjects = await this.getAllObjects();
      const filteredObjects = allObjects.filter(object => 
        object.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        object.makerManufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        object.modelNameCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return filteredObjects;
    } catch (error) {
      console.error('ObjectService: Mock - Error searching objects:', error);
      throw error;
    }
  }
}
