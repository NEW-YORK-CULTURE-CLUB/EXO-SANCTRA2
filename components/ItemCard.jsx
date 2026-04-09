import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Building2 } from 'lucide-react';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { SecureImage } from '@/components/secure-image';

const ItemCard = ({ 
  item, 
  index, 
  itemType, 
  handleArtworkClick, 
  resolvedTheme, 
  theme, 
  formatPrice 
}) => {
  const getItemIcon = () => {
    switch (itemType) {
      case 'artwork':
        return '🎨';
      case 'object':
        return '🪑';
      case 'collectible':
        return '🏆';
      default:
        return '📦';
    }
  };

  const getItemDetails = () => {
    switch (itemType) {
      case 'artwork':
        return {
          title: item.title || 'Untitled',
          subtitle: item.artist || 'Unknown Artist',
          year: item.year || 'Unknown Year',
          medium: item.medium || 'Unknown Medium',
          size: item.size || 'Size not specified',
          itemType: item.itemType || 'Artwork',
          nativeType: item.nativeType || 'Unknown Type'
        };
      case 'object':
        return {
          title: item.title || 'Untitled',
          subtitle: item.makerManufacturer || 'Unknown Maker',
          year: item.productionYearEra || 'Unknown Era',
          medium: item.materialsComposition || 'Unknown Materials',
          size: item.width && item.height ? `${item.width} × ${item.height}${item.depth ? ` × ${item.depth}` : ''}` : 'Size not specified',
          itemType: 'Object',
          nativeType: item.modelNameCode || 'Physical Object'
        };
      case 'collectible':
        return {
          title: item.title || 'Untitled',
          subtitle: item.manufacturerBrand || 'Unknown Brand',
          year: item.releaseYearEra || 'Unknown Era',
          medium: item.seriesSetName || 'Unknown Series',
          size: item.width && item.height ? `${item.width} × ${item.height}${item.depth ? ` × ${item.depth}` : ''}` : 'Size not specified',
          itemType: 'Collectible',
          nativeType: item.modelVersionSku || 'Collectible Item'
        };
      default:
        return {
          title: item.title || 'Untitled',
          subtitle: 'Unknown Creator',
          year: 'Unknown Year',
          medium: 'Unknown Medium',
          size: 'Size not specified',
          itemType: 'Unknown',
          nativeType: 'Unknown Type'
        };
    }
  };

  const details = getItemDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -5 }}
    >
      <Card 
        className="cursor-pointer shadow-lg shadow-primary/10 border-0 bg-background/50 backdrop-blur hover:bg-background/80"
        onClick={() => handleArtworkClick(item.id, item.title, item.matureContent)}
      >
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/20 to-muted/40">
          {item.images && item.images.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Check if images are in new secure format */}
              {typeof item.images[0] === 'object' && item.images[0].variants ? (
                <SecureImage
                  processedImage={item.images[0]}
                  alt={details.title || 'Item'}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    item.matureContent === 'Yes' ? 'filter blur-lg scale-110' : ''
                  }`}
                  preventSave={true}
                />
              ) : (
                <img 
                  src={item.images[0] || item.images[1]} 
                  alt={details.title || 'Item'} 
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    item.matureContent === 'Yes' ? 'filter blur-lg scale-110' : ''
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
              )}
              {item.matureContent === 'Yes' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white text-center p-4">
                  <div className="text-sm font-medium mb-1">Mature Content</div>
                  <div className="text-xs opacity-80">Age verification required</div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20">{getItemIcon()}</div>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80">
              {item.status === 'active' ? 'Available' : 'Sold'}
            </Badge>
          </div>
          
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-background/80">
              Digital Floor: {item.digitalFloor}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {details.title} {details.year && details.year !== 'Unknown Year' ? `• ${details.year}` : ''}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {itemType === 'artwork' ? 'Artist' : itemType === 'object' ? 'Maker' : 'Brand'}: {details.subtitle}
            </p>
            
            <p className="text-xs text-muted-foreground line-clamp-1">
              {details.medium && details.medium !== 'Unknown Medium' ? details.medium : ''} {details.medium && details.medium !== 'Unknown Medium' && details.size && details.size !== 'Size not specified' ? '•' : ''} {details.size && details.size !== 'Size not specified' ? details.size : ''}
            </p>
            
                            {itemType === 'artwork' && (
                  <p className="text-xs flex items-center text-muted-foreground line-clamp-1">
                    <span className="mr-1">Certificate Of Authenticity:</span> 
                    {item.certificates && item.certificates.some((cert) => cert.type === 'certificate_of_authenticity') ? (
                      <span className="inline-flex items-center">
                        <RiVerifiedBadgeFill className="w-4 h-4 text-blue-600 mr-1" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </p>
                )}
            
            <p className="text-xs text-muted-foreground line-clamp-1">
              {details.itemType && details.itemType !== 'Unknown' ? details.itemType : ''} {details.itemType && details.itemType !== 'Unknown' && details.nativeType && details.nativeType !== 'Unknown Type' ? '•' : ''} {details.nativeType && details.nativeType !== 'Unknown Type' ? details.nativeType : ''}
            </p>
            
            {/* Gallery Information */}
            {item.galleryData && Object.keys(item.galleryData).length > 0 && (
              <div className="flex items-center space-x-2 pt-1">
                <p className="text-xs text-muted-foreground">
                  Gallery:
                </p>
                {(() => {
                  const galleryInfo = Object.values(item.galleryData)[0];
                  const logoUrl = (resolvedTheme || theme) === "dark" ? (galleryInfo?.darkLogo || galleryInfo?.lightLogo) : (galleryInfo?.lightLogo || galleryInfo?.darkLogo);
                  
                  return logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${galleryInfo?.name || 'Gallery'} logo`}
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                  );
                })()}
                <p className="text-xs text-muted-foreground">
                  {Object.values(item.galleryData)[0]?.name || 'Gallery'}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-0">
                <span className="font-semibold text-green-600">
                  {formatPrice(item.price)}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
