import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface ImageVariant {
  width: number;
  height: number;
  quality: number;
  format: 'webp' | 'avif' | 'jpeg';
  url: string;
  path: string;
}

export interface ProcessedImage {
  id: string;
  originalPath: string;
  variants: ImageVariant[];
  metadata: {
    originalSize: number;
    originalDimensions: { width: number; height: number };
    processedAt: string;
    hash: string;
  };
}

export class SecureImageService {
  private static readonly PRIVATE_BUCKET = 'private-artwork-images';
  private static readonly PUBLIC_BUCKET = 'public-artwork-derivatives';
  
  // Maximum dimensions for public derivatives
  private static readonly MAX_PUBLIC_WIDTH = 1600;
  private static readonly MAX_PUBLIC_HEIGHT = 1600;
  private static readonly PUBLIC_QUALITY = 80;
  
  // Watermark settings
  private static readonly WATERMARK_TEXT = 'ExhibitIQ';
  private static readonly WATERMARK_OPACITY = 0.3;

  /**
   * Upload and process artwork image securely
   * @param file - Original image file
   * @param artworkId - Unique identifier for the artwork
   * @returns Processed image data with secure URLs
   */
  static async processArtworkImage(file: File, artworkId: string): Promise<ProcessedImage> {
    try {
      // 1. Upload original to private bucket
      const originalPath = `${this.PRIVATE_BUCKET}/${artworkId}/${Date.now()}-${file.name}`;
      const originalRef = ref(storage, originalPath);
      await uploadBytes(originalRef, file);
      
      // 2. Generate image hash for cache busting
      const hash = await this.generateImageHash(file);
      
      // 3. Create derivatives with different sizes and formats
      const variants = await this.createImageDerivatives(file, artworkId, hash);
      
      // 4. Store processed image metadata
      const processedImage: ProcessedImage = {
        id: `${artworkId}-${Date.now()}`,
        originalPath,
        variants,
        metadata: {
          originalSize: file.size,
          originalDimensions: await this.getImageDimensions(file),
          processedAt: new Date().toISOString(),
          hash
        }
      };

      return processedImage;
    } catch (error) {
      console.error('Error processing artwork image:', error);
      throw new Error('Failed to process artwork image securely');
    }
  }

  /**
   * Create multiple image derivatives for different use cases
   */
  private static async createImageDerivatives(
    file: File, 
    artworkId: string, 
    hash: string
  ): Promise<ImageVariant[]> {
    const variants: ImageVariant[] = [];
    
    // Define standard sizes for responsive design
    const sizes = [
      { width: 640, height: 640, quality: 85 },
      { width: 1280, height: 1280, quality: 80 },
      { width: 1600, height: 1600, quality: 75 }
    ];

    // Create variants for each size and format
    for (const size of sizes) {
      // WebP variant (modern browsers)
      const webpVariant = await this.createVariant(
        file, 
        artworkId, 
        hash, 
        size.width, 
        size.height, 
        size.quality, 
        'webp'
      );
      variants.push(webpVariant);

      // JPEG fallback (universal support)
      const jpegVariant = await this.createVariant(
        file, 
        artworkId, 
        hash, 
        size.width, 
        size.height, 
        size.quality, 
        'jpeg'
      );
      variants.push(jpegVariant);
    }

    return variants;
  }

  /**
   * Create a single image variant with specified parameters
   */
  private static async createVariant(
    file: File,
    artworkId: string,
    hash: string,
    width: number,
    height: number,
    quality: number,
    format: 'webp' | 'jpeg'
  ): Promise<ImageVariant> {
    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Load image and resize
    const img = await this.loadImage(file);
    const { scaledWidth, scaledHeight } = this.calculateScaledDimensions(
      img.width, 
      img.height, 
      width, 
      height
    );

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw resized image
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // Add watermark for larger sizes
    if (scaledWidth >= 1280) {
      this.addWatermark(ctx, scaledWidth, scaledHeight);
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, `image/${format}`, quality / 100);
    });

    // Upload derivative to public bucket
    const variantPath = `${this.PUBLIC_BUCKET}/${artworkId}/${width}x${height}_q${quality}_${hash}.${format}`;
    const variantRef = ref(storage, variantPath);
    await uploadBytes(variantRef, blob);

    // Get public URL
    const url = await getDownloadURL(variantRef);

    return {
      width: scaledWidth,
      height: scaledHeight,
      quality,
      format,
      url,
      path: variantPath
    };
  }

  /**
   * Add watermark to processed images
   */
  private static addWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    
    // Set watermark properties
    ctx.font = `${Math.max(width * 0.03, 16)}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.WATERMARK_OPACITY})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Position watermark in bottom-right corner
    const x = width * 0.85;
    const y = height * 0.95;
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(this.WATERMARK_TEXT, x, y);
    ctx.restore();
  }

  /**
   * Calculate scaled dimensions maintaining aspect ratio
   */
  private static calculateScaledDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { scaledWidth: number; scaledHeight: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    let scaledWidth = maxWidth;
    let scaledHeight = maxHeight;

    if (aspectRatio > 1) {
      // Landscape image
      scaledHeight = maxWidth / aspectRatio;
    } else {
      // Portrait image
      scaledWidth = maxHeight * aspectRatio;
    }

    return { scaledWidth, scaledHeight };
  }

  /**
   * Load image file into HTMLImageElement
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    const img = await this.loadImage(file);
    return { width: img.width, height: img.height };
  }

  /**
   * Generate simple hash for cache busting
   */
  private static async generateImageHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
  }

  /**
   * Get secure image URL for display
   * @param processedImage - Processed image data
   * @param preferredWidth - Preferred width for the image
   * @param preferredFormat - Preferred format (webp, avif, jpeg)
   * @returns Secure URL for the image
   */
  static getSecureImageUrl(
    processedImage: ProcessedImage,
    preferredWidth: number = 1280,
    preferredFormat: 'webp' | 'avif' | 'jpeg' = 'webp'
  ): string {
    // Find the best variant for the requested size and format
    const variant = processedImage.variants.find(v => 
      v.format === preferredFormat && v.width >= preferredWidth
    ) || processedImage.variants.find(v => v.format === preferredFormat) || processedImage.variants[0];

    if (!variant) {
      throw new Error('No suitable image variant found');
    }

    return variant.url;
  }

  /**
   * Generate responsive image srcset for optimal delivery
   */
  static generateResponsiveSrcset(processedImage: ProcessedImage): string {
    const webpVariants = processedImage.variants.filter(v => v.format === 'webp');
    const jpegVariants = processedImage.variants.filter(v => v.format === 'jpeg');

    let srcset = '';

    // WebP variants
    if (webpVariants.length > 0) {
      srcset += webpVariants
        .map(v => `${v.url} ${v.width}w`)
        .join(', ');
    }

    // JPEG fallback
    if (jpegVariants.length > 0) {
      if (srcset) srcset += ', ';
      srcset += jpegVariants
        .map(v => `${v.url} ${v.width}w`)
        .join(', ');
    }

    return srcset;
  }

  /**
   * Clean up processed images when artwork is deleted
   */
  static async cleanupArtworkImages(artworkId: string, processedImage: ProcessedImage): Promise<void> {
    try {
      // Delete original from private bucket
      const originalRef = ref(storage, processedImage.originalPath);
      await deleteObject(originalRef);

      // Delete all derivatives from public bucket
      for (const variant of processedImage.variants) {
        const variantRef = ref(storage, variant.path);
        await deleteObject(variantRef);
      }
    } catch (error) {
      console.error('Error cleaning up artwork images:', error);
    }
  }

  /**
   * Generate signed URL for high-resolution access (members only)
   * @param processedImage - Processed image data
   * @param expiresIn - Expiration time in seconds (default: 15 minutes)
   * @returns Signed URL with short expiration
   */
  static async generateSignedUrl(
    processedImage: ProcessedImage,
    expiresIn: number = 900
  ): Promise<string> {
    // This would integrate with Firebase Auth or your CDN for signed URLs
    // For now, we'll return the highest quality variant
    const highestQualityVariant = processedImage.variants.reduce((prev, current) => 
      (current.width > prev.width) ? current : prev
    );

    // In production, you'd generate a signed URL here
    // For Firebase, you might use custom claims and security rules
    return highestQualityVariant.url;
  }
}
