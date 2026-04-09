"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { patrons as data } from '@/data/patronManagementData';
import { AddPatronModal } from '@/components/add-patron-modal';
import { SharedArtworkModal } from '@/components/shared-artwork-modal';
import { AssignArtworkModal } from '@/components/assign-artwork-modal';
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  CaretSortIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  HeartIcon,
  ImageIcon,
  EyeOpenIcon,
  LockOpen1Icon,
  PlusIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
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
  Menu
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context'; // Disabled - using mock data
// import { useGallery } from '@/contexts/gallery-context'; // Disabled - using mock data
// import { collection, query, where, getDocs } from 'firebase/firestore'; // Disabled - using mock data
// import { db } from '@/lib/firebase'; // Disabled - using mock data


function SendEmailModal({ open, onOpenChange, selectedPatrons }) {
    if (!selectedPatrons || selectedPatrons.length === 0) return null;
    const recipients = selectedPatrons.map(p => p.name).join(', ');
    const hasOptedOut = selectedPatrons.some(p => p.marketing === 'Opted Out');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Send Bulk Email</DialogTitle>
                    <DialogDescription>Send an email to {selectedPatrons.length} selected patron(s)</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div><Label>Recipients</Label><p className="text-sm text-muted-foreground">{recipients}</p></div>
                    <div><Label htmlFor="template">Email Template</Label><Select><SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger><SelectContent><SelectItem value="new-artwork">New Artwork Arrival</SelectItem><SelectItem value="exhibition-invite">Exhibition Invitation</SelectItem><SelectItem value="newsletter">Gallery Newsletter</SelectItem><SelectItem value="event-invite">Event Invitation</SelectItem><SelectItem value="custom">Custom Message</SelectItem></SelectContent></Select></div>
                    <div><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="Email Subject" /></div>
                    <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} placeholder="Type your message here." /></div>
                    {hasOptedOut && (<Alert variant="destructive"><ExclamationTriangleIcon className="h-4 w-4" /><AlertTitle>Marketing Consent Warning</AlertTitle><AlertDescription>Some selected patrons have opted out of marketing communications.<div className="flex items-center mt-2"><Checkbox id="include-opted-out" /><Label htmlFor="include-opt-out" className="ml-2 text-xs">Include patrons who have opted out (not recommended)</Label></div></AlertDescription></Alert>)}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button>Send to {selectedPatrons.length} Patron(s)</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function PatronManagementPage() {
    const router = useRouter();
    // const { user, userData } = useAuth(); // Disabled - using mock data
    // const { gallery } = useGallery(); // Disabled - using mock data
    const user = { uid: 'mock-user', email: 'demo@exhibitiq.com' }; // Mock user
    const userData = { fullname: 'Demo User', role: ['admin'] }; // Mock user data
    const gallery = { galleryId: 'demo-gallery', name: 'Demo Gallery' }; // Mock gallery
    const [patrons, setPatrons] = useState(data);
    const [sorting, setSorting] = useState({ key: 'name', order: 'asc' });
    const [columnFilters, setColumnFilters] = useState('');
    const [columnVisibility, setColumnVisibility] = useState({
        email: true,
        phone: true,
        status: true,
        type: true,
        lastActivity: true,
        interests: true,
        marketing: true,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [activeTab, setActiveTab] = useState('All Patrons');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddPatronModalOpen, setIsAddPatronModalOpen] = useState(false);
    const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
    const [isSharedArtworkModalOpen, setIsSharedArtworkModalOpen] = useState(false);
    const [isAssignArtworkModalOpen, setIsAssignArtworkModalOpen] = useState(false);
    const [activePatron, setActivePatron] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDemoGallery, setIsDemoGallery] = useState(false);
    const rowsPerPage = 7;

    // Load patron data based on gallery type
    const loadPatronData = useCallback(async () => {
        if (!user || !gallery) return;
        
        setIsLoading(true);
        try {
            // Check if this is the Demo gallery
            if (gallery.name === "Demo" || gallery.name === "Demo Gallery" || gallery.email === "demo@exhibit-iq.com") {
                setIsDemoGallery(true);
                setPatrons(data);
            } else {
                // Fetch real patrons from users collection
                setIsDemoGallery(false);
                
                const usersRef = collection(db, 'users');
                // Get all users and filter client-side for better reliability
                const querySnapshot = await getDocs(usersRef);
                const realPatrons = [];
                
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    // Check if user has this gallery in their patronTo array
                    const patronData = userData.patronTo?.find(p => p.galleryId === gallery.id);
                    
                    if (patronData) {
                        console.log('Found patron for gallery:', gallery.id, 'User:', userData.email);
                        realPatrons.push({
                            id: doc.id,
                            name: userData.fullname || userData.email || 'Unknown',
                            email: userData.email,
                            phone: userData.phone || '',
                            status: patronData.status || 'Active',
                            type: userData.patronType || 'Collector',
                            lastActivity: patronData.joinedAt ? new Date(patronData.joinedAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString(),
                            interests: userData.interests || [],
                            marketing: userData.marketingPreference || 'Opted In',
                            vip: userData.vip || false,
                            avatar: userData.photoURL || '/placeholder-user.jpg',
                            notes: userData.notes || '',
                            address: userData.address || {}
                        });
                    }
                });
                
                console.log(`Found ${realPatrons.length} patrons for gallery ${gallery.id} (${gallery.name})`);
                
                setPatrons(realPatrons);
            }
        } catch (error) {
            console.error('Error loading patron data:', error);
            // Fallback to demo data if there's an error
            setIsDemoGallery(true);
            setPatrons(data);
        } finally {
            setIsLoading(false);
        }
    }, [user, gallery]);

    useEffect(() => {
        loadPatronData();
    }, [loadPatronData]);
  
    const filteredAndSortedPatrons = (() => {
        let filteredData = patrons;
        if (activeTab === 'Active') filteredData = patrons.filter(p => p.status === 'Active');
        else if (activeTab === 'VIP') filteredData = patrons.filter(p => p.vip);
        else if (activeTab === 'Recent Activity') filteredData = [...patrons].sort((a,b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  
        if (columnFilters) {
            filteredData = filteredData.filter(p =>
                p.name.toLowerCase().includes(columnFilters.toLowerCase()) ||
                p.email.toLowerCase().includes(columnFilters.toLowerCase()) ||
                p.interests.some(i => i.toLowerCase().includes(columnFilters.toLowerCase()))
            );
        }
      
        return [...filteredData].sort((a, b) => {
            if (!sorting.key) return 0;
            const aValue = a[sorting.key];
            const bValue = b[sorting.key];
            if (aValue < bValue) return sorting.order === 'asc' ? -1 : 1;
            if (aValue > bValue) return sorting.order === 'asc' ? 1 : -1;
            return 0;
        });
    })();

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, columnFilters, sorting]);
  
    const handleSort = (key) => {
      const order = sorting.key === key && sorting.order === 'asc' ? 'desc' : 'asc';
      setSorting({ key, order });
    };

    const toggleRowSelection = (id) => setRowSelection(prev => ({...prev, [id]: !prev[id]}));

    const paginatedPatrons = filteredAndSortedPatrons.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const toggleAllRowsSelected = () => {
        const allSelected = paginatedPatrons.every(p => rowSelection[p.id]);
        const newRowSelection = {...rowSelection};
        paginatedPatrons.forEach(p => newRowSelection[p.id] = !allSelected);
        setRowSelection(newRowSelection);
    }

    const openModal = (modalSetter, patron) => {
        setActivePatron(patron);
        modalSetter(true);
    }

    const selectedPatrons = patrons.filter(p => rowSelection[p.id]);
    const selectedRowCount = selectedPatrons.length;
    const totalPages = Math.ceil(filteredAndSortedPatrons.length / rowsPerPage);
    const isAllPageRowsSelected = paginatedPatrons.length > 0 && paginatedPatrons.every(p => rowSelection[p.id]);

  if (isLoading) {
    return (
      <div className="w-full -mt-5">
        {/* Header Skeleton */}
        <div className="lg:flex items-center justify-between space-y-2">
          <div>
            <div className="h-8 bg-muted/20 rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted/20 rounded w-96 mb-2"></div>
            {!isDemoGallery && (
              <div className="mt-2 p-3 bg-muted/20 rounded-lg">
                <div className="h-4 bg-muted/30 rounded w-48"></div>
              </div>
            )}
          </div>
          <div className="flex items-center lg:pt-0 pt-2 space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted/20 rounded w-24"></div>
            ))}
          </div>
        </div>

        {/* Badge Tabs Skeleton */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-muted/20 rounded w-24"></div>
            ))}
          </div>
        </div>

        {/* Main Tabs Skeleton */}
        <div className="mt-4">
          <div className="grid w-full max-w-[800px] grid-cols-4 gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted/20 rounded"></div>
            ))}
          </div>
          
          <div className="py-2">
            {/* Filter Bar Skeleton */}
            <div className="flex items-center justify-between py-2 mb-4">
              <div className="flex gap-2">
                <div className="h-10 bg-muted/20 rounded w-64"></div>
                <div className="h-10 bg-muted/20 rounded w-32"></div>
              </div>
              <div className="h-10 bg-muted/20 rounded w-24"></div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border">
              <div className="p-4">
                {/* Table Header Skeleton */}
                <div className="grid grid-cols-9 gap-4 mb-4">
                  <div className="h-4 bg-muted/20 rounded w-4"></div>
                  <div className="h-4 bg-muted/20 rounded w-16"></div>
                  <div className="h-4 bg-muted/20 rounded w-20"></div>
                  <div className="h-4 bg-muted/20 rounded w-16"></div>
                  <div className="h-4 bg-muted/20 rounded w-12"></div>
                  <div className="h-4 bg-muted/20 rounded w-16"></div>
                  <div className="h-4 bg-muted/20 rounded w-20"></div>
                  <div className="h-4 bg-muted/20 rounded w-24"></div>
                  <div className="h-4 bg-muted/20 rounded w-16"></div>
                </div>
                
                {/* Table Rows Skeleton */}
                {[...Array(7)].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-9 gap-4 mb-3 py-2">
                    <div className="h-4 bg-muted/20 rounded w-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-muted/20 rounded-full"></div>
                      <div className="h-4 bg-muted/20 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-muted/20 rounded w-32"></div>
                    <div className="h-4 bg-muted/20 rounded w-20"></div>
                    <div className="h-4 bg-muted/20 rounded w-16"></div>
                    <div className="h-4 bg-muted/20 rounded w-20"></div>
                    <div className="h-4 bg-muted/20 rounded w-24"></div>
                    <div className="flex gap-1">
                      <div className="h-5 bg-muted/20 rounded w-12"></div>
                      <div className="h-5 bg-muted/20 rounded w-8"></div>
                    </div>
                    <div className="h-4 bg-muted/20 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="h-4 bg-muted/20 rounded w-32"></div>
              <div className="space-x-2">
                <div className="h-8 bg-muted/20 rounded w-20"></div>
                <div className="h-8 bg-muted/20 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full -mt-5">
      <div className="lg:flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-muted-foreground">Patron </span>
            <span className="text-foreground">Management</span>
          </h2>
          <p className="text-muted-foreground">
            {isDemoGallery 
              ? "Manage collector and patron relationships for your gallery."
              : `Manage patron relationships for ${gallery?.name || 'your gallery'}.`
            }
          </p>
          {/* {!isDemoGallery && gallery && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Gallery:</strong> {gallery.name} ({gallery.email})
              </p>
            </div>
          )} */}
        </div>
        <div className="flex items-center lg:pt-0 pt-2 space-x-2">
          <Button variant="outline"><DownloadIcon className="mr-2 h-4 w-4"/>Export</Button>
          <Button variant="outline" onClick={() => setIsSendEmailModalOpen(true)} disabled={selectedRowCount === 0}><EnvelopeClosedIcon className="mr-2 h-4 w-4"/>Send Email</Button>
          <Button onClick={() => setIsAddPatronModalOpen(true)}><PlusIcon className="mr-2 h-4 w-4"/>Add Patron</Button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center"><div className="flex gap-2">
          <Badge variant={activeTab === 'All Patrons' ? 'default' : 'outline'} className="p-2 px-4 cursor-pointer text-xs font-normal" onClick={() => setActiveTab('All Patrons')}>All Patrons: {patrons.length}</Badge>
          <Badge variant={activeTab === 'Active' ? 'default' : 'outline'} className="p-2 px-4 cursor-pointer text-xs font-normal" onClick={() => setActiveTab('Active')}>Active: {patrons.filter(p=>p.status === 'Active').length}</Badge>
          <Badge variant={activeTab === 'VIP' ? 'default' : 'outline'} className="p-2 px-4 cursor-pointer text-xs font-normal" onClick={() => setActiveTab('VIP')}>VIP: {patrons.filter(p=>p.vip).length}</Badge>
          <Badge variant={activeTab === 'Recent Activity' ? 'default' : 'outline'} className="p-2 px-4 cursor-pointer text-xs font-normal" onClick={() => setActiveTab('Recent Activity')}>New This Month: {patrons.filter(p => {
            const lastActivity = new Date(p.lastActivity);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return lastActivity >= oneMonthAgo;
          }).length}</Badge>
      </div></div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full max-w-[800px] grid-cols-4 text-sm"><TabsTrigger value="All Patrons">All Patrons</TabsTrigger><TabsTrigger value="Active">Active</TabsTrigger><TabsTrigger value="VIP">VIP</TabsTrigger><TabsTrigger value="Recent Activity">Recent Activity</TabsTrigger></TabsList>
        <TabsContent value={activeTab}>
          <div className="py-2">
            <div className="flex items-center justify-between py-2">
              <Input placeholder="Filter by type..." value={columnFilters} onChange={(event) => setColumnFilters(event.target.value)} className="max-w-sm mr-5"/>
              {selectedRowCount > 0 ? (
                  <Button onClick={() => setIsSendEmailModalOpen(true)}><EnvelopeClosedIcon className=" h-4 w-4" /> Email Selected ({selectedRowCount})</Button>
              ) : <div/>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" className="ml-auto">Columns <ChevronDownIcon className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">{Object.keys(columnVisibility).map((column) => (<DropdownMenuCheckboxItem key={column} className="capitalize" checked={columnVisibility[column]} onCheckedChange={(value) => setColumnVisibility(prev => ({ ...prev, [column]: !!value }))}>{column}</DropdownMenuCheckboxItem>))}</DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Checkbox checked={isAllPageRowsSelected} onCheckedChange={toggleAllRowsSelected}/></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('name')}>Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    {columnVisibility.email && <TableHead>Email</TableHead>}
                    {columnVisibility.phone && <TableHead>Phone</TableHead>}
                    {columnVisibility.status && <TableHead>Status</TableHead>}
                    {columnVisibility.type && <TableHead>Type</TableHead>}
                    {columnVisibility.lastActivity && <TableHead><Button variant="ghost" onClick={() => handleSort('lastActivity')}>Last Activity <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>}
                    {columnVisibility.interests && <TableHead>Interests</TableHead>}
                    {columnVisibility.marketing && <TableHead>Marketing</TableHead>}
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatrons.length ? (
                    paginatedPatrons.map((patron) => (
                      <TableRow key={patron.id} data-state={rowSelection[patron.id] && "selected"}>
                        <TableCell className="text-xs"><Checkbox checked={rowSelection[patron.id] || false} onCheckedChange={() => toggleRowSelection(patron.id)}/></TableCell>
                        <TableCell className="text-xs"><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarImage src={patron.avatar} alt={patron.name} className="object-cover" /><AvatarFallback>{patron.name.charAt(0)}</AvatarFallback></Avatar><div className="flex items-center gap-1"><button onClick={() => router.push(`/patron-management/${patron.id}`)} className="text-blue-600 hover:underline font-medium bg-transparent border-none p-0 m-0 cursor-pointer">{patron.name}</button>{patron.vip && <Badge variant="secondary">VIP</Badge>}</div></div></TableCell>
                        {columnVisibility.email && <TableCell className="text-xs">{patron.email}</TableCell>}
                        {columnVisibility.phone && <TableCell className="text-xs">{patron.phone}</TableCell>}
                        {columnVisibility.status && <TableCell className="text-xs"><Badge variant={patron.status === "Active" ? "default" : "outline"}>{patron.status}</Badge></TableCell>}
                        {columnVisibility.type && <TableCell className="text-xs">{patron.type}</TableCell>}
                        {columnVisibility.lastActivity && <TableCell className="text-xs">{new Date(patron.lastActivity).toLocaleDateString()}</TableCell>}
                        {columnVisibility.interests && <TableCell className="text-xs"><div className="flex flex-wrap gap-1">{patron.interests.slice(0, 2).map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}{patron.interests.length > 2 && <Badge variant="secondary">+{patron.interests.length - 2}</Badge>}</div></TableCell>}
                        {columnVisibility.marketing && <TableCell className=""><Badge className="text-xs w-24 text-center " variant={patron.marketing === "Opted In" ? "success" : "destructive"}>{patron.marketing}</Badge></TableCell>}
                        <TableCell className="text-xs">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><DotsHorizontalIcon className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => { setRowSelection({[patron.id]: true}); setIsSendEmailModalOpen(true); }}><EnvelopeClosedIcon className="mr-2 h-4 w-4" />Send Email</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openModal(setIsAssignArtworkModalOpen, patron)}><LockClosedIcon className="mr-2 h-4 w-4" />Assign Private Artwork</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openModal(setIsSharedArtworkModalOpen, patron)}><HeartIcon className="mr-2 h-4 w-4" />View Shared Artwork</DropdownMenuItem>
                                    <DropdownMenuItem><ImageIcon className="mr-2 h-4 w-4" />View Albums</DropdownMenuItem>
                                    <DropdownMenuItem><EyeOpenIcon className="mr-2 h-4 w-4" />View Full Profile</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600"><LockOpen1Icon className="mr-2 h-4 w-4" />Opt Out of Marketing</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 3} className="h-24 text-center">No results.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-xs text-muted-foreground">{selectedRowCount} of {filteredAndSortedPatrons.length} row(s) selected.</div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages}>Next</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <AddPatronModal 
        open={isAddPatronModalOpen} 
        onOpenChange={setIsAddPatronModalOpen} 
        onPatronAdded={loadPatronData}
      />
      <SendEmailModal open={isSendEmailModalOpen} onOpenChange={setIsSendEmailModalOpen} selectedPatrons={selectedPatrons} />
      <SharedArtworkModal open={isSharedArtworkModalOpen} onOpenChange={setIsSharedArtworkModalOpen} patronName={activePatron?.name} />
      <AssignArtworkModal open={isAssignArtworkModalOpen} onOpenChange={setIsAssignArtworkModalOpen} patronName={activePatron?.name} />
    </div>
  );
}

