/** Top-level Firestore collections used by EXO SANCTRA */
export const EXO_SANCTRA_ROOT_COLLECTIONS = [
  'users',
  'orders',
  'soul_activation_orders',
  'ceremony_signups',
  'alien_gift_claims',
  'wallets',
  'Artwork',
  'Objects',
  'Collectibles',
  'Memorabilia',
  'Gallery',
  'Artists',
  'galleries',
  'analytics_events',
  'ReputationScores',
  'ReputationActions',
  'artist-approvals',
  'user-collections',
  'Documents',
  'ArtistProfiles',
] as const;

/** Subcollections under users/{userId}/… */
export const USER_SUBCOLLECTIONS = [
  'favorites',
  'wishlist',
  'shared',
  'assigned',
  'albums',
] as const;

export type ExportRow = Record<string, string>;
