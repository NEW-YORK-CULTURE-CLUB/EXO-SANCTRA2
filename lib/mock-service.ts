// Mock service to replace all database calls
import { artworkInventoryData } from '@/data/artworkInventoryData';
import { artistProfilesData } from '@/data/artistProfilesData';
import { collectorsData } from '@/data/collectorsData';
import { upcomingAuctions as auctionManagementData } from '@/data/auctionManagementData';
import { patrons as patronManagementData } from '@/data/patronManagementData';
import { recordVaultData } from '@/data/recordVaultData';
import { salesMetrics as salesData } from '@/data/salesData';
import { topPerformingArtworksData as topPerformersData } from '@/data/topPerformersData';
import { qrScanMetrics as qrScansData } from '@/data/qrScansData';
import { digitalFloorMetrics as digitalFloorData } from '@/data/digitalFloorData';
import { statsData as homePageData } from '@/data/homePageData';
import { analyticsStats as analyticsData } from '@/data/analyticsData';
import { getRandomUserData } from './profile-utils';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error for testing
const mockError = (message: string = 'Mock error') => {
  throw new Error(message);
};

// Generic mock CRUD operations
export class MockService {
  static async getCollection(collectionName: string, filters?: any) {
    await mockDelay();
    
    let data: any[] = [];
    
    switch (collectionName) {
      case 'Artwork':
        data = artworkInventoryData;
        break;
      case 'ArtistProfiles':
        data = artistProfilesData;
        break;
      case 'Collectors':
        data = collectorsData;
        break;
      case 'Auctions':
        data = auctionManagementData;
        break;
      case 'Patrons':
        data = patronManagementData;
        break;
      case 'RecordVault':
        data = recordVaultData;
        break;
      case 'Sales':
        data = salesData;
        break;
      case 'TopPerformers':
        data = topPerformersData;
        break;
      case 'QRScans':
        data = qrScansData;
        break;
      case 'DigitalFloor':
        data = digitalFloorData;
        break;
      case 'HomePage':
        data = homePageData;
        break;
      case 'Analytics':
        data = analyticsData;
        break;
      case 'Objects':
        data = [
          {
            id: 'OBJ-001',
            sku: 'OBJ-001',
            title: 'Vintage Tiffany Lamp',
            makerManufacturer: 'Tiffany Studios',
            modelNameCode: 'TS-1900-001',
            productionYearEra: '1900-1910',
            materialsComposition: 'Bronze, Favrile glass, Lead',
            width: 400,
            height: 600,
            depth: 300,
            weight: 8.5,
            hasFrame: false,
            unitPreference: 'mm',
            condition: 'Excellent',
            price: 125000,
            priceType: 'Fixed',
            location: 'Main Gallery',
            digitalFloor: 'Active',
            status: 'active',
            description: 'Original Tiffany Studios leaded glass table lamp with bronze base',
            createdBy: 'demo-user',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          {
            id: 'OBJ-002',
            sku: 'OBJ-002',
            title: 'Art Deco Vase',
            makerManufacturer: 'Lalique',
            modelNameCode: 'LAL-1930-002',
            productionYearEra: '1930-1940',
            materialsComposition: 'Crystal glass',
            width: 200,
            height: 350,
            depth: 200,
            weight: 2.1,
            hasFrame: false,
            unitPreference: 'mm',
            condition: 'Good',
            price: 45000,
            priceType: 'By Request',
            location: 'Vault A',
            digitalFloor: 'Inactive',
            status: 'active',
            description: 'Art Deco crystal vase with geometric patterns',
            createdBy: 'demo-user',
            createdAt: new Date('2023-02-10'),
            updatedAt: new Date('2023-02-10')
          }
        ];
        break;
      case 'users':
        // Get random user data
        const randomUserData = getRandomUserData();
        
        data = [{
          id: 'mock-user-id',
          email: 'demo@exhibitiq.com',
          userType: ['gallery', 'artist'],
          fullname: randomUserData.fullname,
          role: ['admin'],
          photoURL: randomUserData.photoURL,
          phone: '+1234567890',
          timezone: 'UTC',
          biography: 'Demo user for ExhibitIQ',
          location: 'Demo Location',
          website: 'https://exhibitiq.com',
          specialty: 'Digital Art',
          interests: ['Contemporary Art', 'Digital Media'],
          address: {
            street: '123 Demo Street',
            city: 'Demo City',
            state: 'DC',
            zipCode: '12345',
            country: 'USA'
          },
          marketingPreference: 'email',
          notes: 'Demo user account',
          patronType: 'premium',
          gallery: {
            'demo-gallery': {
              name: 'Demo Gallery',
              galleryId: 'demo-gallery',
              role: 'admin'
            }
          }
        }];
        break;
      default:
        data = [];
    }
    
    // Apply basic filtering if provided
    if (filters) {
      if (filters.where) {
        filters.where.forEach((filter: any) => {
          data = data.filter(item => item[filter.field] === filter.value);
        });
      }
      if (filters.orderBy) {
        data.sort((a, b) => {
          const field = filters.orderBy.field;
          const direction = filters.orderBy.direction || 'asc';
          if (direction === 'desc') {
            return b[field] > a[field] ? -1 : 1;
          }
          return a[field] > b[field] ? 1 : -1;
        });
      }
      if (filters.limit) {
        data = data.slice(0, filters.limit);
      }
    }
    
    return {
      docs: data.map((item, index) => ({
        id: item.id || `mock-${index}`,
        data: () => item,
        exists: true
      })),
      empty: data.length === 0,
      size: data.length
    };
  }

  static async getDocument(collectionName: string, docId: string) {
    await mockDelay();
    
    const collection = await this.getCollection(collectionName);
    const doc = collection.docs.find(d => d.id === docId);
    
    if (!doc) {
      return {
        id: docId,
        data: () => null,
        exists: false
      };
    }
    
    return doc;
  }

  static async addDocument(collectionName: string, data: any) {
    await mockDelay();
    
    const newId = `mock-${Date.now()}`;
    const newDoc = {
      id: newId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`Mock: Added document to ${collectionName}:`, newDoc);
    return { id: newId };
  }

  static async updateDocument(collectionName: string, docId: string, data: any) {
    await mockDelay();
    
    console.log(`Mock: Updated document ${docId} in ${collectionName}:`, data);
    return { success: true };
  }

  static async deleteDocument(collectionName: string, docId: string) {
    await mockDelay();
    
    console.log(`Mock: Deleted document ${docId} from ${collectionName}`);
    return { success: true };
  }

  static async setDocument(collectionName: string, docId: string, data: any) {
    await mockDelay();
    
    console.log(`Mock: Set document ${docId} in ${collectionName}:`, data);
    return { success: true };
  }

  // Specific mock methods for common operations
  static async getArtworks(filters?: any) {
    return this.getCollection('Artwork', filters);
  }

  static async getArtwork(id: string) {
    return this.getDocument('Artwork', id);
  }

  static async addArtwork(data: any) {
    return this.addDocument('Artwork', data);
  }

  static async updateArtwork(id: string, data: any) {
    return this.updateDocument('Artwork', id, data);
  }

  static async deleteArtwork(id: string) {
    return this.deleteDocument('Artwork', id);
  }

  static async getArtists(filters?: any) {
    return this.getCollection('ArtistProfiles', filters);
  }

  static async getArtist(id: string) {
    return this.getDocument('ArtistProfiles', id);
  }

  static async addArtist(data: any) {
    return this.addDocument('ArtistProfiles', data);
  }

  static async updateArtist(id: string, data: any) {
    return this.updateDocument('ArtistProfiles', id, data);
  }

  static async deleteArtist(id: string) {
    return this.deleteDocument('ArtistProfiles', id);
  }

  static async getCollectors(filters?: any) {
    return this.getCollection('Collectors', filters);
  }

  static async getCollector(id: string) {
    return this.getDocument('Collectors', id);
  }

  static async addCollector(data: any) {
    return this.addDocument('Collectors', data);
  }

  static async updateCollector(id: string, data: any) {
    return this.updateDocument('Collectors', id, data);
  }

  static async deleteCollector(id: string) {
    return this.deleteDocument('Collectors', id);
  }

  // Object methods
  static async getObjects(filters?: any) {
    return this.getCollection('Objects', filters);
  }

  static async getObject(id: string) {
    return this.getDocument('Objects', id);
  }

  static async addObject(data: any) {
    return this.addDocument('Objects', data);
  }

  static async updateObject(id: string, data: any) {
    return this.updateDocument('Objects', id, data);
  }

  static async deleteObject(id: string) {
    return this.deleteDocument('Objects', id);
  }

  static async getAuctions(filters?: any) {
    return this.getCollection('Auctions', filters);
  }

  static async getAuction(id: string) {
    return this.getDocument('Auctions', id);
  }

  static async addAuction(data: any) {
    return this.addDocument('Auctions', data);
  }

  static async updateAuction(id: string, data: any) {
    return this.updateDocument('Auctions', id, data);
  }

  static async deleteAuction(id: string) {
    return this.deleteDocument('Auctions', id);
  }

  static async getPatrons(filters?: any) {
    return this.getCollection('Patrons', filters);
  }

  static async getPatron(id: string) {
    return this.getDocument('Patrons', id);
  }

  static async addPatron(data: any) {
    return this.addDocument('Patrons', data);
  }

  static async updatePatron(id: string, data: any) {
    return this.updateDocument('Patrons', id, data);
  }

  static async deletePatron(id: string) {
    return this.deleteDocument('Patrons', id);
  }

  static async getUsers(filters?: any) {
    return this.getCollection('users', filters);
  }

  static async getUser(id: string) {
    return this.getDocument('users', id);
  }

  static async addUser(data: any) {
    return this.addDocument('users', data);
  }

  static async updateUser(id: string, data: any) {
    return this.updateDocument('users', id, data);
  }

  static async deleteUser(id: string) {
    return this.deleteDocument('users', id);
  }

  // Analytics and reporting
  static async getAnalytics() {
    return analyticsData;
  }

  static async getSalesData() {
    return salesData;
  }

  static async getTopPerformers() {
    return topPerformersData;
  }

  static async getQRScans() {
    return qrScansData;
  }

  static async getDigitalFloorData() {
    return digitalFloorData;
  }

  static async getHomePageData() {
    return homePageData;
  }

  static async getRecordVaultData() {
    return recordVaultData;
  }

  // Image and file operations (mock)
  static async uploadFile(file: File, path: string) {
    await mockDelay(500); // Simulate upload time
    
    const mockUrl = `https://mock-storage.com/${path}/${file.name}`;
    console.log(`Mock: Uploaded file to ${mockUrl}`);
    
    return {
      ref: { fullPath: path },
      metadata: { name: file.name, size: file.size },
      downloadURL: mockUrl
    };
  }

  static async deleteFile(path: string) {
    await mockDelay();
    console.log(`Mock: Deleted file ${path}`);
    return { success: true };
  }

  static async getDownloadURL(path: string) {
    await mockDelay();
    return `https://mock-storage.com/${path}`;
  }
}

// Export individual functions for compatibility
export const mockGetCollection = MockService.getCollection.bind(MockService);
export const mockGetDocument = MockService.getDocument.bind(MockService);
export const mockAddDocument = MockService.addDocument.bind(MockService);
export const mockUpdateDocument = MockService.updateDocument.bind(MockService);
export const mockDeleteDocument = MockService.deleteDocument.bind(MockService);
export const mockSetDocument = MockService.setDocument.bind(MockService);
