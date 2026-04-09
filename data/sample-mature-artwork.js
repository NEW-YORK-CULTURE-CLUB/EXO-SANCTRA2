// Sample artwork data with mature content for testing
export const sampleMatureArtwork = {
  id: 'sample-mature-1',
  title: 'Sample Mature Artwork',
  artist: 'Test Artist',
  year: 2024,
  medium: 'Oil on Canvas',
  itemType: 'Artwork',
  nativeType: 'Painting',
  size: '24" x 36"',
  price: 5000,
  priceType: 'Fixed',
  condition: 'Excellent',
  framed: 'Framed',
  location: 'New York, NY',
  digitalFloor: 'Active',
  status: 'active',
  description: 'This is a sample artwork with mature content for testing age verification functionality.',
  matureContent: 'Yes', // This triggers the age verification
  images: [
    'https://via.placeholder.com/400x400/ff0000/ffffff?text=Mature+Content+Image'
  ],
  certificates: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

export const sampleRegularArtwork = {
  id: 'sample-regular-1',
  title: 'Sample Regular Artwork',
  artist: 'Test Artist',
  year: 2024,
  medium: 'Watercolor',
  itemType: 'Artwork',
  nativeType: 'Painting',
  size: '18" x 24"',
  price: 2500,
  priceType: 'Fixed',
  condition: 'Good',
  framed: 'Unframed',
  location: 'Los Angeles, CA',
  digitalFloor: 'Active',
  status: 'active',
  description: 'This is a sample artwork without mature content.',
  matureContent: 'No', // This does not trigger age verification
  images: [
    'https://via.placeholder.com/400x400/00ff00/ffffff?text=Regular+Content+Image'
  ],
  certificates: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
