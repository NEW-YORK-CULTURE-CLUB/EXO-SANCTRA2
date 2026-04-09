import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
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
  MoreHorizontal, 
  ChevronDown,
  Copy,
  Eye,
  Edit,
  Trash,
  ArrowUpDown,
  Calendar,
  Package,
  Ruler,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  User,
  CalendarDays,
  PenTool,
  Shield,
  Hash,
  Star,
  Globe
} from "lucide-react";
import Link from "next/link";

const MemorabiliaTab = ({
  data,
  selectedArtworks,
  setSelectedArtworks,
  handleDeleteItem,
  handleToggleDigitalFloor,
  handleCopySKU,
  handleSelectAll,
  handleSelectArtwork,
  handleColumnVisibility,
  handleSort,
  formatPrice,
  visibleColumns,
  sortColumn,
  sortDirection,
  currentPage,
  setCurrentPage,
  isMobile,
  searchQuery,
  filterCreator,
  setFilterCreator,
  handleBulkDigitalFloorToggle,
  handleBulkDelete
}) => {
  // Filter and sort data specifically for memorabilia
  let filteredData = data.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      item.title?.toLowerCase().includes(searchLower) ||
      item.associatedPersons?.toLowerCase().includes(searchLower) ||
      item.associatedTeamOrganization?.toLowerCase().includes(searchLower) ||
      item.eventNameDate?.toLowerCase().includes(searchLower) ||
      item.autographDetails?.toLowerCase().includes(searchLower) ||
      item.sku?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.eraPeriod?.toLowerCase().includes(searchLower);
    
    const matchesCreator = filterCreator === "" || 
      item.associatedPersons?.toLowerCase().includes(filterCreator.toLowerCase()) ||
      item.associatedTeamOrganization?.toLowerCase().includes(filterCreator.toLowerCase());
    
    return matchesSearch && matchesCreator;
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
  const itemsPerPage = isMobile ? 5 : 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCreator, setCurrentPage]);

  // Mobile card component for memorabilia
  const MobileCard = ({ item }) => (
    <div className="bg-card border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header with checkbox and SKU */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedArtworks.includes(item.id)}
            onCheckedChange={(checked) => handleSelectArtwork(item.id, checked)}
          />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-mono">SKU</span>
            <span className="font-medium text-sm">{item.sku}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-medium">Actions</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopySKU(item.sku)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy SKU
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/inventory/${item.sku}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/inventory/${item.sku}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleDigitalFloor(item)}>
              {item.digitalFloor === "Active" ? (
                <>
                  <span className="text-orange-600">Remove from Digital Floor</span>
                </>
              ) : (
                <>
                  <span className="text-green-600">Add to Digital Floor</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteItem(item)}
              className="text-red-600 cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title and Associated Person/Team */}
      <div className="space-y-2">
        <Link href={`/inventory/${item.sku}`} className="block">
          <h3 className="font-semibold text-base text-blue-600 hover:underline line-clamp-2">
            {item.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="font-medium">Associated:</span>
          <span>{item.associatedPersons || item.associatedTeamOrganization || 'N/A'}</span>
        </div>
      </div>

      {/* Memorabilia-specific Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {visibleColumns.find(col => col.id === 'year')?.checked && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Event Date:</span>
            <span className="font-medium">{item.eventNameDate || 'N/A'}</span>
          </div>
        )}
        
        {visibleColumns.find(col => col.id === 'medium')?.checked && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Era/Period:</span>
            <span className="font-medium line-clamp-1">{item.eraPeriod || 'N/A'}</span>
          </div>
        )}
        
        {visibleColumns.find(col => col.id === 'size')?.checked && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium line-clamp-1">
              {item.size || (item.width && item.height ? `${item.width} x ${item.height}` : 'N/A')}
            </span>
          </div>
        )}
        
        {visibleColumns.find(col => col.id === 'price')?.checked && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{formatPrice(item.price)}</span>
          </div>
        )}
        
        {visibleColumns.find(col => col.id === 'priceType')?.checked && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Type:</span>
            <Badge 
              variant={item.priceType === "Fixed" ? "default" : "secondary"}
              className={item.priceType === "Fixed" ? "bg-primary" : ""}
            >
              {item.priceType}
            </Badge>
          </div>
        )}
        
        {visibleColumns.find(col => col.id === 'location')?.checked && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium line-clamp-1">{item.location || 'N/A'}</span>
          </div>
        )}
        {visibleColumns.find(col => col.id === 'condition')?.checked && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Condition:</span>
            <Badge variant="outline" className="text-xs">
              {item.condition || 'N/A'}
            </Badge>
          </div>
        )}
      </div>

      {/* Memorabilia-specific fields: Autograph, Authentication, Historical */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        {item.autographDetails && (
          <Badge variant="outline" className="text-xs">
            <PenTool className="h-3 w-3 mr-1" />
            Autograph
          </Badge>
        )}
        {item.authenticationProvider && (
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            {item.authenticationProvider}
          </Badge>
        )}
        {item.certificateOfAuthenticityNumber && (
          <Badge variant="outline" className="text-xs">
            <Hash className="h-3 w-3 mr-1" />
            COA: {item.certificateOfAuthenticityNumber}
          </Badge>
        )}
        {item.historicalSignificanceNotes && (
          <Badge variant="outline" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Historical
          </Badge>
        )}
        {item.ticketPassNumber && (
          <Badge variant="outline" className="text-xs">
            <CalendarDays className="h-3 w-3 mr-1" />
            #{item.ticketPassNumber}
          </Badge>
        )}
        {item.commemorativeEditionDetails && (
          <Badge variant="outline" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            Commemorative
          </Badge>
        )}
      </div>

      {/* Digital Floor Status */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Digital Floor:</span>
          <Badge 
            className={item.digitalFloor === "Active" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }
          >
            {item.digitalFloor === "Active" ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Inactive
              </div>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Input
            placeholder="Filter by person/team/organization..."
            className="w-full lg:w-48"
            value={filterCreator}
            onChange={(e) => setFilterCreator(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
          <span className="text-xs lg:text-sm text-muted-foreground">
            {selectedArtworks.length} of {filteredData.length} memorabilia item(s) selected.
          </span>
          
          {/* Bulk Actions */}
          {selectedArtworks.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDigitalFloorToggle}
                className="text-green-600 hover:text-green-700"
              >
                Toggle Digital Floor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700"
              >
                Delete Selected
              </Button>
            </div>
          )}
          
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
            {!isMobile && (
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
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards Layout */}
      {isMobile && (
        <div className="space-y-4">
          {paginatedData.map((item) => (
            <MobileCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Desktop Table Layout */}
      {!isMobile && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedArtworks.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-1">
                    SKU <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">
                    Title <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Associated Person/Team</TableHead>
                <TableHead>Event/Date</TableHead>
                {visibleColumns.find(col => col.id === 'year')?.checked && (
                  <TableHead>Era/Period</TableHead>
                )}
                {visibleColumns.find(col => col.id === 'size')?.checked && (
                  <TableHead>Size/Dimensions</TableHead>
                )}
                {visibleColumns.find(col => col.id === 'price')?.checked && (
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      Price <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                )}
                {visibleColumns.find(col => col.id === 'priceType')?.checked && (
                  <TableHead>Price Type</TableHead>
                )}
                {visibleColumns.find(col => col.id === 'location')?.checked && (
                  <TableHead>Location</TableHead>
                )}
                {visibleColumns.find(col => col.id === 'condition')?.checked && (
                  <TableHead>Condition</TableHead>
                )}
                <TableHead>Details</TableHead>
                <TableHead>Digital Floor</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedArtworks.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectArtwork(item.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>
                    <Link href={`/inventory/${item.sku}`} className="text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.associatedPersons || item.associatedTeamOrganization || 'N/A'}
                  </TableCell>
                  <TableCell>{item.eventNameDate || 'N/A'}</TableCell>
                  {visibleColumns.find(col => col.id === 'year')?.checked && (
                    <TableCell>{item.eraPeriod}</TableCell>
                  )}
                  {visibleColumns.find(col => col.id === 'size')?.checked && (
                    <TableCell>
                      {item.size || (item.width && item.height ? `${item.width} x ${item.height}` : 'N/A')}
                    </TableCell>
                  )}
                  {visibleColumns.find(col => col.id === 'price')?.checked && (
                    <TableCell>{formatPrice(item.price)}</TableCell>
                  )}
                  {visibleColumns.find(col => col.id === 'priceType')?.checked && (
                    <TableCell>
                      <Badge 
                        variant={item.priceType === "Fixed" ? "default" : "secondary"}
                        className={item.priceType === "Fixed" ? "bg-primary" : ""}
                      >
                        {item.priceType}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.find(col => col.id === 'location')?.checked && (
                    <TableCell>{item.location}</TableCell>
                  )}
                  {visibleColumns.find(col => col.id === 'condition')?.checked && (
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.condition || 'N/A'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {item.autographDetails && (
                        <span>Autograph: {item.autographDetails}</span>
                      )}
                      {item.authenticationProvider && (
                        <span>Auth: {item.authenticationProvider}</span>
                      )}
                      {item.certificateOfAuthenticityNumber && (
                        <span>COA: {item.certificateOfAuthenticityNumber}</span>
                      )}
                      {item.ticketPassNumber && (
                        <span>Ticket: #{item.ticketPassNumber}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={item.digitalFloor === "Active" 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }
                    >
                      {item.digitalFloor}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopySKU(item.sku)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy SKU
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href={`/inventory/${item.sku}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href={`/inventory/${item.sku}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleDigitalFloor(item)}>
                          {item.digitalFloor === "Active" ? (
                            <>
                              <span className="text-orange-600">Remove from Digital Floor</span>
                            </>
                          ) : (
                            <>
                              <span className="text-green-600">Add to Digital Floor</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer Pagination - Mobile */}
      {isMobile && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">
            {selectedArtworks.length} of {filteredData.length} memorabilia item(s) selected
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
      )}

      {/* Footer Pagination - Desktop */}
      {!isMobile && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            {selectedArtworks.length} of {filteredData.length} memorabilia item(s) selected.
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
      )}
    </>
  );
};

export default MemorabiliaTab;
