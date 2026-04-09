"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter as FilterIcon,
  Mail,
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  ArrowUpDown,
  Crown,
  DollarSign,
  Palette,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  Award,
  Target,
  Activity
} from "lucide-react";
import { collectorsData, columnOptionsCollectors, collectorStats } from "@/data/collectorsData";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Collectors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columnOptionsCollectors);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterTier, setFilterTier] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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

  const itemsPerPage = 10; // Show same number of items on all screen sizes

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
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort data
  let filteredData = collectorsData.filter(collector => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      collector.name.toLowerCase().includes(searchLower) ||
      collector.email.toLowerCase().includes(searchLower) ||
      collector.preferredStyles.some(style => style.toLowerCase().includes(searchLower)) ||
      collector.location.toLowerCase().includes(searchLower) ||
      collector.phone.includes(searchLower);
    
    const matchesTier = filterTier === "" || 
      collector.tier.toLowerCase().includes(filterTier.toLowerCase());
    
    const matchesStatus = filterStatus === "" || 
      collector.status.toLowerCase().includes(filterStatus.toLowerCase());
    
    return matchesSearch && matchesTier && matchesStatus;
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
  }, [searchQuery, filterTier, filterStatus]);

  const displayColumns = visibleColumns;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-6 -mt-5">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          <span className="text-muted-foreground">Collector </span>
          <span className="text-foreground">Management</span>
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Manage your collector relationships, track engagement, and monitor collection values.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Collectors</p>
                <p className="text-2xl font-bold">{collectorStats.totalCollectors}</p>
              </div>
              {/* <Users className="h-8 w-8 text-blue-500" /> */}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Collectors</p>
                <p className="text-2xl font-bold">{collectorStats.vipCollectors}</p>
              </div>
              {/* <Crown className="h-8 w-8 text-yellow-500" /> */}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(collectorStats.totalRevenue)}</p>
              </div>
              {/* <DollarSign className="h-8 w-8 text-green-500" /> */}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Collection Value</p>
                <p className="text-2xl font-bold">{formatCurrency(collectorStats.averageCollectionValue)}</p>
              </div>
              {/* <TrendingUp className="h-8 w-8 text-purple-500" /> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-full lg:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or interests..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            <span>Send Newsletter</span>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/collectors/new">
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Collector</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 lg:gap-4">
          <Input
            placeholder="Filter by tier..."
            className="w-full lg:w-48"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          />
          <Input
            placeholder="Filter by status..."
            className="w-full lg:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
          <span className="text-xs text-muted-foreground">
            {filteredData.length} collector(s) found.
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
            <span className="text-xs">
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
      <div className="rounded-lg border bg-card overflow-x-auto min-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Collector <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {displayColumns.find(col => col.id === 'email')?.checked && (
                <TableHead className="text-xs">Email</TableHead>
              )}
              {displayColumns.find(col => col.id === 'tier')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('tier')}>
                  <div className="flex items-center gap-1">
                    Tier <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              {displayColumns.find(col => col.id === 'totalSpent')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('totalSpent')}>
                  <div className="flex items-center gap-1">
                    Total Spent <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              {displayColumns.find(col => col.id === 'collectionValue')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('collectionValue')}>
                  <div className="flex items-center gap-1">
                    Collection Value <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              {displayColumns.find(col => col.id === 'artworksOwned')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('artworksOwned')}>
                  <div className="flex items-center gap-1">
                    Artworks <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              <TableHead className="text-xs">Interests</TableHead>
              {displayColumns.find(col => col.id === 'lastPurchase')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('lastPurchase')}>
                  <div className="flex items-center gap-1">
                    Last Purchase <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              {displayColumns.find(col => col.id === 'lastVisit')?.checked && (
                <TableHead className="cursor-pointer text-xs" onClick={() => handleSort('lastVisit')}>
                  <div className="flex items-center gap-1">
                    Last Visit <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              )}
              <TableHead className="text-xs">Status</TableHead>
              {displayColumns.find(col => col.id === 'vipStatus')?.checked && (
                <TableHead className="text-xs">VIP</TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground text-xs">
                  No collectors found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((collector) => (
                <TableRow key={collector.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage className="object-cover" src={collector.avatar} />
                        <AvatarFallback className="bg-muted">
                          {getInitials(collector.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <button
                          className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 m-0 cursor-pointer text-left text-xs"
                          onClick={() => router.push(`/collectors/${collector.id}`)}
                          type="button"
                        >
                          {collector.name}
                        </button>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {collector.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {displayColumns.find(col => col.id === 'email')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">{collector.email}</TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'tier')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">
                      <Badge 
                        variant={collector.tier === "VIP" ? "default" : "secondary"}
                        className={collector.tier === "VIP" ? "bg-yellow-500 hover:bg-yellow-600 text-white text-xs" : "text-xs"}
                      >
                        {collector.tier}
                      </Badge>
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'totalSpent')?.checked && (
                    <TableCell className="font-medium text-xs whitespace-nowrap">
                      {formatCurrency(collector.totalSpent)}
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'collectionValue')?.checked && (
                    <TableCell className="font-medium text-xs whitespace-nowrap">
                      {formatCurrency(collector.collectionValue)}
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'artworksOwned')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3 text-muted-foreground" />
                        {collector.artworksOwned}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-xs whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {collector.preferredStyles.slice(0, 2).map((style, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                      {collector.preferredStyles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{collector.preferredStyles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {displayColumns.find(col => col.id === 'lastPurchase')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(collector.lastPurchase).toLocaleDateString()}
                      </div>
                    </TableCell>
                  )}
                  {displayColumns.find(col => col.id === 'lastVisit')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        {new Date(collector.lastVisit).toLocaleDateString()}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-xs whitespace-nowrap">
                    <Badge 
                      className={collector.status === "Active" 
                        ? "bg-green-500 hover:bg-green-600 text-white text-xs" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                      }
                    >
                      {collector.status}
                    </Badge>
                  </TableCell>
                  {displayColumns.find(col => col.id === 'vipStatus')?.checked && (
                    <TableCell className="text-xs whitespace-nowrap">
                      {collector.vipStatus && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-xs whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="font-medium text-xs">Actions</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/collectors/${collector.id}`)} className="text-xs">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Collector
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <Heart className="h-4 w-4 mr-2" />
                          View Wishlist
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <Award className="h-4 w-4 mr-2" />
                          Manage VIP Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs">
                          <Target className="h-4 w-4 mr-2" />
                          Send Recommendations
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
        <span className="text-xs text-muted-foreground text-center lg:text-left">
          {filteredData.length} collector(s) found.
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
          <span className="text-xs mx-2">
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