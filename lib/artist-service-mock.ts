// Mock Artist Service - replaces all database calls with mock data
import { MockService } from './mock-service';

export interface ArtistProfile {
  id?: string;
  name: string;
  biography?: string;
  specialty?: string;
  nationality?: string;
  birthYear?: string;
  deathYear?: string;
  photo?: File;
  photoURL?: string;
  email: string;
  phone?: string;
  altContact?: string;
  altEmail?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  taxId?: string;
  taxClassification?: string;
  businessName?: string;
  w9?: File;
  w9Url?: string;
  additionalFields?: Array<{ label: string; value: string }>;
  additionalDocuments?: Array<{
    id: string;
    file: File;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
  createdBy?: {
    email: string;
    uid: string;
  };
}

export interface ArtistFormData {
  name: string;
  biography?: string;
  specialty?: string;
  nationality?: string;
  birthYear?: string;
  deathYear?: string;
  photo?: File;
  email: string;
  phone?: string;
  altContact?: string;
  altEmail?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  taxId?: string;
  taxClassification?: string;
  businessName?: string;
  w9?: File;
  additionalFields?: Array<{ label: string; value: string }>;
  additionalDocuments?: Array<{
    id: string;
    file: File;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
  createdBy?: {
    email: string;
    uid: string;
  };
}

export class ArtistService {
  private static COLLECTION_NAME = 'ArtistProfiles';

  // Create a new artist profile (mock implementation)
  static async createArtistProfile(artistData: ArtistFormData): Promise<string> {
    try {
      console.log('ArtistService: Mock - Creating artist profile...');
      
      // Mock artist document data
      const artistDoc: ArtistProfile = {
        name: artistData.name,
        biography: artistData.biography,
        specialty: artistData.specialty,
        nationality: artistData.nationality,
        birthYear: artistData.birthYear,
        deathYear: artistData.deathYear,
        email: artistData.email,
        phone: artistData.phone,
        altContact: artistData.altContact,
        altEmail: artistData.altEmail,
        address1: artistData.address1,
        address2: artistData.address2,
        city: artistData.city,
        state: artistData.state,
        postal: artistData.postal,
        country: artistData.country,
        taxId: artistData.taxId,
        taxClassification: artistData.taxClassification,
        businessName: artistData.businessName,
        additionalFields: artistData.additionalFields,
        additionalDocuments: artistData.additionalDocuments,
        status: 'pending',
        createdBy: artistData.createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock save to database
      const result = await MockService.addArtist(artistDoc);
      console.log('ArtistService: Mock - Artist profile created with ID:', result.id);
      return result.id;
    } catch (error) {
      console.error('ArtistService: Mock - Error creating artist profile:', error);
      throw error;
    }
  }

  // Get artist profile by ID (mock implementation)
  static async getArtistProfile(artistId: string): Promise<ArtistProfile | null> {
    try {
      const doc = await MockService.getArtist(artistId);
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as ArtistProfile;
      }
      return null;
    } catch (error) {
      console.error('ArtistService: Mock - Error getting artist profile:', error);
      throw error;
    }
  }

  // Get all artist profiles (mock implementation)
  static async getAllArtistProfiles(): Promise<ArtistProfile[]> {
    try {
      const querySnapshot = await MockService.getArtists();
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistProfile[];
    } catch (error) {
      console.error('ArtistService: Mock - Error getting all artist profiles:', error);
      throw error;
    }
  }

  // Get artist profiles by status (mock implementation)
  static async getArtistProfilesByStatus(status: string): Promise<ArtistProfile[]> {
    try {
      const querySnapshot = await MockService.getArtists({ 
        where: [{ field: 'status', value: status }] 
      });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistProfile[];
    } catch (error) {
      console.error('ArtistService: Mock - Error getting artist profiles by status:', error);
      throw error;
    }
  }

  // Update artist profile (mock implementation)
  static async updateArtistProfile(artistId: string, updateData: Partial<ArtistProfile>): Promise<void> {
    try {
      await MockService.updateArtist(artistId, { ...updateData, updatedAt: new Date() });
      console.log('ArtistService: Mock - Artist profile updated:', artistId);
    } catch (error) {
      console.error('ArtistService: Mock - Error updating artist profile:', error);
      throw error;
    }
  }

  // Delete artist profile (mock implementation)
  static async deleteArtistProfile(artistId: string): Promise<void> {
    try {
      await MockService.deleteArtist(artistId);
      console.log('ArtistService: Mock - Artist profile deleted:', artistId);
    } catch (error) {
      console.error('ArtistService: Mock - Error deleting artist profile:', error);
      throw error;
    }
  }

  // Search artist profiles (mock implementation)
  static async searchArtistProfiles(searchTerm: string): Promise<ArtistProfile[]> {
    try {
      const querySnapshot = await MockService.getArtists();
      const allArtists = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistProfile[];
      
      const term = searchTerm.toLowerCase();
      return allArtists.filter(artist => 
        artist.name.toLowerCase().includes(term) ||
        artist.biography?.toLowerCase().includes(term) ||
        artist.specialty?.toLowerCase().includes(term) ||
        artist.email.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('ArtistService: Mock - Error searching artist profiles:', error);
      throw error;
    }
  }

  // Get artist profiles by specialty (mock implementation)
  static async getArtistProfilesBySpecialty(specialty: string): Promise<ArtistProfile[]> {
    try {
      const querySnapshot = await MockService.getArtists({ 
        where: [{ field: 'specialty', value: specialty }] 
      });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistProfile[];
    } catch (error) {
      console.error('ArtistService: Mock - Error getting artist profiles by specialty:', error);
      throw error;
    }
  }

  // Approve artist profile (mock implementation)
  static async approveArtistProfile(artistId: string): Promise<void> {
    try {
      await this.updateArtistProfile(artistId, { status: 'approved' });
      console.log('ArtistService: Mock - Artist profile approved:', artistId);
    } catch (error) {
      console.error('ArtistService: Mock - Error approving artist profile:', error);
      throw error;
    }
  }

  // Reject artist profile (mock implementation)
  static async rejectArtistProfile(artistId: string): Promise<void> {
    try {
      await this.updateArtistProfile(artistId, { status: 'rejected' });
      console.log('ArtistService: Mock - Artist profile rejected:', artistId);
    } catch (error) {
      console.error('ArtistService: Mock - Error rejecting artist profile:', error);
      throw error;
    }
  }

  // Get artist statistics (mock implementation)
  static async getArtistStatistics(): Promise<{
    totalArtists: number;
    pendingArtists: number;
    approvedArtists: number;
    rejectedArtists: number;
    specialties: { [key: string]: number };
  }> {
    try {
      const allArtists = await this.getAllArtistProfiles();
      
      const stats = {
        totalArtists: allArtists.length,
        pendingArtists: allArtists.filter(artist => artist.status === 'pending').length,
        approvedArtists: allArtists.filter(artist => artist.status === 'approved').length,
        rejectedArtists: allArtists.filter(artist => artist.status === 'rejected').length,
        specialties: {} as { [key: string]: number }
      };
      
      // Count by specialty
      allArtists.forEach(artist => {
        if (artist.specialty) {
          stats.specialties[artist.specialty] = (stats.specialties[artist.specialty] || 0) + 1;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('ArtistService: Mock - Error getting artist statistics:', error);
      throw error;
    }
  }

  // Upload artist photo (mock implementation)
  static async uploadArtistPhoto(photo: File, artistId: string): Promise<string> {
    try {
      const path = `artist-photos/${artistId}/${photo.name}`;
      const result = await MockService.uploadFile(photo, path);
      return result.downloadURL;
    } catch (error) {
      console.error('ArtistService: Mock - Error uploading artist photo:', error);
      throw error;
    }
  }

  // Upload W9 document (mock implementation)
  static async uploadW9Document(w9File: File, artistId: string): Promise<string> {
    try {
      const path = `artist-documents/${artistId}/w9-${w9File.name}`;
      const result = await MockService.uploadFile(w9File, path);
      return result.downloadURL;
    } catch (error) {
      console.error('ArtistService: Mock - Error uploading W9 document:', error);
      throw error;
    }
  }

  // Upload additional document (mock implementation)
  static async uploadAdditionalDocument(document: File, artistId: string, documentType: string): Promise<string> {
    try {
      const path = `artist-documents/${artistId}/${documentType}-${document.name}`;
      const result = await MockService.uploadFile(document, path);
      return result.downloadURL;
    } catch (error) {
      console.error('ArtistService: Mock - Error uploading additional document:', error);
      throw error;
    }
  }
}
