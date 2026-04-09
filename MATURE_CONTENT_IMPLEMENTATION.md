# Mature Content Implementation

This document describes the implementation of mature content handling in the ExhibitIQ marketplace application.

## Overview

The application now includes age verification for artworks marked with mature content. Users must confirm they are 18+ before viewing such content.

## Features

### 1. Mature Content Flag
- Artworks can be marked with `matureContent: 'Yes'` or `matureContent: 'No'`
- This field is added to the `Artwork` interface in `lib/artwork-service.ts`

### 2. Image Blurring
- Mature content images are automatically blurred in the marketplace listing
- A warning overlay is displayed indicating age verification is required
- Images remain blurred until age verification is completed

### 3. Age Verification Modal
- Users must click "I am 18 or older" to proceed
- Verification is stored in localStorage for 24 hours
- Modal includes legal disclaimers and content warnings

### 4. Access Control
- Direct access to mature content URLs requires age verification
- Users without verification are redirected to the age verification modal
- Verification status is checked on each page load

## Implementation Details

### Components

#### AgeVerificationModal (`components/age-verification-modal.tsx`)
- Displays age verification prompt
- Handles user confirmation
- Stores verification status in localStorage

### Updated Files

#### Marketplace Page (`app/marketplace/page.tsx`)
- Added mature content detection
- Implements image blurring for mature content
- Shows age verification modal when needed
- Prevents navigation to mature content without verification

#### Artwork Detail Page (`app/marketplace/[id]/page.tsx`)
- Checks age verification on page load
- Blurs images until verification is complete
- Redirects unverified users back to marketplace

#### Artwork Service (`lib/artwork-service.ts`)
- Updated `Artwork` interface to include `matureContent` field
- Updated `ArtworkFormData` interface for form handling

## Usage

### Setting Mature Content Flag

When creating or updating artwork, set the `matureContent` field:

```typescript
const artwork = {
  // ... other fields
  matureContent: 'Yes', // or 'No'
  // ... other fields
};
```

### Testing

Use the sample data in `data/sample-mature-artwork.js` to test the functionality:

```javascript
import { sampleMatureArtwork, sampleRegularArtwork } from '@/data/sample-mature-artwork';
```

## User Experience Flow

1. **Marketplace Listing**: Mature content images appear blurred with warning overlay
2. **Click on Mature Artwork**: Age verification modal appears
3. **Age Confirmation**: User confirms they are 18+
4. **Access Granted**: User can view artwork normally
5. **24-Hour Validity**: Verification remains valid for 24 hours
6. **Re-verification**: After 24 hours, users must verify again

## Security Considerations

- Age verification is client-side only (localStorage)
- No server-side validation of actual age
- Users can bypass by clearing localStorage
- Intended for content warning purposes, not legal compliance

## Future Enhancements

- Server-side age verification
- Integration with user accounts
- Parental consent mechanisms
- Content rating system (G, PG, R, etc.)
- Geographic content restrictions

## Browser Compatibility

- Requires localStorage support
- Works with all modern browsers
- Graceful degradation for older browsers

## Local Development

To test the mature content functionality:

1. Add `matureContent: 'Yes'` to artwork data
2. Clear localStorage to simulate first-time user
3. Navigate to marketplace and click on mature artwork
4. Verify age verification modal appears
5. Confirm age and verify access is granted
6. Check that images are no longer blurred
