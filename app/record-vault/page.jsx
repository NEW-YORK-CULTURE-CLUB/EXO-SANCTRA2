"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter as FilterIcon,
  Download,
  Upload,
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  ArrowUpDown,
  AlertTriangle,
  FileText,
  Eye,
  Edit,
  Trash2,
  X,
  Loader2
} from "lucide-react";
import { recordVaultData, documentTypes, columnOptionsVault } from "@/data/recordVaultData";
import { EditDocumentModal } from "@/components/EditDocumentModal";
import { ViewDocumentModal } from "@/components/ViewDocumentModal";
// import { useAuth } from "@/contexts/auth-context"; // Disabled - using mock data
// import { useGallery } from "@/contexts/gallery-context"; // Disabled - using mock data
// import { ArtworkService } from "@/lib/artwork-service"; // Disabled - using mock data
// import { ObjectService } from "@/lib/object-service"; // Disabled - using mock data
// import { CollectibleService } from "@/lib/collectible-service"; // Disabled - using mock data
// import { MemorabiliaService } from "@/lib/memorabilia-service"; // Disabled - using mock data
import { useRouter } from "next/navigation";

export default function RecordVault() {
  // const { user, userData } = useAuth(); // Disabled - using mock data
  // const { gallery } = useGallery(); // Disabled - using mock data
  const user = { uid: 'mock-user', email: 'demo@exhibitiq.com' }; // Mock user
  const userData = { fullname: 'Demo User', role: ['admin'] }; // Mock user data
  const gallery = { galleryId: 'demo-gallery', name: 'Demo Gallery' }; // Mock gallery
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columnOptionsVault);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterArtist, setFilterArtist] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedItemType, setSelectedItemType] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [isAddArtworkOpen, setIsAddArtworkOpen] = useState(false);
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentTag, setCurrentTag] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // New states for dynamic data
  const [isLoading, setIsLoading] = useState(true);
  const [vaultData, setVaultData] = useState([]);
  const [isDemoGallery, setIsDemoGallery] = useState(false);
  
  // Form states for Add Artwork
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    artist: "",
    year: "",
    medium: "",
    description: "",
    requiredDocuments: []
  });

  // Form states for Upload Document
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "",
    description: "",
    tags: [],
    file: null
  });

  // Helper function to format Firebase timestamps
  const formatFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toLocaleDateString();
    
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      // Firebase timestamp
      return timestamp.toDate().toLocaleDateString();
    } else if (typeof timestamp === 'string') {
      // String date
      return new Date(timestamp).toLocaleDateString();
    } else if (timestamp instanceof Date) {
      // Date object
      return timestamp.toLocaleDateString();
    }
    
    return new Date().toLocaleDateString();
  };

  // Helper function to extract document types from certificates
  const extractDocumentTypes = (certificates) => {
    const existingDocs = [];
    if (certificates && Array.isArray(certificates)) {
      certificates.forEach(cert => {
        // Use the typeLabel if available, otherwise use the type field
        const docType = cert.typeLabel || cert.type || cert.name;
        if (docType) {
          existingDocs.push(docType);
        }
      });
    }
    return existingDocs;
  };

  // Helper function to calculate document completeness
  const calculateDocumentCompleteness = (existingDocs) => {
    const allDocumentTypes = ["Certificate of Authenticity", "Provenance", "Insurance Records", "Miscellaneous"];
    const documentsCount = existingDocs.length;
    const missingCount = Math.max(0, allDocumentTypes.length - documentsCount);
    
    let status = "Complete";
    if (documentsCount === 0) status = "Missing";
    else if (documentsCount < allDocumentTypes.length) status = "Incomplete";
    
    return { documentsCount, missingCount, status };
  };

  const router = useRouter();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data - simplified for mock mode
  useEffect(() => {
    const loadVaultData = async () => {
      setIsLoading(true);
      try {
        // Always use demo data since we're in mock mode
        setIsDemoGallery(true);
        // Transform demo data to match the expected structure
        const transformedDemoData = recordVaultData.map(item => ({
          ...item,
          itemTitle: item.artwork,
          itemArtist: item.artist,
          itemYear: item.year,
          itemMedium: item.medium,
          itemType: item.itemType || 'Artwork',
          totalDocuments: item.documents,
          missingDocuments: item.missing,
          completeDocuments: item.documents,
          documentTypes: item.documentTypes || [],
          missingDocumentTypes: [],
          lastUpdated: item.lastUpdated,
          // Add fields needed for inventory navigation
          title: item.artwork,
          sku: item.sku || item.id
        }));
        setVaultData(transformedDemoData);
      } catch (error) {
        console.error('Error loading vault data:', error);
        // Fallback to demo data if there's an error
        setIsDemoGallery(true);
        setVaultData(recordVaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadVaultData();
  }, []); // Empty dependency array since we're using static demo data

  const itemsPerPage = isMobile ? 5 : 10;

  // Handle column visibility
  const handleColumnVisibility = (columnId, checked) => {
    setVisibleColumns(prev => 
      prev.map(col => col.id === columnId ? { ...col, checked } : col)
    );
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter data based on tab selection (document status)
  let filteredByTab = vaultData;
  if (selectedTab === "missing") {
    filteredByTab = vaultData.filter(item => item.status === "Missing");
  } else if (selectedTab === "incomplete") {
    filteredByTab = vaultData.filter(item => item.status === "Incomplete");
  } else if (selectedTab === "complete") {
    filteredByTab = vaultData.filter(item => item.status === "Complete");
  }

  // Filter data based on item type selection
  let filteredByItemType = filteredByTab;
  if (selectedItemType === "artwork") {
    filteredByItemType = filteredByTab.filter(item => item.itemType === "Artwork");
  } else if (selectedItemType === "collectibles") {
    filteredByItemType = filteredByTab.filter(item => item.itemType === "Collectibles");
  } else if (selectedItemType === "objects") {
    filteredByItemType = filteredByTab.filter(item => item.itemType === "Objects");
  }
  // "all" shows all item types

  // Filter and sort data
  let filteredData = filteredByItemType.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      item.itemTitle?.toLowerCase().includes(searchLower) ||
      item.itemArtist?.toLowerCase().includes(searchLower) ||
      (item.itemYear && item.itemYear.toString().includes(searchLower)) ||
      (item.itemMakerManufacturer && item.itemMakerManufacturer.toLowerCase().includes(searchLower)) ||
      (item.itemManufacturerBrand && item.itemManufacturerBrand.toLowerCase().includes(searchLower)) ||
      (item.itemAssociatedPersons && item.itemAssociatedPersons.toLowerCase().includes(searchLower));
    
    const matchesArtist = filterArtist === "" || 
      (item.itemArtist && item.itemArtist.toLowerCase().includes(filterArtist.toLowerCase())) ||
      (item.itemMakerManufacturer && item.itemMakerManufacturer.toLowerCase().includes(filterArtist.toLowerCase())) ||
      (item.itemManufacturerBrand && item.itemManufacturerBrand.toLowerCase().includes(filterArtist.toLowerCase())) ||
      (item.itemAssociatedPersons && item.itemAssociatedPersons.toLowerCase().includes(filterArtist.toLowerCase()));
    
    return matchesSearch && matchesArtist;
  });

  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterArtist, selectedTab, selectedItemType]);

  const displayColumns = visibleColumns;

  // Count documents by status
  const missingCount = vaultData.filter(item => item.status === "Missing").length;
  const incompleteCount = vaultData.filter(item => item.status === "Incomplete").length;
  const completeCount = vaultData.filter(item => item.status === "Complete").length;
  const totalDocuments = vaultData.reduce((sum, item) => sum + (item.totalDocuments || 0), 0);

  // Handle Add Artwork
  const handleAddArtwork = () => {
    console.log("Adding artwork:", newArtwork);
    setIsAddArtworkOpen(false);
    setNewArtwork({
      title: "",
      artist: "",
      year: "",
      medium: "",
      description: "",
      requiredDocuments: []
    });
  };

  // Handle Upload Document
  const handleUploadDocument = () => {
    console.log("Uploading document:", newDocument);
    setIsUploadDocumentOpen(false);
    setNewDocument({
      name: "",
      type: "",
      description: "",
      tags: [],
      file: null
    });
  };

  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewDocument({ ...newDocument, file });
    }
  };

  // Handlers for document modals
  const handleViewDocument = (artwork, docType) => {
    setSelectedDocument({ 
      ...artwork, 
      name: docType,
      fileName: 'Exhibition History',
      fileSize: '1.7 MB',
      fileDate: '12/06/2022'
    });
    setIsViewModalOpen(true);
  };

  const handleEditDocument = (artwork, docType) => {
    setSelectedDocument({ 
      ...artwork, 
      name: docType,
      fileName: 'Exhibition History',
      fileSize: '1.7 MB',
      fileDate: '12/06/2022',
      description: "A summary of the artwork's exhibition history.",
      tags: ['Warhol', 'Pop Art']
    });
    setIsEditModalOpen(true);
  };

  const handleSaveDocument = (updatedDocument) => {
    console.log("Saving document:", updatedDocument);
    // Here you would typically update your data source
  };

  // Get display name for item
  const getItemDisplayName = (item) => {
    if (isDemoGallery) {
      return item.artwork || item.title;
    }
    return item.itemTitle;
  };

  // Get display artist for item
  const getItemDisplayArtist = (item) => {
    if (isDemoGallery) {
      return item.artist;
    }
    return item.itemArtist || item.itemMakerManufacturer || item.itemManufacturerBrand || item.itemAssociatedPersons || 'N/A';
  };

  // Get display year for item
  const getItemDisplayYear = (item) => {
    if (isDemoGallery) {
      return item.year;
    }
    return item.itemYear || item.itemProductionYearEra || item.itemReleaseYearEra || 'N/A';
  };

  // Get thumbnail for item
  const getItemThumbnail = (item) => {
    if (isDemoGallery) {
      return item.thumbnail || "/placeholder.svg";
    }
    
    // Debug: Log the complete item structure for the first few items
    if (Math.random() < 0.1) { // Only log 10% of items to avoid spam
      console.log('Complete item structure for debugging:', {
        id: item.id,
        title: item.itemTitle || item.title,
        images: item.images,
        imageUrl: item.imageUrl,
        thumbnail: item.thumbnail,
        allKeys: Object.keys(item)
      });
    }
    
    // For real gallery items, handle both old string URLs and new processed image objects
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const firstImage = item.images[0];
      
      // Handle old string URL format
      if (typeof firstImage === 'string') {
        console.log('Found string image URL for item:', item.itemTitle || item.title, 'URL:', firstImage);
        // Check if it's a valid URL
        if (firstImage.startsWith('http')) {
          return firstImage;
        } else if (firstImage.startsWith('gs://') || firstImage.includes('firebase')) {
          // This is a Firebase Storage path, we need to convert it to a public URL
          console.warn('Firebase Storage path detected, converting to public URL:', firstImage);
          // For now, return placeholder since we can't convert server-side
          return "/placeholder.svg";
        } else if (firstImage.startsWith('/')) {
          // This is a relative path, try to make it absolute
          console.log('Relative path detected, making absolute:', firstImage);
          // For now, return placeholder since we can't convert server-side
          return "/placeholder.svg";
        } else {
          console.warn('Invalid URL format (not starting with http):', firstImage);
          return "/placeholder.svg";
        }
      }
      
      // Handle new processed image object format
      if (firstImage && typeof firstImage === 'object' && firstImage.variants) {
        try {
          // Get the smallest variant for thumbnail (usually 640x640)
          const thumbnailVariant = firstImage.variants.find(v => v.width <= 640) || firstImage.variants[0];
          if (thumbnailVariant && thumbnailVariant.url) {
            console.log('Found processed image for item:', item.itemTitle || item.title, 'URL:', thumbnailVariant.url);
            // Check if it's a valid URL
            if (thumbnailVariant.url.startsWith('http')) {
              return thumbnailVariant.url;
            } else if (thumbnailVariant.url.startsWith('gs://') || thumbnailVariant.url.includes('firebase')) {
              // This is a Firebase Storage path, we need to convert it to a public URL
              console.warn('Firebase Storage path detected in variants, converting to public URL:', thumbnailVariant.url);
              // For now, return placeholder since we can't convert server-side
              return "/placeholder.svg";
            } else if (thumbnailVariant.url.startsWith('/')) {
              // This is a relative path, try to make it absolute
              console.log('Relative path detected in variants, making absolute:', thumbnailVariant.url);
              // For now, return placeholder since we can't convert server-side
              return "/placeholder.svg";
            } else {
              console.warn('Invalid URL format in variants (not starting with http):', thumbnailVariant.url);
              return "/placeholder.svg";
            }
          }
        } catch (error) {
          console.warn('Error processing image variants for item:', item.itemTitle || item.title, error);
        }
      }
    }
    
    // Debug logging for items without images
    console.log('No valid images found for item:', item.itemTitle || item.title, 'Images field:', item.images);
    
    // Check for other possible image fields
    if (item.imageUrl) {
      console.log('Found imageUrl field for item:', item.itemTitle || item.title, 'URL:', item.imageUrl);
      if (item.imageUrl.startsWith('http')) {
        return item.imageUrl;
      } else if (item.imageUrl.startsWith('gs://') || item.imageUrl.includes('firebase')) {
        console.warn('Firebase Storage path detected in imageUrl:', item.imageUrl);
        return "/placeholder.svg";
      } else if (item.imageUrl.startsWith('/')) {
        console.log('Relative path detected in imageUrl:', item.imageUrl);
        return "/placeholder.svg";
      }
    }
    
    if (item.thumbnail) {
      console.log('Found thumbnail field for item:', item.itemTitle || item.title, 'URL:', item.thumbnail);
      if (item.thumbnail.startsWith('http')) {
        return item.thumbnail;
      } else if (item.thumbnail.startsWith('gs://') || item.thumbnail.includes('firebase')) {
        console.warn('Firebase Storage path detected in thumbnail:', item.thumbnail);
        return "/placeholder.svg";
      } else if (item.thumbnail.startsWith('/')) {
        console.log('Relative path detected in thumbnail:', item.thumbnail);
        return "/placeholder.svg";
      }
    }
    
    // Fallback to placeholder if no images available
    return "/placeholder.svg";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background -mt-5">
        {/* Header Skeleton */}
        <div className="mb-4 lg:mb-6">
          <div className="h-8 bg-muted/20 rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted/20 rounded w-96 mb-2"></div>
          {!isDemoGallery && (
            <div className="mt-2 p-3 bg-muted/20 rounded-lg">
              <div className="h-4 bg-muted/30 rounded w-48"></div>
            </div>
          )}
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-4">
          <div className="grid w-full max-w-[800px] grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted/20 rounded"></div>
            ))}
          </div>
        </div>

        {/* Actions Bar Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 lg:mb-6">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
            <div className="relative flex-1">
              <div className="h-10 bg-muted/20 rounded pl-10"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-muted/20 rounded w-20"></div>
            ))}
          </div>
        </div>

        {/* Status Summary Skeleton */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-muted/20 rounded w-24"></div>
          ))}
        </div>

        {/* Main Navigation Tabs Skeleton */}
        <div className="mb-4">
          <div className="grid w-full grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted/20 rounded"></div>
            ))}
          </div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="h-10 bg-muted/20 rounded w-48"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-muted/20 rounded w-32"></div>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-muted/20 rounded w-16"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <div className="p-4">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-8 gap-4 mb-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted/20 rounded"></div>
              ))}
            </div>
            
            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-8 gap-4 mb-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted/20 rounded"></div>
                  <div className="h-4 bg-muted/20 rounded w-32"></div>
                </div>
                <div className="h-4 bg-muted/20 rounded w-24"></div>
                <div className="h-4 bg-muted/20 rounded w-16"></div>
                <div className="h-4 bg-muted/20 rounded w-20"></div>
                <div className="h-4 bg-muted/20 rounded w-16"></div>
                <div className="h-4 bg-muted/20 rounded w-12"></div>
                <div className="h-4 bg-muted/20 rounded w-12"></div>
                <div className="h-4 bg-muted/20 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Pagination Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-4">
          <div className="h-4 bg-muted/20 rounded w-32"></div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted/20 rounded w-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background -mt-5">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          <span className="text-muted-foreground">Record </span>
          <span className="text-foreground">Vault</span>
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          {isDemoGallery 
            ? "Secure storage for important gallery records and artwork documentation."
            : `Document management for ${gallery?.name || 'your gallery'}. Track document completeness and manage records.`
          }
        </p>
        {/* {!isDemoGallery && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Gallery:</strong> {gallery?.name} ({gallery?.email})
            </p>
          </div>
        )} */}
      </div>



      {/* Item Type Tabs */}
      <Tabs value={selectedItemType} onValueChange={setSelectedItemType} className="mb-4">
        <TabsList className="grid w-full max-w-[800px] grid-cols-4">
          <TabsTrigger value="all">All Types</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
          <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isMobile ? "Search..." : "Search by item title, artist, or document type..."}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-0 lg:mr-2" />
            <span className="">Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-0 lg:mr-2" />
            <span className="">Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsUploadDocumentOpen(true)}
          >
            <Upload className="h-4 w-4 mr-0 lg:mr-2" />
            <span className="">Upload Document</span>
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push('/inventory/new')}
            // onClick={() => setIsAddArtworkOpen(true)}
          >
            <Plus className="h-4 w-4 mr-0 lg:mr-2" />
            <span className="">Add Item</span>
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">All Documents:</span>
          <span className="font-bold">{totalDocuments}</span>
        </div>
        <Badge className="bg-red-500 hover:bg-red-600 text-white">
          Missing Documentation: {missingCount}
        </Badge>
        <Badge variant="secondary">
          Incomplete: {incompleteCount}
        </Badge>
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          Complete: {completeCount}
        </Badge>
      </div>

            {/* Main Navigation Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="missing">Missing Docs</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Input
            placeholder="Filter by artist/maker..."
            className="w-full lg:w-48"
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
          <span className="text-xs lg:text-sm text-muted-foreground">
            {filteredData.length} item(s) found.
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {visibleColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.checked}
                    onCheckedChange={(checked) => handleColumnVisibility(column.id, checked)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('itemTitle')}>
                <div className="flex items-center gap-1">
                  {isDemoGallery ? 'Artwork' : 'Item'} <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('itemArtist')}>
                <div className="flex items-center gap-1">
                  {isDemoGallery ? 'Artist' : 'Artist/Maker'} <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {displayColumns.find(col => col.id === 'year')?.checked && (
                <TableHead className="cursor-pointer" onClick={() => handleSort('itemYear')}>
                  <div className="flex items-center gap-1">
                    {isDemoGallery ? 'Year' : 'Year/Era'} <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('totalDocuments')}>
                <div className="flex items-center gap-1">
                  Documents <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {displayColumns.find(col => col.id === 'missingDocuments')?.checked && (
                <TableHead>Missing</TableHead>
              )}
              {displayColumns.find(col => col.id === 'lastUpdated')?.checked && (
                <TableHead>Last Updated</TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No items found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={getItemThumbnail(item)} 
                        alt={getItemDisplayName(item)}
                        className="h-10 w-10 rounded object-cover"
                        onError={(e) => {
                          console.error('Image failed to load for item:', item.itemTitle || item.title, 'URL:', e.target.src);
                          e.target.src = "/placeholder.svg";
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully for item:', item.itemTitle || item.title);
                        }}
                      />
                      <a href={`/inventory/${item.id}`} className="text-blue-600 hover:underline font-medium">
                        {getItemDisplayName(item)}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{getItemDisplayArtist(item)}</TableCell>
                  {displayColumns.find(col => col.id === 'year')?.checked && (
                    <TableCell>{getItemDisplayYear(item)}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {isDemoGallery ? (item.medium || 'N/A') : (item.itemType || 'Unknown')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        item.status === "Complete" 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : item.status === "Missing"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.totalDocuments || item.documents || 0}</TableCell>
                  {displayColumns.find(col => col.id === 'missingDocuments')?.checked && (
                    <TableCell>
                      {item.missingDocuments > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.missingDocuments}
                          </span>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                      {item.missingDocuments === 0 && "-"}
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'lastUpdated')?.checked && (
                    <TableCell>{item.lastUpdated || item.lastUpdated || '-'}</TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="font-medium">Actions</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsUploadDocumentOpen(true)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="font-medium">Documents</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {documentTypes.slice(0, 5).map((docType, index) => (
                          <DropdownMenuItem key={index} onSelect={(e) => e.preventDefault()}>
                            <div className="flex items-center justify-between w-full">
                              <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {docType}
                              </span>
                              <div className="flex items-center gap-2 ml-4">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleViewDocument(item, docType)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditDocument(item, docType)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-4">
        <span className="text-xs lg:text-sm text-muted-foreground text-center lg:text-left">
          {filteredData.length} item(s) found.
        </span>
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EditDocumentModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        document={selectedDocument}
        onSave={handleSaveDocument}
      />
      <ViewDocumentModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        document={selectedDocument}
      />

      {/* Add Item Modal */}
      <Dialog open={isAddArtworkOpen} onOpenChange={setIsAddArtworkOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to the record vault for documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-title">Item Title *</Label>
              <Input
                id="item-title"
                value={newArtwork.title}
                onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                placeholder="Enter item title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist/Maker *</Label>
              <Input
                id="artist"
                value={newArtwork.artist}
                onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                placeholder="Enter artist or maker name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year/Era *</Label>
                <Input
                  id="year"
                  type="number"
                  value={newArtwork.year}
                  onChange={(e) => setNewArtwork({ ...newArtwork, year: e.target.value })}
                  placeholder="YYYY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium/Type</Label>
                <Input
                  id="medium"
                  value={newArtwork.medium}
                  onChange={(e) => setNewArtwork({ ...newArtwork, medium: e.target.value })}
                  placeholder="e.g., Oil on canvas, Bronze, etc."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newArtwork.description}
                onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                placeholder="Enter item description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Required Documents</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Certificate of Authenticity</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const docs = newArtwork.requiredDocuments.filter(d => d !== "Certificate of Authenticity");
                    setNewArtwork({ ...newArtwork, requiredDocuments: docs });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Select
                onValueChange={(value) => {
                  if (!newArtwork.requiredDocuments.includes(value)) {
                    setNewArtwork({
                      ...newArtwork,
                      requiredDocuments: [...newArtwork.requiredDocuments, value]
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add required document" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((docType, index) => (
                    <SelectItem key={index} value={docType}>
                      {docType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddArtworkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddArtwork} className="bg-black hover:bg-gray-800">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={isUploadDocumentOpen} onOpenChange={setIsUploadDocumentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to the record vault
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doc-name">Document Name *</Label>
              <Input
                id="doc-name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="Enter document name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-type">Document Type *</Label>
              <Select
                value={newDocument.type}
                onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((docType, index) => (
                    <SelectItem key={index} value={docType}>
                      {docType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-description">Description</Label>
              <Textarea
                id="doc-description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                placeholder="Enter a brief description of the document"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-tags">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="doc-tags"
                  value={currentTag}
                  placeholder="Add a tag and press Enter"
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentTag.trim()) {
                      e.preventDefault();
                      if (!newDocument.tags.includes(currentTag.trim())) {
                        setNewDocument(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
                      }
                      setCurrentTag('');
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (currentTag.trim() && !newDocument.tags.includes(currentTag.trim())) {
                      setNewDocument(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
                      setCurrentTag('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newDocument.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => {
                        setNewDocument(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File *</Label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="flex flex-col justify-center items-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Drag and drop</span> or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: PDF, JPG, PNG, TIFF (Max 10MB)
                  </p>
                  <label htmlFor="file-upload" className="sr-only">Upload file</label>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setNewDocument({ ...newDocument, file: e.target.files[0] });
                      }
                    }}
                  />
                  {newDocument.file && (
                    <p className="text-sm mt-2 text-foreground">
                      Selected file: {newDocument.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDocumentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument} className="bg-black hover:bg-gray-800 text-white">
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
