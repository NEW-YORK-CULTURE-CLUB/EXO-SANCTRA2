export class WatermarkService {
  
  /**
   * Ultra-simple method to download an image with image watermark
   */
  static async downloadImageWithWatermark(
    imageUrl: string,
    filename: string = 'artwork.jpg'
  ): Promise<void> {
    try {
      console.log('Starting watermark process for:', imageUrl);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Load image with comprehensive fallbacks
      const img = await this.loadImageSimple(imageUrl);
      
      console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
      
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Load and apply watermark image
      try {
        const watermark = await this.loadWatermarkImage();
        const watermarkSize = Math.min(img.width * 0.3, img.height * 0.3); // 30% of image size, but not larger than either dimension
        
        // Position watermark in center of image
        const watermarkX = (img.width - watermarkSize) / 2;
        const watermarkY = (img.height - watermarkSize) / 2;
        
        // Draw watermark with some transparency
        ctx.globalAlpha = 0.8;
        ctx.drawImage(watermark, watermarkX, watermarkY, watermarkSize, watermarkSize);
        ctx.globalAlpha = 1.0;
        
        console.log('Watermark applied successfully');
      } catch (watermarkError) {
        console.warn('Failed to load watermark image, falling back to text:', watermarkError);
        // Fallback to text watermark
        this.addTextWatermark(ctx, img.width, img.height);
      }
      
      // Download
      await this.downloadCanvas(canvas, filename);
      
    } catch (error) {
      console.error('Watermark process failed:', error);
      throw error;
    }
  }

  /**
   * Comprehensive image loading with multiple fallback methods
   */
  private static async loadImageSimple(src: string): Promise<HTMLImageElement> {
    console.log('Attempting to load image:', src);
    
    // Method 1: Try CORS
    try {
      console.log('Trying CORS method...');
      const img = await this.loadImageWithCORS(src);
      console.log('CORS method succeeded');
      return img;
    } catch (corsError) {
      console.warn('CORS method failed, trying no-CORS:', corsError);
    }
    
    // Method 2: Try without CORS
    try {
      console.log('Trying no-CORS method...');
      const img = await this.loadImageWithoutCORS(src);
      console.log('No-CORS method succeeded');
      return img;
    } catch (noCorsError) {
      console.warn('No-CORS method failed, trying fetch:', noCorsError);
    }
    
    // Method 3: Try fetch method
    try {
      console.log('Trying fetch method...');
      const img = await this.loadImageViaFetch(src);
      console.log('Fetch method succeeded');
      return img;
    } catch (fetchError) {
      console.warn('Fetch method failed, trying proxy:', fetchError);
    }
    
    // Method 4: Try proxy method
    try {
      console.log('Trying proxy method...');
      const img = await this.loadImageViaProxy(src);
      console.log('Proxy method succeeded');
      return img;
    } catch (proxyError) {
      console.warn('Proxy method failed, creating placeholder:', proxyError);
    }
    
    // Method 5: Final fallback - placeholder
    console.log('All methods failed, creating placeholder image');
    return this.createPlaceholderImage();
  }

  /**
   * Load image with CORS
   */
  private static loadImageWithCORS(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('CORS loading failed'));
      
      img.src = src;
    });
  }

  /**
   * Load image without CORS
   */
  private static loadImageWithoutCORS(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'none';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No-CORS loading failed'));
      
      img.src = src;
    });
  }

  /**
   * Load image via fetch (bypasses some CORS issues)
   */
  private static async loadImageViaFetch(src: string): Promise<HTMLImageElement> {
    try {
      const response = await fetch(src, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image from blob'));
        };
        img.src = objectUrl;
      });
    } catch (error) {
      throw new Error(`Fetch method failed: ${error}`);
    }
  }

  /**
   * Load image via Next.js proxy API
   */
  private static async loadImageViaProxy(src: string): Promise<HTMLImageElement> {
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
      console.log('Attempting to load via proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Proxy failed with status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image from proxy blob'));
        };
        img.src = objectUrl;
      });
    } catch (error) {
      throw new Error(`Proxy method failed: ${error}`);
    }
  }

  /**
   * Load the watermark image (dark.png)
   */
  private static async loadWatermarkImage(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const watermark = new Image();
      watermark.crossOrigin = 'anonymous';
      
      watermark.onload = () => {
        console.log('Watermark image loaded successfully');
        resolve(watermark);
      };
      
      watermark.onerror = () => {
        reject(new Error('Failed to load watermark image'));
      };
      
      // Use the dark.png from public folder
      watermark.src = '/dark.png';
    });
  }

  /**
   * Fallback text watermark
   */
  private static addTextWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.font = `${Math.max(width * 0.05, 24)}px Arial, sans-serif`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const text = 'ExhibitIQ';
    const x = width / 2;
    const y = height / 2;
    
    // Draw text with stroke for visibility
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  /**
   * Create a simple placeholder image
   */
  private static createPlaceholderImage(): HTMLImageElement {
    console.log('Creating placeholder image');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Text
    ctx.fillStyle = '#666';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('Image Unavailable', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '20px Arial';
    ctx.fillText('Original image could not be loaded', canvas.width / 2, canvas.height / 2);
    ctx.fillText('due to security restrictions', canvas.width / 2, canvas.height / 2 + 30);
    
    // Convert to image
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  /**
   * Download canvas as file
   */
  private static downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Converting canvas to blob for download');
      
      canvas.toBlob((blob) => {
        if (blob) {
          try {
            console.log('Blob created, downloading file:', filename);
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            console.log('Download completed successfully');
            resolve();
            
          } catch (error) {
            console.error('Download failed:', error);
            reject(new Error(`Download failed: ${error}`));
          }
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.9);
    });
  }

  /**
   * Check if URL is a video file
   */
  private static isVideoUrl(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('youtube.com') || 
           lowerUrl.includes('youtu.be') || 
           lowerUrl.includes('vimeo.com');
  }

  /**
   * Download image or video with appropriate handling
   */
  static async downloadWithWatermark(
    url: string,
    filename: string = 'artwork'
  ): Promise<void> {
    if (this.isVideoUrl(url)) {
      // For videos, create a simple download link
      // Note: Video watermarking would require server-side processing
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Video download initiated');
    } else {
      // For images, apply watermark
      await this.downloadImageWithWatermark(url, filename);
    }
  }

  /**
   * Download multiple images one by one
   */
  static async downloadImagesOneByOne(
    imageUrls: string[],
    baseFilename: string = 'artwork'
  ): Promise<void> {
    if (imageUrls.length === 0) {
      throw new Error('No images to download');
    }

    console.log(`Starting download of ${imageUrls.length} images`);

    for (let i = 0; i < imageUrls.length; i++) {
      try {
        console.log(`Processing image ${i + 1} of ${imageUrls.length}`);
        
        const filename = imageUrls.length === 1 
          ? `${baseFilename}.jpg`
          : `${baseFilename}_${i + 1}.jpg`;
        
        await this.downloadWithWatermark(imageUrls[i], filename);
        
        // Delay between downloads
        if (i < imageUrls.length - 1) {
          console.log('Waiting 500ms before next download...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`Failed to download image ${i + 1}:`, error);
        // Continue with next image
      }
    }
    
    console.log('All downloads completed');
  }

  /**
   * Main download method
   */
  static async downloadWatermarkedImages(
    imageUrls: string[],
    baseFilename: string = 'artwork'
  ): Promise<void> {
    await this.downloadImagesOneByOne(imageUrls, baseFilename);
  }

  /**
   * Check if watermark exists (always true for text watermark)
   */
  static async checkWatermarkExists(): Promise<boolean> {
    return true;
  }

  /**
   * Test watermark image accessibility
   */
  static async testWatermarkAccessibility(): Promise<{ accessible: boolean; error?: string }> {
    try {
      console.log('Testing watermark image accessibility...');
      await this.loadWatermarkImage();
      return { accessible: true };
    } catch (error) {
      console.log('Watermark image test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { accessible: false, error: errorMessage };
    }
  }

  /**
   * Test image accessibility with detailed logging
   */
  static async testImageAccessibility(imageUrl: string): Promise<{ accessible: boolean; method: string; error?: string }> {
    console.log('Testing image accessibility for:', imageUrl);
    
    // Test CORS method
    try {
      console.log('Testing CORS method...');
      await this.loadImageWithCORS(imageUrl);
      return { accessible: true, method: 'CORS' };
    } catch (error) {
      console.log('CORS method failed:', error);
    }
    
    // Test no-CORS method
    try {
      console.log('Testing no-CORS method...');
      await this.loadImageWithoutCORS(imageUrl);
      return { accessible: true, method: 'no-CORS' };
    } catch (error) {
      console.log('No-CORS method failed:', error);
    }
    
    // Test fetch method
    try {
      console.log('Testing fetch method...');
      await this.loadImageViaFetch(imageUrl);
      return { accessible: true, method: 'fetch' };
    } catch (error) {
      console.log('Fetch method failed:', error);
    }
    
    // Test proxy method
    try {
      console.log('Testing proxy method...');
      await this.loadImageViaProxy(imageUrl);
      return { accessible: true, method: 'proxy' };
    } catch (error) {
      console.log('Proxy method failed:', error);
    }
    
    return { accessible: false, method: 'none', error: 'Image cannot be loaded' };
  }

  /**
   * Test proxy API directly
   */
  static async testProxyAPI(imageUrl: string): Promise<{ success: boolean; status?: number; error?: string }> {
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      console.log('Testing proxy API with URL:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      console.log('Proxy response status:', response.status);
      console.log('Proxy response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('Proxy blob size:', blob.size, 'bytes');
        return { success: true, status: response.status };
      } else {
        const errorText = await response.text();
        console.log('Proxy error response:', errorText);
        return { success: false, status: response.status, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.log('Proxy test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  }
}
