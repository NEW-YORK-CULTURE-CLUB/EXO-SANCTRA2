# User Type Migration Guide

## Overview

This document describes the migration from using a boolean `artist` field to a more flexible `userType` array system that allows users to have multiple roles.

## What Changed

### Before (Old Structure)
```javascript
{
  email: "artist@example.com",
  artist: true,  // boolean field
  gallery: { ... },
  // other fields...
}
```

### After (New Structure)
```javascript
{
  email: "artist@example.com",
  userType: ["user", "artist"],  // array of user types
  gallery: { ... },
  // other fields...
}
```

## User Types

The new system supports the following user types:

- `"user"` - Base type for all users
- `"artist"` - Artists who create artwork
- `"collector"` - Art collectors
- `"patron"` - Patrons/supporters
- `"gallery"` - Gallery owners/administrators

## Migration Process

### 1. Automatic Migration

The migration service will automatically:
- Convert users with `artist: true` to `userType: ["user", "artist"]`
- Add `userType: ["user"]` to users without any type
- Remove the old `artist` boolean field
- Preserve all other user data

### 2. Running the Migration

1. Navigate to `/admin/migration` in your application
2. Click "Check Status" to see current migration status
3. Click "Run Full Migration" to migrate all users
4. Monitor the results in the console and UI

### 3. Manual Migration (if needed)

```javascript
import { MigrationService } from '@/lib/migration-service';

// Check migration status
const status = await MigrationService.getMigrationStatus();
console.log(status);

// Run artist migration
const result = await MigrationService.migrateArtistBooleanToUserType();
console.log(result);

// Run full migration
const result = await MigrationService.migrateUsersWithoutUserType();
console.log(result);
```

## Code Changes

### Updated Files

1. **`contexts/auth-context.tsx`**
   - Updated `UserData` interface
   - Changed login logic to use `userType.includes('artist')`

2. **`lib/artist-service.ts`**
   - Updated queries to use `where('userType', 'array-contains', 'artist')`
   - Changed user creation to set `userType: ['user', 'artist']`

3. **`app/marketplace/artist/[id]/page.tsx`**
   - Updated artist check logic
   - Added proper TypeScript interfaces

4. **`app/auth/register/page.tsx`**
   - Updated to set `userType: ['user', selectedUserType]`

5. **`lib/utils.ts`**
   - Added utility functions for user type checking
   - Added constants for user types

### New Files

1. **`lib/migration-service.ts`**
   - Migration service for updating existing data

2. **`app/admin/migration/page.tsx`**
   - Admin interface for running migrations

## Utility Functions

New utility functions are available in `lib/utils.ts`:

```javascript
import { 
  hasUserType, 
  isArtist, 
  isGallery, 
  isCollector, 
  isPatron,
  getUserTypes,
  addUserType,
  removeUserType,
  USER_TYPES 
} from '@/lib/utils';

// Check if user is an artist
if (isArtist(userData)) {
  // User is an artist
}

// Check if user has specific type
if (hasUserType(userData, USER_TYPES.COLLECTOR)) {
  // User is a collector
}

// Get all user types
const types = getUserTypes(userData); // ['user', 'artist']

// Add a user type
const newTypes = addUserType(userData, USER_TYPES.PATRON);

// Remove a user type
const newTypes = removeUserType(userData, USER_TYPES.ARTIST);
```

## Query Changes

### Old Queries
```javascript
// Find all artists
const q = query(collection(db, 'users'), where('artist', '==', true));

// Check if user is artist
if (userData.artist === true) {
  // User is artist
}
```

### New Queries
```javascript
// Find all artists
const q = query(collection(db, 'users'), where('userType', 'array-contains', 'artist'));

// Check if user is artist
if (userData.userType && userData.userType.includes('artist')) {
  // User is artist
}

// Or use utility function
if (isArtist(userData)) {
  // User is artist
}
```

## Benefits

1. **Flexibility**: Users can have multiple roles (e.g., artist + collector)
2. **Scalability**: Easy to add new user types
3. **Consistency**: All users have a base "user" type
4. **Future-proof**: Supports complex role hierarchies

## Backward Compatibility

The migration maintains backward compatibility by:
- Preserving all existing user data
- Providing utility functions for easy checking
- Supporting both old and new query patterns during transition

## Testing

After migration, test the following:

1. **Artist login**: Artists should still be able to log in
2. **Artist queries**: Artist listings should work correctly
3. **User registration**: New users should get proper user types
4. **Role checking**: All role-based features should work

## Rollback Plan

If issues occur, you can rollback by:

1. Restoring the old `artist` boolean field
2. Reverting the code changes
3. Using the old query patterns

However, the migration is designed to be safe and non-destructive.

## Support

For issues or questions about the migration:

1. Check the migration status page (`/admin/migration`)
2. Review console logs for detailed error messages
3. Verify user data structure in Firestore
4. Test with utility functions to ensure proper functionality 