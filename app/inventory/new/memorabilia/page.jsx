"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChevronLeft, Upload, Loader2, X, CheckCircle, FileText, Shield, FileCheck, Star, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useGallery } from "@/contexts/gallery-context";
import { useAuth } from "@/contexts/auth-context";
import { MemorabiliaService } from "@/lib/memorabilia-service";
import { useConfetti } from "@/hooks/use-confetti";

const storageLocationOptions = [
  "Main Gallery",
  "Vault A",
  "Vault B",
  "Exhibition Hall",
  "Storage Room A"
];

// Document type options with icons and descriptions
const documentTypeOptions = [
  {
    value: "certificate_of_authenticity",
    label: "Certificate of Authenticity",
    icon: CheckCircle,
    description: "Official certificate verifying the item's authenticity",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    value: "provenance",
    label: "Provenance",
    icon: FileCheck,
    description: "Documentation of item ownership history",
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

const AddNewMemorabilia = () => {
  const { gallery } = useGallery();
  const { user } = useAuth();
  const { triggerSuccessConfetti } = useConfetti();
  const [form, setForm] = useState({
    title: "",
    associatedPersons: "",
    associatedTeamOrganization: "",
    eventNameDate: "",
    autographDetails: "",
    authenticationProvider: "",
    certificateOfAuthenticityNumber: "",
    historicalSignificanceNotes: "",
    eraPeriod: "",
    ticketPassNumber: "",
    commemorativeEditionDetails: "",
    condition: "",
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
    price: "",
    priceType: "",
    location: "",
    description: "",
    internalNotes: "",
    digitalFloor: false,
    images: [],
    certificates: [],
    matureContent: "",
    distributionType: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

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

  const getDocumentTypeInfo = (typeValue) => {
    return documentTypeOptions.find(option => option.value === typeValue) || documentTypeOptions[3];
  };

  const handleSubmit = async () => {
    if (!form.title || !form.associatedPersons || !form.width || !form.height || !form.price || !form.priceType || !form.location || !form.condition || !form.matureContent) {
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
        description: "At least one image is required. Please upload at least one image of the memorabilia.",
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
      console.log('Starting memorabilia creation...');
      console.log('Form data:', form);
      console.log('Gallery data:', gallery);
      console.log('User data:', user);

      const memorabiliaData = {
        title: form.title,
        associatedPersons: form.associatedPersons,
        associatedTeamOrganization: form.associatedTeamOrganization,
        eventNameDate: form.eventNameDate,
        autographDetails: form.autographDetails,
        authenticationProvider: form.authenticationProvider,
        certificateOfAuthenticityNumber: form.certificateOfAuthenticityNumber,
        historicalSignificanceNotes: form.historicalSignificanceNotes,
        eraPeriod: form.eraPeriod,
        ticketPassNumber: form.ticketPassNumber,
        commemorativeEditionDetails: form.commemorativeEditionDetails,
        condition: form.condition,
        // Dimensions and weight
        unitSystem: form.unitSystem,
        width: form.width,
        height: form.height,
        depth: form.depth,
        weight: form.weight,
        // Frame dimensions
        hasFrame: form.hasFrame,
        frameWidth: form.frameWidth,
        frameHeight: form.frameHeight,
        frameDepth: form.frameDepth,
        price: parseFloat(form.price),
        priceType: form.priceType,
        location: form.location,
        digitalFloor: form.digitalFloor,
        description: form.description,
        internalNotes: form.internalNotes,
        matureContent: form.matureContent === "yes" ? "Yes" : "No",
        images: form.images,
        certificates: form.certificates,
        distributionType: form.distributionType,
        createdBy: user ? {
          email: user.email,
          uid: user.uid
        } : null
      };

      console.log('Prepared memorabilia data:', memorabiliaData);

      const galleryInfo = gallery ? {
        [gallery.id]: {
          darkLogo: gallery.darkLogo,
          galleryId: gallery.id,
          lightLogo: gallery.lightLogo,
          name: gallery.name
        }
      } : {};

      console.log('Gallery info:', galleryInfo);

      const memorabiliaId = await MemorabiliaService.createMemorabilia(memorabiliaData, galleryInfo);
      
      console.log('Memorabilia created successfully with ID:', memorabiliaId);

      // Trigger confetti celebration
      triggerSuccessConfetti();

      toast({
        title: "Success!",
        description: `Memorabilia "${form.title}" has been added successfully.`,
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error creating memorabilia:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to create memorabilia. Please try again.",
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
        <div className="text-2xl font-bold mb-2">Add New Memorabilia</div>

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
                    <span className="mt-2 font-semibold text-center text-lg w-full">Upload Memorabilia Media</span>
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
                  placeholder="Enter memorabilia title" 
                  value={form.title}
                  onChange={handleInput}
                />
              </div>
              <div>
                <div className="mb-1 font-medium">Associated Person(s) *</div>
                <Input 
                  name="associatedPersons"
                  placeholder="e.g., Michael Jordan, The Beatles" 
                  value={form.associatedPersons}
                  onChange={handleInput}
                />
              </div>
              <div>
                <div className="mb-1 font-medium">Associated Team / Organization</div>
                <Input 
                  name="associatedTeamOrganization"
                  placeholder="e.g., Chicago Bulls, Abbey Road Studios" 
                  value={form.associatedTeamOrganization}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Event Name & Date</div>
                <Input 
                  name="eventNameDate"
                  placeholder="e.g., 1991 NBA Finals, 1969 Concert" 
                  value={form.eventNameDate}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Required if event-linked</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Autograph Details</div>
                <Input 
                  name="autographDetails"
                  placeholder="e.g., Signer name, inscription, date/location" 
                  value={form.autographDetails}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Required if autographed</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Authentication Provider</div>
                <Input 
                  name="authenticationProvider"
                  placeholder="e.g., JSA, PSA DNA, Beckett" 
                  value={form.authenticationProvider}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Required if autographed</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Certificate of Authenticity #</div>
                <Input 
                  name="certificateOfAuthenticityNumber"
                  placeholder="e.g., COA-2024-001" 
                  value={form.certificateOfAuthenticityNumber}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Required if autographed</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Historical Significance Notes</div>
                <Input 
                  name="historicalSignificanceNotes"
                  placeholder="Why this item is historically important" 
                  value={form.historicalSignificanceNotes}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Era / Period</div>
                <Input 
                  name="eraPeriod"
                  placeholder="e.g., 1960s, Victorian Era, Golden Age" 
                  value={form.eraPeriod}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Ticket / Pass #</div>
                <Input 
                  name="ticketPassNumber"
                  placeholder="e.g., TKT-001, VIP-2024" 
                  value={form.ticketPassNumber}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional</div>
              </div>
              <div>
                <div className="mb-1 font-medium">Commemorative Edition Details</div>
                <Input 
                  name="commemorativeEditionDetails"
                  placeholder="e.g., Limited commemorative version details" 
                  value={form.commemorativeEditionDetails}
                  onChange={handleInput}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional</div>
              </div>
              
              <div>
                <div className="mb-1 font-medium">Condition</div>
                <select 
                  name="condition"
                  value={form.condition}
                  onChange={handleInput}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                <div className="text-xs text-muted-foreground mt-1">Required</div>
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
                  <option value="Fixed">Fixed</option>
                  <option value="By Request">By Request</option>
                  <option value="Auction">Auction</option>
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
                  placeholder="Enter a detailed description of the memorabilia"
                  rows={5}
                />
                <div className="text-xs text-muted-foreground mt-1">Optional - Use the toolbar above for formatting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Source & Distribution Type */}
        <div className="mt-10">
          <div className="text-xl font-semibold mb-4">Source & Distribution Type (Optional)</div>
          <div className="text-sm text-muted-foreground mb-4">
            We need to be able to distinguish between Primary Dealer, Secondary Market, or Consigned. When uploading items.
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
                <div className="text-sm text-muted-foreground">Direct from source or primary market</div>
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

        {/* Mature Content Question */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Content Classification *</div>
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">For appropriate audience filtering</div>
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
                <span className="text-sm">Contains mature themes</span>
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
                <span className="text-sm">Suitable for all audiences</span>
              </label>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-10">
          <div className="font-medium mb-1">Internal Notes</div>
          <RichTextEditor
            value={form.internalNotes}
            onChange={(value) => setForm(prev => ({ ...prev, internalNotes: value }))}
            placeholder="Add any internal notes (not visible to clients)"
            rows={4}
          />
          <div className="text-xs text-muted-foreground mt-1">Optional - Use the toolbar above for formatting</div>
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
                "Save Memorabilia"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMemorabilia;
