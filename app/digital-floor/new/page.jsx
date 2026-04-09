"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, MoreHorizontal, QrCode, RotateCcw, Archive, X, Upload, Plus, ChevronUp, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const TopActions = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 w-full mb-4 md:flex-row md:gap-2 md:items-center md:absolute md:right-8 md:top-8 md:w-auto md:mb-0 z-10 justify-end">
      <Button
        variant="outline"
        className="flex items-center gap-2 font-medium px-4 py-2 rounded-lg w-full md:w-auto"
        aria-label="Go to QR Code System"
        onClick={() => router.push('/digital-floor')}
      >
        <QrCode className="w-4 h-4" /> QR Code System
      </Button>
      <Button
        className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg hover:bg-primary/90 w-full md:w-auto flex items-center gap-2"
        aria-label="Save Layout"
      >
        <Save className="w-4 h-4" /> Save Layout
      </Button>
    </div>
  );
};

const FloorPlanTab = () => (
  <div className="flex flex-col md:flex-row gap-6 w-full max-w-full">
    {/* Main Floor Plan Area */}
    <div className="flex-1 bg-card rounded-lg border border-border p-6 flex flex-col min-h-[300px] md:min-h-[400px] justify-center items-center max-w-full overflow-auto">
      <span className="text-muted-foreground text-lg font-medium text-center">
        Interactive Floor Plan
        <span className="text-xs ml-1">(Drag and drop artworks to position them)</span>
      </span>
    </div>
    {/* Controls and Artworks */}
    <div className="w-full md:w-[320px] flex flex-col gap-6">
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-base mb-1">Floor Plan Controls</h3>
        <p className="text-xs text-muted-foreground mb-3">Manage your gallery's digital floor layout</p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <Switch />
            <span className="text-sm">Show QR Code Locations</span>
          </label>
          <label className="flex items-center gap-2">
            <Switch />
            <span className="text-sm">Show Artworks</span>
          </label>
          <label className="flex items-center gap-2">
            <Switch />
            <span className="text-sm">Show Labels</span>
          </label>
        </div>
        <Button className="w-full mt-4 bg-primary text-primary-foreground font-medium rounded-lg" aria-label="Update Floor Plan">Update Floor Plan</Button>
      </div>
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-base mb-1">Available Artworks</h3>
        <p className="text-xs text-muted-foreground mb-3">Drag these to the floor plan</p>
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3 p-2 border rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-muted rounded" />
              <div>
                <div className="font-medium text-sm">Artwork Title {i}</div>
                <div className="text-xs text-muted-foreground">Artist Name</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const QRCodePlacementTab = () => (
  <div className="flex flex-col md:flex-row gap-6 w-full max-w-full">
    {/* QR Code Placement Map */}
    <div className="flex-1 bg-card rounded-lg border border-border p-6 flex flex-col min-h-[300px] md:min-h-[400px] justify-center items-center max-w-full overflow-auto">
      <span className="text-muted-foreground text-lg font-medium text-center">
        QR Code Placement Map
        <span className="text-xs ml-1">(Click on a QR code to edit its properties)</span>
      </span>
    </div>
    {/* QR Code Properties and List */}
    <div className="w-full md:w-[320px] flex flex-col gap-6">
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-base mb-1">QR Code Properties</h3>
        <p className="text-xs text-muted-foreground mb-3">Edit the selected QR code</p>
        <div className="flex flex-col gap-3">
          <Input placeholder="e.g., Gallery Entrance - Wall 1" className="mb-2" />
          <Input placeholder="Select artwork" className="mb-2" />
          <label className="flex items-center gap-2">
            <Switch />
            <span className="text-sm">Active</span>
          </label>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" aria-label="View QR">View QR</Button>
            <Button className="flex-1 bg-primary text-primary-foreground font-medium rounded-lg" aria-label="Update QR Code">Update QR Code</Button>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-base mb-1">QR Code List</h3>
        <p className="text-xs text-muted-foreground mb-3">All QR codes in this floor plan</p>
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between p-2 border rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-sm">QR-00{i}</div>
                <div className="text-xs text-muted-foreground">Gallery Wall {i}</div>
              </div>
              <Button size="sm" variant="outline" className="rounded-md px-3 py-1" aria-label={`Select QR-00${i}`}>Select</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FloorSettingsTab = () => (
  <div className="flex flex-col md:flex-row gap-6 w-full max-w-full">
    {/* Digital Floor Settings */}
    <div className="bg-card rounded-lg border border-border p-6 flex-1 max-w-full md:max-w-[420px]">
      <h3 className="font-bold text-xl mb-2">Digital Floor Settings</h3>
      <p className="text-muted-foreground text-sm mb-6">Configure your gallery's digital floor experience</p>
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between">
          <span>Public Access</span>
          <Switch />
        </label>
        <label className="flex items-center justify-between">
          <span>Require Login for Details</span>
          <Switch />
        </label>
        <label className="flex items-center justify-between">
          <span>Show Prices</span>
          <Switch />
        </label>
        <label className="flex items-center justify-between">
          <span>Allow Social Sharing</span>
          <Switch />
        </label>
        <div>
          <div className="mb-1">Welcome Message</div>
          <Input defaultValue="Welcome to VFA Gallery's Digital Floor" />
        </div>
        <Button className="w-full mt-4 bg-primary text-primary-foreground font-medium rounded-lg" aria-label="Save Settings">Save Settings</Button>
      </div>
    </div>
    {/* QR Code Appearance */}
    <div className="bg-card rounded-lg border border-border p-6 flex-1 max-w-full md:max-w-[420px]">
      <h3 className="font-bold text-xl mb-2">QR Code Appearance</h3>
      <p className="text-muted-foreground text-sm mb-6">Customize how your QR codes look</p>
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1">QR Code Logo</div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-muted rounded border" />
            <Button size="sm" variant="outline" className="rounded-md" aria-label="Change Logo">Change Logo</Button>
          </div>
        </div>
        <div>
          <div className="mb-1">Primary Color</div>
          <Input type="color" defaultValue="#000000" className="w-12 h-8 p-0 border-none" />
        </div>
        <div>
          <div className="mb-1">Background Color</div>
          <Input type="color" defaultValue="#FFFFFF" className="w-12 h-8 p-0 border-none" />
        </div>
        <label className="flex items-center gap-2">
          <Switch />
          <span>Rounded Corners</span>
        </label>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1" aria-label="Preview QR Code">Preview</Button>
          <Button className="flex-1 bg-primary text-primary-foreground font-medium rounded-lg" aria-label="Apply to All QR Codes">Apply to All QR Codes</Button>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const router = useRouter();
  const [tab, setTab] = useState('floor-plan');
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showColumns, setShowColumns] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [qrCodeId, setQrCodeId] = useState('');
  const [initialLocation, setInitialLocation] = useState('');

  const [columns, setColumns] = useState({
    id: true,
    location: true,
    artworkTitle: true,
    artist: true,
    status: true,
    visibility: true,
    scanCount: true,
    lastUpdated: true
  });

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sample data as in screenshots
  const qrCodes = [
    {
      id: 'QR-001',
      location: 'Gallery Entrance - Wall 1',
      artwork: "Campbell's Soup Cans",
      artist: 'Andy Warhol',
      status: 'Available',
      visibility: 'Published',
      scans: 145,
      lastUpdated: '15/05/2023',
      tab: 'active'
    },
    {
      id: 'QR-002',
      location: 'Main Hall - Wall 3',
      artwork: 'Radiant Baby',
      artist: 'Keith Haring',
      status: 'Available',
      visibility: 'Published',
      scans: 98,
      lastUpdated: '20/05/2023',
      tab: 'active'
    },
    {
      id: 'QR-003',
      location: 'Exhibition Room - Wall 2',
      artwork: 'The Starry Night',
      artist: 'Vincent van Gogh',
      status: 'Sold',
      visibility: 'Published',
      scans: 212,
      lastUpdated: '01/06/2023',
      tab: 'active'
    },
    {
      id: 'QR-004',
      location: 'Exhibition Room - Wall 4',
      artwork: 'Guernica',
      artist: 'Pablo Picasso',
      status: 'Gallery Only',
      visibility: 'Private',
      scans: 76,
      lastUpdated: '10/06/2023',
      tab: 'active'
    },
    {
      id: 'QR-005',
      location: 'Storage',
      artwork: 'Unassigned',
      artist: '-',
      status: 'Unassigned',
      visibility: 'Unpublished',
      scans: 0,
      lastUpdated: '10/04/2023',
      tab: 'available'
    },
    {
      id: 'QR-006',
      location: 'Storage',
      artwork: 'Unassigned',
      artist: '-',
      status: 'Unassigned',
      visibility: 'Unpublished',
      scans: 0,
      lastUpdated: '10/04/2023',
      tab: 'available'
    },
    {
      id: 'QR-007',
      location: 'Former Exhibition - Wall 1',
      artwork: 'Water Lilies',
      artist: 'Claude Monet',
      status: 'Archived',
      visibility: 'Unpublished',
      scans: 187,
      lastUpdated: '15/03/2023',
      tab: 'archived'
    }
  ];

  const filteredQRCodes = useMemo(() => {
    return qrCodes.filter(qr => {
      const matchesTab = qr.tab === activeTab;
      const matchesSearch = !searchQuery || 
        qr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.artwork.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || qr.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesTab && matchesSearch && matchesLocation;
    });
  }, [activeTab, searchQuery, locationFilter]);

  const sortedQRCodes = useMemo(() => {
    let sorted = [...filteredQRCodes];
    if (sortColumn) {
      sorted.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];
        if (sortColumn === 'scans') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = aValue?.toString().toLowerCase();
          bValue = bValue?.toString().toLowerCase();
        }
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredQRCodes, sortColumn, sortDirection]);

  // Badge helpers
  const statusBadge = (status) => {
    if (status === 'Available') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Available</span>;
    if (status === 'Sold') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Sold</span>;
    if (status === 'Gallery Only') return <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">Gallery Only</span>;
    if (status === 'Unassigned') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Unassigned</span>;
    if (status === 'Archived') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Archived</span>;
    return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
  };
  const visibilityBadge = (visibility) => {
    if (visibility === 'Published') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Published</span>;
    if (visibility === 'Private') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Private</span>;
    if (visibility === 'Unpublished') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Unpublished</span>;
    return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{visibility}</span>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5 relative">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-muted-foreground">Digital </span>
        <span className="text-foreground">Floor </span>
        <span className="text-muted-foreground">Management</span>
      </h1>
      <p className="text-muted-foreground mb-6">Manage your gallery's digital floor layout and QR code placements.</p>
      <TopActions />
      <Input placeholder="Search floor plan or artwork..." className="mb-6 max-w-xl" />
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 justify-between w-full mb-8">
          <TabsTrigger className='text-xs lg:text-sm' value="floor-plan">Floor Plan</TabsTrigger>
          <TabsTrigger className='text-xs lg:text-sm' value="qr-code-placement">QR Code Placement</TabsTrigger>
          <TabsTrigger className='text-xs lg:text-sm' value="floor-settings">Floor Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="floor-plan"><FloorPlanTab /></TabsContent>
        <TabsContent value="qr-code-placement"><QRCodePlacementTab /></TabsContent>
        <TabsContent value="floor-settings"><FloorSettingsTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;