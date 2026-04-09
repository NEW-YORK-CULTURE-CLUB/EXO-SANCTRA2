# Artist Register System

This document describes the new artist register system implemented in Exhibit-IQ.

## Overview

The artist register system allows artists to register themselves on the platform and provides gallery administrators with tools to create and manage artist profiles.

## Features

### 1. Artist Self-Registration
- **URL**: `/auth/artist-register`
- Artists can register themselves with a comprehensive form
- Creates Firebase Auth account and Firestore profile
- Sends email verification
- Sets `userType: ['user', 'artist']` in users collection

### 2. Admin Artist Profile Creation
- **URL**: `/artist-profiles/new`
- Gallery administrators can create artist profiles
- Option to enable portal access (creates Firebase Auth account)
- Upload artist photos and W-9 forms
- Comprehensive profile management

### 3. Artist Profile Management
- **URL**: `/artist-profiles`
- View all artist profiles from Firestore
- Search and filter functionality
- Real-time data loading

## Database Structure

### Users Collection
```javascript
{
  email: string,
  userType: string[], // Array of user types: ['user', 'artist', 'collector', 'patron', 'gallery']
  gallery: object,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Artist Profiles Collection
```javascript
{
  name: string,
  biography: string,
  specialty: string,
  nationality: string,
  birthYear: string,
  deathYear: string,
  photo: string, // URL to uploaded image
  email: string,
  phone: string,
  altContact: string,
  altEmail: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  postal: string,
  country: string,
  taxId: string,
  taxClassification: string,
  businessName: string,
  w9Url: string, // URL to uploaded W-9
  additionalFields: Array<{label: string, value: string}>,
  notes: string,
  portalAccess: boolean,
  status: 'pending' | 'active' | 'inactive',
  userId: string, // Firebase Auth UID (if portal access enabled)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## File Storage

### Artist Photos
- **Path**: `artist-photos/{timestamp}-{filename}`
- **Format**: Images (jpg, png, etc.)

### W-9 Forms
- **Path**: `w9-forms/{timestamp}-{filename}`
- **Format**: PDF files

## Service Functions

### ArtistService Class

#### `createArtistAccount(registerData)`
- Creates Firebase Auth account
- Updates user profile with name
- Sends email verification
- Creates user document in Firestore
- Creates artist profile document
- Returns `{ uid, profileId }`

#### `createArtistProfile(profileData)`
- Creates Firebase Auth account (if portal access enabled)
- Uploads photo and W-9 files
- Creates artist profile document
- Returns profile ID

#### `getAllArtistProfiles()`
- Retrieves all artist profiles from Firestore
- Returns array of artist profiles

#### `getArtistProfile(profileId)`
- Retrieves specific artist profile by ID
- Returns artist profile or null

#### `updateArtistProfile(profileId, updates)`
- Updates artist profile with new data
- Updates timestamp

#### `isEmailRegistered(email)`
- Checks if email exists in users collection
- Returns boolean

## Authentication Flow

### Artist Self-Registration
1. Artist fills out register form
2. System checks if email is already registered
3. Creates Firebase Auth account
4. Sends email verification
5. Creates user document with `userType: ['user', 'artist']`
6. Creates artist profile document
7. Redirects to login page

### Admin-Created Profile
1. Admin fills out artist profile form
2. If portal access enabled:
   - Creates Firebase Auth account with temporary password
   - Sends email verification
   - Creates user document with `userType: ['user', 'artist']`
3. Uploads files (photo, W-9)
4. Creates artist profile document
5. Shows success message

## Security Features

- Email verification required for all accounts
- Password validation (minimum 6 characters)
- File upload restrictions
- Secure file storage with unique names
- Email uniqueness validation

## Usage Examples

### Creating an Artist Profile (Admin)
```javascript
import { ArtistService } from '@/lib/artist-service';

const profileData = {
  name: "John Doe",
  email: "john@example.com",
  biography: "Contemporary artist...",
  specialty: "Oil Painting",
  portalAccess: true,
  // ... other fields
};

const profileId = await ArtistService.createArtistProfile(profileData);
```

### Artist Self-Registration
```javascript
const registerData = {
  email: "artist@example.com",
  password: "securepassword",
  name: "Jane Smith",
  biography: "Abstract painter...",
  // ... other fields
};

const { uid, profileId } = await ArtistService.createArtistAccount(registerData);
```

## Environment Variables

Make sure these Firebase environment variables are set:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Future Enhancements

- Artist dashboard for profile management
- Gallery invitation system
- Document expiration tracking
- Bulk artist import
- Artist portfolio uploads
- Exhibition history tracking 