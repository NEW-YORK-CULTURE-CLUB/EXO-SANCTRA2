"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Crown, 
  DollarSign, 
  Palette, 
  Calendar, 
  Users, 
  TrendingUp, 
  Star, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Award, 
  Target, 
  Activity,
  Plus,
  Trash2,
  Link2,
  Download,
  Share2,
  MoreHorizontal,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { collectorsData } from "@/data/collectorsData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock collector data - in real app this would come from API
const getCollectorData = (id) => {
  return collectorsData.find(collector => collector.id === parseInt(id)) || collectorsData[0];
};

// Mock collection data
const collectionData = [
  {
    id: 1,
    title: "Campbell's Soup Cans",
    artist: "Andy Warhol",
    year: 1962,
    medium: "Acrylic on canvas",
    size: "20 x 16 inches",
    purchasePrice: 15000000,
    currentValue: 18000000,
    purchaseDate: "2024-01-15",
    location: "Private Collection",
    image: "/vault/AndyWarhol_Soup-Cans.jpg",
    status: "Owned"
  },
  {
    id: 2,
    title: "Marilyn Diptych",
    artist: "Andy Warhol",
    year: 1962,
    medium: "Silkscreen on canvas",
    size: "80 x 114 inches",
    purchasePrice: 25000000,
    currentValue: 30000000,
    purchaseDate: "2023-11-20",
    location: "Private Collection",
    image: "/vault/Marilyn-Diptych.jpg",
    status: "Owned"
  },
  {
    id: 3,
    title: "Radiant Baby",
    artist: "Keith Haring",
    year: 1982,
    medium: "Acrylic on canvas",
    size: "48 x 48 inches",
    purchasePrice: 3500000,
    currentValue: 4200000,
    purchaseDate: "2023-09-10",
    location: "Private Collection",
    image: "/vault/Radiant-Baby.jpg",
    status: "Owned"
  }
];

// Mock wishlist data
const wishlistData = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: 1889,
    estimatedPrice: 12000000,
    priority: "High",
    addedDate: "2024-01-10",
    image: "/vault/The-Starry-Night.jpg"
  },
  {
    id: 2,
    title: "Guernica",
    artist: "Pablo Picasso",
    year: 1937,
    estimatedPrice: 18000000,
    priority: "Medium",
    addedDate: "2024-01-05",
    image: "/vault/Guernica.jpg"
  }
];

// Mock engagement data
const engagementData = {
  totalVisits: 47,
  lastVisit: "2024-01-20",
  averageVisitDuration: "2.5 hours",
  favoriteTime: "Weekend afternoons",
  preferredContact: "Email",
  responseRate: "95%",
  eventAttendance: 12,
  privateViewings: 8,
  galleryTours: 5
};

const CollectorDetail = () => {
  const [tab, setTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const collector = getCollectorData(params.id);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Header */}
      <div className="flex gap-2 justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/collectors")}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Collectors
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-1" /> Contact
          </Button>
          <Button variant="outline" size="sm">
            <Link2 className="w-4 h-4 mr-1" /> Share Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4 mr-1" /> More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Send Recommendations
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Collector
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage className="object-cover" src={collector.avatar} />
                  <AvatarFallback className="bg-muted text-lg">
                    {getInitials(collector.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold mb-1">{collector.name}</h2>
                <div className="text-sm text-muted-foreground mb-3">{collector.occupation}</div>
                
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <Badge 
                    variant={collector.tier === "VIP" ? "default" : "secondary"}
                    className={collector.tier === "VIP" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                  >
                    {collector.tier}
                  </Badge>
                  <Badge 
                    className={collector.status === "Active" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }
                  >
                    {collector.status}
                  </Badge>
                  {collector.vipStatus && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{collector.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{collector.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{collector.location}</span>
                  </div>
                </div>

                {collector.socialMedia.instagram || collector.socialMedia.twitter || collector.socialMedia.linkedin ? (
                  <div className="flex gap-2 mt-4">
                    {collector.socialMedia.instagram && (
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                    {collector.socialMedia.twitter && (
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {collector.socialMedia.linkedin && (
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tabs Content */}
        <div className="lg:col-span-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                        <p className=" font-bold">{formatCurrency(collector.totalSpent)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Collection Value</p>
                        <p className=" font-bold">{formatCurrency(collector.collectionValue)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Artworks Owned</p>
                        <p className=" font-bold">{collector.artworksOwned}</p>
                      </div>
                      <Palette className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Purchase</p>
                        <p className=" font-bold">{new Date(collector.lastPurchase).toLocaleDateString()}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collector.purchaseHistory.slice(0, 3).map((purchase, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{purchase.artwork}</p>
                            <p className="text-sm text-muted-foreground">by {purchase.artist}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(purchase.price)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Art Style Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Art Style Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {collector.preferredStyles.map((style, index) => (
                      <Badge key={index} variant="outline">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {collector.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{collector.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Art Collection</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artwork
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collectionData.map((artwork) => (
                  <Card key={artwork.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {artwork.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{artwork.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {artwork.artist}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Purchase Price:</span>
                          <span className="font-medium">{formatCurrency(artwork.purchasePrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Value:</span>
                          <span className="font-medium text-green-600">{formatCurrency(artwork.currentValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purchase Date:</span>
                          <span>{new Date(artwork.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wishlist</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistData.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={item.priority === "High" ? "destructive" : "secondary"}
                      >
                        {item.priority} Priority
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {item.artist}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Estimated Price:</span>
                          <span className="font-medium">{formatCurrency(item.estimatedPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Added:</span>
                          <span>{new Date(item.addedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Visit Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Visits:</span>
                      <span className="font-medium">{engagementData.totalVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Visit:</span>
                      <span className="font-medium">{new Date(engagementData.lastVisit).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Duration:</span>
                      <span className="font-medium">{engagementData.averageVisitDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Favorite Time:</span>
                      <span className="font-medium">{engagementData.favoriteTime}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Preferred Contact:</span>
                      <span className="font-medium">{engagementData.preferredContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Rate:</span>
                      <span className="font-medium">{engagementData.responseRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Attendance:</span>
                      <span className="font-medium">{engagementData.eventAttendance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Private Viewings:</span>
                      <span className="font-medium">{engagementData.privateViewings}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Email sent about new exhibition</p>
                          <p className="text-sm text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">Opened</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Eye className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Gallery visit</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">2.5 hours</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <Heart className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">Added artwork to wishlist</p>
                          <p className="text-sm text-muted-foreground">2 weeks ago</p>
                        </div>
                      </div>
                      <Badge variant="outline">High Priority</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Art Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Styles</label>
                      <div className="flex flex-wrap gap-2">
                        {collector.preferredStyles.map((style, index) => (
                          <Badge key={index} variant="outline">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Areas of Interest</label>
                      <div className="flex flex-wrap gap-2">
                        {collector.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Budget Range</label>
                      <Badge variant="outline">{collector.budgetRange}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Communication Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Contact Method</label>
                      <Badge variant="outline">{collector.preferredContact}</Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Marketing Opt-in</label>
                      <Badge variant={collector.marketingOptIn ? "default" : "secondary"}>
                        {collector.marketingOptIn ? "Opted In" : "Opted Out"}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Newsletter Subscription</label>
                      <Badge variant={collector.newsletterOptIn ? "default" : "secondary"}>
                        {collector.newsletterOptIn ? "Subscribed" : "Not Subscribed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {collector.specialRequests && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Special Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{collector.specialRequests}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollectorDetail; 