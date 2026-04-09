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
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './firebase';

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
    url?: string;
  }>;
  notes?: string;
  portalAccess: boolean;
  status: 'pending' | 'active' | 'inactive';
  createdAt: any;
  updatedAt: any;
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
  gallery?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

export interface ArtistRegisterData {
  email: string;
  password: string;
  name: string;
  biography?: string;
  specialty?: string;
  nationality?: string;
  birthYear?: string;
  deathYear?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  galleryData?: { [key: string]: { darkLogo?: string; galleryId: string; lightLogo?: string; name: string } };
}

export class ArtistService {
  private static COLLECTION_NAME = 'users';

  // Create a new artist account and profile
  static async createArtistAccount(registerData: ArtistRegisterData): Promise<{ uid: string; profileId: string }> {
    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
                registerData.email,
        registerData.password
      );
      
      const { user } = userCredential;

      // 2. Update user profile with name
      await updateProfile(user, {
                  displayName: registerData.name
      });

      // 3. Send email verification
      await sendEmailVerification(user);

      // 4. Create user document in Firestore with all artist profile data
      const userDocRef = doc(db, this.COLLECTION_NAME, user.uid);
      const userData = {
        email: registerData.email,
        userType: ['user', 'artist'], // Set userType array instead of artist boolean
        gallery: registerData.galleryData || {},
        name: registerData.name,
        biography: registerData.biography || '',
        specialty: registerData.specialty || '',
        nationality: registerData.nationality || '',
        birthYear: registerData.birthYear || '',
        deathYear: registerData.deathYear || '',
        phone: registerData.phone || '',
        address1: registerData.address1 || '',
        city: registerData.city || '',
        state: registerData.state || '',
        postal: registerData.postal || '',
        country: registerData.country || '',
        additionalFields: [
          { label: 'Instagram', value: '' },
          { label: 'Website', value: '' }
        ],
        portalAccess: true,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userDocRef, userData);

      return {
        uid: user.uid,
        profileId: user.uid // Since we're using the same document, profileId = uid
      };
    } catch (error) {
      console.error('Error creating artist account:', error);
      throw error;
    }
  }

  // Create artist profile from admin panel
  static async createArtistProfile(profileData: ArtistProfile & { password?: string; confirmPassword?: string }): Promise<string> {
    try {
      // Extract password for Firebase Auth (don't save to Firestore)
      const { password, confirmPassword, ...profileDataWithoutPasswords } = profileData;
      
      // 1. Create Firebase Auth account if portal access is enabled
      let uid: string | null = null;
      
      if (profileData.portalAccess && profileData.email) {
        // Use provided password or generate a temporary password
        const tempPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          profileData.email,
          tempPassword
        );
        
        uid = userCredential.user.uid;
        
        // Update user profile
        await updateProfile(userCredential.user, {
          displayName: profileData.name
        });

        // Send email verification
        await sendEmailVerification(userCredential.user);
      }

      // 2. Upload photo if provided
      let photoURL: string | undefined = undefined;
      if (profileData.photo && typeof profileData.photo === 'object') {
        const file = profileData.photo as File;
        const photoRef = ref(storage, `artist-photos/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(photoRef, file);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // 3. Upload W-9 if provided
      let w9Url: string | undefined = undefined;
      if (profileData.w9 && typeof profileData.w9 === 'object') {
        const file = profileData.w9 as File;
        const w9Ref = ref(storage, `w9-forms/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(w9Ref, file);
        w9Url = await getDownloadURL(snapshot.ref);
      }

      // 4. Upload additional documents if provided
      let additionalDocumentsUrls: Array<{ id: string; name: string; type: string; url: string }> = [];
      if (profileData.additionalDocuments && profileData.additionalDocuments.length > 0) {
        for (const doc of profileData.additionalDocuments) {
          if (doc.file) {
            const docRef = ref(storage, `artist-documents/${Date.now()}-${doc.file.name}`);
            const snapshot = await uploadBytes(docRef, doc.file);
            const url = await getDownloadURL(snapshot.ref);
            additionalDocumentsUrls.push({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              url: url
            });
          }
        }
      }

      // 5. Prepare user document data with all artist profile information
      const userData: any = {
        email: profileData.email,
        userType: ['user', 'artist'], // Set userType array instead of artist boolean
        gallery: profileData.galleryData || {},
        name: profileData.name,
        biography: profileData.biography || '',
        specialty: profileData.specialty || '',
        nationality: profileData.nationality || '',
        birthYear: profileData.birthYear || '',
        deathYear: profileData.deathYear || '',
        phone: profileData.phone || '',
        altContact: profileData.altContact || '',
        altEmail: profileData.altEmail || '',
        address1: profileData.address1 || '',
        address2: profileData.address2 || '',
        city: profileData.city || '',
        state: profileData.state || '',
        postal: profileData.postal || '',
        country: profileData.country || '',
        taxId: profileData.taxId || '',
        taxClassification: profileData.taxClassification || '',
        businessName: profileData.businessName || '',
        additionalFields: profileData.additionalFields || [
          { label: 'Instagram', value: '' },
          { label: 'Website', value: '' }
        ],
        notes: profileData.notes || '',
        portalAccess: profileData.portalAccess || false,
        status: profileData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add photoURL, w9Url, and additionalDocumentsUrls if they exist
      if (photoURL) {
        userData.photoURL = photoURL;
      }
      if (w9Url) {
        userData.w9Url = w9Url;
      }
      if (additionalDocumentsUrls.length > 0) {
        userData.additionalDocuments = additionalDocumentsUrls;
      }

      // 6. Save to users collection
      if (uid) {
        // If we created a Firebase Auth account, save to that user's document
        const userDocRef = doc(db, this.COLLECTION_NAME, uid);
        console.log("Saving artist data to users collection with UID:", uid);
        console.log("Data being saved:", userData);
        await setDoc(userDocRef, userData);
        return uid;
      } else {
        // If no portal access, create a new document in users collection
        console.log("Creating new artist document in users collection");
        console.log("Data being saved:", userData);
        const userDocRef = await addDoc(collection(db, this.COLLECTION_NAME), userData);
        return userDocRef.id;
      }
    } catch (error) {
      console.error('Error creating artist profile:', error);
      throw error;
    }
  }

  // Get artist profile by ID
  static async getArtistProfile(profileId: string): Promise<ArtistProfile | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, profileId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ArtistProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artist profile:', error);
      throw error;
    }
  }

  // Get all artist profiles
  static async getAllArtistProfiles(): Promise<ArtistProfile[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where('userType', 'array-contains', 'artist'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtistProfile[];
    } catch (error) {
      console.error('Error getting all artist profiles:', error);
      throw error;
    }
  }

  // Get artist profiles by gallery ID
  static async getArtistProfilesByGalleryId(galleryId: string): Promise<ArtistProfile[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where('userType', 'array-contains', 'artist'));
      const querySnapshot = await getDocs(q);
      
      // Filter artists that belong to the specified gallery
      const filteredArtists = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ArtistProfile))
        .filter(artist => {
          // Check if the artist has gallery data and if the specified galleryId exists in it
          return artist.gallery && artist.gallery[galleryId];
        });
      
      return filteredArtists;
    } catch (error) {
      console.error('Error getting artist profiles by gallery ID:', error);
      throw error;
    }
  }

  // Update artist profile
  static async updateArtistProfile(profileId: string, updates: Partial<ArtistProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, profileId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating artist profile:', error);
      throw error;
    }
  }

  // Get artist profile by user ID
  static async getArtistProfileByUserId(userId: string): Promise<ArtistProfile | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ArtistProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artist profile by user ID:', error);
      throw error;
    }
  }

  // Check if email is already registered
  static async isEmailRegistered(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email registration:', error);
      throw error;
    }
  }
} 