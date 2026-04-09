import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

export class MigrationService {
  /**
   * Migrate existing users from artist boolean to userType array
   * This should be run once to update existing data
   */
  static async migrateArtistBooleanToUserType(): Promise<{ success: number; errors: number }> {
    try {
      console.log('Starting migration from artist boolean to userType array...');
      
      let successCount = 0;
      let errorCount = 0;
      
      // Get all users that have the old artist boolean field
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('artist', '==', true));
      const querySnapshot = await getDocs(q);
      
      console.log(`Found ${querySnapshot.size} users with artist: true`);
      
      for (const userDoc of querySnapshot.docs) {
        try {
          const userData = userDoc.data();
          
          // Skip if user already has userType array
          if (userData.userType && Array.isArray(userData.userType)) {
            console.log(`User ${userDoc.id} already has userType array, skipping...`);
            continue;
          }
          
          // Update user document
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, {
            userType: ['user', 'artist'],
            // Remove the old artist boolean field
            artist: null
          });
          
          console.log(`Successfully migrated user ${userDoc.id}`);
          successCount++;
        } catch (error) {
          console.error(`Error migrating user ${userDoc.id}:`, error);
          errorCount++;
        }
      }
      
      console.log(`Migration completed. Success: ${successCount}, Errors: ${errorCount}`);
      return { success: successCount, errors: errorCount };
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
  
  /**
   * Migrate users that don't have userType array to have at least 'user' type
   */
  static async migrateUsersWithoutUserType(): Promise<{ success: number; errors: number }> {
    try {
      console.log('Starting migration for users without userType array...');
      
      let successCount = 0;
      let errorCount = 0;
      
      // Get all users that don't have userType field
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      console.log(`Found ${querySnapshot.size} total users`);
      
      for (const userDoc of querySnapshot.docs) {
        try {
          const userData = userDoc.data();
          
          // Skip if user already has userType array
          if (userData.userType && Array.isArray(userData.userType)) {
            continue;
          }
          
          // Determine user type based on existing data
          let userTypes = ['user'];
          
          // Check for artist boolean (old format)
          if (userData.artist === true) {
            userTypes.push('artist');
          }
          
          // Check for gallery data
          if (userData.gallery && Object.keys(userData.gallery).length > 0) {
            userTypes.push('gallery');
          }
          
          // Check for role array (if exists)
          if (userData.role && Array.isArray(userData.role)) {
            userTypes = [...new Set([...userTypes, ...userData.role])];
          }
          
          // Update user document
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, {
            userType: userTypes,
            // Remove old fields
            artist: null
          });
          
          console.log(`Successfully migrated user ${userDoc.id} with types: ${userTypes.join(', ')}`);
          successCount++;
        } catch (error) {
          console.error(`Error migrating user ${userDoc.id}:`, error);
          errorCount++;
        }
      }
      
      console.log(`Migration completed. Success: ${successCount}, Errors: ${errorCount}`);
      return { success: successCount, errors: errorCount };
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
  
  /**
   * Get migration status - count of users with old vs new format
   */
  static async getMigrationStatus(): Promise<{
    totalUsers: number;
    usersWithUserType: number;
    usersWithArtistBoolean: number;
    usersNeedingMigration: number;
  }> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      let usersWithUserType = 0;
      let usersWithArtistBoolean = 0;
      
      querySnapshot.docs.forEach(doc => {
        const userData = doc.data();
        
        if (userData.userType && Array.isArray(userData.userType)) {
          usersWithUserType++;
        }
        
        if (userData.artist === true) {
          usersWithArtistBoolean++;
        }
      });
      
      const totalUsers = querySnapshot.size;
      const usersNeedingMigration = totalUsers - usersWithUserType;
      
      return {
        totalUsers,
        usersWithUserType,
        usersWithArtistBoolean,
        usersNeedingMigration
      };
    } catch (error) {
      console.error('Error getting migration status:', error);
      throw error;
    }
  }
} 