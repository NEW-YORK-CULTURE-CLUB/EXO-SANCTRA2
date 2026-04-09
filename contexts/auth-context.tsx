'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { isArtist } from '@/lib/utils';
import { VerificationService } from '@/lib/verification-service';

interface Gallery {
  name: string;
  galleryId: string;
  darkLogo?: string;
  lightLogo?: string;
  role?: string;
}

interface UserData {
  email?: string;
  userType?: string[]; // Array of user types: ['user', 'artist', 'collector', 'patron', 'gallery']
  gallery?: { [key: string]: Gallery };
  role?: string[]; // Keep for backward compatibility
  photoURL?: string;
  fullname?: string;
  phone?: string;
  timezone?: string;
  biography?: string;
  location?: string;
  website?: string;
  specialty?: string;
  // User profile data (standalone fields)
  interests?: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  marketingPreference?: string;
  notes?: string;
  patronType?: string;
  // Gallery relationships (only gallery-specific data)
  patronTo?: Array<{
    galleryId: string;
    galleryName: string;
    galleryEmail: string;
    joinedAt: Date;
    status: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null; // Add userData to context
  loading: boolean;
  login: (email: string, password: string, loginType: 'gallery' | 'artist') => Promise<{ userData: UserData; galleries: Gallery[]; requiresGallerySelection: boolean; requiresMFA?: boolean; mfaMethods?: ('email' | 'authenticator')[]; userId?: string }>;
  completeLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user data from Firestore including roles
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data() as UserData;
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, loginType: 'gallery' | 'artist') => {
    try {
      console.log('Auth: Starting login validation...', { email, loginType });
      
      // First, check if user exists in Firestore by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('You do not have access to use this system. Please contact your administrator.');
      }

      // Get the user document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as UserData;
      const userId = userDoc.id;
      console.log('Auth: User data found:', userData);


      // Check artist status if logging in as artist
      if (loginType === 'artist') {
        if (!isArtist(userData)) {
          throw new Error('Sorry, you are not an Artist. Please contact your administrator for access.');
        }

        
        // Artist login - authenticate immediately
        console.log('Auth: Artist login, authenticating immediately...');
        await signInWithEmailAndPassword(auth, email, password);
        return { userData, galleries: [], requiresGallerySelection: false };
      }

      // Gallery login - check gallery data
      let galleries: Gallery[] = [];
      if (userData.gallery) {
        galleries = Object.values(userData.gallery);
      }
      console.log('Auth: Gallery data:', { galleries, count: galleries.length });

      // If user has multiple galleries, require gallery selection
      if (loginType === 'gallery' && galleries.length > 0) {
        console.log('Auth: Gallery login with galleries, requiring selection...');
        return { userData, galleries, requiresGallerySelection: true, requiresMFA: false, mfaMethods: [], userId };
      }


      // If user has single gallery or no galleries, authenticate immediately
      console.log('Auth: Single gallery or no galleries, authenticating immediately...');
      await signInWithEmailAndPassword(auth, email, password);
      return { userData, galleries, requiresGallerySelection: false };
    } catch (error) {
      console.error('Auth: Error during login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, userType?: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // TODO: Store userType in Firestore if needed
      console.log('User registered with type:', userType);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const completeLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };



  const value = {
    user,
    userData,
    loading,
    login,
    completeLogin,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 