# Watermark Download Feature for ExhibitIQ

This document explains the watermark download functionality that allows users to download artwork images with a protective watermark overlay.

## 🎯 Overview

The watermark download feature automatically adds a protective watermark (using `public/dark.png`) to all artwork images when users download them. This helps protect the intellectual property of artists and galleries while still allowing legitimate sharing and reference.

## 🏗️ Architecture

```
User Clicks Download → WatermarkService → Canvas Processing → Watermarked Image → Download
         ↓                    ↓                    ↓                    ↓              ↓
   Download Button    Image + Watermark    Overlay Creation    JPEG Export    File Download
```

## 📁 Components Created

### 1. `WatermarkService` (`lib/watermark-service.ts`)
Core service that handles:
- **Image Processing**: Loads images and applies watermarks
- **Canvas Operations**: Uses HTML5 Canvas for image manipulation
- **Watermark Overlay**: Positions and scales watermark image
- **File Export**: Converts processed images to downloadable blobs
- **Batch Processing**: Handles multiple images with zip creation

### 2. **Download Button Integration**
Added to the artwork detail page (`app/marketplace/[id]/page.tsx`):
- **Header Button**: Small download icon in the top navigation
- **Main Button**: Prominent download button overlaid on the artwork image
- **Loading States**: Shows processing status during download
- **User Feedback**: Toast notifications for success/error states

## 🚀 How It Works

### **Watermark Application Process**
1. **Image Loading**: Loads the original artwork image
2. **Canvas Creation**: Creates a canvas matching the image dimensions
3. **Base Image**: Draws the original artwork onto the canvas
4. **Watermark Overlay**: Loads and positions the watermark image
5. **Opacity Control**: Applies configurable transparency (default: 70%)
6. **Export**: Converts canvas to JPEG blob for download

### **Watermark Positioning**
- **Size**: 30% of the main image width (maintains aspect ratio)
- **Position**: Bottom-right corner with 20px padding
- **Opacity**: Configurable (default: 0.7 for 70% visibility)
- **Layering**: Watermark appears on top of the artwork

### **Download Options**
- **Single Image**: Direct download as JPEG
- **Multiple Images**: Automatic ZIP creation with sequential naming
- **Filename Generation**: Based on artwork title (sanitized)
- **Format**: High-quality JPEG (90% quality)

## 🔧 Configuration

### **Watermark Image**
- **Path**: `public/dark.png`
- **Format**: PNG with transparency support
- **Size**: Recommended 200x200px or larger
- **Design**: Dark/contrasting colors for visibility

### **Watermark Settings**
```typescript
// Default settings in WatermarkService
private static readonly WATERMARK_IMAGE_PATH = '/dark.png';
const watermarkOpacity = 0.7; // 70% opacity
const watermarkSize = 0.3; // 30% of image width
const padding = 20; // 20px from edges
```

### **Customization Options**
```typescript
// Custom watermark settings
await WatermarkService.downloadWatermarkedImages(
  images,
  'custom_filename',
  0.5, // 50% opacity
);
```

## 📱 User Experience

### **Download Button Locations**
1. **Header Navigation**: Small download icon next to favorite/share buttons
2. **Main Artwork**: Large download button overlaid on the artwork image
3. **Responsive Design**: Adapts to different screen sizes

### **User Feedback**
- **Processing State**: "Processing images with watermark..." message
- **Success Notification**: "Images downloaded successfully with watermark!"
- **Error Handling**: Clear error messages for failed downloads
- **Loading Indicators**: Disabled buttons during processing

### **Accessibility**
- **Tooltips**: Hover text explaining the feature
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Visual Feedback**: Clear loading and completion states

## 🛡️ Security Features

### **Image Protection**
- **Watermark Overlay**: Visible protection on all downloaded images
- **Quality Reduction**: JPEG compression reduces high-resolution copying
- **Metadata Stripping**: Removes EXIF/IPTC data during processing
- **Canvas Processing**: Prevents direct URL access to processed images

### **Download Limitations**
- **Watermark Required**: All downloads include watermark overlay
- **No Original Access**: Users cannot download unwatermarked versions
- **Processing Required**: Images must go through watermark service
- **Audit Trail**: Download events can be tracked for analytics

## 🔍 Technical Implementation

### **Canvas Processing**
```typescript
// Create canvas for image processing
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set dimensions and draw base image
canvas.width = mainImage.width;
canvas.height = mainImage.height;
ctx.drawImage(mainImage, 0, 0);

// Apply watermark overlay
ctx.globalAlpha = watermarkOpacity;
ctx.drawImage(watermarkImage, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
```

### **File Handling**
```typescript
// Convert canvas to blob
canvas.toBlob((blob) => {
  if (blob) {
    resolve(blob);
  }
}, 'image/jpeg', 0.9);

// Download blob as file
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = filename;
link.click();
URL.revokeObjectURL(url);
```

### **Batch Processing**
```typescript
// Handle multiple images
if (watermarkedImages.length === 1) {
  // Single image - download directly
  this.downloadBlob(watermarkedImages[0], `${baseFilename}.jpg`);
} else {
  // Multiple images - create zip file
  await this.downloadAsZip(watermarkedImages, baseFilename);
}
```

## 📊 Performance Considerations

### **Optimization Features**
- **Lazy Loading**: Watermark image loaded only when needed
- **Canvas Reuse**: Efficient memory management
- **Blob Cleanup**: Automatic URL cleanup after download
- **Error Handling**: Graceful fallbacks for failed operations

### **Memory Management**
- **Image Cleanup**: Automatic cleanup of loaded images
- **Canvas Disposal**: Proper disposal of canvas elements
- **Blob Management**: Efficient blob handling and cleanup
- **Garbage Collection**: Minimal memory footprint

## 🚨 Error Handling

### **Common Issues**
1. **Watermark Image Missing**: Clear error message and fallback
2. **Image Loading Failures**: Graceful handling of broken images
3. **Canvas Support**: Fallback for older browsers
4. **Download Failures**: User-friendly error messages

### **Fallback Behavior**
- **Individual Downloads**: If ZIP creation fails, download images individually
- **Error Recovery**: Continue processing other images if one fails
- **User Notification**: Clear feedback on what went wrong
- **Retry Options**: Allow users to attempt download again

## 🔄 Future Enhancements

### **Planned Features**
1. **Custom Watermarks**: User-defined watermark images
2. **Watermark Positioning**: Configurable placement options
3. **Multiple Watermarks**: Support for multiple overlay images
4. **Watermark Templates**: Pre-designed watermark styles

### **Integration Opportunities**
1. **Analytics Dashboard**: Track download patterns and usage
2. **Watermark Management**: Admin interface for watermark configuration
3. **Batch Operations**: Bulk watermark application for galleries
4. **API Endpoints**: External watermark service integration

## 📞 Support and Maintenance

### **Troubleshooting**
- **Check Watermark Image**: Verify `public/dark.png` exists
- **Browser Compatibility**: Test in different browsers
- **Image Formats**: Ensure artwork images are accessible
- **Console Errors**: Check browser console for detailed errors

### **Maintenance Tasks**
- **Watermark Updates**: Replace watermark image as needed
- **Performance Monitoring**: Track download processing times
- **User Feedback**: Collect and address user concerns
- **Security Audits**: Regular review of protection effectiveness

## 🎨 Customization Guide

### **Changing Watermark Image**
1. Replace `public/dark.png` with your new watermark
2. Ensure the new image has appropriate dimensions
3. Test the download functionality
4. Update any documentation references

### **Adjusting Watermark Settings**
```typescript
// Modify WatermarkService for custom settings
private static readonly WATERMARK_IMAGE_PATH = '/your-watermark.png';
const watermarkOpacity = 0.8; // 80% opacity
const watermarkSize = 0.25; // 25% of image width
const padding = 30; // 30px from edges
```

### **Adding Custom Watermark Logic**
```typescript
// Extend WatermarkService for custom behavior
static async addCustomWatermark(
  imageUrl: string,
  customSettings: CustomWatermarkSettings
): Promise<Blob> {
  // Implement custom watermark logic
}
```

This watermark download feature provides robust protection for artwork images while maintaining excellent user experience and performance. The system is designed to be maintainable, customizable, and secure for protecting artists' intellectual property.
