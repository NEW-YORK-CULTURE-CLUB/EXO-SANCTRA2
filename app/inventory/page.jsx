// app/inventory/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  Copy,
  Eye,
  Edit,
  Trash,
  ArrowUpDown,
  Filter,
  Menu,
  Loader2
} from "lucide-react";
import { storageLocations, bulkOperations, columnOptions, collectibleColumnOptions, memorabiliaColumnOptions, objectColumnOptions, artworkInventoryData } from "@/data/artworkInventoryData";
import StorageLocationsTab from "@/components/StorageLocationsTab";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
// import { ArtworkService } from "@/lib/artwork-service";
// import { ObjectService } from "@/lib/object-service";
// import { CollectibleService } from "@/lib/collectible-service";
// import { MemorabiliaService } from "@/lib/memorabilia-service";
import { useToast } from "@/hooks/use-toast";
import { ArtworkInventoryPageSkeleton } from "@/components/artwork-inventory-skeleton";
// import { useAuth } from '@/contexts/auth-context'; // Disabled - using mock data
// import { useGallery } from '@/contexts/gallery-context'; // Disabled - using mock data
// import { collection, query, where, getDocs } from 'firebase/firestore'; // Disabled - using mock data
// import { db } from '@/lib/firebase'; // Disabled - using mock data
import InventoryTab from "@/components/InventoryTab";
import ArtworkTab from "@/components/ArtworkTab";
import CollectiblesTab from "@/components/CollectiblesTab";
import ObjectsTab from "@/components/ObjectsTab";
import MemorabiliaTab from "@/components/MemorabiliaTab";

export default function Inventory() {
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columnOptions);
  const [collectibleVisibleColumns, setCollectibleVisibleColumns] = useState(collectibleColumnOptions);
  const [memorabiliaVisibleColumns, setMemorabiliaVisibleColumns] = useState(memorabiliaColumnOptions);
  const [objectVisibleColumns, setObjectVisibleColumns] = useState(objectColumnOptions);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterCreator, setFilterCreator] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [artworkData, setArtworkData] = useState([]);
  const [objectData, setObjectData] = useState([]);
  const [collectibleData, setCollectibleData] = useState([]);
  const [memorabiliaData, setMemorabiliaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState('');
  const { toast } = useToast();
  const [isDemoGallery, setIsDemoGallery] = useState(true);

  // Handle copying SKU to clipboard
  const handleCopySKU = useCallback(async (sku) => {
    try {
      await navigator.clipboard.writeText(sku);
      toast({
        title: "SKU Copied",
        description: `SKU "${sku}" has been copied to clipboard.`,
      });
    } catch (error) {
      console.error('Error copying SKU:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy SKU to clipboard.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle toggling digital floor status
  const handleToggleDigitalFloor = useCallback(async (artwork) => {
    try {
      const newStatus = artwork.digitalFloor === "Active" ? "Inactive" : "Active";
      
      // Update local state only
      setArtworkData(prev => 
        prev.map(item => 
          item.id === artwork.id 
            ? { ...item, digitalFloor: newStatus }
            : item
        )
      );

      toast({
        title: "Digital Floor Updated",
        description: `"${artwork.title}" has been ${newStatus === "Active" ? "added to" : "removed from"} the digital floor.`,
      });
    } catch (error) {
      console.error('Error updating digital floor status:', error);
      toast({
        title: "Update Failed",
        description: `Failed to update digital floor status: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Helper function to determine item type
  const getItemType = (item) => {
    // Check for artwork-specific fields
    if (item.artist && item.medium && item.year) return 'artwork';
    
    // Check for object-specific fields
    if (item.makerManufacturer && item.materialsComposition && item.productionYearEra) return 'object';
    
    // Check for collectible-specific fields
    if (item.seriesSetName && item.manufacturerBrand && item.releaseYearEra) return 'collectible';
    
    // Check for memorabilia-specific fields
    if (item.associatedPersons && item.eventNameDate && item.eraPeriod) return 'memorabilia';
    
    // Fallback: check for any distinguishing fields
    if (item.artist) return 'artwork';
    if (item.makerManufacturer) return 'object';
    if (item.seriesSetName) return 'collectible';
    if (item.associatedPersons) return 'memorabilia';
    
    // Default fallback
    return 'artwork';
  };

  // Handle deleting items
  const handleDeleteItem = async (item, itemType) => {
    setItemToDelete(item);
    setDeleteItemType(itemType);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute single item deletion
  const confirmDeleteItem = async () => {
    if (!itemToDelete || !deleteItemType) return;

    try {
      let service;
      let dataSetter;
      let deleteMethod;
      
      console.log('confirmDeleteItem - Item:', itemToDelete);
      console.log('confirmDeleteItem - Item Type:', deleteItemType);
      
      switch (deleteItemType) {
        case 'artwork':
          service = ArtworkService;
          dataSetter = setArtworkData;
          deleteMethod = 'deleteArtwork';
          break;
        case 'object':
          service = ObjectService;
          dataSetter = setObjectData;
          deleteMethod = 'deleteObject';
          break;
        case 'collectible':
          service = CollectibleService;
          dataSetter = setCollectibleData;
          deleteMethod = 'deleteCollectible';
          break;
        case 'memorabilia':
          service = MemorabiliaService;
          dataSetter = setMemorabiliaData;
          deleteMethod = 'deleteMemorabilia';
          break;
        default:
          throw new Error('Invalid item type');
      }
      
      console.log('confirmDeleteItem - Service:', service);
      console.log('confirmDeleteItem - Delete Method:', deleteMethod);
      
      // Safety check: ensure service exists and has the required method
      if (!service) {
        throw new Error(`Service not found for item type: ${deleteItemType}`);
      }
      
      // Call the appropriate delete method with safety checks
      try {
        if (deleteMethod === 'deleteArtwork' && typeof service.deleteArtwork === 'function') {
          console.log('Calling ArtworkService.deleteArtwork');
          await service.deleteArtwork(itemToDelete.id);
        } else if (deleteMethod === 'deleteObject' && typeof service.deleteObject === 'function') {
          console.log('Calling ObjectService.deleteObject');
          await service.deleteObject(itemToDelete.id);
        } else if (deleteMethod === 'deleteCollectible' && typeof service.deleteCollectible === 'function') {
          console.log('Calling CollectibleService.deleteCollectible');
          await service.deleteCollectible(itemToDelete.id);
        } else if (deleteMethod === 'deleteMemorabilia' && typeof service.deleteMemorabilia === 'function') {
          console.log('Calling MemorabiliaService.deleteMemorabilia');
          await service.deleteMemorabilia(itemToDelete.id);
        } else {
          console.error('Service method not found:', { service, deleteMethod, deleteItemType });
          throw new Error(`Delete method ${deleteMethod} not found on service`);
        }
      } catch (serviceError) {
        console.error(`Service error for ${deleteMethod}:`, serviceError);
        throw new Error(`Failed to delete ${deleteItemType}: ${serviceError.message}`);
      }
      
      // Remove from local state
      dataSetter(prev => prev.filter(item => item.id !== itemToDelete.id));
      
      // Clear selection if this item was selected
      setSelectedArtworks(prev => prev.filter(id => id !== itemToDelete.id));

      toast({
        title: "Item Deleted",
        description: `"${itemToDelete.title}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteItemType('');
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (selectedArtworks.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one item to delete.",
        variant: "destructive",
      });
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  // Confirm and execute bulk item deletion
  const confirmBulkDelete = async () => {
    try {
      // Delete all selected items
      for (const itemId of selectedArtworks) {
        // Find the item in any of the data arrays to determine its type
        let itemType = null;
        let service = null;
        let deleteMethod = null;
        
        if (artworkData.find(item => item.id === itemId)) {
          itemType = 'artwork';
          service = ArtworkService;
          deleteMethod = 'deleteArtwork';
        } else if (objectData.find(item => item.id === itemId)) {
          itemType = 'object';
          service = ObjectService;
          deleteMethod = 'deleteObject';
        } else if (collectibleData.find(item => item.id === itemId)) {
          itemType = 'collectible';
          service = CollectibleService;
          deleteMethod = 'deleteCollectible';
        } else if (memorabiliaData.find(item => item.id === itemId)) {
          itemType = 'memorabilia';
          service = MemorabiliaService;
          deleteMethod = 'deleteMemorabilia';
        }
        
        if (service && itemType && deleteMethod) {
          try {
            console.log(`Bulk delete - Item ID: ${itemId}, Type: ${itemType}, Method: ${deleteMethod}`);
            
            // Call the appropriate delete method with safety checks
            if (deleteMethod === 'deleteArtwork' && typeof service.deleteArtwork === 'function') {
              console.log('Calling ArtworkService.deleteArtwork for bulk delete');
              await service.deleteArtwork(itemId);
            } else if (deleteMethod === 'deleteObject' && typeof service.deleteObject === 'function') {
              console.log('Calling ObjectService.deleteObject for bulk delete');
              await service.deleteObject(itemId);
            } else if (deleteMethod === 'deleteCollectible' && typeof service.deleteCollectible === 'function') {
              console.log('Calling CollectibleService.deleteCollectible for bulk delete');
              await service.deleteCollectible(itemId);
            } else if (deleteMethod === 'deleteMemorabilia' && typeof service.deleteMemorabilia === 'function') {
              console.log('Calling MemorabiliaService.deleteMemorabilia for bulk delete');
              await service.deleteMemorabilia(itemId);
            } else {
              console.error(`Delete method not found for ${itemType} on service:`, service);
            }
          } catch (serviceError) {
            console.error(`Service error deleting ${itemType} ${itemId}:`, serviceError);
            // Continue with other items even if one fails
          }
        }
      }
      
      // Remove from all local state arrays
      setArtworkData(prev => prev.filter(item => !selectedArtworks.includes(item.id)));
      setObjectData(prev => prev.filter(item => !selectedArtworks.includes(item.id)));
      setCollectibleData(prev => prev.filter(item => !selectedArtworks.includes(item.id)));
      setMemorabiliaData(prev => prev.filter(item => !selectedArtworks.includes(item.id)));
      
      // Clear selection
      setSelectedArtworks([]);

      toast({
        title: "Bulk Delete Complete",
        description: `${selectedArtworks.length} item(s) have been permanently deleted.`,
      });
    } catch (error) {
      console.error('Error during bulk delete:', error);
      toast({
        title: "Bulk Delete Failed",
        description: "Some items could not be deleted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle bulk digital floor toggle
  const handleBulkDigitalFloorToggle = async () => {
    if (selectedArtworks.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one item to update.",
        variant: "destructive",
      });
      return;
    }

    // Get all selected items from all data arrays
    const allSelectedItems = [
      ...artworkData.filter(item => selectedArtworks.includes(item.id)),
      ...objectData.filter(item => selectedArtworks.includes(item.id)),
      ...collectibleData.filter(item => selectedArtworks.includes(item.id)),
      ...memorabiliaData.filter(item => selectedArtworks.includes(item.id))
    ];
    
    const activeCount = allSelectedItems.filter(item => item.digitalFloor === "Active").length;
    const newStatus = activeCount > allSelectedItems.length / 2 ? "Inactive" : "Active";
    
    try {
      // Update all selected items
      for (const itemId of selectedArtworks) {
        // Find the item and determine its type
        let itemType = null;
        let service = null;
        
        if (artworkData.find(item => item.id === itemId)) {
          itemType = 'artwork';
          service = ArtworkService;
        } else if (objectData.find(item => item.id === itemId)) {
          itemType = 'object';
          service = ObjectService;
        } else if (collectibleData.find(item => item.id === itemId)) {
          itemType = 'collectible';
          service = CollectibleService;
        } else if (memorabiliaData.find(item => item.id === itemId)) {
          itemType = 'memorabilia';
          service = MemorabiliaService;
        }
        
        if (service && itemType) {
          // Call the appropriate update method with safety checks
          try {
            console.log(`Bulk update - Item ID: ${itemId}, Type: ${itemType}, Service:`, service);
            
            if (itemType === 'artwork' && typeof service.updateArtwork === 'function') {
              console.log('Calling ArtworkService.updateArtwork for bulk update');
              await service.updateArtwork(itemId, { digitalFloor: newStatus });
            } else if (itemType === 'object' && typeof service.updateObject === 'function') {
              console.log('Calling ObjectService.updateObject for bulk update');
              await service.updateObject(itemId, { digitalFloor: newStatus });
            } else if (itemType === 'collectible' && typeof service.updateCollectible === 'function') {
              console.log('Calling CollectibleService.updateCollectible for bulk update');
              await service.updateCollectible(itemId, { digitalFloor: newStatus });
            } else if (itemType === 'memorabilia' && typeof service.updateMemorabilia === 'function') {
              console.log('Calling MemorabiliaService.updateMemorabilia for bulk update');
              await service.updateMemorabilia(itemId, { digitalFloor: newStatus });
            } else {
              console.error(`Update method not found for ${itemType} on service:`, service);
            }
          } catch (serviceError) {
            console.error(`Service error updating ${itemType} ${itemId}:`, serviceError);
            // Continue with other items even if one fails
          }
        }
      }
      
      // Update all local state arrays
      setArtworkData(prev => 
        prev.map(item => 
          selectedArtworks.includes(item.id) 
            ? { ...item, digitalFloor: newStatus }
            : item
        )
      );
      setObjectData(prev => 
        prev.map(item => 
          selectedArtworks.includes(item.id) 
            ? { ...item, digitalFloor: newStatus }
            : item
        )
      );
      setCollectibleData(prev => 
        prev.map(item => 
          selectedArtworks.includes(item.id) 
            ? { ...item, digitalFloor: newStatus }
            : item
        )
      );
      setMemorabiliaData(prev => 
        prev.map(item => 
          selectedArtworks.includes(item.id) 
            ? { ...item, digitalFloor: newStatus }
            : item
        )
      );

      toast({
        title: "Bulk Update Complete",
        description: `${selectedArtworks.length} item(s) have been ${newStatus === "Active" ? "added to" : "removed from"} the digital floor.`,
      });
    } catch (error) {
      console.error('Error during bulk digital floor update:', error);
      toast({
        title: "Bulk Update Failed",
        description: "Some items could not be updated. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    try {
      let dataToExport = [];
      
      if (selectedArtworks.length > 0) {
        // Export selected items from all data arrays
        dataToExport = [
          ...artworkData.filter(item => selectedArtworks.includes(item.id)),
          ...objectData.filter(item => selectedArtworks.includes(item.id)),
          ...collectibleData.filter(item => selectedArtworks.includes(item.id)),
          ...memorabiliaData.filter(item => selectedArtworks.includes(item.id))
        ];
      } else {
        // Export all filtered data based on current tab
        switch (selectedTab) {
          case 'artwork':
            // For artwork tab, use the filtered artwork data
            dataToExport = artworkData.filter(item => {
              const searchLower = searchQuery.toLowerCase();
              const matchesSearch = searchQuery === "" || 
                item.title?.toLowerCase().includes(searchLower) ||
                item.artist?.toLowerCase().includes(searchLower) ||
                item.medium?.toLowerCase().includes(searchLower) ||
                item.year?.toString().includes(searchLower) ||
                item.sku?.toLowerCase().includes(searchLower) ||
                item.location?.toLowerCase().includes(searchLower);
              
              const matchesCreator = filterCreator === "" || 
                item.artist?.toLowerCase().includes(filterCreator.toLowerCase());
              
              return matchesSearch && matchesCreator;
            });
            break;
          case 'objects':
            dataToExport = objectData;
            break;
          case 'collectibles':
            dataToExport = collectibleData;
            break;
          case 'memorabilia':
            dataToExport = memorabiliaData;
            break;
          default:
            dataToExport = [...artworkData, ...objectData, ...collectibleData, ...memorabiliaData];
        }
      }

      if (dataToExport.length === 0) {
        toast({
          title: "No Data to Export",
          description: "There is no data to export.",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content with dynamic headers based on item types
      const headers = ['Item Type', 'SKU', 'Title', 'Artist/Maker', 'Year', 'Medium/Material', 'Size/Dimensions', 'Price', 'Price Type', 'Condition', 'Framed', 'Location', 'Digital Floor', 'Status'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => [
          item.itemType || 'Unknown',
          item.sku,
          `"${item.title}"`,
          `"${item.artist || item.makerManufacturer || 'N/A'}"`,
          item.year || item.productionYearEra || 'N/A',
          `"${item.medium || item.materialsComposition || 'N/A'}"`,
          `"${item.size || `${item.width || 'N/A'} x ${item.height || 'N/A'}`}"`,
          item.price || 'N/A',
          item.priceType || 'N/A',
          item.condition || 'N/A',
          item.framed || 'N/A',
          `"${item.location}"`,
          item.digitalFloor || 'N/A',
          item.status || 'N/A'
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: `${dataToExport.length} item(s) have been exported to CSV.`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load dummy data directly
  useEffect(() => {
    setLoading(true);
    setArtworkData(artworkInventoryData);
    setObjectData([]);
    setCollectibleData([]);
    setMemorabiliaData([]);
    setIsDemoGallery(true);
    setLoading(false);
  }, []);

  // Pagination - these will be calculated per tab
  const itemsPerPage = isMobile ? 5 : 10;

  // Handle select all
  const handleSelectAll = useCallback((checked) => {
    let currentData = [];
    
    // Get the appropriate data based on current tab
    switch (selectedTab) {
      case 'artwork':
        currentData = artworkData.filter(item => {
          const searchLower = searchQuery.toLowerCase();
          const matchesSearch = searchQuery === "" || 
            item.title?.toLowerCase().includes(searchLower) ||
            item.artist?.toLowerCase().includes(searchLower) ||
            item.medium?.toLowerCase().includes(searchLower) ||
            item.year?.toString().includes(searchLower) ||
            item.sku?.toLowerCase().includes(searchLower) ||
            item.location?.toLowerCase().includes(searchLower);
          
          const matchesCreator = filterCreator === "" || 
            item.artist?.toLowerCase().includes(filterCreator.toLowerCase());
          
          return matchesSearch && matchesCreator;
        });
        break;
      case 'objects':
        currentData = objectData;
        break;
      case 'collectibles':
        currentData = collectibleData;
        break;
      case 'memorabilia':
        currentData = memorabiliaData;
        break;
      default:
        // For inventory tab (all items), combine all data
        currentData = [...artworkData, ...objectData, ...collectibleData, ...memorabiliaData];
    }
    
    if (checked) {
      setSelectedArtworks(currentData.map(item => item.id));
    } else {
      setSelectedArtworks([]);
    }
  }, [selectedTab, artworkData, objectData, collectibleData, memorabiliaData, searchQuery, filterCreator]);

  // Handle individual selection
  const handleSelectArtwork = useCallback((id, checked) => {
    if (checked) {
      setSelectedArtworks(prev => [...prev, id]);
    } else {
      setSelectedArtworks(prev => prev.filter(item => item !== id));
    }
  }, []);

  // Handle column visibility
  const handleColumnVisibility = useCallback((columnId, checked) => {
    setVisibleColumns(prev => 
      prev.map(col => col.id === columnId ? { ...col, checked } : col)
    );
  }, []);

  const handleCollectibleColumnVisibility = useCallback((columnId, checked) => {
    setCollectibleVisibleColumns(prev => 
      prev.map(col => col.id === columnId ? { ...col, checked } : col)
    );
  }, []);

  const handleMemorabiliaColumnVisibility = useCallback((columnId, checked) => {
    setMemorabiliaVisibleColumns(prev => 
      prev.map(col => col.id === columnId ? { ...col, checked } : col)
    );
  }, []);

  const handleObjectColumnVisibility = useCallback((columnId, checked) => {
    setObjectVisibleColumns(prev => 
      prev.map(col => col.id === columnId ? { ...col, checked } : col)
    );
  }, []);

  // Handle sorting
  const handleSort = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(artworkData.length / itemsPerPage);
  const paginatedData = artworkData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCreator]);

  // Mobile columns
  const mobileColumns = ['title', 'artist', 'price', 'location'];
  const displayColumns = isMobile 
    ? visibleColumns.filter(col => mobileColumns.includes(col.id))
    : visibleColumns;

  if (loading) {
    return <ArtworkInventoryPageSkeleton />;
  }


  return (
    <div className="min-h-screen bg-background -mt-5">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          <span className="">Inventory</span>
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Manage your gallery's collection and inventory items.
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={"Search by title, artist, medium, year..."}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
       
            <>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {/* <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button> */}
            </>
          {/* {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )} */}
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href="/inventory/new">
              <Plus className="h-4 w-4 mr-0 lg:mr-2" />
              <span className="">Add Item</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid w-full max-w-[800px] grid-cols-5">
          <TabsTrigger value="inventory">All Items</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
          <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
          <TabsTrigger value="memorabilia">Memorabilia</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Content Tabs */}
      {selectedTab === 'inventory' && (
        <InventoryTab 
          data={[...artworkData, ...objectData, ...collectibleData, ...memorabiliaData]}
          selectedArtworks={selectedArtworks}
          setSelectedArtworks={setSelectedArtworks}
          handleDeleteItem={(item) => handleDeleteItem(item, getItemType(item))}
          handleToggleDigitalFloor={handleToggleDigitalFloor}
          handleCopySKU={handleCopySKU}
          handleSelectAll={handleSelectAll}
          handleSelectArtwork={handleSelectArtwork}
          handleColumnVisibility={handleColumnVisibility}
          handleSort={handleSort}
          formatPrice={formatPrice}
          visibleColumns={visibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobile={isMobile}
          searchQuery={searchQuery}
          filterCreator={filterCreator}
          setFilterCreator={setFilterCreator}
          handleBulkDigitalFloorToggle={handleBulkDigitalFloorToggle}
          handleBulkDelete={handleBulkDelete}
        />
      )}

      {selectedTab === 'artwork' && (
        <ArtworkTab 
          data={artworkData}
          selectedArtworks={selectedArtworks}
          setSelectedArtworks={setSelectedArtworks}
          handleDeleteItem={(item) => handleDeleteItem(item, 'artwork')}
          handleToggleDigitalFloor={handleToggleDigitalFloor}
          handleCopySKU={handleCopySKU}
          handleSelectAll={handleSelectAll}
          handleSelectArtwork={handleSelectArtwork}
          handleColumnVisibility={handleColumnVisibility}
          handleSort={handleSort}
          formatPrice={formatPrice}
          visibleColumns={visibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobile={isMobile}
          searchQuery={searchQuery}
          filterCreator={filterCreator}
          setFilterCreator={setFilterCreator}
          handleBulkDigitalFloorToggle={handleBulkDigitalFloorToggle}
          handleBulkDelete={handleBulkDelete}
        />
      )}

      {selectedTab === 'objects' && (
        <ObjectsTab 
          data={objectData}
          selectedArtworks={selectedArtworks}
          setSelectedArtworks={setSelectedArtworks}
          handleDeleteItem={(item) => handleDeleteItem(item, 'object')}
          handleToggleDigitalFloor={handleToggleDigitalFloor}
          handleCopySKU={handleCopySKU}
          handleSelectAll={handleSelectAll}
          handleSelectArtwork={handleSelectArtwork}
          handleColumnVisibility={handleObjectColumnVisibility}
          handleSort={handleSort}
          formatPrice={formatPrice}
          visibleColumns={objectVisibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobile={isMobile}
          searchQuery={searchQuery}
          filterCreator={filterCreator}
          setFilterCreator={setFilterCreator}
          handleBulkDigitalFloorToggle={handleBulkDigitalFloorToggle}
          handleBulkDelete={handleBulkDelete}
        />
      )}

      {selectedTab === 'collectibles' && (
        <CollectiblesTab 
          data={collectibleData}
          selectedArtworks={selectedArtworks}
          setSelectedArtworks={setSelectedArtworks}
          handleDeleteItem={(item) => handleDeleteItem(item, 'collectible')}
          handleToggleDigitalFloor={handleToggleDigitalFloor}
          handleCopySKU={handleCopySKU}
          handleSelectAll={handleSelectAll}
          handleSelectArtwork={handleSelectArtwork}
          handleColumnVisibility={handleCollectibleColumnVisibility}
          handleSort={handleSort}
          formatPrice={formatPrice}
          visibleColumns={collectibleVisibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobile={isMobile}
          searchQuery={searchQuery}
          filterCreator={filterCreator}
          setFilterCreator={setFilterCreator}
          handleBulkDigitalFloorToggle={handleBulkDigitalFloorToggle}
          handleBulkDelete={handleBulkDelete}
        />
      )}

      {selectedTab === 'memorabilia' && (
        <MemorabiliaTab 
          data={memorabiliaData}
          selectedArtworks={selectedArtworks}
          setSelectedArtworks={setSelectedArtworks}
          handleDeleteItem={(item) => handleDeleteItem(item, 'memorabilia')}
          handleToggleDigitalFloor={handleToggleDigitalFloor}
          handleCopySKU={handleCopySKU}
          handleSelectAll={handleSelectAll}
          handleSelectArtwork={handleSelectArtwork}
          handleColumnVisibility={handleMemorabiliaColumnVisibility}
          handleSort={handleSort}
          formatPrice={formatPrice}
          visibleColumns={memorabiliaVisibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobile={isMobile}
          searchQuery={searchQuery}
          filterCreator={filterCreator}
          setFilterCreator={setFilterCreator}
          handleBulkDigitalFloorToggle={handleBulkDigitalFloorToggle}
          handleBulkDelete={handleBulkDelete}
        />
      )}

      {selectedTab === 'storage' && (
        <StorageLocationsTab />
      )}

      {selectedTab === 'bulk' && (
        <div className="p-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Bulk Operations</h2>
            <p className="text-muted-foreground mt-1">
              Import or export inventory data in bulk.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CSV Import</CardTitle>
                <CardDescription>
                  Upload a CSV file to import multiple artwork pieces at once.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Select CSV File
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Art Galleria Import</CardTitle>
                <CardDescription>
                  Import artwork data directly from Art Galleria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">Connect to Art Galleria</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Single Item Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteItem}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedArtworks.length} selected item(s)? This action cannot be undone.
              {selectedArtworks.length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded text-xs max-h-20 overflow-y-auto">
                  {[...artworkData, ...objectData, ...collectibleData, ...memorabiliaData]
                    .filter(item => selectedArtworks.includes(item.id))
                    .map(item => item.title)
                    .join(', ')}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}