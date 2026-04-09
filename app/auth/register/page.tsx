'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building2, Palette, ShoppingBag, Users, Crown, Check, Upload, X, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Skeleton } from '@/components/ui/skeleton';
import { USER_TYPES } from '@/lib/utils';

export default function RegisterPage() {
  const [step, setStep] = useState<'userType' | 'form'>('userType');
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Artist-specific fields
  const [artistName, setArtistName] = useState('');
  const [biography, setBiography] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [phone, setPhone] = useState('');
  const [altContact, setAltContact] = useState('');
  const [altEmail, setAltEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('');
  const [selectedGallery, setSelectedGallery] = useState('');
  const [gallerySearch, setGallerySearch] = useState('');
  const [showGalleryDropdown, setShowGalleryDropdown] = useState(false);
  const [taxId, setTaxId] = useState('');
  const [taxClassification, setTaxClassification] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [x, setX] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [portalAccess, setPortalAccess] = useState(false);
  const [artistPhoto, setArtistPhoto] = useState<File | null>(null);
  const [artistPhotoPreview, setArtistPhotoPreview] = useState<string | null>(null);
  
  // Gallery-specific fields
  const [galleryName, setGalleryName] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryAddress, setGalleryAddress] = useState('');
  const [galleryPhone, setGalleryPhone] = useState('');
  const [galleryWebsite, setGalleryWebsite] = useState('');
  const [galleryInstagram, setGalleryInstagram] = useState('');
  const [galleryLinkedin, setGalleryLinkedin] = useState('');
  const [galleryX, setGalleryX] = useState('');
  const [lightLogo, setLightLogo] = useState<File | null>(null);
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogoPreview, setLightLogoPreview] = useState<string | null>(null);
  const [darkLogoPreview, setDarkLogoPreview] = useState<string | null>(null);
  
  // Buyer/Collector/Patron fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerCity, setBuyerCity] = useState('');
  const [buyerState, setBuyerState] = useState('');
  const [buyerPostal, setBuyerPostal] = useState('');
  const [buyerCountry, setBuyerCountry] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerWebsite, setBuyerWebsite] = useState('');
  const [buyerInstagram, setBuyerInstagram] = useState('');
  const [buyerLinkedin, setBuyerLinkedin] = useState('');
  const [buyerX, setBuyerX] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [buyerPhoto, setBuyerPhoto] = useState<File | null>(null);
  const [buyerPhotoPreview, setBuyerPhotoPreview] = useState<string | null>(null);
  
  const { register } = useAuth();
  const router = useRouter();

  // Gallery data from Firebase
  const [galleries, setGalleries] = useState<Array<{id: string, name: string, city: string, state: string}>>([]);
  const [galleriesLoading, setGalleriesLoading] = useState(false);

  const taxClassifications = [
    "Individual/Sole Proprietor",
    "C Corporation",
    "S Corporation",
    "Partnership",
    "Trust/Estate",
    "LLC",
  ];

  // Fetch galleries from Firebase
  const fetchGalleries = async () => {
    setGalleriesLoading(true);
    try {
      const galleriesRef = collection(db, 'Gallery');
      const q = query(galleriesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const galleriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        city: doc.data().city || '',
        state: doc.data().state || ''
      }));
      
      setGalleries(galleriesData);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setGalleriesLoading(false);
    }
  };

  // Load galleries when component mounts
  useEffect(() => {
    fetchGalleries();
  }, []);

  // Upload file to Firebase Storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const filteredGalleries = galleries.filter(gallery =>
    gallery.name.toLowerCase().includes(gallerySearch.toLowerCase()) ||
    gallery.city.toLowerCase().includes(gallerySearch.toLowerCase())
  );

  const userTypes = [
    {
      id: USER_TYPES.USER,
      title: 'User',
      description: 'Basic user account',
      icon: User
    },
    {
      id: USER_TYPES.ARTIST,
      title: 'Artist',
      description: 'Create and sell your artwork',
      icon: Palette
    },
    {
      id: USER_TYPES.GALLERY,
      title: 'Gallery',
      description: 'Manage and showcase artwork',
      icon: Building2
    },
    {
      id: USER_TYPES.COLLECTOR,
      title: 'Collector',
      description: 'Build and manage collections',
      icon: Users
    },
    {
      id: USER_TYPES.PATRON,
      title: 'Patron',
      description: 'Support artists and galleries',
      icon: Crown
    }
  ];

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  const handleContinue = () => {
    if (selectedUserType) {
      setStep('form');
    }
  };

  const handleBack = () => {
    setStep('userType');
  };

  const handleLogoUpload = (type: 'light' | 'dark', file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (type === 'light') {
      setLightLogo(file);
      setLightLogoPreview(previewUrl);
    } else {
      setDarkLogo(file);
      setDarkLogoPreview(previewUrl);
    }
  };

  const clearLogo = (type: 'light' | 'dark') => {
    if (type === 'light') {
      setLightLogo(null);
      setLightLogoPreview(null);
    } else {
      setDarkLogo(null);
      setDarkLogoPreview(null);
    }
  };

  const handlePhotoUpload = (type: 'artist' | 'user', file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (type === 'artist') {
      setArtistPhoto(file);
      setArtistPhotoPreview(previewUrl);
    } else {
      setBuyerPhoto(file);
      setBuyerPhotoPreview(previewUrl);
    }
  };

  const clearPhoto = (type: 'artist' | 'user') => {
    if (type === 'artist') {
      setArtistPhoto(null);
      setArtistPhotoPreview(null);
    } else {
      setBuyerPhoto(null);
      setBuyerPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate required fields based on user type
    if (selectedUserType === USER_TYPES.ARTIST && !selectedGallery) {
      setError('Please select a gallery to associate with');
      return;
    }

    if (selectedUserType === USER_TYPES.GALLERY && !galleryName) {
      setError('Gallery name is required');
      return;
    }

    setLoading(true);

    try {
      // First, register the user with Firebase Auth
      await register(email, password, selectedUserType);
      
      // Upload files if they exist
      let photoURL = null;
      let lightLogoURL = null;
      let darkLogoURL = null;

      if (selectedUserType === USER_TYPES.ARTIST && artistPhoto) {
        photoURL = await uploadFile(artistPhoto, `users/artists/${Date.now()}_${artistPhoto.name}`);
      }

      if (selectedUserType === USER_TYPES.USER && buyerPhoto) {
        photoURL = await uploadFile(buyerPhoto, `users/users/${Date.now()}_${buyerPhoto.name}`);
      }

      if (selectedUserType === 'gallery') {
        if (lightLogo) {
          lightLogoURL = await uploadFile(lightLogo, `galleries/logos/light/${Date.now()}_${lightLogo.name}`);
        }
        if (darkLogo) {
          darkLogoURL = await uploadFile(darkLogo, `galleries/logos/dark/${Date.now()}_${darkLogo.name}`);
        }
      }

      // Prepare user data for Firestore (without password)
      const userData = {
        email,
        userType: ['user', selectedUserType], // Set userType as array with 'user' as base type
        createdAt: new Date(),
        updatedAt: new Date(),
        // Artist data
        ...(selectedUserType === 'artist' && {
          artistName,
          biography,
          specialty,
          nationality,
          birthYear,
          deathYear,
          phone,
          altContact,
          altEmail,
          address1,
          address2,
          city,
          state,
          postal,
          country,
          galleryId: selectedGallery,
          taxId,
          taxClassification,
          businessName,
          instagram,
          linkedin,
          x,
          website,
          notes,
          portalAccess,
          photoURL
        }),
        // Gallery data
        ...(selectedUserType === 'gallery' && {
          galleryName,
          galleryDescription,
          galleryAddress,
          galleryPhone,
          galleryWebsite,
          instagram: galleryInstagram,
          linkedin: galleryLinkedin,
          x: galleryX,
          lightLogoURL,
          darkLogoURL
        }),
        // Buyer/Collector/Patron data
        ...(['buyer', 'collector', 'patron'].includes(selectedUserType) && {
          firstName,
          lastName,
          phone: buyerPhone,
          address: buyerAddress,
          city: buyerCity,
          state: buyerState,
          postal: buyerPostal,
          country: buyerCountry,
          website: buyerWebsite,
          instagram: buyerInstagram,
          linkedin: buyerLinkedin,
          x: buyerX,
          notes: buyerNotes,
          photoURL
        })
      };

      // Save user data to "users" collection
      const usersRef = collection(db, 'users');
      const userDocRef = await addDoc(usersRef, userData);
      console.log('User data saved to Firestore with ID:', userDocRef.id);

      // If artist selected a gallery, also save to "Gallery" collection
      if (selectedUserType === USER_TYPES.ARTIST && selectedGallery) {
        const galleryData = {
          ...userData,
          userId: userDocRef.id,
          galleryId: selectedGallery,
          addedToGalleryAt: new Date()
        };

        const galleryRef = collection(db, 'Gallery');
        const galleryDocRef = await addDoc(galleryRef, galleryData);
        console.log('Artist data also saved to Gallery collection with ID:', galleryDocRef.id);
      }

              router.push('/home');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please try a different email or sign in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (selectedUserType) {
      case USER_TYPES.USER:
      case USER_TYPES.COLLECTOR:
      case USER_TYPES.PATRON:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-medium text-foreground">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-medium text-foreground">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div className="space-y-4">
                  <Label className="text-xs font-medium text-foreground">Profile Picture</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    {buyerPhotoPreview ? (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={buyerPhotoPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => clearPhoto('user')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {buyerPhoto?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handlePhotoUpload('user', e.target.files[0])}
                          className="hidden"
                          id="buyer-photo-upload"
                        />
                        <label
                          htmlFor="buyer-photo-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          Upload Profile Picture
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="buyerEmail" className="text-xs font-medium text-foreground">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="buyerEmail"
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerPhone" className="text-xs font-medium text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Address Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="buyerAddress" className="text-xs font-medium text-foreground">
                  Address
                </Label>
                <Input
                  id="buyerAddress"
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerCity" className="text-xs font-medium text-foreground">
                    City
                  </Label>
                  <Input
                    id="buyerCity"
                    type="text"
                    value={buyerCity}
                    onChange={(e) => setBuyerCity(e.target.value)}
                    placeholder="City"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerState" className="text-xs font-medium text-foreground">
                    State/Province
                  </Label>
                  <Input
                    id="buyerState"
                    type="text"
                    value={buyerState}
                    onChange={(e) => setBuyerState(e.target.value)}
                    placeholder="State"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerPostal" className="text-xs font-medium text-foreground">
                    Postal Code
                  </Label>
                  <Input
                    id="buyerPostal"
                    type="text"
                    value={buyerPostal}
                    onChange={(e) => setBuyerPostal(e.target.value)}
                    placeholder="Postal code"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerCountry" className="text-xs font-medium text-foreground">
                  Country
                </Label>
                <Input
                  id="buyerCountry"
                  type="text"
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  placeholder="Country"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerInstagram" className="text-xs font-medium text-foreground">
                    Instagram
                  </Label>
                  <Input
                    id="buyerInstagram"
                    type="text"
                    value={buyerInstagram}
                    onChange={(e) => setBuyerInstagram(e.target.value)}
                    placeholder="Instagram handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerLinkedin" className="text-xs font-medium text-foreground">
                    LinkedIn
                  </Label>
                  <Input
                    id="buyerLinkedin"
                    type="text"
                    value={buyerLinkedin}
                    onChange={(e) => setBuyerLinkedin(e.target.value)}
                    placeholder="LinkedIn profile URL or handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerX" className="text-xs font-medium text-foreground">
                    X (Twitter)
                  </Label>
                  <Input
                    id="buyerX"
                    type="text"
                    value={buyerX}
                    onChange={(e) => setBuyerX(e.target.value)}
                    placeholder="X handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerWebsite" className="text-xs font-medium text-foreground">
                    Website
                  </Label>
                  <Input
                    id="buyerWebsite"
                    type="url"
                    value={buyerWebsite}
                    onChange={(e) => setBuyerWebsite(e.target.value)}
                    placeholder="https://your-website.com"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerNotes" className="text-xs font-medium text-foreground">
                  Notes & Special Instructions
                </Label>
                <textarea
                  id="buyerNotes"
                  value={buyerNotes}
                  onChange={(e) => setBuyerNotes(e.target.value)}
                  placeholder="Enter any additional notes or special instructions"
                  className="w-full border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
                  rows={3}
                />
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                `Create ${selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)} Account`
              )}
            </Button>
          </form>
        );

      case USER_TYPES.ARTIST:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="artistName" className="text-xs font-medium text-foreground">
                      Artist Name *
                    </Label>
                    <Input
                      id="artistName"
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biography" className="text-xs font-medium text-foreground">
                      Biography
                    </Label>
                    <textarea
                      id="biography"
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      placeholder="Tell us about yourself and your art"
                      className="w-full border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-xs font-medium text-foreground">
                        Specialty/Medium
                      </Label>
                      <Input
                        id="specialty"
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="e.g., Oil Painting, Sculpture, Photography"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality" className="text-xs font-medium text-foreground">
                        Nationality
                      </Label>
                      <Input
                        id="nationality"
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Your nationality"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthYear" className="text-xs font-medium text-foreground">
                        Birth Year
                      </Label>
                      <Input
                        id="birthYear"
                        type="text"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="YYYY"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deathYear" className="text-xs font-medium text-foreground">
                        Death Year (if applicable)
                      </Label>
                      <Input
                        id="deathYear"
                        type="text"
                        value={deathYear}
                        onChange={(e) => setDeathYear(e.target.value)}
                        placeholder="YYYY"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div className="space-y-4">
                  <Label className="text-xs font-medium text-foreground">Profile Picture</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    {artistPhotoPreview ? (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={artistPhotoPreview}
                            alt="Artist preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => clearPhoto('artist')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {artistPhoto?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handlePhotoUpload('artist', e.target.files[0])}
                          className="hidden"
                          id="artist-photo-upload"
                        />
                        <label
                          htmlFor="artist-photo-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          Upload Profile Picture
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altContact" className="text-xs font-medium text-foreground">
                    Alternate Contact
                  </Label>
                  <Input
                    id="altContact"
                    type="text"
                    value={altContact}
                    onChange={(e) => setAltContact(e.target.value)}
                    placeholder="e.g., Agent or Assistant"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="altEmail" className="text-xs font-medium text-foreground">
                  Alternate Email
                </Label>
                <Input
                  id="altEmail"
                  type="email"
                  value={altEmail}
                  onChange={(e) => setAltEmail(e.target.value)}
                  placeholder="alternate@example.com"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Address Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address1" className="text-xs font-medium text-foreground">
                  Address Line 1
                </Label>
                <Input
                  id="address1"
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Street address"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2" className="text-xs font-medium text-foreground">
                  Address Line 2
                </Label>
                <Input
                  id="address2"
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Apt, Suite, etc."
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-medium text-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-medium text-foreground">
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal" className="text-xs font-medium text-foreground">
                    Postal Code
                  </Label>
                  <Input
                    id="postal"
                    type="text"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    placeholder="Postal code"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-xs font-medium text-foreground">
                  Country
                </Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Gallery Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Gallery Association</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">
                    Select Gallery *
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={fetchGalleries}
                    disabled={galleriesLoading}
                    className="text-xs"
                  >
                    {galleriesLoading ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      onFocus={() => setShowGalleryDropdown(true)}
                      placeholder="Search for a gallery..."
                      className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                  
                  {showGalleryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                      {galleriesLoading ? (
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ) : filteredGalleries.length > 0 ? (
                        filteredGalleries.map((gallery) => (
                          <div
                            key={gallery.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setSelectedGallery(gallery.id);
                              setGallerySearch(gallery.name);
                              setShowGalleryDropdown(false);
                            }}
                          >
                            <div className="font-medium">{gallery.name}</div>
                            <div className="text-sm text-muted-foreground">{gallery.city}, {gallery.state}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">
                          {gallerySearch ? 'No galleries found' : 'No galleries available'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Tax Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="taxId" className="text-xs font-medium text-foreground">
                  Tax ID Number
                </Label>
                <Input
                  id="taxId"
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g., SSN or EIN"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxClassification" className="text-xs font-medium text-foreground">
                  Tax Classification
                </Label>
                <select
                  id="taxClassification"
                  value={taxClassification}
                  onChange={(e) => setTaxClassification(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="">Select classification</option>
                  {taxClassifications.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-xs font-medium text-foreground">
                  Business Name (if different)
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business name"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-xs font-medium text-foreground">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-xs font-medium text-foreground">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn profile URL or handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x" className="text-xs font-medium text-foreground">
                    X (Twitter)
                  </Label>
                  <Input
                    id="x"
                    type="text"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    placeholder="X handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-medium text-foreground">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://your-website.com"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs font-medium text-foreground">
                  Notes & Special Instructions
                </Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes or special instructions"
                  className="w-full border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="portalAccess"
                  checked={portalAccess}
                  onChange={(e) => setPortalAccess(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <Label htmlFor="portalAccess" className="text-sm text-foreground">
                  Enable Artist Portal Access
                </Label>
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                'Create Artist Account'
              )}
            </Button>
          </form>
        );

      case USER_TYPES.GALLERY:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="galleryName" className="text-xs font-medium text-foreground">
                Gallery Name *
              </Label>
              <Input
                id="galleryName"
                type="text"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                placeholder="Enter your gallery name"
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="galleryDescription" className="text-xs font-medium text-foreground">
                Gallery Description
              </Label>
              <textarea
                id="galleryDescription"
                value={galleryDescription}
                onChange={(e) => setGalleryDescription(e.target.value)}
                placeholder="Tell us about your gallery"
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="galleryPhone" className="text-xs font-medium text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="galleryPhone"
                  type="tel"
                  value={galleryPhone}
                  onChange={(e) => setGalleryPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryWebsite" className="text-xs font-medium text-foreground">
                  Website
                </Label>
                <Input
                  id="galleryWebsite"
                  type="url"
                  value={galleryWebsite}
                  onChange={(e) => setGalleryWebsite(e.target.value)}
                  placeholder="https://your-gallery.com"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Social Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="galleryInstagram" className="text-xs font-medium text-foreground">
                    Instagram
                  </Label>
                  <Input
                    id="galleryInstagram"
                    type="text"
                    value={galleryInstagram}
                    onChange={(e) => setGalleryInstagram(e.target.value)}
                    placeholder="Instagram handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="galleryLinkedin" className="text-xs font-medium text-foreground">
                    LinkedIn
                  </Label>
                  <Input
                    id="galleryLinkedin"
                    type="text"
                    value={galleryLinkedin}
                    onChange={(e) => setGalleryLinkedin(e.target.value)}
                    placeholder="LinkedIn profile URL or handle"
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryX" className="text-xs font-medium text-foreground">
                  X (Twitter)
                </Label>
                <Input
                  id="galleryX"
                  type="text"
                  value={galleryX}
                  onChange={(e) => setGalleryX(e.target.value)}
                  placeholder="X handle"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="galleryAddress" className="text-xs font-medium text-foreground">
                Gallery Address
              </Label>
              <Input
                id="galleryAddress"
                type="text"
                value={galleryAddress}
                onChange={(e) => setGalleryAddress(e.target.value)}
                placeholder="Enter your gallery address"
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label className="text-xs font-medium text-foreground">
                Gallery Logos
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Light Logo */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Light Logo (for dark backgrounds)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {lightLogoPreview ? (
                      <div className="relative">
                        <img
                          src={lightLogoPreview}
                          alt="Light logo preview"
                          className="w-full h-20 object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => clearLogo('light')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload('light', e.target.files[0])}
                          className="hidden"
                          id="light-logo-upload"
                        />
                        <label
                          htmlFor="light-logo-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          Upload Light Logo
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dark Logo */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Dark Logo (for light backgrounds)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {darkLogoPreview ? (
                      <div className="relative">
                        <img
                          src={darkLogoPreview}
                          alt="Dark logo preview"
                          className="w-full h-20 object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => clearLogo('dark')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload('dark', e.target.files[0])}
                          className="hidden"
                          id="dark-logo-upload"
                        />
                        <label
                          htmlFor="dark-logo-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                        >
                          Upload Dark Logo
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                'Create Gallery Account'
              )}
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  if (step === 'userType') {
    return (
      <div className="min-h-screen bg-background">
        {/* Theme Toggle - Fixed Position */}
        <div className="flex items-center justify-between mb-4 p-4 z-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                  className="mr-2"
                >
                  ← Back
                </Button>

          <ThemeToggle />

              </div>

        {/* Full Screen User Type Selection */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24">
          <div className="w-full max-w-6xl space-y-4">
            {/* Header */}
            <div className="text-center">
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                <span className="text-muted-foreground">Welcome</span> 
                <span className="text-foreground"> to </span> 
                <span className="text-primary">ExhibitIQ</span>
              </h1>
              <div className="lg:flex grid items-center mt-1 justify-center">
              <p className="text-sm text-muted-foreground">
                Choose what fits you best below
              </p>
              <p className="text-sm text-muted-foreground lg:ml-1"> Already have an account or want to see a demo?{' '}
              <a href="/auth/login" className="text-primary hover:text-primary/90 font-semibold">
                Login here
              </a>
            </p>
              </div>
            </div>

            {/* User Type Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTypes.map((userType) => {
                const IconComponent = userType.icon;
                const isSelected = selectedUserType === userType.id;
                
                return (
                  <Card
                    key={userType.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-primary shadow-lg scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => handleUserTypeSelect(userType.id)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                      
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-foreground" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {userType.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {userType.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedUserType}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Full Screen Register Form */}
      <div className="flex-1 flex items-start justify-center px-8 lg:px-16 xl:px-24 py-8">
        <div className="w-full max-w-4xl space-y-4">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-2"
              >
                ← Back
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Fill in your details to create your {selectedUserType} account
            </p>
          </div>

          {/* Dynamic Form */}
          {renderForm()}

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <a href="/auth/login" className="text-primary hover:text-primary/90 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>


    </div>
  );
} 