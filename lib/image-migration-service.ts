import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { SecureImageService, ProcessedImage } from './secure-image-service';
import { ArtworkService, Artwork } from './artwork-service';

export interface MigrationProgress {
  total: number;
  processed: number;
  failed: number;
  current: string;
  status: 'idle' | 'running' | 'completed' | 'error';
}

export class ImageMigrationService {
  private static readonly COLLECTION_NAME = 'Artwork';
  private static readonly BATCH_SIZE = 5; // Process images in small batches to avoid timeouts

  /**
   * Migrate all existing artwork images to secure format
   */
  static async migrateAllArtworkImages(
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<void> {
    try {
      // Get all artwork documents
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const artworks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];

      const total = artworks.length;
      let processed = 0;
      let failed = 0;

      onProgress?.({
        total,
        processed: 0,
        failed: 0,
        current: 'Starting migration...',
        status: 'running'
      });

      // Process artworks in batches
      for (let i = 0; i < artworks.length; i += this.BATCH_SIZE) {
        const batch = artworks.slice(i, i + this.BATCH_SIZE);
        
        await Promise.all(
          batch.map(async (artwork) => {
            try {
              // Skip artworks without an ID
              if (!artwork.id) {
                console.warn('Skipping artwork without ID');
                return;
              }

              onProgress?.({
                total,
                processed,
                failed,
                current: `Processing ${artwork.title || artwork.id}...`,
                status: 'running'
              });

              await this.migrateArtworkImages(artwork.id, artwork);
              processed++;

              onProgress?.({
                total,
                processed,
                failed,
                current: `Completed ${artwork.title || artwork.id}`,
                status: 'running'
              });
            } catch (error) {
              console.error(`Failed to migrate artwork ${artwork.id}:`, error);
              failed++;

              onProgress?.({
                total,
                processed,
                failed,
                current: `Failed ${artwork.title || artwork.id}`,
                status: 'running'
              });
            }
          })
        );

        // Small delay between batches to avoid overwhelming the system
        if (i + this.BATCH_SIZE < artworks.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      onProgress?.({
        total,
        processed,
        failed,
        current: 'Migration completed',
        status: 'completed'
      });

    } catch (error) {
      console.error('Migration failed:', error);
      onProgress?.({
        total: 0,
        processed: 0,
        failed: 0,
        current: 'Migration failed',
        status: 'error'
      });
      throw error;
    }
  }

  /**
   * Migrate images for a specific artwork
   */
  static async migrateArtworkImages(artworkId: string, artwork: Artwork): Promise<void> {
    try {
      // Check if artwork already has processed images
      if (artwork.images && artwork.images.length > 0) {
        // Check if images are already in new format
        if (typeof artwork.images[0] === 'object' && artwork.images[0].variants) {
          console.log(`Artwork ${artworkId} already has processed images, skipping...`);
          return;
        }
      }

      // If no images, skip
      if (!artwork.images || artwork.images.length === 0) {
        console.log(`Artwork ${artworkId} has no images, skipping...`);
        return;
      }

      // Download and process each image
      const processedImages: ProcessedImage[] = [];
      
      // For migration, we expect the old format to be string[] (URLs)
      const oldImageUrls = artwork.images as unknown as string[];
      
      for (const imageUrl of oldImageUrls) {
        try {
          // Download the image from the old URL
          const response = await fetch(imageUrl);
          if (!response.ok) {
            console.warn(`Failed to download image from ${imageUrl}`);
            continue;
          }

          const blob = await response.blob();
          const file = new File([blob], `migrated-${Date.now()}.jpg`, { type: blob.type });

          // Process the image securely
          const processedImage = await SecureImageService.processArtworkImage(file, artworkId);
          processedImages.push(processedImage);

          console.log(`Successfully processed image for artwork ${artworkId}`);
        } catch (error) {
          console.error(`Failed to process image ${imageUrl} for artwork ${artworkId}:`, error);
          // Continue with other images
        }
      }

      // Update the artwork document with processed images
      if (processedImages.length > 0) {
        await updateDoc(doc(db, this.COLLECTION_NAME, artworkId), {
          images: processedImages,
          updatedAt: new Date()
        });

        console.log(`Updated artwork ${artworkId} with ${processedImages.length} processed images`);
      }

    } catch (error) {
      console.error(`Failed to migrate artwork ${artworkId}:`, error);
      throw error;
    }
  }

  /**
   * Rollback migration for a specific artwork (restore original URLs)
   */
  static async rollbackArtworkImages(artworkId: string, originalUrls: string[]): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, artworkId), {
        images: originalUrls,
        updatedAt: new Date()
      });

      console.log(`Rolled back artwork ${artworkId} to original image URLs`);
    } catch (error) {
      console.error(`Failed to rollback artwork ${artworkId}:`, error);
      throw error;
    }
  }

  /**
   * Get migration statistics
   */
  static async getMigrationStats(): Promise<{
    total: number;
    migrated: number;
    pending: number;
    failed: number;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const artworks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];

      let migrated = 0;
      let pending = 0;
      let failed = 0;

      for (const artwork of artworks) {
        if (artwork.images && artwork.images.length > 0) {
          if (typeof artwork.images[0] === 'object' && artwork.images[0].variants) {
            migrated++;
          } else {
            pending++;
          }
        }
      }

      return {
        total: artworks.length,
        migrated,
        pending,
        failed
      };
    } catch (error) {
      console.error('Failed to get migration stats:', error);
      throw error;
    }
  }

  /**
   * Clean up old image URLs after successful migration
   */
  static async cleanupOldImageUrls(artworkId: string): Promise<void> {
    try {
      // This would delete the old images from Firebase Storage
      // For now, we'll just log the action
      console.log(`Would clean up old image URLs for artwork ${artworkId}`);
      
      // In production, you might want to:
      // 1. Delete old images from storage
      // 2. Update any references to old URLs
      // 3. Log the cleanup action
    } catch (error) {
      console.error(`Failed to cleanup old image URLs for artwork ${artworkId}:`, error);
      throw error;
    }
  }

  /**
   * Validate migrated images
   */
  static async validateMigratedImages(artworkId: string): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    try {
      const artwork = await ArtworkService.getArtwork(artworkId);
      if (!artwork) {
        return { valid: false, issues: ['Artwork not found'] };
      }

      const issues: string[] = [];

      if (!artwork.images || artwork.images.length === 0) {
        issues.push('No images found');
        return { valid: false, issues };
      }

      // Check if images are in new format
      if (typeof artwork.images[0] === 'string') {
        issues.push('Images still in old format');
        return { valid: false, issues };
      }

      // Validate each processed image
      const processedImages = artwork.images as unknown as ProcessedImage[];
      for (const processedImage of processedImages) {
        if (!processedImage.variants || processedImage.variants.length === 0) {
          issues.push(`Processed image ${processedImage.id} has no variants`);
          continue;
        }

        // Check if variants are accessible
        for (const variant of processedImage.variants) {
          try {
            const response = await fetch(variant.url, { method: 'HEAD' });
            if (!response.ok) {
              issues.push(`Variant ${variant.url} is not accessible`);
            }
          } catch (error) {
            issues.push(`Failed to access variant ${variant.url}`);
          }
        }
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error(`Failed to validate migrated images for artwork ${artworkId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { valid: false, issues: [errorMessage] };
    }
  }
}
