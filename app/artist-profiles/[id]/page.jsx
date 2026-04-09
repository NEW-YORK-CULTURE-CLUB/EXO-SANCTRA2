"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Edit, QrCode, Trash, Plus, Upload, Mail, Link2, Loader2, Eye, MoreHorizontal, Palette, Camera, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import Image from "next/image";
// import { ArtistService } from "@/lib/artist-service"; // Disabled - using mock data
// import { ArtworkService } from "@/lib/artwork-service"; // Disabled - using mock data
import { useToast } from "@/hooks/use-toast";
import { ArtistDetailPageSkeleton } from "@/components/artist-profiles-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { useGallery } from "@/contexts/gallery-context"; // Disabled - using mock data
import { artistProfilesData } from "@/data/artistProfilesData";

const taxClassifications = [
  "Individual/Sole Proprietor",
  "C Corporation",
  "S Corporation",
  "Partnership",
  "Trust/Estate",
  "LLC",
];

const ArtistProfileDetails = () => {
  const [tab, setTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState(null);
  const [form, setForm] = useState({});
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', type: '', file: null });
  const [artworks, setArtworks] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDemoGallery, setIsDemoGallery] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  // const { gallery } = useGallery(); // Disabled - using mock data
  const gallery = { galleryId: 'demo-gallery', name: 'Demo Gallery' }; // Mock gallery

  const artistId = params.id;

  // Load demo data immediately
  useEffect(() => {
    try {
      console.log('Loading demo data for artist:', artistId);
      setIsDemoGallery(true);
      
      // Find the artist in dummy data by ID or name
      console.log('Searching for artist in dummy data. artistId:', artistId, 'artistProfilesData:', artistProfilesData);
      const dummyArtist = artistProfilesData.find(a => 
        a.id.toString() === artistId || 
        a.name.toLowerCase() === artistId.toLowerCase()
      );
      
      if (dummyArtist) {
        console.log('Found dummy artist:', dummyArtist);
        setArtist(dummyArtist);
        setForm({
          name: dummyArtist.name || '',
          specialty: dummyArtist.specialty || '',
          biography: dummyArtist.specialty || '', // Use specialty as biography for demo
          nationality: 'American', // Default for demo
          status: dummyArtist.status?.toLowerCase() || 'pending',
          birthYear: '1900', // Default for demo
          deathYear: '', // Default for demo
          email: dummyArtist.email || '',
          phone: dummyArtist.phone || '',
          address1: dummyArtist.location || '',
          address2: '',
          city: dummyArtist.location?.split(', ')[0] || '',
          state: dummyArtist.location?.split(', ')[1] || '',
          postal: '',
          country: 'United States', // Default for demo
          taxId: '123-45-6789', // Default for demo
          taxClassification: 'Individual/Sole Proprietor', // Default for demo
          businessName: dummyArtist.name || '',
          notes: `Demo profile for ${dummyArtist.name}`,
        });
        setLoading(false);
      } else {
        console.log('Artist not found in dummy data. artistId:', artistId, 'Available artists:', artistProfilesData.map(a => ({ id: a.id, name: a.name })));
        toast({
          title: "Artist Not Found",
          description: "The requested artist profile could not be found in demo data.",
          variant: "destructive",
        });
        router.push("/artist-profiles");
      }
    } catch (error) {
      console.error('Error loading artist data:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profile.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [artistId, router, toast]);


  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setPhotoFile(file);
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleCancel = () => {
    // Reset form to original artist data
    setForm({
      name: artist.name || '',
      specialty: artist.specialty || '',
      biography: artist.biography || '',
      nationality: artist.nationality || '',
      status: artist.status || 'pending',
      birthYear: artist.birthYear || '',
      deathYear: artist.deathYear || '',
      email: artist.email || '',
      phone: artist.phone || '',
      address1: artist.address1 || '',
      address2: artist.address2 || '',
      city: artist.city || '',
      state: artist.state || '',
      postal: artist.postal || '',
      country: artist.country || '',
      taxId: artist.taxId || '',
      taxClassification: artist.taxClassification || '',
      businessName: artist.businessName || '',
      notes: artist.notes || '',
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Upload photo if a new one was selected
      let photoURL = artist.photoURL;
      if (photoFile) {
        try {
          const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const { storage } = await import('@/lib/firebase');
          
          const photoRef = ref(storage, `artist-photos/${Date.now()}-${photoFile.name}`);
          const snapshot = await uploadBytes(photoRef, photoFile);
          photoURL = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          toast({
            title: "Error",
            description: "Failed to upload photo. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare updates object with all form fields
      const updates = {
        name: form.name,
        specialty: form.specialty,
        biography: form.biography,
        nationality: form.nationality,
        status: form.status,
        birthYear: form.birthYear,
        deathYear: form.deathYear,
        email: form.email,
        phone: form.phone,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        state: form.state,
        postal: form.postal,
        country: form.country,
        taxId: form.taxId,
        taxClassification: form.taxClassification,
        businessName: form.businessName,
        notes: form.notes,
        photoURL: photoURL
      };

      await ArtistService.updateArtistProfile(artistId, updates);
      
      // Update local artist state
      setArtist(prev => ({ ...prev, ...updates }));
      
      // Reset photo state
      setPhotoFile(null);
      setPhotoPreview(null);
      
      toast({
        title: "Profile Updated",
        description: "Artist profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating artist:', error);
      toast({
        title: "Error",
        description: "Failed to update artist profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artist profile? This action cannot be undone.')) {
      try {
        // Note: You'll need to implement deleteArtistProfile in ArtistService
        // await ArtistService.deleteArtistProfile(artistId);
        toast({
          title: "Profile Deleted",
          description: "Artist profile has been successfully deleted.",
        });
        router.push("/artist-profiles");
      } catch (error) {
        console.error('Error deleting artist:', error);
        toast({
          title: "Error",
          description: "Failed to delete artist profile.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddDocument = async () => {
    try {
      if (!newDocument.name || !newDocument.type || !newDocument.file) {
        toast({
          title: "Error",
          description: "Please fill in all document fields.",
          variant: "destructive",
        });
        return;
      }

      // Upload document file
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('@/lib/firebase');
      
      const docRef = ref(storage, `artist-documents/${Date.now()}-${newDocument.file.name}`);
      const snapshot = await uploadBytes(docRef, newDocument.file);
      const url = await getDownloadURL(snapshot.ref);

      // Create document object
      const document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        url: url
      };

      // Update artist with new document
      const updatedDocuments = [...(artist.additionalDocuments || []), document];
      await ArtistService.updateArtistProfile(artistId, { additionalDocuments: updatedDocuments });

      // Update local state
      setArtist(prev => ({ ...prev, additionalDocuments: updatedDocuments }));

      // Reset form
      setNewDocument({ name: '', type: '', file: null });
      setShowAddDocument(false);

      toast({
        title: "Document Added",
        description: "Document has been successfully added to the artist profile.",
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Error",
        description: "Failed to add document.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      const updatedDocuments = artist.additionalDocuments.filter(doc => doc.id !== documentId);
      await ArtistService.updateArtistProfile(artistId, { additionalDocuments: updatedDocuments });

      // Update local state
      setArtist(prev => ({ ...prev, additionalDocuments: updatedDocuments }));

      toast({
        title: "Document Removed",
        description: "Document has been removed from the artist profile.",
      });
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: "Error",
        description: "Failed to remove document.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ArtistDetailPageSkeleton />;
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Artist not found</p>
          <Button onClick={() => router.push("/artist-profiles")} className="mt-4">
            Back to Artist Profiles
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Helper function to check if tax info is complete
  const isTaxInfoComplete = () => {
    return artist.taxId && artist.taxClassification && artist.w9Url;
  };

  // Helper function to check if profile is complete
  const isProfileComplete = () => {
    return artist.name && artist.email && artist.biography && artist.specialty;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-between mb-0">
        <Button variant="outline" className="mb-6 w-full sm:w-auto" onClick={() => router.push("/artist-profiles")}> 
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Artist Profiles 
        </Button>
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => window.open(`mailto:${artist.email}`, '_blank')}
            >
              <Mail className="w-4 h-4 mr-1" /> Contact
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={async () => {
                const url = `${window.location.origin}/marketplace/artist/${artistId}`;
                try {
                  await navigator.clipboard.writeText(url);
                  toast({
                    title: "Link Copied",
                    description: "Artist marketplace link has been copied to clipboard.",
                  });
                } catch (error) {
                  console.error('Failed to copy link:', error);
                  toast({
                    title: "Error",
                    description: "Failed to copy link to clipboard.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Link2 className="w-4 h-4 mr-1" /> Generate Link
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full sm:w-auto">
              <Trash className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="ghost" onClick={handleCancel} disabled={saving} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="default" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Profile Card */}
        <div className="flex flex-col items-center w-full lg:w-[350px]">
          <div className="w-full max-w-[280px] sm:mt-0 mt-5 lg:max-w-none aspect-square rounded-lg flex items-center justify-center text-muted-foreground text-4xl overflow-hidden relative bg-muted/10">
            
             {/* VIP and Active badges in top right */}
        <div className="absolute right-3 top-3 lg:right-6 lg:top-6 flex gap-2">
           {/* <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">VIP</Badge> */}
          {/* <Badge className="rounded-full px-2 py-1 lg:px-3 text-xs font-semibold bg-green-500 text-white">Active</Badge> */}
        </div>

            {photoPreview ? (
              <Image 
                src={photoPreview || artist.photoURL} 
                alt={`${artist.name} photo preview`} 
                width={320} 
                height={320} 
                quality={95}
                priority
                className="object-cover rounded-lg w-full h-full shadow-lg" 
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 160px"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : artist.photoURL ? (
              <Image 
                src={artist.photoURL} 
                alt={`${artist.name} photo`} 
                width={320} 
                height={320} 
                quality={95}
                priority
                className="object-cover rounded-lg w-full h-full shadow-lg" 
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 160px"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <Image 
                src="/placeholder.jpg" 
                alt="Artist placeholder" 
                width={320} 
                height={320} 
                quality={95}
                className="object-cover rounded-lg w-full h-full shadow-lg" 
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 160px"
              />
            )}
            
            {/* Fallback avatar when image fails to load */}
            <div className="hidden w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 items-center justify-center text-3xl sm:text-4xl font-bold text-primary/60">
              <div className="flex items-center justify-center w-full h-full">
                {artist.name?.charAt(0) || '?'}
              </div>
            </div>
                    
            {/* Photo upload overlay when editing */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="artist-photo-upload"
                  />
                  <label htmlFor="artist-photo-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </label>
                  {photoPreview && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemovePhoto}
                      className="cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 w-full px-4 lg:px-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center lg:text-left">{artist.name}</h2>
            <div className="text-base sm:text-lg text-muted-foreground mb-2 text-center lg:text-left">{artist.specialty}</div>
            <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadgeColor(artist.status)}`}>
                {artist.status?.charAt(0).toUpperCase() + artist.status?.slice(1)}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isTaxInfoComplete() ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                Tax Info: {isTaxInfoComplete() ? 'Complete' : 'Incomplete'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isProfileComplete() ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                Profile: {isProfileComplete() ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-sm sm:text-base">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Mail className="w-4 h-4 flex-shrink-0" /> 
                <span className="break-all">{artist.email}</span>
              </div>
              {artist.phone && (
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="font-medium flex-shrink-0">📞</span> 
                  <span className="break-all">{artist.phone}</span>
                </div>
              )}
              {(artist.city || artist.state) && (
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="font-medium flex-shrink-0">📍</span> 
                  <span className="break-all">{[artist.city, artist.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right: Tabs Content */}
        <div className="flex-1 w-full">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:pb-0 pb-24">
              <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
              <TabsTrigger value="tax" className="text-xs sm:text-sm">Tax Info</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
              <TabsTrigger value="artworks" className="text-xs sm:text-sm">Artworks</TabsTrigger>
            </TabsList>
            {/* Details Tab */}
            <TabsContent value="details">
              {!isEditing ? (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Biography</div>
                        <div className="mb-6 text-sm sm:text-base">{artist.biography || 'No biography provided'}</div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Nationality</div>
                        <div className="mb-6 text-sm sm:text-base">{artist.nationality || 'Not specified'}</div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Notes</div>
                        <div className="text-sm sm:text-base">{artist.notes || 'No additional notes'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Birth Year</div>
                        <div className="mb-6 text-sm sm:text-base">{artist.birthYear || 'Not specified'}</div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Death Year</div>
                        <div className="mb-6 text-sm sm:text-base">{artist.deathYear || 'Not applicable'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Artist Name</div>
                        <input name="name" value={form.name} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Specialty/Medium</div>
                        <input name="specialty" value={form.specialty} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Biography</div>
                        <textarea name="biography" value={form.biography} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" rows={3} />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Notes</div>
                        <textarea name="notes" value={form.notes} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" rows={2} />
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Nationality</div>
                        <input name="nationality" value={form.nationality} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Status</div>
                        <select name="status" value={form.status} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base">
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="text-muted-foreground text-sm font-medium mb-1">Birth Year</div>
                            <input name="birthYear" value={form.birthYear} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                          </div>
                          <div className="flex-1">
                            <div className="text-muted-foreground text-sm font-medium mb-1">Death Year (if applicable)</div>
                            <input name="deathYear" value={form.deathYear} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            {/* Contact Tab */}
            <TabsContent value="contact">
              {!isEditing ? (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Email</div>
                        <div className="mb-6 text-sm sm:text-base break-all">{artist.email}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Phone</div>
                        <div className="mb-6 text-sm sm:text-base">{artist.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm font-medium mb-1">Address</div>
                    <div className="text-sm sm:text-base" style={{ whiteSpace: 'pre-line' }}>
                      {[artist.address1, artist.address2, `${artist.city || ''}${artist.city && artist.state ? ', ' : ''}${artist.state || ''} ${artist.postal || ''}`, artist.country].filter(Boolean).join('\n') || 'No address provided'}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Email Address</div>
                        <input name="email" value={form.email} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Phone Number</div>
                        <input name="phone" value={form.phone} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Address Line 1</div>
                        <input name="address1" value={form.address1} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Address Line 2</div>
                        <input name="address2" value={form.address2} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">City</div>
                        <input name="city" value={form.city} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="text-muted-foreground text-sm font-medium mb-1">State/Province</div>
                            <input name="state" value={form.state} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                          </div>
                          <div className="flex-1">
                            <div className="text-muted-foreground text-sm font-medium mb-1">Postal Code</div>
                            <input name="postal" value={form.postal} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                          </div>
                        </div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Country</div>
                        <input name="country" value={form.country} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            {/* Tax Info Tab */}
            <TabsContent value="tax">
              {!isEditing ? (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Tax ID</div>
                        <div className="mb-4 text-sm sm:text-base">{artist.taxId || 'Not provided'}</div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Business Name</div>
                        <div className="mb-4 text-sm sm:text-base">{artist.businessName || 'Not provided'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Classification</div>
                        <div className="mb-4 text-sm sm:text-base">{artist.taxClassification || 'Not provided'}</div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">W-9 Status</div>
                        <div className="mb-4 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${artist.w9Url ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {artist.w9Url ? 'Uploaded' : 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {artist.w9Url && (
                      <div className="mt-4">
                        <div className="border border-border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 gap-2">
                          <div>
                            <span className="font-medium text-sm sm:text-base">W-9 Form</span>
                            <span className="text-xs text-muted-foreground ml-2">Uploaded</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(artist.w9Url, '_blank')} className="w-full sm:w-auto">View</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="grid gap-6 lg:gap-8">
                      <div>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Tax ID Number</div>
                        <input name="taxId" value={form.taxId} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                        <div className="text-muted-foreground text-sm font-medium mb-1">Tax Classification</div>
                        <select name="taxClassification" value={form.taxClassification} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base">
                          <option value="">Select classification</option>
                          {taxClassifications.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="text-muted-foreground text-sm font-medium mb-1">Business Name (if different)</div>
                        <input name="businessName" value={form.businessName} onChange={handleInput} className="w-full border border-input rounded px-3 py-2 mb-4 bg-background text-foreground text-sm sm:text-base" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div className="font-semibold text-lg">Documents</div>
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 w-full sm:w-auto"
                        onClick={() => setShowAddDocument(true)}
                      >
                        <Upload className="w-4 h-4" /> Upload Document
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {artist.additionalDocuments && artist.additionalDocuments.length > 0 ? (
                      artist.additionalDocuments.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-border rounded p-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm sm:text-base block truncate">{doc.name}</span>
                            <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-semibold mt-1 inline-block">{doc.type}</span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')} className="flex-1 sm:flex-none">View</Button>
                            <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')} className="flex-1 sm:flex-none">Download</Button>
                            {isEditing && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No documents uploaded yet.</p>
                        {isEditing && (
                          <p className="text-sm mt-2">Click "Upload Document" to add documentation</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Add Document Modal */}
              {showAddDocument && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Document Name</label>
                        <input
                          value={newDocument.name}
                          onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Artist Statement"
                          className="w-full border border-input rounded px-3 py-2 mt-1 bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Document Type</label>
                        <select
                          value={newDocument.type}
                          onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full border border-input rounded px-3 py-2 mt-1 bg-background text-foreground"
                        >
                          <option value="">Select document type</option>
                          <option value="Artist Statement">Artist Statement</option>
                          <option value="CV/Resume">CV/Resume</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="Press Kit">Press Kit</option>
                          <option value="Contract">Contract</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Document File</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setNewDocument(prev => ({ ...prev, file }));
                            }
                          }}
                          className="w-full border border-input rounded px-3 py-2 mt-1 bg-background text-foreground"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddDocument(false);
                            setNewDocument({ name: '', type: '', file: null });
                          }}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddDocument}
                          disabled={!newDocument.name || !newDocument.type || !newDocument.file}
                          className="w-full sm:w-auto"
                        >
                          Add Document
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            {/* Artworks Tab */}
            <TabsContent value="artworks">
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                    <div className="font-semibold text-lg">Associated Artworks</div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Badge variant="outline" className="text-xs sm:text-sm">{artworks.length} pieces</Badge>
                      <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                        <Link href="/inventory/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Artwork
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  {artworks.length > 0 ? (
                    <div className="space-y-4">
                      {artworks.map((artwork) => (
                        <Card 
                          key={artwork.id} 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200"
                          onClick={() => router.push(`/inventory/${artwork.sku}`)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex space-x-3 sm:space-x-4">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0">
                                {artwork.images?.[0] ? (
                                  <img 
                                    src={artwork.images[0]} 
                                    alt={artwork.title || 'Artwork'} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target;
                                      target.style.display = 'none';
                                      target.parentElement?.classList.add('bg-muted/40');
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Palette className="w-4 h-4 sm:w-6 sm:h-6" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-xs sm:text-sm mb-1 truncate">{artwork.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{artwork.medium}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                  <span className="text-xs sm:text-sm font-medium text-primary">
                                    {formatPrice(artwork.price)}
                                  </span>
                                  <Badge variant={artwork.status === 'active' ? 'default' : 'secondary'} className="text-xs w-fit">
                                    {artwork.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-20 mx-auto" />
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">No Artworks Available</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        This artist doesn't have any artworks listed yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileDetails;
