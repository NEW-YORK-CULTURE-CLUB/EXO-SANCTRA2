import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if user has admin privileges
export function hasAdminAccess(userRole?: string[]): boolean {
  if (!userRole || !Array.isArray(userRole)) return false;
  return userRole.some(role => 
    role === 'superadmin' || 
    role === 'admin' || 
    role === 'Admin'
  );
}

// User type utilities
export const USER_TYPES = {
  USER: 'user',
  ARTIST: 'artist',
  COLLECTOR: 'collector',
  PATRON: 'patron',
  GALLERY: 'gallery'
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

/**
 * Check if a user has a specific user type
 */
export function hasUserType(userData: any, userType: UserType): boolean {
  if (!userData || !userData.userType) return false;
  return Array.isArray(userData.userType) && userData.userType.includes(userType);
}

/**
 * Check if a user is an artist (for backward compatibility)
 */
export function isArtist(userData: any): boolean {
  return hasUserType(userData, USER_TYPES.ARTIST);
}

/**
 * Check if a user is a gallery
 */
export function isGallery(userData: any): boolean {
  return hasUserType(userData, USER_TYPES.GALLERY);
}

/**
 * Check if a user is a collector
 */
export function isCollector(userData: any): boolean {
  return hasUserType(userData, USER_TYPES.COLLECTOR);
}

/**
 * Check if a user is a patron
 */
export function isPatron(userData: any): boolean {
  return hasUserType(userData, USER_TYPES.PATRON);
}

/**
 * Get all user types for a user
 */
export function getUserTypes(userData: any): UserType[] {
  if (!userData || !userData.userType) return [USER_TYPES.USER];
  return Array.isArray(userData.userType) ? userData.userType : [USER_TYPES.USER];
}

/**
 * Add a user type to a user's userType array
 */
export function addUserType(userData: any, userType: UserType): string[] {
  const currentTypes = getUserTypes(userData);
  if (!currentTypes.includes(userType)) {
    return [...currentTypes, userType];
  }
  return currentTypes;
}

/**
 * Remove a user type from a user's userType array
 */
export function removeUserType(userData: any, userType: UserType): string[] {
  const currentTypes = getUserTypes(userData);
  return currentTypes.filter(type => type !== userType);
}
