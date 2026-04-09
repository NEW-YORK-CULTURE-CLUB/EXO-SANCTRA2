// app/record-vault/page.js
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
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { recordVaultData, documentTypes, columnOptionsVault } from "@/data/recordVaultData";
import { EditDocumentModal } from "@/components/EditDocumentModal";
import { ViewDocumentModal } from "@/components/ViewDocumentModal";
// import { useAuth } from "@/contexts/auth-context"; // Disabled - using mock data
// import { useGallery } from "@/contexts/gallery-context"; // Disabled - using mock data
import { ArtworkService } from "@/lib/artwork-service";
import { ObjectService } from "@/lib/object-service";
import { CollectibleService } from "@/lib/collectible-service";
import { MemorabiliaService } from "@/lib/memorabilia-service";
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
  const [vaultData, setVaultData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoGallery, setIsDemoGallery] = useState(true);
  const [isAddArtworkOpen, setIsAddArtworkOpen] = useState(false);
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    artist: "",
    year: "",
    medium: "",
    description: ""
  });
  const [newDocument, setNewDocument] = useState({
    title: "",
    type: "",
    description: "",
    file: null
  });

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

  // Filter data based on search query
  const filteredData = filteredByItemType.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.itemTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemArtist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArtist = filterArtist === "" || 
      item.itemArtist?.toLowerCase().includes(filterArtist.toLowerCase());
    
    return matchesSearch && matchesArtist;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
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
      description: ""
    });
  };

  // Handle Upload Document
  const handleUploadDocument = () => {
    console.log("Uploading document:", newDocument);
    setIsUploadDocumentOpen(false);
    setNewDocument({
      title: "",
      type: "",
      description: "",
      file: null
    });
  };

  // Handle Edit Document
  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setIsEditDocumentOpen(true);
  };

  // Handle View Document
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewDocumentOpen(true);
  };

  // Handle Delete Document
  const handleDeleteDocument = (documentId) => {
    console.log("Deleting document:", documentId);
  };

  // Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Incomplete":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "Missing":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Incomplete":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Missing":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vault data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Record Vault</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all artwork documentation and certificates
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={() => setIsAddArtworkOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artwork
            </Button>
            <Button variant="outline" onClick={() => setIsUploadDocumentOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complete</p>
                <p className="text-2xl font-bold text-green-600">{completeCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incomplete</p>
                <p className="text-2xl font-bold text-yellow-600">{incompleteCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Missing</p>
                <p className="text-2xl font-bold text-red-600">{missingCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search artworks, artists, or SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterArtist} onValueChange={setFilterArtist}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Artists</SelectItem>
                {Array.from(new Set(vaultData.map(item => item.itemArtist))).map(artist => (
                  <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedItemType} onValueChange={setSelectedItemType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="artwork">Artwork</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
                <SelectItem value="objects">Objects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({vaultData.length})</TabsTrigger>
            <TabsTrigger value="complete">Complete ({completeCount})</TabsTrigger>
            <TabsTrigger value="incomplete">Incomplete ({incompleteCount})</TabsTrigger>
            <TabsTrigger value="missing">Missing ({missingCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Table */}
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.filter(col => col.checked).map((column) => (
                    <TableHead key={column.id} className="whitespace-nowrap">
                      <button
                        className="flex items-center gap-2 hover:text-foreground"
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {displayColumns.filter(col => col.checked).map((column) => (
                      <TableCell key={column.id} className="whitespace-nowrap">
                        {column.id === 'thumbnail' ? (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{item.itemTitle}</p>
                              <p className="text-sm text-muted-foreground">{item.sku}</p>
                            </div>
                          </div>
                        ) : column.id === 'status' ? (
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                        ) : column.id === 'documents' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {item.totalDocuments || 0} / {item.totalDocuments || 0}
                            </span>
                            {item.missingDocuments > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {item.missingDocuments} missing
                              </Badge>
                            )}
                          </div>
                        ) : column.id === 'lastUpdated' ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.lastUpdated}</span>
                          </div>
                        ) : (
                          item[column.id] || '-'
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDocument(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDocument(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Document
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => router.push(`/inventory/${item.id}`)}
                            className="text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in Inventory
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Artwork Modal */}
      <Dialog open={isAddArtworkOpen} onOpenChange={setIsAddArtworkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Artwork</DialogTitle>
            <DialogDescription>
              Add a new artwork to the record vault for documentation tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newArtwork.title}
                onChange={(e) => setNewArtwork(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter artwork title"
              />
            </div>
            <div>
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={newArtwork.artist}
                onChange={(e) => setNewArtwork(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Enter artist name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={newArtwork.year}
                  onChange={(e) => setNewArtwork(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="Enter year"
                />
              </div>
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  value={newArtwork.medium}
                  onChange={(e) => setNewArtwork(prev => ({ ...prev, medium: e.target.value }))}
                  placeholder="Enter medium"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newArtwork.description}
                onChange={(e) => setNewArtwork(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddArtworkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddArtwork}>
              Add Artwork
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={isUploadDocumentOpen} onOpenChange={setIsUploadDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document for an artwork in the vault.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="docTitle">Document Title</Label>
              <Input
                id="docTitle"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
              />
            </div>
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <Select value={newDocument.type} onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="docDescription">Description</Label>
              <Textarea
                id="docDescription"
                value={newDocument.description}
                onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="docFile">File</Label>
              <Input
                id="docFile"
                type="file"
                onChange={(e) => setNewDocument(prev => ({ ...prev, file: e.target.files[0] }))}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDocumentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Modal */}
      {selectedDocument && (
        <EditDocumentModal
          open={isEditDocumentOpen}
          onOpenChange={setIsEditDocumentOpen}
          document={selectedDocument}
          onSave={handleEditDocument}
        />
      )}

      {/* View Document Modal */}
      {selectedDocument && (
        <ViewDocumentModal
          open={isViewDocumentOpen}
          onOpenChange={setIsViewDocumentOpen}
          document={selectedDocument}
        />
      )}
    </div>
  );
}
