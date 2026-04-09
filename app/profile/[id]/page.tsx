"use client"

import { useSettings } from "@/contexts/settings-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Eye, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Palette, 
  Shield, 
  Sparkles, 
  Building2, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Camera,
  Settings,
  Bell,
  Lock,
  User,
  Edit,
  Save,
  X,
  LogOut,
  ShoppingBag,
  Search,
  Filter,
  Plus,
  MoreHorizontal
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import Image from "next/image"
import { ProfilePageSkeleton } from "@/components/profile-skeleton"
import { UserCollectionService, CollectionItem, CollectionStats } from "@/lib/user-collection-service"
import { isArtist, isGallery, isCollector, isPatron, getUserTypes, USER_TYPES } from "@/lib/utils"
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ProfileDetail() {
  const { settings, updateSettings, updateNotificationSettings, updatePrivacySettings } = useSettings()
  const { user, userData, logout } = useAuth()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "")
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentURL, setCurrentURL] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([])
  const [collectionStats, setCollectionStats] = useState<CollectionStats | null>(null)
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [collectionSearch, setCollectionSearch] = useState("")
  const [collectionFilter, setCollectionFilter] = useState<CollectionItem['status'] | 'all'>('all')
  const [editForm, setEditForm] = useState({
    fullname: userData?.fullname || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    timezone: userData?.timezone || "",
    biography: userData?.biography || "",
    location: userData?.location || "",
    website: userData?.website || "",
    specialty: userData?.specialty || ""
  })

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update photoURL and edit form when userData changes
  useEffect(() => {
    setPhotoURL(userData?.photoURL || "")
    setEditForm({
      fullname: userData?.fullname || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      timezone: userData?.timezone || "",
      biography: userData?.biography || "",
      location: userData?.location || "",
      website: userData?.website || "",
      specialty: userData?.specialty || ""
    })
  }, [userData])

  // Set the currentURL after component mounts (client-side)
  useEffect(() => {
    setCurrentURL(`${window.location.origin}/`)
  }, [])

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Show skeleton for 1 second minimum

    return () => clearTimeout(timer)
  }, [])

  // Fetch collection data
  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!user?.uid) return
      
      try {
        setCollectionLoading(true)
        const [items, stats] = await Promise.all([
          UserCollectionService.getUserCollection(user.uid),
          UserCollectionService.getCollectionStats(user.uid)
        ])
        
        setCollectionItems(items)
        setCollectionStats(stats)
      } catch (error) {
        console.error('Error fetching collection data:', error)
        // toast.error('Failed to load collection data')
      } finally {
        setCollectionLoading(false)
      }
    }

    fetchCollectionData()
  }, [user?.uid])

  const handleSaveAccount = async () => {
    try {
      // Update local settings (only for avatar)
      updateSettings({
        avatar: photoURL
      })

      // Update user data in Firestore
      if (user?.email) {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', user.email))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          await updateDoc(doc(db, 'users', userDoc.id), {
            photoURL: photoURL,
            fullname: editForm.fullname,
            email: editForm.email,
            phone: editForm.phone,
            timezone: editForm.timezone,
            biography: editForm.biography,
            location: editForm.location,
            website: editForm.website,
            specialty: editForm.specialty
          })
        }
      }

      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  const handleSaveNotifications = () => {
    updateNotificationSettings(settings.notifications)
    toast.success("Notification settings saved successfully")
  }

  const handleSavePrivacy = () => {
    updatePrivacySettings(settings.privacy)
    toast.success("Privacy settings saved successfully")
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData?.fullname}`,
          url: `${currentURL}/profile/${user?.uid}`,
        })
      } catch (error) {
        console.error('Error sharing profile:', error)
      }
    }
  }

  const handleContact = () => {
    if (userData?.email) {
      window.open(`mailto:${userData.email}`, '_blank')
    }
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateNotificationSettings({ ...settings.notifications, [field]: checked })
  }

  const handlePrivacyCheckboxChange = (field: string, checked: boolean) => {
    updatePrivacySettings({ ...settings.privacy, [field]: checked })
  }

  const handlePrivacySelectChange = (field: string, value: string) => {
    updatePrivacySettings({ ...settings.privacy, [field]: value })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file")
        return
      }

      // Create a temporary URL for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoURL(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      toast.success("Logged out successfully")
      router.push('/marketplace')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Failed to logout. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Collection helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getFilteredCollection = () => {
    let filtered = collectionItems

    // Apply search filter
    if (collectionSearch) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(collectionSearch.toLowerCase()) ||
        item.artist.toLowerCase().includes(collectionSearch.toLowerCase())
      )
    }

    // Apply status filter
    if (collectionFilter !== 'all') {
      filtered = filtered.filter(item => item.status === collectionFilter)
    }

    return filtered
  }

  const getStatusColor = (status: CollectionItem['status']) => {
    switch (status) {
      case 'owned': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'sold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'on-loan': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'in-storage': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // Show skeleton while loading
  if (isLoading) {
    return <ProfilePageSkeleton />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your profile.</p>
          <Button onClick={() => router.push('/auth/login')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => router.push('/marketplace')}>
                {/* <Palette className="w-5 h-5 text-primary" />
              <h1 className="text-xl flex items-center font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
               <span className="mr-1">Art  </span> <span className="lg:block hidden">Marketplace</span>
              </h1> */}
               {mounted ? (
                 <Image 
                   key={(resolvedTheme || theme)}
                   src={(resolvedTheme || theme) === "dark" ? ("/dark.png") : ("/light.png")} 
                   alt={`${'Gallery'} Logo`} 
                   width={50} 
                   height={50} 
                 />
               ) : (
                 <div className="w-[50px] h-[50px] bg-muted rounded animate-pulse" />
               )}
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {user ? (
                <>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    Operating System
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Operating System
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Section - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Photo and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/40 border">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={userData?.fullname || 'User'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${photoURL ? 'hidden' : ''}`}>
                    <User className="w-24 h-24 opacity-20" />
                  </div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    {isArtist(userData) && <Badge variant="default">Artist</Badge>}
                    {isGallery(userData) && <Badge variant="default">Gallery</Badge>}
                    {isCollector(userData) && <Badge variant="default">Collector</Badge>}
                    {isPatron(userData) && <Badge variant="default">Patron</Badge>}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-0">{userData?.fullname}</h1>
                    <p className=" text-muted-foreground mb-4">{userData?.email || ''}</p>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      {userData?.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{userData.location}</span>
                        </div>
                      )}
                      {userData?.timezone && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{userData.timezone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Contact and Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {/* <Button onClick={handleContact} className="bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button> */}
                  {userData?.website && (
                    <Button variant="outline" onClick={() => window.open(userData.website, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}

{isGallery(userData) && (  
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/dashboard')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Biography */}
            {userData?.biography && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>About</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {userData.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Edit Profile Form */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <Label>Profile Photo</Label>
                    <div className="flex gap-4 items-center">
                      <Avatar className="h-20 w-20 rounded-lg shrink-0">
                        <AvatarImage src={photoURL || undefined} alt="User Avatar" className="object-cover" />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                          {photoURL && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPhotoURL("")}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a photo from your device (JPG, PNG, GIF)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        value={editForm.fullname}
                        onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={editForm.specialty}
                        onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                        placeholder="e.g., Contemporary Art, Photography"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={editForm.timezone} onValueChange={(value) => setEditForm({...editForm, timezone: value})}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">Greenwich Mean Time (UTC+0)</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                        <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biography">Biography</Label>
                    <textarea
                      id="biography"
                      value={editForm.biography}
                      onChange={(e) => setEditForm({...editForm, biography: e.target.value})}
                      className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSaveAccount} className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collection Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>My Collection</span>
                </CardTitle>
                <CardDescription className="text-xs">Manage your art collection and track your investments</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Collection Stats */}
                {collectionStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{collectionStats.totalItems}</div>
                      <div className="text-sm text-muted-foreground">Total Items</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(collectionStats.totalValue)}</div>
                      <div className="text-sm text-muted-foreground">Total Value</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(collectionStats.totalSpent)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(collectionStats.averageValue)}</div>
                      <div className="text-sm text-muted-foreground">Avg. Value</div>
                    </div>
                  </div>
                )}

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search your collection..."
                      value={collectionSearch}
                      onChange={(e) => setCollectionSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={collectionFilter} onValueChange={(value) => setCollectionFilter(value as CollectionItem['status'] | 'all')}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="on-loan">On Loan</SelectItem>
                      <SelectItem value="in-storage">In Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collection Items */}
                {collectionLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                          <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : getFilteredCollection().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredCollection().map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Palette className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">by {item.artist}</p>
                          {item.year && (
                            <p className="text-xs text-muted-foreground">{item.year}</p>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium">{formatCurrency(item.purchasePrice)}</div>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No items in your collection</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your art collection by purchasing pieces from the marketplace.
                    </p>
                    <Button onClick={() => router.push('/marketplace')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Section - Right Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Badge variant="outline">Profile</Badge>
            </div>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleCheckboxChange('email', checked as boolean)}
                    />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => handleCheckboxChange('push', checked as boolean)}
                    />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="account-activity"
                      checked={settings.notifications.accountActivity}
                      onCheckedChange={(checked) => handleCheckboxChange('accountActivity', checked as boolean)}
                    />
                    <Label htmlFor="account-activity">Account Activity</Label>
                  </div>
                </div>
                <Button onClick={handleSaveNotifications} className="w-full">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Privacy</span>
                </CardTitle>
                <CardDescription>Manage your privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics-sharing">Share analytics data</Label>
                    <Switch
                      id="analytics-sharing"
                      checked={settings.privacy.analyticsSharing}
                      onCheckedChange={(checked) => handlePrivacyCheckboxChange('analyticsSharing', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="personalized-ads">Allow personalized ads</Label>
                    <Switch
                      id="personalized-ads"
                      checked={settings.privacy.personalizedAds}
                      onCheckedChange={(checked) => handlePrivacyCheckboxChange('personalizedAds', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <RadioGroup
                    value={settings.privacy.visibility}
                    onValueChange={(value) => handlePrivacySelectChange('visibility', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="visibility-public" />
                      <Label htmlFor="visibility-public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="visibility-private" />
                      <Label htmlFor="visibility-private">Private</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button onClick={handleSavePrivacy} className="w-full">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Account Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Type</span>
                    <span className="font-semibold">
                      {isArtist(userData) ? 'Artist' : isGallery(userData) ? 'Gallery' : isCollector(userData) ? 'Collector' : isPatron(userData) ? 'Patron' : 'User'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-semibold">
                      {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="font-semibold">
                      {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData?.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                  )}
                  {userData?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                  )}
                  {userData?.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Actions</span>
                </CardTitle>
                <CardDescription>Manage your account and session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="outline"
                    className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Sign Out"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
