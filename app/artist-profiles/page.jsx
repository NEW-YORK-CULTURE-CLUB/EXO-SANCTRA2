// app/artist-profiles/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter as FilterIcon,
  Mail,
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  ArrowUpDown,
  Menu,
  User,
  FileText,
  Link2,
  Trash2
} from "lucide-react";
import { artistProfilesData, columnOptionsArtists } from "@/data/artistProfilesData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArtistService } from "@/lib/artist-service";
import { useToast } from "@/hooks/use-toast";
import { ArtistProfilesPageSkeleton } from "@/components/artist-profiles-skeleton";
// import { useAuth } from '@/contexts/auth-context'; // Disabled - using mock data
// import { useGallery } from '@/contexts/gallery-context'; // Disabled - using mock data
// import { collection, query, where, getDocs } from 'firebase/firestore'; // Disabled - using mock data
// import { db } from '@/lib/firebase'; // Disabled - using mock data

export default function ArtistProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columnOptionsArtists);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoGallery, setIsDemoGallery] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  // const { user, userData } = useAuth(); // Disabled - using mock data
  // const { gallery, loading: galleryLoading } = useGallery(); // Disabled - using mock data
  const user = { uid: 'mock-user', email: 'demo@exhibitiq.com' }; // Mock user
  const userData = { fullname: 'Demo User', role: ['admin'] }; // Mock user data
  const gallery = { galleryId: 'demo-gallery', name: 'Demo Gallery' }; // Mock gallery
  const galleryLoading = false; // No loading needed

  // Load artist data based on gallery type
  const loadArtistData = useCallback(async () => {
    if (!user || !gallery) return;
    
    setLoading(true);
    try {
      // Check if this is the Demo gallery
      if (gallery.name === "Demo" || gallery.name === "Demo Gallery" || gallery.email === "demo@exhibit-iq.com") {
        setIsDemoGallery(true);
        setArtists(artistProfilesData);
      } else {
        // Fetch real artists from Firestore
        setIsDemoGallery(false);
        
        const artistProfiles = await ArtistService.getArtistProfilesByGalleryId(gallery.id);
        setArtists(artistProfiles);
      }
    } catch (error) {
      console.error('Error loading artist data:', error);
      // Fallback to demo data if there's an error
      setIsDemoGallery(true);
      setArtists(artistProfilesData);
    } finally {
      setLoading(false);
    }
  }, [user, gallery]);

  useEffect(() => {
    loadArtistData();
  }, [loadArtistData]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'NA'; // Return 'NA' for No Avatar when name is undefined/null
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter and sort data
  let filteredData = artists.filter(artist => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      artist.name.toLowerCase().includes(searchLower) ||
      artist.email.toLowerCase().includes(searchLower) ||
      (artist.specialty && artist.specialty.toLowerCase().includes(searchLower)) ||
      (artist.city && artist.city.toLowerCase().includes(searchLower)) ||
      (artist.phone && artist.phone.includes(searchLower));
    
    const matchesSpecialty = filterSpecialty === "" || 
      (artist.specialty && artist.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()));
    
    return matchesSearch && matchesSpecialty;
  });

  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      // Handle createdAt field (timestamp)
      if (sortColumn === 'createdAt') {
        // Convert to Date objects if they're timestamps
        aValue = aValue?.toDate ? aValue.toDate() : new Date(aValue);
        bValue = bValue?.toDate ? bValue.toDate() : new Date(bValue);
      }
      
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
  }, [searchQuery, filterSpecialty]);

  const displayColumns = visibleColumns;

  if (loading) {
    return <ArtistProfilesPageSkeleton />;
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Gallery Selected</h2>
          <p className="text-muted-foreground">Please select a gallery to view artist profiles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-4 -mt-5 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          <span className="text-muted-foreground">Artist </span>
          <span className="text-foreground">Profiles</span>
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          {isDemoGallery 
            ? "Manage artist information, tax documents, and contact details for your gallery."
            : `Manage artist information, tax documents, and contact details for ${gallery?.name || 'your gallery'}.`
          }
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isMobile ? "Search..." : "Search by name, email, or specialty..."}
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
            <Mail className="h-4 w-4 mr-0 lg:mr-2" />
            <span className="">Invite Artist</span>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/artist-profiles/new">
              <Plus className="h-4 w-4 mr-0 lg:mr-2" />
              <span className="">Add Artist</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Input
            placeholder="Filter by specialty..."
            className="w-full lg:w-48"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
          <span className="text-xs lg:text-sm text-muted-foreground">
            {filteredData.length} artist(s) found.
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Name <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {displayColumns.find(col => col.id === 'email')?.checked && (
                <TableHead>Email</TableHead>
              )}
              <TableHead>Phone</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('specialty')}>
                <div className="flex items-center gap-1">
                  Specialty <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {displayColumns.find(col => col.id === 'location')?.checked && (
                <TableHead>Location</TableHead>
              )}
              <TableHead>Status</TableHead>
              {displayColumns.find(col => col.id === 'taxInfoComplete')?.checked && (
                <TableHead>Tax Info</TableHead>
              )}
              {displayColumns.find(col => col.id === 'profileComplete')?.checked && (
                <TableHead>Profile</TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No artists found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((artist) => (
                <TableRow key={artist.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarImage className="object-cover" src={artist.photoURL} />
                        <AvatarFallback className="bg-muted">
                          {getInitials(artist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 m-0 cursor-pointer"
                        onClick={() => router.push(`/artist-profiles/${artist.id}`)}
                        type="button"
                      >
                        {artist.name}
                      </button>
                    </div>
                  </TableCell>
                  {displayColumns.find(col => col.id === 'email')?.checked && (
                    <TableCell>{artist.email}</TableCell>
                  )}
                  <TableCell>
                    <div>
                      {artist.phone}
                    </div>
                  </TableCell>
                  <TableCell>{artist.specialty}</TableCell>
                  {displayColumns.find(col => col.id === 'location')?.checked && (
                    <TableCell>{artist.city} {artist.country}</TableCell>
                  )}
                  <TableCell>
                    <Badge 
                      className={artist.status === "Active" 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }
                    >
                      {artist.status}
                    </Badge>
                  </TableCell>
                  {displayColumns.find(col => col.id === 'taxInfoComplete')?.checked && (
                    <TableCell>
                      <Badge 
                        variant={artist.taxInfo === "Complete" ? "default" : "secondary"}
                        className={artist.taxInfo === "Complete" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                      >
                        {artist.taxInfo}
                      </Badge>
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'profileComplete')?.checked && (
                    <TableCell>
                      <Badge 
                        variant={artist.profile === "Complete" ? "default" : "secondary"}
                        className={artist.profile === "Complete" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                      >
                        {artist.profile}
                      </Badge>
                    </TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/artist-profiles/${artist.id}`)}>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Artist
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Tax Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="h-4 w-4 mr-2" />
                          Send Profile Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Profile
                        </DropdownMenuItem>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
        <span className="text-sm text-muted-foreground text-center lg:text-left">
          {filteredData.length} artist(s) found.
        </span>
        <div className="flex items-center justify-center lg:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm mx-2">
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
    </div>
  );
}