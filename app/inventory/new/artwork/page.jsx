"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChevronLeft, Upload, Loader2, X, Search, CheckCircle, AlertCircle, FileText, Shield, FileCheck, Star, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArtworkService } from "@/lib/artwork-service";
import { ArtistService } from "@/lib/artist-service";
import { useToast } from "@/hooks/use-toast";
import { useGallery } from "@/contexts/gallery-context";
import { useAuth } from "@/contexts/auth-context";
import { useConfetti } from "@/hooks/use-confetti";

const conditionOptions = ["Excellent", "Good", "Fair", "Poor"];
const priceTypeOptions = ["Fixed", "By Request", "Auction"];
const framedOptions = ["Framed", "Unframed"];
const nativeTypeOptions = ["Physical Native", "Digital Native"];
const storageLocationOptions = [
  "Main Gallery",
  "Vault A",
  "Vault B",
  "Exhibition Hall",
  "Storage Room A"
];

// Color options for artwork
const colorOptions = [
  "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", 
  "Brown", "Black", "White", "Gray", "Gold", "Silver", "Bronze",
  "Multicolor", "Monochrome", "Neutral", "Vibrant", "Pastel", "Earth Tones"
];

// Mood options for artwork
const moodOptions = [
  "Calm", "Energetic", "Melancholic", "Joyful", "Mysterious", "Peaceful",
  "Dramatic", "Whimsical", "Serious", "Playful", "Romantic", "Mystical",
  "Contemporary", "Classical", "Abstract", "Realistic", "Surreal", "Minimalist"
];

// Document type options with icons and descriptions
const documentTypeOptions = [
  {
    value: "certificate_of_authenticity",
    label: "Certificate of Authenticity",
    icon: CheckCircle,
    description: "Official certificate verifying the artwork's authenticity",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    value: "provenance",
    label: "Provenance",
    icon: FileCheck,
    description: "Documentation of artwork ownership history",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "insurance_records",
    label: "Insurance Records",
    icon: Shield,
    description: "Insurance documentation and appraisals",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    value: "miscellaneous",
    label: "Miscellaneous",
    icon: FileText,
    description: "Other relevant documentation",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-800"
  }
];

const AddNewArtwork = () => {
  const { gallery } = useGallery();
  const { user } = useAuth();
  const { triggerSuccessConfetti } = useConfetti();
  const [form, setForm] = useState({
    title: "",
    artist: "",
    artistId: "",
    year: "",
    medium: "",
    nativeType: "",
    // New dimension and weight fields
    unitSystem: "imperial", // imperial, metric, millimeters
    width: "",
    height: "",
    depth: "",
    weight: "",
    hasFrame: false,
    frameWidth: "",
    frameHeight: "",
    frameDepth: "",
    // End new fields
    condition: "",
    framed: "",
    price: "",
    priceType: "",
    location: "",
    description: "",
    artworkHistory: "",
    internalNotes: "",
    digitalFloor: false,
    images: [],
    certificates: [],
    matureContent: "",
    color: "",
    mood: "",
    distributionType: "",
    customColor: "",
    customMood: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artists, setArtists] = useState([]);
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  // Load artists on component mount
  useEffect(() => {
    loadArtists();
  }, []);

  // Filter artists based on search term
  useEffect(() => {
    if (artistSearchTerm.trim() === "") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  }, [artistSearchTerm, artists]);

  const loadArtists = async () => {
    try {
      const artistProfiles = await ArtistService.getAllArtistProfiles();
      setArtists(artistProfiles);
      setFilteredArtists(artistProfiles);
    } catch (error) {
      console.error('Error loading artists:', error);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "images") {
        setForm((prev) => ({ ...prev, [name]: [...(prev.images || []), ...Array.from(files)] }));
      } else {
        setForm((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (name === "unitSystem") {
      // Handle unit system change with auto-conversion
      const oldUnitSystem = form.unitSystem;
      const newUnitSystem = value;
      
      // Convert existing dimension values to new unit system
      const convertedForm = { ...form, [name]: value };
      
      if (form.width) {
        const widthInMm = convertToMillimeters(form.width, oldUnitSystem);
        convertedForm.width = convertFromMillimeters(widthInMm, newUnitSystem);
      }
      if (form.height) {
        const heightInMm = convertToMillimeters(form.height, oldUnitSystem);
        convertedForm.height = convertFromMillimeters(heightInMm, newUnitSystem);
      }
      if (form.depth) {
        const depthInMm = convertToMillimeters(form.depth, oldUnitSystem);
        convertedForm.depth = convertFromMillimeters(depthInMm, newUnitSystem);
      }
      if (form.weight) {
        const weightInKg = convertToKilograms(form.weight, oldUnitSystem);
        convertedForm.weight = convertFromKilograms(weightInKg, newUnitSystem);
      }
      if (form.frameWidth) {
        const frameWidthInMm = convertToMillimeters(form.frameWidth, oldUnitSystem);
        convertedForm.frameWidth = convertFromMillimeters(frameWidthInMm, newUnitSystem);
      }
      if (form.frameHeight) {
        const frameHeightInMm = convertToMillimeters(form.frameHeight, oldUnitSystem);
        convertedForm.frameHeight = convertFromMillimeters(frameHeightInMm, newUnitSystem);
      }
      if (form.frameDepth) {
        const frameDepthInMm = convertToMillimeters(form.frameDepth, oldUnitSystem);
        convertedForm.frameDepth = convertFromMillimeters(frameDepthInMm, newUnitSystem);
      }
      
      setForm(convertedForm);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArtistSelect = (artist) => {
    setForm(prev => ({
      ...prev,
      artist: artist.name,
      artistId: artist.id
    }));
    setShowArtistSearch(false);
    setArtistSearchTerm("");
  };

  const handleDocumentTypeSelect = (docType) => {
    // If clicking on the same document type that's already selected, deselect it
    if (selectedDocumentType && selectedDocumentType.value === docType.value) {
      setSelectedDocumentType(null);
    } else {
      setSelectedDocumentType(docType);
    }
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const certificateId = Date.now() + Math.random().toString(36).substr(2, 9);
      const newCertificate = {
        id: certificateId,
        file: file,
        name: file.name,
        type: selectedDocumentType ? selectedDocumentType.value : "miscellaneous",
        typeLabel: selectedDocumentType ? selectedDocumentType.label : "Miscellaneous",
        uploadedAt: new Date().toISOString()
      };
      setForm(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCertificate]
      }));
    });
    // Reset document type selector
    setSelectedDocumentType(null);
  };

  const removeCertificate = (certificateId) => {
    setForm(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== certificateId)
    }));
  };

  const updateCertificateInfo = (certificateId, field, value) => {
    setForm(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert => 
        cert.id === certificateId ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const getDocumentTypeInfo = (typeValue) => {
    return documentTypeOptions.find(option => option.value === typeValue) || documentTypeOptions[3]; // Default to miscellaneous
  };

  // Unit conversion functions
  const convertToMillimeters = (value, unitSystem) => {
    if (!value || isNaN(value)) return null;
    const numValue = parseFloat(value);
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round(numValue * 25.4); // inches to mm
      case 'metric':
        return Math.round(numValue * 10); // cm to mm
      case 'millimeters':
        return Math.round(numValue); // already in mm
      default:
        return Math.round(numValue * 25.4); // default to inches
    }
  };

  const convertToKilograms = (value, unitSystem) => {
    if (!value || isNaN(value)) return null;
    const numValue = parseFloat(value);
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round((numValue * 0.453592) * 1000) / 1000; // lbs to kg, keep 3 decimal places
      case 'metric':
      case 'millimeters':
        return Math.round(numValue * 1000) / 1000; // already in kg, keep 3 decimal places
      default:
        return Math.round((numValue * 0.453592) * 1000) / 1000; // default to lbs
    }
  };

  // Conversion functions from mm/kg back to display units
  const convertFromMillimeters = (valueInMm, unitSystem) => {
    if (!valueInMm || isNaN(valueInMm)) return "";
    const numValue = valueInMm;
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round((numValue / 25.4) * 100) / 100; // mm to inches, keep 2 decimal places
      case 'metric':
        return Math.round((numValue / 10) * 100) / 100; // mm to cm, keep 2 decimal places
      case 'millimeters':
        return Math.round(numValue); // already in mm
      default:
        return Math.round((numValue / 25.4) * 100) / 100; // default to inches
    }
  };

  const convertFromKilograms = (valueInKg, unitSystem) => {
    if (!valueInKg || isNaN(valueInKg)) return "";
    const numValue = valueInKg;
    
    switch (unitSystem) {
      case 'imperial':
        return Math.round((numValue / 0.453592) * 100) / 100; // kg to lbs, keep 2 decimal places
      case 'metric':
      case 'millimeters':
        return Math.round(numValue * 100) / 100; // already in kg, keep 2 decimal places
      default:
        return Math.round((numValue / 0.453592) * 100) / 100; // default to lbs
    }
  };

  // Parse dimension string (e.g., "20 x 30 in", "50 x 75 cm")
  const parseDimensionString = (dimString) => {
    const trimmed = dimString.trim().toLowerCase();
    
    // Match patterns like "20 x 30 in", "50 x 75 cm", "600 x 900 mm"
    const patterns = [
      /^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(in|inch|inches|cm|centimeter|centimeters|mm|millimeter|millimeters)$/,
      /^(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\s*(in|inch|inches|cm|centimeter|centimeters|mm|millimeter|millimeters)$/,
      /^(\d+(?:\.\d+)?)\s*by\s*(\d+(?:\.\d+)?)\s*(in|inch|inches|cm|centimeter|centimeters|mm|millimeter|millimeters)$/
    ];
    
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const width = parseFloat(match[1]);
        const height = parseFloat(match[2]);
        const unit = match[3];
        
        // Determine unit system from the unit
        let detectedUnitSystem = 'imperial';
        if (unit === 'cm' || unit === 'centimeter' || unit === 'centimeters') {
          detectedUnitSystem = 'metric';
        } else if (unit === 'mm' || unit === 'millimeter' || unit === 'millimeters') {
          detectedUnitSystem = 'millimeters';
        }
        
        return {
          width: width.toString(),
          height: height.toString(),
          unitSystem: detectedUnitSystem,
          success: true
        };
      }
    }
    
    return { success: false, message: "Could not parse dimension string. Expected format: '20 x 30 in' or '50 x 75 cm'" };
  };

  // Handle dimension string paste
  const handleDimensionPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const parsed = parseDimensionString(pastedText);
    
    if (parsed.success) {
      // Ask for confirmation before auto-filling (only on client side)
      if (typeof window !== 'undefined' && window.confirm(`Detected dimensions: ${parsed.width} x ${parsed.height} in ${parsed.unitSystem === 'imperial' ? 'inches' : parsed.unitSystem === 'metric' ? 'cm' : 'mm'}. Auto-fill fields?`)) {
        setForm(prev => ({
          ...prev,
          width: parsed.width,
          height: parsed.height,
          unitSystem: parsed.unitSystem
        }));
        
        toast({
          title: "Dimensions Auto-filled",
          description: `Width: ${parsed.width}, Height: ${parsed.height}`,
        });
      }
    }
  };

  // Validation function for dimensions
  const validateDimensions = () => {
    if (!form.width || !form.height) {
      return { valid: false, message: "Width and Height are required." };
    }
    
    const width = parseFloat(form.width);
    const height = parseFloat(form.height);
    const depth = form.depth ? parseFloat(form.depth) : null;
    
    if (width <= 0 || height <= 0) {
      return { valid: false, message: "Width and Height must be greater than 0." };
    }
    
    if (depth !== null && depth < 0) {
      return { valid: false, message: "Depth must be 0 or greater." };
    }
    
    // Check reasonable maximum (10,000 mm = 10 meters)
    const maxDimension = 10000;
    if (convertToMillimeters(width, form.unitSystem) > maxDimension || 
        convertToMillimeters(height, form.unitSystem) > maxDimension ||
        (depth !== null && convertToMillimeters(depth, form.unitSystem) > maxDimension)) {
      return { valid: false, message: "Dimensions exceed maximum allowed size (10,000 mm)." };
    }
    
    // Validate framed dimensions if frame is checked
    if (form.hasFrame) {
      const frameWidth = parseFloat(form.frameWidth);
      const frameHeight = parseFloat(form.frameHeight);
      const frameDepth = form.frameDepth ? parseFloat(form.frameDepth) : null;
      
      if (!frameWidth || !frameHeight) {
        return { valid: false, message: "Frame dimensions are required when 'Has Frame' is checked." };
      }
      
      if (frameWidth <= 0 || frameHeight <= 0) {
        return { valid: false, message: "Frame dimensions must be greater than 0." };
      }
      
      if (frameDepth !== null && frameDepth < 0) {
        return { valid: false, message: "Frame depth must be 0 or greater." };
      }
      
      // Check that frame dimensions are >= unframed dimensions
      if (convertToMillimeters(frameWidth, form.unitSystem) < convertToMillimeters(width, form.unitSystem) ||
          convertToMillimeters(frameHeight, form.unitSystem) < convertToMillimeters(height, form.unitSystem)) {
        return { valid: false, message: "Frame dimensions must be equal to or greater than unframed dimensions." };
      }
    }
    
    return { valid: true };
  };

  const handleSubmit = async () => {
    if (!form.title || !form.artist || !form.year || !form.medium || !form.nativeType || !form.condition || !form.framed || !form.price || !form.priceType || !form.location || !form.matureContent) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate media uploads
    if (!form.images || form.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image is required. Please upload at least one image of the artwork.",
        variant: "destructive",
      });
      return;
    }

    // Validate dimensions
    const dimensionValidation = validateDimensions();
    if (!dimensionValidation.valid) {
      toast({
        title: "Validation Error",
        description: dimensionValidation.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting artwork creation...');
      console.log('Form data:', form);
      console.log('Gallery data:', gallery);
      console.log('User data:', user);

      const artworkData = {
        title: form.title,
        artist: form.artist,
        artistId: form.artistId,
        year: parseInt(form.year),
        medium: form.medium,
        itemType: "Artwork",
        nativeType: form.nativeType,
        // Dimensions and weight (stored in mm and kg)
        width: convertToMillimeters(form.width, form.unitSystem),
        height: convertToMillimeters(form.height, form.unitSystem),
        depth: form.depth ? convertToMillimeters(form.depth, form.unitSystem) : null,
        weight: form.weight ? convertToKilograms(form.weight, form.unitSystem) : null,
        // Frame dimensions (stored in mm)
        hasFrame: form.hasFrame,
        frameWidth: form.hasFrame && form.frameWidth ? convertToMillimeters(form.frameWidth, form.unitSystem) : null,
        frameHeight: form.hasFrame && form.frameHeight ? convertToMillimeters(form.frameHeight, form.unitSystem) : null,
        frameDepth: form.hasFrame && form.frameDepth ? convertToMillimeters(form.frameDepth, form.unitSystem) : null,
        // Unit preference for display
        unitPreference: form.unitSystem,
        price: parseFloat(form.price),
        priceType: form.priceType,
        condition: form.condition,
        framed: form.framed,
        location: form.location,
        digitalFloor: form.digitalFloor,
        description: form.description,
        artworkHistory: form.artworkHistory,
        internalNotes: form.internalNotes,
        images: form.images,
        certificates: form.certificates,
        matureContent: form.matureContent === "yes" ? "Yes" : "No",
        color: form.color === "other" ? form.customColor : form.color,
        mood: form.mood === "other" ? form.customMood : form.mood,
        distributionType: form.distributionType,
        createdBy: user ? {
          email: user.email,
          uid: user.uid
        } : null
      };

      console.log('Prepared artwork data:', artworkData);

      const galleryInfo = gallery ? {
        [gallery.id]: {
          darkLogo: gallery.darkLogo,
          galleryId: gallery.id,
          lightLogo: gallery.lightLogo,
          name: gallery.name
        }
      } : {};

      console.log('Gallery info:', galleryInfo);

      const artworkId = await ArtworkService.createArtwork(artworkData, galleryInfo);
      
      console.log('Artwork created successfully with ID:', artworkId);

      // Trigger confetti celebration
      triggerSuccessConfetti();

      toast({
        title: "Success!",
        description: `Artwork "${form.title}" has been added successfully.`,
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error creating artwork:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to create artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <Button variant="outline" className="mb-6" onClick={() => router.push("/inventory/new")}> 
        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Item Selection 
      </Button>

      <div className="max-w-5xl mx-auto">
        <div className="text-2xl font-bold mb-2">Add New Artwork</div>

        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Image Upload Area */}
          <div className="flex-1 md:max-w-xs">
            <Card className="bg-card border border-dashed border-border dark:border-border/50 rounded-xl">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    name="images" 
                    accept="image/*,video/*" 
                    multiple
                    onChange={handleInput} 
                    className="hidden" 
                    id="images-upload" 
                  />
                  <label htmlFor="images-upload" className="w-full h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer mb-4 transition-colors">
                    <span className="opacity-40"><Upload className="w-10 h-10" /></span>
                    <span className="mt-2 font-semibold text-center text-lg w-full">Upload Artwork Media</span>
                    <span className="text-xs text-muted-foreground mt-2">Drag and drop your images and videos here, or click to browse.</span>
                  </label>
                  <Button variant="outline" className="w-full max-w-xs" asChild>
                    <label htmlFor="images-upload">Browse Files</label>
                  </Button>
                </div>
                {form.images.length > 0 && (
                  <div className="w-full mt-4">
                    <div className="text-sm font-medium mb-3">Selected Media ({form.images.length})</div>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from(form.images).map((file, index) => (
                        <div
                          key={index}
                          className="relative group"
                          draggable
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragIndex === null || dragIndex === index) return;
                            const updated = Array.from(form.images);
                            const [moved] = updated.splice(dragIndex, 1);
                            updated.splice(index, 0, moved);
                            setDragIndex(null);
                            setForm(prev => ({ ...prev, images: updated }));
                          }}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            {file.type.startsWith('video/') ? (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => e.target.pause()}
                              />
                            ) : (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => {
                                const newImages = Array.from(form.images).filter((_, i) => i !== index);
                                setForm(prev => ({ ...prev, images: newImages }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <GripVertical className="w-3 h-3" /> {index + 1}
                          </div>
                          <div className="absolute top-2 right-2 flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-6 px-2 bg-black/70 text-white hover:bg-black"
                              onClick={() => {
                                if (index === 0) return;
                                const updated = Array.from(form.images);
                                const [sel] = updated.splice(index, 1);
                                updated.unshift(sel);
                                setForm(prev => ({ ...prev, images: updated }));
                              }}
                            >
                              <Star className={`w-3 h-3 mr-1 ${index === 0 ? 'text-yellow-400' : 'text-white'}`} />
                              {index === 0 ? 'Main' : 'Set Main'}
                            </Button>
                          </div>
                          {file.type.startsWith('video/') && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                              VIDEO
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p>• Drag to reorder. Click the star to set the main image.</p>
                      <p>• Media will be displayed and saved in the order shown above.</p>
                      <p>• Videos will auto-play on hover.</p>
                    </div>
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-4 text-left w-full">
                  <div className="font-medium mb-1">Media Requirements</div>
                  <ul className="list-disc pl-4">
                    <li>High resolution images (minimum 1200x1200px)</li>
                    <li>Videos should be high quality and under 2 minutes</li>
                    <li>Maximum file size: 10MB per file</li>
                    <li>Accepted formats: JPG, PNG, TIFF, MP4, MOV, AVI</li>
                    <li>Upload multiple files for different angles and perspectives</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-1 font-medium">Title *</div>
                <Input 
                  name="title"
                  placeholder="Enter artwork title" 
                  value={form.title}
                  onChange={handleInput}
                />
              </div>
              <div className="relative">
                <div className="mb-1 font-medium">Artist *</div>
                <div className="relative">
                  <Input 
                    name="artist"
                    placeholder="Search or enter artist name" 
                    value={form.artist}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, artist: e.target.value }));
                      if (e.target.value) {
                        setShowArtistSearch(true);
                        setArtistSearchTerm(e.target.value);
                      } else {
                        setShowArtistSearch(false);
                      }
                    }}
                    onFocus={() => {
                      if (artists.length > 0) {
                        setShowArtistSearch(true);
                      }
                    }}
                  />
                  {showArtistSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                          <div
                            key={artist.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                            onClick={() => handleArtistSelect(artist)}
                          >
                            <div className="font-medium text-foreground">{artist.name}</div>
                            {artist.specialty && (
                              <div className="text-sm text-muted-foreground">{artist.specialty}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">
                          No artists found. You can enter the artist name manually.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1 font-medium">Year *</div>
                <Input 
                  name="year"
                  placeholder="YYYY" 
                  value={form.year}
                  onChange={handleInput}
                />
              </div>
              <div>
                <div className="mb-1 font-medium">Medium *</div>
                <Input 
                  name="medium"
                  placeholder="e.g., Oil on canvas" 
                  value={form.medium}
                  onChange={handleInput}
                />
              </div>
              <div>
                <div className="mb-1 font-medium">Native Type *</div>
                <select 
                  name="nativeType"
                  value={form.nativeType}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select native type</option>
                  {nativeTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Dimensions & Weight Section */}
              <div className="md:col-span-2">
                <div className="text-lg font-semibold mb-4">Dimensions & Weight</div>
                
                {/* Unit System Toggle */}
                <div className="mb-4">
                  <div className="mb-2 font-medium">Unit System</div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="unitSystem"
                        value="imperial"
                        checked={form.unitSystem === "imperial"}
                        onChange={handleInput}
                        className="accent-primary w-4 h-4"
                      />
                      <span>Imperial (in / lbs)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="unitSystem"
                        value="metric"
                        checked={form.unitSystem === "metric"}
                        onChange={handleInput}
                        className="accent-primary w-4 h-4"
                      />
                      <span>Metric (cm / kg)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="unitSystem"
                        value="millimeters"
                        checked={form.unitSystem === "millimeters"}
                        onChange={handleInput}
                        className="accent-primary w-4 h-4"
                      />
                      <span>Millimeters (mm)</span>
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Switching units will auto-convert values. All dimensions are stored in mm and weight in kg on the backend.
                    <br />
                    <span className="text-muted-foreground">💡 Try pasting dimension strings like "20 x 30 in" or "50 x 75 cm" into the Width field!</span>
                  </div>
                </div>
                
                {/* Dimension Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="mb-1 font-medium">Width *</div>
                    <Input 
                      name="width"
                      placeholder={form.unitSystem === "imperial" ? "e.g., 24" : form.unitSystem === "metric" ? "e.g., 60" : "e.g., 600"}
                      value={form.width}
                      onChange={handleInput}
                      onPaste={handleDimensionPaste}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {form.unitSystem === "imperial" ? "inches" : form.unitSystem === "metric" ? "cm" : "mm"}
                      <br />
                      <span className="text-muted-foreground">💡 Paste dimension strings like "20 x 30 in"</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 font-medium">Height *</div>
                    <Input 
                      name="height"
                      placeholder={form.unitSystem === "imperial" ? "e.g., 36" : form.unitSystem === "metric" ? "e.g., 90" : "e.g., 900"}
                      value={form.height}
                      onChange={handleInput}
                      onPaste={handleDimensionPaste}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {form.unitSystem === "imperial" ? "inches" : form.unitSystem === "metric" ? "cm" : "mm"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 font-medium">Depth (Optional)</div>
                    <Input 
                      name="depth"
                      placeholder={form.unitSystem === "imperial" ? "e.g., 1" : form.unitSystem === "metric" ? "e.g., 2.5" : "e.g., 25"}
                      value={form.depth}
                      onChange={handleInput}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {form.unitSystem === "imperial" ? "inches" : form.unitSystem === "metric" ? "cm" : "mm"}
                    </div>
                  </div>
                </div>
                
                {/* Weight Field */}
                <div className="mb-4">
                  <div className="mb-1 font-medium">Weight (Optional)</div>
                  <Input 
                    name="weight"
                    placeholder={form.unitSystem === "imperial" ? "e.g., 10" : "e.g., 4.5"}
                    value={form.weight}
                    onChange={handleInput}
                      type="number"
                      step="0.01"
                      min="0"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {form.unitSystem === "imperial" ? "lbs" : "kg"}
                  </div>
                </div>
                
                {/* Framed Dimensions */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="hasFrame"
                      name="hasFrame"
                      checked={form.hasFrame}
                      onChange={handleInput}
                      className="accent-primary w-4 h-4"
                    />
                    <label htmlFor="hasFrame" className="font-medium">Has Frame</label>
                  </div>
                  
                  {form.hasFrame && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <div className="mb-1 font-medium text-sm">Frame Width</div>
                        <Input 
                          name="frameWidth"
                          placeholder={form.unitSystem === "imperial" ? "e.g., 26" : form.unitSystem === "metric" ? "e.g., 66" : "e.g., 660"}
                          value={form.frameWidth}
                          onChange={handleInput}
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <div className="mb-1 font-medium text-sm">Frame Height</div>
                        <Input 
                          name="frameHeight"
                          placeholder={form.unitSystem === "imperial" ? "e.g., 38" : form.unitSystem === "metric" ? "e.g., 96" : "e.g., 960"}
                          value={form.frameHeight}
                          onChange={handleInput}
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <div className="mb-1 font-medium text-sm">Frame Depth</div>
                        <Input 
                          name="frameDepth"
                          placeholder={form.unitSystem === "imperial" ? "e.g., 2" : form.unitSystem === "metric" ? "e.g., 5" : "e.g., 50"}
                          value={form.frameDepth}
                          onChange={handleInput}
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1 font-medium">Condition *</div>
                <select 
                  name="condition"
                  value={form.condition}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <div className="mb-1 font-medium">Framed *</div>
                <select 
                  name="framed"
                  value={form.framed}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select framing status</option>
                  {framedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <div className="mb-1 font-medium">Price *</div>
                <Input 
                  name="price"
                  placeholder="Enter price" 
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleInput}
                />
              </div>
              <div>
                <div className="mb-1 font-medium">Price Type *</div>
                <select 
                  name="priceType"
                  value={form.priceType}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select price type</option>
                  {priceTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="mb-1 font-medium">Storage Location *</div>
                <select 
                  name="location"
                  value={form.location}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select location</option>
                  {storageLocationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="mb-1 font-medium">Description</div>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
                  placeholder="Enter a detailed description of the artwork"
                  rows={5}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional - Use the toolbar above for formatting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tagging + Age Gating */}
        <div className="mt-10">
          <div className="text-xl font-semibold mb-4">Category Tagging + Age Gating</div>
          
          {/* Mature Content Question */}
          <div className="mb-6">
            <div className="font-medium mb-3">Does this work contain any mature content, nudity, or sensitive themes? *</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="matureContent"
                  value="yes"
                  checked={form.matureContent === "yes"}
                  onChange={handleInput}
                  className="accent-primary w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="matureContent"
                  value="no"
                  checked={form.matureContent === "no"}
                  onChange={handleInput}
                  className="accent-primary w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              This helps us ensure appropriate content filtering and age-gating for your artwork.
            </div>
            
            {/* Warning for mature content */}
            {form.matureContent === "yes" && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg mt-3">
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Mature Content Warning</span>
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  This artwork will be automatically age-gated and may have restricted visibility. 
                  Color and mood tagging will be disabled for mature content items.
                </div>
              </div>
            )}
          </div>

          {/* Color and Mood Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium mb-2">Artwork Color</div>
              <select 
                name="color"
                value={form.color}
                onChange={handleInput}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select primary color</option>
                {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                <option value="other">Other (Custom)</option>
              </select>
              {form.color === "other" && (
                <Input
                  name="customColor"
                  placeholder="Enter custom color description"
                  value={form.customColor || ""}
                  onChange={handleInput}
                  className="mt-2"
                />
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Choose the dominant color palette of your artwork
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2">Artwork Mood</div>
              <select 
                name="mood"
                value={form.mood}
                onChange={handleInput}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select mood/atmosphere</option>
                {moodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                <option value="other">Other (Custom)</option>
              </select>
              {form.mood === "other" && (
                <Input
                  name="customMood"
                  placeholder="Enter custom mood description"
                  value={form.customMood || ""}
                  onChange={handleInput}
                  className="mt-2"
                />
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Describe the emotional tone or atmosphere of your artwork
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Source & Distribution Type */}
        <div className="mt-10">
          <div className="text-xl font-semibold mb-4">Artwork Source & Distribution Type (Optional)</div>
          <div className="text-sm text-muted-foreground mb-4">
            We need to be able to distinguish between Primary Dealer, Secondary Market, or Consigned. When uploading artwork.
            <br />
            <span className="text-muted-foreground">💡 Click on a selected option again to deselect it</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                form.distributionType === "primary_dealer"
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => {
                // Toggle selection - if already selected, deselect it
                if (form.distributionType === "primary_dealer") {
                  setForm(prev => ({ ...prev, distributionType: "" }));
                } else {
                  setForm(prev => ({ ...prev, distributionType: "primary_dealer" }));
                }
              }}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                form.distributionType === "primary_dealer"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}>
                {form.distributionType === "primary_dealer" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <div className="font-medium">Primary Dealer</div>
                <div className="text-sm text-muted-foreground">Direct from artist or primary source</div>
              </div>
            </div>
            
            <div 
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                form.distributionType === "secondary_market"
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => {
                // Toggle selection - if already selected, deselect it
                if (form.distributionType === "secondary_market") {
                  setForm(prev => ({ ...prev, distributionType: "" }));
                } else {
                  setForm(prev => ({ ...prev, distributionType: "secondary_market" }));
                }
              }}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                form.distributionType === "secondary_market"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}>
                {form.distributionType === "secondary_market" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <div className="font-medium">Secondary Market</div>
                <div className="text-sm text-muted-foreground">Previously owned, resale market</div>
              </div>
            </div>
            
            <div 
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                form.distributionType === "consigned"
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => {
                // Toggle selection - if already selected, deselect it
                if (form.distributionType === "consigned") {
                  setForm(prev => ({ ...prev, distributionType: "" }));
                } else {
                  setForm(prev => ({ ...prev, distributionType: "consigned" }));
                }
              }}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                form.distributionType === "consigned"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}>
                {form.distributionType === "consigned" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <div className="font-medium">Consigned</div>
                <div className="text-sm text-muted-foreground">On consignment from owner</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-3">
            This information helps with pricing strategy, commission structures, and inventory management.
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <div className="font-medium mb-1">Artwork History</div>
            <RichTextEditor
              value={form.artworkHistory}
              onChange={(value) => setForm(prev => ({ ...prev, artworkHistory: value }))}
              placeholder="Enter the provenance and exhibition history"
              rows={4}
            />
            <div className="text-xs text-muted-foreground mt-1">Optional - Use the toolbar above for formatting</div>
          </div>
          <div>
            <div className="font-medium mb-1">Internal Notes</div>
            <RichTextEditor
              value={form.internalNotes}
              onChange={(value) => setForm(prev => ({ ...prev, internalNotes: value }))}
              placeholder="Add any internal notes (not visible to clients)"
              rows={4}
            />
            <div className="text-xs text-muted-foreground mt-1">Optional - Use the toolbar above for formatting</div>
          </div>
        </div>

        {/* Enhanced Certificates & Documentation */}
        <div className="font-medium mt-10 mb-4">Certificates & Documentation (Optional)</div>
        <div className="text-sm text-muted-foreground mb-4">
          Upload documents to receive Blue Check verification for authenticity and provenance. All fields are optional.
        </div>
        
        <Card className="bg-card border border-dashed border-border dark:border-border/50 rounded-xl">
          <CardContent className="pt-6 pb-6">
            {/* Document Type Selector */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-3">Select Document Type</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {documentTypeOptions.map((docType) => {
                  const IconComponent = docType.icon;
                  return (
                    <div
                      key={docType.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDocumentType?.value === docType.value
                          ? `${docType.borderColor} ${docType.bgColor}`
                          : 'border-border hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleDocumentTypeSelect(docType)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${docType.color}`} />
                        <div>
                          <div className="font-medium text-sm">{docType.label}</div>
                          <div className="text-xs text-muted-foreground">{docType.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upload Section */}
            {selectedDocumentType && (
              <div className={`p-4 rounded-lg border-2 ${getDocumentTypeInfo(selectedDocumentType.value).borderColor} ${getDocumentTypeInfo(selectedDocumentType.value).bgColor} mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getDocumentTypeInfo(selectedDocumentType.value).icon;
                      return <IconComponent className={`w-5 h-5 ${getDocumentTypeInfo(selectedDocumentType.value).color}`} />;
                    })()}
                    <div>
                      <div className="font-medium">{selectedDocumentType.label}</div>
                      <div className="text-sm text-muted-foreground">{selectedDocumentType.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDocumentType(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                    onChange={handleCertificateUpload}
                    className="hidden" 
                    id="certificates-upload" 
                  />
                  <label htmlFor="certificates-upload" className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Upload {selectedDocumentType.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Click to browse or drag and drop files here
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Uploaded Documents */}
            {form.certificates.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-medium mb-3">Uploaded Documents ({form.certificates.length})</div>
                <div className="space-y-3">
                  {form.certificates.map((certificate, index) => {
                    const docTypeInfo = getDocumentTypeInfo(certificate.type);
                    const IconComponent = docTypeInfo.icon;
                    return (
                      <div key={certificate.id} className={`border rounded-lg p-4 ${docTypeInfo.bgColor} ${docTypeInfo.borderColor}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-5 h-5 ${docTypeInfo.color}`} />
                            <div>
                              <div className="font-medium text-sm">{certificate.typeLabel}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(certificate.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCertificate(certificate.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Document Name</label>
                            <Input
                              value={certificate.name}
                              onChange={(e) => updateCertificateInfo(certificate.id, 'name', e.target.value)}
                              className="h-8 text-sm"
                              placeholder="Enter document name"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Document Type</label>
                            <select
                              value={certificate.type}
                              onChange={(e) => {
                                const newType = e.target.value;
                                const newTypeInfo = getDocumentTypeInfo(newType);
                                updateCertificateInfo(certificate.id, 'type', newType);
                                updateCertificateInfo(certificate.id, 'typeLabel', newTypeInfo.label);
                              }}
                              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                            >
                              {documentTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          File: {certificate.file.name} ({(certificate.file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>• Accepted formats: PDF, DOC, DOCX, JPG, PNG, TIFF</p>
              <p>• Maximum file size: 10MB per document</p>
              <p>• All uploaded documents are automatically verified for authenticity</p>
            </div>
          </CardContent>
        </Card>

        {/* Digital Floor Checkbox and Save/Cancel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="digital-floor" 
              name="digitalFloor"
              checked={form.digitalFloor}
              onChange={handleInput}
              className="accent-primary w-4 h-4" 
            />
            <label htmlFor="digital-floor" className="text-base">Add to Digital Floor (QR Code System)</label>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/inventory/new")}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Artwork"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewArtwork;
