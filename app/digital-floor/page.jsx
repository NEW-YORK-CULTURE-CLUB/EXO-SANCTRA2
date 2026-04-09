"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Filter, Plus, ShoppingCart, Package, MoreHorizontal, QrCode, Eye, RotateCcw, Archive, X, Upload, Camera, ChevronDown, Minus, Check, ShoppingBag } from 'lucide-react';
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
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiBitCoinFill } from 'react-icons/ri';

const Page = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTab, setSelectedTab] = useState('physical');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showColumns, setShowColumns] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopTab, setShopTab] = useState('frames');
  
  // Form states
  const [qrCodeId, setQrCodeId] = useState('');
  const [initialLocation, setInitialLocation] = useState('');
  const [selectedSize, setSelectedSize] = useState('small');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [nameOnCard, setNameOnCard] = useState('John Smith');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('123');
  const [shippingAddress, setShippingAddress] = useState('Gallery Address (Default)');

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

  // Sample data
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

  const artworks = [
    { id: 'ART-001', title: "Campbell's Soup Cans", artist: 'Andy Warhol', hasQR: 'QR-001', image: '/vault/AndyWarhol_Soup-Cans.jpg' },
    { id: 'ART-002', title: 'Mona Lisa (Replica)', artist: 'Leonardo Da Vinci', hasQR: null, image: '/vault/MonaLisa.jpg' },
    { id: 'ART-003', title: 'Radiant Baby', artist: 'Keith Haring', hasQR: 'QR-002', image: '/vault/Radiant-Baby.jpg' },
    { id: 'ART-004', title: 'Marilyn Diptych', artist: 'Andy Warhol', hasQR: null, image: '/vault/Marilyn-Diptych.jpg' },
    { id: 'ART-005', title: 'The Starry Night', artist: 'Vincent van Gogh', hasQR: null, image: '/vault/The-Starry-Night.jpg' }
  ];

  const products = [
    {
      id: 'minimalist-frame',
      name: 'Minimalist QR Frame',
      description: 'Clean, simple frame design that complements any gallery',
      price: 39,
      materials: 'Aluminum, Acrylic',
      dimensions: '5" x 5" x 0.5"',
      colors: ['black', 'white'],
      features: [
        'Base aluminum construction',
        'Anti-glare acrylic cover',
        'Easy wall mounting system',
        'Clean contemporary design',
        'Replaceable QR code panel'
      ]
    },
    {
      id: 'classic-frame',
      name: 'Classic Gallery Frame',
      description: 'Traditional gallery-style frame with elegant finish',
      price: 59,
      materials: 'Hardwood, Aluminum Spacer',
      dimensions: '6" x 6" x 1"',
      colors: ['brown', 'black', 'white', 'gold'],
      features: [
        'Solid wood construction',
        'Museum quality glass',
        'Archival matting',
        'Hanging hardware included',
        'Contemporary design',
        'Available in multiple sizes'
      ],
      popular: true
    },
    {
      id: 'floating-display',
      name: 'Floating QR Display',
      description: 'Modern floating display that makes your QR code appear suspended',
      price: 79,
      materials: 'Tempered Glass, Aluminum Spacers',
      dimensions: '4" x 4" x 1"',
      colors: ['clear', 'black'],
      features: [
        'Floating mount design',
        'Tempered safety glass',
        'Invisible mounting hardware',
        'LED backlight option',
        'QR code sheet included',
        'Premium presentation'
      ]
    },
    {
      id: 'industrial-frame',
      name: 'Industrial Metal Frame',
      description: 'Industrial-inspired metal frame with raw, contemporary aesthetic',
      price: 69,
      materials: 'Steel, Brass Hardware',
      dimensions: '5.5" x 5.5" x 0.75"',
      colors: ['black', 'silver', 'copper'],
      features: [
        'Raw steel construction',
        'Weathered finish options',
        'External hardware aesthetic',
        'Modern industrial design',
        'QR code sheet included',
        'Ideal for contemporary spaces'
      ]
    },
    {
      id: 'illuminated-frame',
      name: 'Illuminated QR Frame',
      description: 'Elegant frame that highlights your QR code with subtle illumination',
      price: 89,
      materials: 'Acrylic, LED Components',
      dimensions: '6" x 6" x 1"',
      colors: ['white'],
      features: [
        'Built-in LED lighting',
        'Touch-sensitive power',
        'Battery operated system',
        'Adjustable brightness',
        'QR code sheet included',
        'Premium anti-glare design'
      ]
    }
  ];

  const hardwareProducts = [
    {
      id: 'basic-display',
      name: 'E-Ink QR Display - Basic',
      description: 'Wall-mounted QR code display with e-ink technology for low power consumption',
      price: 149,
      sizes: [
        { name: 'Small (4.2")', price: 149 },
        { name: 'Medium (7.8")', price: 199 }
      ],
      colors: ['black', 'white'],
      features: [
        '4.2" e-ink display',
        'Battery life up to 1 year',
        'Wireless updates via WiFi',
        'Simple mounting system',
        'Matte anti-glare screen'
      ]
    },
    {
      id: 'premium-display',
      name: 'E-Ink QR Display - Premium',
      description: 'Advanced wall-mounted QR display with premium features for professional galleries',
      price: 249,
      sizes: [
        { name: 'Medium (7.8")', price: 249 },
        { name: 'Large (10.3")', price: 299 }
      ],
      colors: ['black', 'white', 'gold'],
      features: [
        '7.8" high-resolution e-ink display',
        'Battery life up to 2 years',
        'Wireless updates via WiFi/Bluetooth',
        'Premium aluminum frame',
        'Ambient light sensor',
        'Motion detection for power saving',
        'Anti-theft mounting system'
      ],
      popular: true
    },
    {
      id: 'museum-display',
      name: 'Museum-Grade QR Display',
      description: 'Museum-quality QR display with advanced security and integration features',
      price: 399,
      sizes: [
        { name: 'Large (10.3")', price: 399 },
        { name: 'Extra Large (13.3")', price: 499 }
      ],
      colors: ['black', 'white'],
      features: [
        '10.3" high-resolution e-ink display',
        'Hardwired power option',
        'Wireless and wired network connectivity',
        'Tamper-proof security features',
        'Integration with museum systems',
        'Visitor analytics',
        'Custom branding options',
        'Professional installation included'
      ]
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

  const addToCart = (product, options = {}) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      ...options,
      quantity: options.quantity || 1
    };
    setCartItems(prev => [...prev, cartItem]);
    toast.success(`${product.name} has been added to your cart.`);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.product.price;
      const sizeUpcharge = item.selectedSize?.price - item.product.price || 0;
      return total + ((basePrice + sizeUpcharge) * item.quantity);
    }, 0);
  };

  const ProductCard = ({ product, isHardware = false }) => (
    <div className="bg-card rounded-lg p-6 border flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-muted rounded-lg flex items-center justify-center aspect-square">
        {isHardware ? <Package className="w-12 h-12 text-muted-foreground" /> : <QrCode className="w-12 h-12 text-muted-foreground" />}
        </div>
      <div className="w-full md:w-2/3 flex flex-col">
              {product.popular && (
          <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded mb-2 w-fit">
                  POPULAR CHOICE
                </span>
              )}
        <h3 className="font-semibold text-2xl mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
        
        <div className="text-3xl font-bold mb-4">
          {isHardware ? 'From ' : ''}${product.price}
          {!isHardware && <span className="text-sm font-normal text-muted-foreground"> per frame</span>}
              </div>
              
        <div className="space-y-3 mb-4 text-sm">
          {isHardware && product.sizes && (
            <div>
              <span className="font-medium">Available Sizes:</span>
              <div className="text-muted-foreground">
                {product.sizes.map(size => `${size.name}${size.price > product.price ? ` (+$${size.price - product.price})` : ''}`).join(' • ')}
                </div>
                </div>
          )}
          {!isHardware && (
            <>
              <div><span className="font-medium">Materials:</span> <span className="text-muted-foreground">{product.materials}</span></div>
              <div><span className="font-medium">Dimensions:</span> <span className="text-muted-foreground">{product.dimensions}</span></div>
            </>
          )}

              {product.colors && (
            <div>
              <span className="font-medium">Available Colors:</span>
                  <div className="flex gap-2 mt-1">
                    {product.colors.map(color => (
                      <div
                        key={color}
                    className={`w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 ${
                          color === 'black' ? 'bg-black' :
                          color === 'white' ? 'bg-white' :
                          color === 'brown' ? 'bg-amber-800' :
                          color === 'gold' ? 'bg-yellow-400' :
                          color === 'silver' ? 'bg-gray-400' :
                          color === 'copper' ? 'bg-orange-600' :
                      color === 'clear' ? 'bg-transparent' :
                          'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
        </div>

        <div className="mb-6">
                <span className="text-sm font-medium">Features:</span>
          <ul className="mt-2 space-y-2">
                  {product.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
          </div>
          
        <div className="flex gap-2 mt-auto">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setShowConfigModal(true);
              }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Configure
            </button>
            <button
              onClick={() => addToCart(product)}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Add to Cart
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="-mt-5">
        <div className="lg:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {/* <span className="text-muted-foreground"></span> */}
              <span className="text-foreground">Floor </span>
              <span className="text-muted-foreground">QR </span>
              <span className="text-foreground">System</span> 
            </h1>
            <p className=" text-sm text-muted-foreground">Manage QR codes for your gallery's digital floor experience.</p>
          </div>
          
          <div className="flex lg:pt-0 pt-4 items-center gap-2">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex text-sm items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <QrCode className="w-4 h-4" />
              Register QR Code
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex text-sm items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <RiBitCoinFill className="w-4 h-4" />
              Convert Assets to Digital
            </button>
            <button
              onClick={() => { setShopTab('frames'); setActiveTab('shop'); }}
              className="flex text-sm items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Hardware
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4">

          {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="physical">Physical Floor</TabsTrigger>
          <TabsTrigger value="digital">Digital Floor</TabsTrigger>

        </TabsList>
      </Tabs>
       
          <>
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by location, artwork, or QR code ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex justify-between bg-muted p-1 rounded-lg w-full">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'active'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Active QR Codes
                </button>
                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'available'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Available QR Codes
                </button>
                <button
                  onClick={() => setActiveTab('archived')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'archived'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Archived QR Codes
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'shop'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  QR Code Shop
                </button>
              </div>
            </div>
            {activeTab !== 'shop' && (
<>
            {/* Filters and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Filter by location..."
                    className="pl-3 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowColumns(!showColumns)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted"
                >
                  Columns
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showColumns && (
                  <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg p-3 w-48 z-10">
                    {Object.entries(columns).map(([key, checked]) => (
                      <label key={key} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="rounded text-primary focus:ring-ring"
                        />
                        <span className="text-sm capitalize">
                          {key === 'artworkTitle' ? 'Artwork' : key === 'scanCount' ? 'Scans' : key.replace(/([A-Z])/g, ' $1')}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {columns.id && <th className="text-left p-4 font-medium text-muted-foreground">QR Code ID</th>}
                    {columns.location && <th className="text-left p-4 font-medium text-muted-foreground">Location</th>}
                    {columns.artworkTitle && <th className="text-left p-4 font-medium text-muted-foreground">Artwork</th>}
                    {columns.artist && <th className="text-left p-4 font-medium text-muted-foreground">Artist</th>}
                    {columns.status && <th className="text-left p-4 font-medium text-muted-foreground">Status</th>}
                    {columns.visibility && <th className="text-left p-4 font-medium text-muted-foreground">Visibility</th>}
                    {columns.scanCount && <th className="text-left p-4 font-medium text-muted-foreground">Scans</th>}
                    {columns.lastUpdated && <th className="text-left p-4 font-medium text-muted-foreground">Last Updated</th>}
                    <th className="text-left p-4 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQRCodes.map((qr) => (
                    <tr key={qr.id} className="border-b border-border hover:bg-muted">
                      {columns.id && <td className="p-4 font-medium text-sm">{qr.id}</td>}
                      {columns.location && <td className="p-4 text-sm">{qr.location}</td>}
                      {columns.artworkTitle && <td className="p-4 text-sm">{qr.artwork}</td>}
                      {columns.artist && <td className="p-4 text-sm">{qr.artist}</td>}
                      {columns.status && (
                        <td className="p-4 text-sm">
                           <Badge variant={qr.status === 'Available' ? 'success' : 'secondary'}>{qr.status}</Badge>
                        </td>
                      )}
                      {columns.visibility && (
                        <td className="p-4 text-sm">
                           <Badge variant={qr.visibility === 'Published' ? 'success' : 'secondary'}>{qr.visibility}</Badge>
                        </td>
                      )}
                      {columns.scanCount && <td className="p-4 text-sm">{qr.scans}</td>}
                      {columns.lastUpdated && <td className="p-4 text-sm">{qr.lastUpdated}</td>}
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedQRCode(qr);
                                  setShowStatusModal(true);
                                }}
                              >
                                Update Artwork Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                  setSelectedQRCode(qr);
                                  setShowVisibilityModal(true);
                                }}
                              >
                                Update Artwork Visibility
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <QrCode className="w-4 h-4 mr-2" />
                                View QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                  setSelectedQRCode(qr);
                                  setShowAssignModal(true);
                                }}
                              >
                              <RotateCcw className="w-4 h-4 mr-2" />
                                Reassign QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Archive className="w-4 h-4 mr-2" />
                                Archive QR Code
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {filteredQRCodes.length} QR code(s) found.
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm text-muted-foreground hover:bg-muted rounded">Previous</button>
                  <button className="px-3 py-1 text-sm text-muted-foreground hover:bg-muted rounded">Next</button>
                </div>
              </div>
            </div>
          </>
            )}
          </>
          {activeTab === 'shop' && (
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">QR Code Shop</h2>
                    <p className="text-muted-foreground">Purchase QR code frames and hardware for your gallery</p>
                </div>
                <button 
                  onClick={() => setShowCartModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartItems.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit mb-6">
              <button
                onClick={() => setShopTab('frames')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${shopTab === 'frames' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                QR Code Frames
              </button>
              <button
                onClick={() => setShopTab('hardware')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${shopTab === 'hardware' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Hardware Displays
              </button>
            </div>
            
            <div className="space-y-6">
              {shopTab === 'frames' && products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {shopTab === 'hardware' && hardwareProducts.map(product => (
                <ProductCard key={product.id} product={product} isHardware />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Register QR Code Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Register New QR Code</h2>
              <button onClick={() => setShowRegisterModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Register a new QR code to be used on your gallery's digital floor.
            </p>

            {!showManualEntry ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Scan or Upload QR Code</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Use your device's camera to scan a QR code or upload an image.
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                  <button 
                    onClick={() => setShowManualEntry(true)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Manual Entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">QR Code ID</label>
                  <Input
                    type="text"
                    placeholder="Enter QR code ID"
                    value={qrCodeId}
                    onChange={(e) => setQrCodeId(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Location</label>
                  <Input
                    type="text"
                    placeholder="e.g., Gallery Entrance - Wall 1"
                    value={initialLocation}
                    onChange={(e) => setInitialLocation(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={() => setShowManualEntry(false)}
                  className="w-full py-2 text-sm text-primary hover:bg-muted rounded-lg"
                >
                  Switch to Scan Mode
                </button>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Register QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Configuration Modal */}
      {showConfigModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Configure Your Display</h2>
              <button onClick={() => setShowConfigModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Customize your selection before adding to cart
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Package className="w-8 h-8 text-muted-foreground" />
                <div>
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-sm text-muted-foreground">Small (4.2")</div>
                </div>
                <div className="ml-auto font-bold">${selectedProduct.price}.00</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Display Size</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="size"
                      value="small"
                      checked={selectedSize === 'small'}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="text-primary focus:ring-ring"
                    />
                    <span>Small (4.2")</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="size"
                      value="medium"
                      checked={selectedSize === 'medium'}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="text-primary focus:ring-ring"
                    />
                    <span>Medium (7.8")</span>
                    <span className="text-sm text-muted-foreground">+$50</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Frame Color</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="color"
                      value="black"
                      checked={selectedColor === 'black'}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="text-primary focus:ring-ring"
                    />
                    <div className="w-4 h-4 bg-black rounded border"></div>
                    <span>Black</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="color"
                      value="white"
                      checked={selectedColor === 'white'}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="text-primary focus:ring-ring"
                    />
                    <div className="w-4 h-4 bg-white rounded border border-muted"></div>
                    <span>White</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="color"
                      value="silver"
                      checked={selectedColor === 'silver'}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="text-primary focus:ring-ring"
                    />
                    <div className="w-4 h-4 bg-gray-400 rounded border"></div>
                    <span>Silver</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  addToCart(selectedProduct, {
                    selectedSize,
                    selectedColor,
                    quantity
                  });
                  setShowConfigModal(false);
                }}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Shopping Cart</h2>
              <button onClick={() => setShowCartModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Review your items and complete your purchase
            </p>

            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Package className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.selectedSize && `${item.selectedSize} • `}
                      {item.selectedColor && `${item.selectedColor} • `}
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${item.product.price * item.quantity}</div>
                    <div className="text-xs text-muted-foreground">${item.product.price} x {item.quantity}</div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {cartItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Your cart is empty
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${getCartTotal()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name on Card</label>
                    <Input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVC</label>
                      <Input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Address</label>
                    <select
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-transparent focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="Gallery Address (Default)">Gallery Address (Default)</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCartModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Continue Shopping
              </button>
              {cartItems.length > 0 && (
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Complete Purchase
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign QR Code Modal */}
      {showAssignModal && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Assign QR Code</h2>
              <button onClick={() => setShowAssignModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Reassign this QR code to a different artwork
            </p>

            <div className="mb-6">
              <h3 className="font-medium mb-2">QR Code Details</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="font-medium">{selectedQRCode.id}</div>
                <div className="text-sm text-muted-foreground">{selectedQRCode.location}</div>
                <div className="mt-2">
                  <span className="text-sm">Currently assigned to: </span>
                  <span className="font-medium">{selectedQRCode.artwork}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search artworks by title, artist, or ID..."
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {artworks.map(artwork => (
                <div
                  key={artwork.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted ${
                    artwork.title === selectedQRCode.artwork ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  <Image src={artwork.image} alt={artwork.title} width={48} height={48} className="w-12 h-12 rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{artwork.title}</div>
                    <div className={`text-sm ${artwork.title === selectedQRCode.artwork ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {artwork.artist} • {artwork.id}
                    </div>
                  </div>
                  {artwork.hasQR && artwork.hasQR !== selectedQRCode.id && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Has QR: {artwork.hasQR}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Reassign QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Update Artwork Status</h2>
              <button onClick={() => setShowStatusModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Change the status of "{selectedQRCode.artwork}" by {selectedQRCode.artist}.
            </p>

            <div className="space-y-3">
              {['Available', 'Sold', 'Online Only', 'Gallery Only', 'Auction Only', 'Archived', 'Custom Status'].map(status => (
                <label key={status} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    defaultChecked={status === selectedQRCode.status}
                    className="text-primary focus:ring-ring"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Visibility Modal */}
      {showVisibilityModal && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Update Artwork Visibility</h2>
              <button onClick={() => setShowVisibilityModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Change the visibility of "{selectedQRCode.artwork}" by {selectedQRCode.artist}.
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="visibility"
                  value="published"
                  defaultChecked={selectedQRCode.visibility === 'Published'}
                  className="text-primary focus:ring-ring mt-1"
                />
                <div>
                  <div className="font-medium">Published</div>
                  <div className="text-sm text-muted-foreground">Public, anyone on the internet can view</div>
                </div>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="visibility"
                  value="unpublished"
                  defaultChecked={selectedQRCode.visibility === 'Unpublished'}
                  className="text-primary focus:ring-ring mt-1"
                />
                <div>
                  <div className="font-medium">Unpublished</div>
                  <div className="text-sm text-muted-foreground">Anyone on the internet with a link can view</div>
                </div>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  defaultChecked={selectedQRCode.visibility === 'Private'}
                  className="text-primary focus:ring-ring mt-1"
                />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-muted-foreground">Only specific gallery patrons can view</div>
                </div>
              </label>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowVisibilityModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Update Visibility
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;