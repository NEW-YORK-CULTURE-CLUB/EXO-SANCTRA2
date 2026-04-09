import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Init services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set auth persistence
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Google Sign-In
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  try {
    signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Error during Google Sign-In redirect:", error);
  }
};

// Handle redirect result (you can call this after component mounts)
const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error getting Google Sign-In redirect result:", error);
    return null;
  }
};

export { auth, db, storage, signInWithGoogle, handleGoogleRedirectResult };
