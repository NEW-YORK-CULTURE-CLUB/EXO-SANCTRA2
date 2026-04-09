"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Upload, Loader2, X, FileText, Image } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArtistService } from "@/lib/artist-service";
import { useToast } from "@/hooks/use-toast";
import { useGallery } from "@/contexts/gallery-context";
import { AddNewArtistPageSkeleton } from "@/components/artist-profiles-skeleton";
import { useConfetti } from "@/hooks/use-confetti";

const initialForm = {
  name: "",
  biography: "",
  specialty: "",
  nationality: "",
  birthYear: "",
  deathYear: "",
  photo: null,
  photoPreview: null,
  email: "",
  phone: "",
  altContact: "",
  altEmail: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postal: "",
  country: "",
  taxId: "",
  taxClassification: "",
  businessName: "",
  w9: null,
  w9Preview: null,
  additionalFields: [{ label: "", value: "" }],
  additionalDocuments: [],
  notes: "",
  portalAccess: false,
  password: "",
  confirmPassword: "",
};

const taxClassifications = [
  "Individual/Sole Proprietor",
  "C Corporation",
  "S Corporation",
  "Partnership",
  "Trust/Estate",
  "LLC",
];

const documentTypes = [
  "Certificate of Authenticity",
  "Provenance Documentation",
  "Exhibition History",
  "Conservation Report",
  "Insurance Certificate",
  "Transportation Documents",
  "Other"
];

const ArtistProfileCreate = () => {
  const { gallery } = useGallery();
  const { triggerSuccessConfetti } = useConfetti();
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState(initialForm);
      const [profileLink] = useState(`https://${gallery?.name?.toLowerCase().replace(/\s+/g, '-') || 'gallery'}.vercel.app/auth/artist-register`);
  const [showProfileLink, setShowProfileLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "photo" && files[0]) {
        // Create preview URL for photo
        const previewUrl = URL.createObjectURL(files[0]);
        setForm((prev) => ({ 
          ...prev, 
          [name]: files[0],
          photoPreview: previewUrl
        }));
      } else if (name === "w9" && files[0]) {
        // Create preview for W-9 (PDF)
        const previewUrl = URL.createObjectURL(files[0]);
        setForm((prev) => ({ 
          ...prev, 
          [name]: files[0],
          w9Preview: previewUrl
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdditionalField = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...(prev.additionalFields || [])];
      // Ensure the array has enough elements
      while (updated.length <= idx) {
        updated.push({ label: "", value: "" });
      }
      updated[idx][key] = value;
      return { ...prev, additionalFields: updated };
    });
  };

  const addAdditionalField = () => {
    setForm((prev) => ({ 
      ...prev, 
      additionalFields: [...(prev.additionalFields || []), { label: "", value: "" }] 
    }));
  };

  const removeAdditionalField = (idx) => {
    setForm((prev) => {
      const currentFields = prev.additionalFields || [];
      const updated = currentFields.filter((_, i) => i !== idx);
      return { ...prev, additionalFields: updated };
    });
  };

  const handleAdditionalDocument = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      file,
      name: file.name,
      type: "Other",
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    
    setForm((prev) => ({
      ...prev,
      additionalDocuments: [...(prev.additionalDocuments || []), ...newDocuments]
    }));
  };

  const removeAdditionalDocument = (documentId) => {
    setForm((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter(doc => doc.id !== documentId)
    }));
  };

  const updateDocumentType = (documentId, type) => {
    setForm((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.map(doc => 
        doc.id === documentId ? { ...doc, type } : doc
      )
    }));
  };

  const clearPhoto = () => {
    setForm((prev) => ({ 
      ...prev, 
      photo: null,
      photoPreview: null
    }));
  };

  const clearW9 = () => {
    setForm((prev) => ({ 
      ...prev, 
      w9: null,
      w9Preview: null
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast({
        title: "Validation Error",
        description: "Artist name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug: Log the current form state
      console.log("Current form state:", form);

      // Check if email is already registered
      const isRegistered = await ArtistService.isEmailRegistered(form.email);
      if (isRegistered) {
        toast({
          title: "Email Already Registered",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return;
      }

      // Prepare profile data - exclude password fields and preview URLs
      const { password, confirmPassword, photoPreview, w9Preview, ...profileDataWithoutPasswords } = form;
      const profileData = {
        ...profileDataWithoutPasswords,
        status: 'pending',
        portalAccess: form.portalAccess || false,
        // Add gallery data to the profile
        galleryData: gallery ? {
          [gallery.id]: {
            darkLogo: gallery.darkLogo,
            galleryId: gallery.id,
            lightLogo: gallery.lightLogo,
            name: gallery.name,
            createdAt: new Date().toISOString()
          }
        } : {}
      };

      // Debug: Log the profile data being sent
      console.log("Profile data being sent to database:", profileData);

      // Create artist profile
      const profileId = await ArtistService.createArtistProfile(profileData);

      console.log("Profile created with ID:", profileId);

      // Trigger confetti celebration
      triggerSuccessConfetti();

      toast({
        title: "Success!",
        description: `Artist profile "${form.name}" has been created successfully.`,
      });

      // Redirect to artist profiles list
      router.push("/artist-profiles");
    } catch (error) {
      console.error("Error creating artist profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create artist profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const tabs = ["basic", "contact", "tax", "additional"];
    const currentIndex = tabs.indexOf(tab);
    if (currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["basic", "contact", "tax", "additional"];
    const currentIndex = tabs.indexOf(tab);
    if (currentIndex > 0) {
      setTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/artist-profiles")}> <ChevronLeft className="w-4 h-4 mr-2" /> Back to Artist Profiles </Button>
        {tab === "additional" ? (
          <Button 
            variant="default" 
            className="hidden md:block" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Save Artist Profile"
            )}
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="hidden md:block" 
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl font-bold mb-4">Create Artist Profile</div>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="tax">Tax Information</TabsTrigger>
            <TabsTrigger value="additional">Additional Data</TabsTrigger>
          </TabsList>
          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="mb-1 font-medium">Artist Name *</div>
                  <Input name="name" value={form.name} onChange={handleInput} placeholder="Enter artist's full name" />
                </div>
                <div>
                  <div className="mb-1 font-medium">Biography</div>
                  <textarea name="biography" value={form.biography} onChange={handleInput} className="w-full border rounded px-3 py-2" rows={3} placeholder="Enter artist's biography" />
                </div>
                <div>
                  <div className="mb-1 font-medium">Specialty/Medium</div>
                  <Input name="specialty" value={form.specialty} onChange={handleInput} placeholder="e.g., Oil Painting, Sculpture, Photography" />
                </div>
                <div>
                  <div className="mb-1 font-medium">Nationality</div>
                  <Input name="nationality" value={form.nationality} onChange={handleInput} placeholder="Enter artist's nationality" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="mb-1 font-medium">Birth Year</div>
                    <Input name="birthYear" value={form.birthYear} onChange={handleInput} placeholder="YYYY" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-medium">Death Year (if applicable)</div>
                    <Input name="deathYear" value={form.deathYear} onChange={handleInput} placeholder="YYYY" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="portalAccess" checked={form.portalAccess} onChange={handleInput} className="accent-primary w-4 h-4" id="active-rep" />
                  <label htmlFor="active-rep" className="text-base">Active Representation</label>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 flex flex-col items-center w-full">
                <div className="w-full flex flex-col items-center justify-center">
                  {form.photoPreview ? (
                    <div className="w-full mb-4">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                        <img 
                          src={form.photoPreview} 
                          alt="Artist preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={clearPhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {form.photo?.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="file" 
                        name="photo" 
                        accept="image/*" 
                        onChange={handleInput} 
                        className="hidden" 
                        id="photo-upload" 
                      />
                      <label htmlFor="photo-upload" className="w-full h-80 border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer mb-4">
                        <span className="opacity-40"><Upload className="w-10 h-10" /></span>
                        <span className="mt-2 font-semibold text-center text-lg w-full">Upload Artist Photo</span>
                        <span className="text-xs text-muted-foreground mt-2">Drag and drop an image here, or click to browse.</span>
                        <span className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, WebP</span>
                        <Button variant="outline" className="w-full max-w-xs mt-5" asChild>
                          <label htmlFor="photo-upload">Browse Images</label>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8 md:hidden">
              {tab === "additional" ? (
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Save Artist Profile"
                  )}
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </TabsContent>
          {/* Contact Details Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-1 font-medium">Email Address *</div>
                <Input name="email" value={form.email} onChange={handleInput} placeholder="artist@example.com" />
              </div>
              <div>
                <div className="mb-1 font-medium">Phone Number</div>
                <Input name="phone" value={form.phone} onChange={handleInput} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <div className="mb-1 font-medium">Alternate Contact</div>
                <Input name="altContact" value={form.altContact} onChange={handleInput} placeholder="e.g., Agent or Assistant" />
              </div>
              <div>
                <div className="mb-1 font-medium">Alternate Email</div>
                <Input name="altEmail" value={form.altEmail} onChange={handleInput} placeholder="alternate@example.com" />
              </div>
              <div>
                <div className="mb-1 font-medium">Address Line 1</div>
                <Input name="address1" value={form.address1} onChange={handleInput} placeholder="Street address" />
              </div>
              <div>
                <div className="mb-1 font-medium">Address Line 2</div>
                <Input name="address2" value={form.address2} onChange={handleInput} placeholder="Apt, Suite, etc." />
              </div>
              <div>
                <div className="mb-1 font-medium">City</div>
                <Input name="city" value={form.city} onChange={handleInput} placeholder="City" />
              </div>
              <div>
                <div className="mb-1 font-medium">State/Province</div>
                <Input name="state" value={form.state} onChange={handleInput} placeholder="State" />
              </div>
              <div>
                <div className="mb-1 font-medium">Postal Code</div>
                <Input name="postal" value={form.postal} onChange={handleInput} placeholder="Postal code" />
              </div>
              <div>
                <div className="mb-1 font-medium">Country</div>
                <Input name="country" value={form.country} onChange={handleInput} placeholder="Country" />
              </div>
            </div>
            <div className="flex justify-end mt-8 md:hidden">
              {tab === "additional" ? (
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Save Artist Profile"
                  )}
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </TabsContent>
          {/* Tax Information Tab */}
          <TabsContent value="tax">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
              {/* Left column: form fields (on mobile, first in stack) */}
              <div className="space-y-6 w-full">
                <div>
                  <div className="mb-1 font-medium">Tax ID Number</div>
                  <Input name="taxId" value={form.taxId} onChange={handleInput} placeholder="e.g., SSN or EIN" />
                </div>
                <div>
                  <div className="mb-1 font-medium">Tax Classification</div>
                  <select name="taxClassification" value={form.taxClassification} onChange={handleInput} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base">
                    <option value="">Select classification</option>
                    {taxClassifications.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-1 font-medium">Business Name (if different)</div>
                  <Input name="businessName" value={form.businessName} onChange={handleInput} placeholder="Business name" />
                </div>
                <div>
                  <div className="mb-1 font-medium">Temporary Password (for portal access)</div>
                  <Input name="password" value={form.password} onChange={handleInput} placeholder="Temporary password for artist login" />
                  <div className="text-xs text-muted-foreground mt-1">This password will be used to create the artist's account. They can change it after first login.</div>
                </div>
                <div>
                  <div className="mb-1 font-medium">Confirm Temporary Password</div>
                  <Input name="confirmPassword" value={form.confirmPassword} onChange={handleInput} placeholder="Confirm temporary password" />
                </div>
              </div>
              {/* Right column: cards (on mobile, stacked below fields) */}
              <div className="flex flex-col gap-0 w-full">
                <div className="bg-card rounded-xl flex flex-col items-center w-full">
                  <div className="w-full flex flex-col items-center justify-center">
                    {form.w9Preview ? (
                      <div className="w-full mb-4">
                        <div className="relative w-full h-60 border rounded-lg overflow-hidden">
                          <iframe 
                            src={form.w9Preview} 
                            className="w-full h-full"
                            title="W-9 Preview"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={clearW9}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          {form.w9?.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <input type="file" name="w9" accept="application/pdf" onChange={handleInput} className="hidden" id="w9-upload" />
                        <label htmlFor="w9-upload" className="w-full h-60 border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer mb-4">
                          <span className="opacity-40"><Upload className="w-10 h-10" /></span>
                          <span className="mt-2 font-semibold text-center text-lg w-full">Upload W-9 Form</span>
                          <span className="text-xs text-muted-foreground mt-2">Upload a completed and signed W-9 form (PDF format)</span>
                          <Button variant="outline" className="w-full max-w-xs mt-5" asChild>
                            <label htmlFor="w9-upload">Browse Files</label>
                          </Button>
                        </label>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 w-full">
                  <div className="font-semibold text-lg mb-2">Secure Upload Link</div>
                  <div className="text-sm text-muted-foreground mb-3">Generate a secure link for the artist to upload their W-9 and other tax documents directly</div>
                  <div className="flex items-center gap-2 mb-2">
                    {showProfileLink ? (
                      <>
                        <Input value={profileLink} readOnly className="flex-1" />
                        <Button variant="outline" type="button" onClick={() => navigator.clipboard.writeText(profileLink)}>Copy</Button>
                      </>
                    ) : (
                      <Button variant="outline" className="text-primary w-full" type="button" onClick={() => setShowProfileLink(true)}>Generate Link</Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">This link will expire in 7 days and can only be used once.</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8 md:hidden">
              {tab === "additional" ? (
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Save Artist Profile"
                  )}
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </TabsContent>
          {/* Additional Data Tab */}
          <TabsContent value="additional">
            <div className="mb-6">
              <div className="font-medium mb-2">Additional Fields</div>
              {/* Instagram and Website fields always first, not removable */}
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Instagram"
                  value={form.additionalFields[0]?.value || ''}
                  onChange={e => handleAdditionalField(0, "value", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Website"
                  value={form.additionalFields[1]?.value || ''}
                  onChange={e => handleAdditionalField(1, "value", e.target.value)}
                  className="flex-1"
                />
              </div>
              {/* Render any additional fields after Instagram and Website */}
              {form.additionalFields.slice(2).map((field, idx) => (
                <div className="flex gap-2 mb-2" key={idx + 2}>
                  <Input
                    placeholder="Field Label"
                    value={field.label}
                    onChange={e => handleAdditionalField(idx + 2, "label", e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={field.value}
                    onChange={e => handleAdditionalField(idx + 2, "value", e.target.value)}
                  />
                  <Button variant="ghost" type="button" onClick={() => removeAdditionalField(idx + 2)} disabled={false}>🗑️</Button>
                </div>
              ))}
              <Button variant="outline" type="button" onClick={addAdditionalField}>+ Add Field</Button>
            </div>

            {/* Additional Documents Section */}
            <div className="mb-6">
              <div className="font-medium mb-2">Additional Documents</div>
              <div className="space-y-4">
                {/* Document Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-semibold text-primary">Drag and drop</span> or click to upload additional documents
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                    </p>
                    <input 
                      type="file" 
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleAdditionalDocument}
                      className="hidden" 
                      id="additional-docs-upload" 
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="additional-docs-upload">Browse Files</label>
                    </Button>
                  </div>
                </div>

                {/* Uploaded Documents List */}
                {form.additionalDocuments && form.additionalDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Uploaded Documents:</h4>
                    {form.additionalDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {doc.file.type.includes('pdf') ? (
                            <FileText className="h-8 w-8 text-red-500" />
                          ) : (
                            <Image className="h-8 w-8 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={doc.type}
                            onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            {documentTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalDocument(doc.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-1">Notes & Special Instructions</div>
              <textarea name="notes" value={form.notes} onChange={handleInput} className="w-full border rounded px-3 py-2" rows={3} placeholder="Enter any additional notes or special instructions for this artist" />
            </div>
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="portalAccess" checked={form.portalAccess} onChange={handleInput} className="accent-primary w-4 h-4" id="portal-access" />
                <label htmlFor="portal-access" className="text-base">Enable Artist Portal Access</label>
              </div>
              <div className="text-xs text-muted-foreground mb-2">When enabled, the artist will receive an email invitation to create an account on the artist portal.</div>
              <div className="mb-2 font-medium">Profile Completion Link</div>
              <div className="flex items-center gap-2">
                <Input value={profileLink} readOnly className="flex-1" />
                <Button variant="outline" type="button" onClick={() => navigator.clipboard.writeText(profileLink)}>Copy</Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">This link will allow the artist to securely complete their profile and upload documentation.</div>
            </div>
            <div className="flex justify-end mt-8 md:hidden">
              {tab === "additional" ? (
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Save Artist Profile"
                  )}
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-8">
          <Button variant="outline" className="mr-2" onClick={() => router.push("/artist-profiles")}>Cancel</Button>
          {tab === "additional" ? (
            <Button 
              variant="default" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Save Artist Profile"
              )}
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileCreate; 