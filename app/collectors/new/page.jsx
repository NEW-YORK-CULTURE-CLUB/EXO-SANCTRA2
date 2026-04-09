"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  X,
  Crown,
  DollarSign,
  Palette,
  MapPin,
  Mail,
  Phone,
  User,
  Building,
  Target,
  Heart,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";

const initialForm = {
  // Basic Information
  name: "",
  email: "",
  phone: "",
  avatar: null,
  
  // Location & Contact
  address1: "",
  address2: "",
  city: "",
  state: "",
  postal: "",
  country: "",
  preferredContact: "Email",
  
  // Collector Profile
  tier: "Standard",
  status: "Active",
  budgetRange: "",
  preferredStyles: [],
  interests: [],
  specialRequests: "",
  notes: "",
  
  // Marketing & Communication
  marketingOptIn: true,
  newsletterOptIn: true,
  vipStatus: false,
  
  // Additional Information
  occupation: "",
  company: "",
  socialMedia: {
    instagram: "",
    twitter: "",
    linkedin: ""
  },
  
  // Preferences
  preferredArtists: [],
  preferredGalleries: [],
  exhibitionInterests: [],
  
  // Custom Fields
  customFields: [{ label: "", value: "" }]
};

const tierOptions = ["Standard", "Premium", "VIP"];
const statusOptions = ["Active", "Inactive", "Prospect"];
const budgetRanges = [
  "Under $50K",
  "$50K - $100K", 
  "$100K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M - $10M",
  "$10M+"
];
const styleOptions = [
  "Contemporary", "Modern", "Impressionism", "Post-Impressionism",
  "Abstract Expressionism", "Pop Art", "Surrealism", "Cubism",
  "Baroque", "Renaissance", "Classical", "Academic",
  "Street Art", "Graffiti", "Photography", "Digital Art",
  "Sculpture", "Installation", "Video Art", "Conceptual Art",
  "Minimalism", "Expressionism", "Realism", "Romanticism"
];
const interestOptions = [
  "Contemporary", "Modern", "Classical", "Emerging Artists",
  "Street Art", "Photography", "Sculpture", "Digital Art",
  "Installation", "Video Art", "Performance", "Sound Art",
  "Political Art", "Feminist Art", "Environmental Art", "Social Practice"
];

const NewCollector = () => {
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState(initialForm);
  const router = useRouter();

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayField = (field, value, action) => {
    setForm((prev) => {
      const currentArray = prev[field] || [];
      let newArray;
      
      if (action === "add" && !currentArray.includes(value)) {
        newArray = [...currentArray, value];
      } else if (action === "remove") {
        newArray = currentArray.filter(item => item !== value);
      } else {
        newArray = currentArray;
      }
      
      return { ...prev, [field]: newArray };
    });
  };

  const handleCustomField = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...prev.customFields];
      updated[idx][key] = value;
      return { ...prev, customFields: updated };
    });
  };

  const addCustomField = () => {
    setForm((prev) => ({ 
      ...prev, 
      customFields: [...prev.customFields, { label: "", value: "" }] 
    }));
  };

  const removeCustomField = (idx) => {
    setForm((prev) => {
      const updated = prev.customFields.filter((_, i) => i !== idx);
      return { ...prev, customFields: updated };
    });
  };

  const handleSocialMedia = (platform, value) => {
    setForm((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/collectors")}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Collectors
        </Button>
        <Button variant="default" className="">
          <Plus className="w-4 h-4 mr-2" /> Create Collector
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-2xl font-bold mb-4">Add New Collector</div>
        
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input 
                          name="name" 
                          value={form.name} 
                          onChange={handleInput} 
                          placeholder="Enter collector's full name" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input 
                          name="email" 
                          value={form.email} 
                          onChange={handleInput} 
                          placeholder="collector@example.com" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleInput} 
                        placeholder="+1 (555) 123-4567" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Occupation</label>
                        <Input 
                          name="occupation" 
                          value={form.occupation} 
                          onChange={handleInput} 
                          placeholder="e.g., CEO, Artist, Consultant" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company</label>
                        <Input 
                          name="company" 
                          value={form.company} 
                          onChange={handleInput} 
                          placeholder="Company name" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Address Line 1</label>
                      <Input 
                        name="address1" 
                        value={form.address1} 
                        onChange={handleInput} 
                        placeholder="Street address" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Address Line 2</label>
                      <Input 
                        name="address2" 
                        value={form.address2} 
                        onChange={handleInput} 
                        placeholder="Apt, Suite, etc." 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">City</label>
                        <Input 
                          name="city" 
                          value={form.city} 
                          onChange={handleInput} 
                          placeholder="City" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">State/Province</label>
                        <Input 
                          name="state" 
                          value={form.state} 
                          onChange={handleInput} 
                          placeholder="State" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Postal Code</label>
                        <Input 
                          name="postal" 
                          value={form.postal} 
                          onChange={handleInput} 
                          placeholder="Postal code" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Country</label>
                      <Input 
                        name="country" 
                        value={form.country} 
                        onChange={handleInput} 
                        placeholder="Country" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-dashed border-muted-foreground/25">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Profile Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full flex flex-col items-center justify-center">
                      <input 
                        type="file" 
                        name="avatar" 
                        accept="image/*" 
                        onChange={handleInput} 
                        className="hidden" 
                        id="avatar-upload" 
                      />
                      <label 
                        htmlFor="avatar-upload" 
                        className="w-full h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="font-medium text-center">Upload Photo</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">
                          Drag and drop an image here, or click to browse.
                        </span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Quick Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Collector Tier</label>
                      <select 
                        name="tier" 
                        value={form.tier} 
                        onChange={handleInput} 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {tierOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <select 
                        name="status" 
                        value={form.status} 
                        onChange={handleInput} 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        name="vipStatus" 
                        checked={form.vipStatus} 
                        onChange={handleInput} 
                        className="rounded border-gray-300" 
                        id="vip-status" 
                      />
                      <label htmlFor="vip-status" className="text-sm font-medium">
                        VIP Status
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget Range</label>
                    <select 
                      name="budgetRange" 
                      value={form.budgetRange} 
                      onChange={handleInput} 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Contact Method</label>
                    <select 
                      name="preferredContact" 
                      value={form.preferredContact} 
                      onChange={handleInput} 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Text">Text</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Marketing Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="marketingOptIn" 
                      checked={form.marketingOptIn} 
                      onChange={handleInput} 
                      className="rounded border-gray-300" 
                      id="marketing-optin" 
                    />
                    <label htmlFor="marketing-optin" className="text-sm font-medium">
                      Marketing Communications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="newsletterOptIn" 
                      checked={form.newsletterOptIn} 
                      onChange={handleInput} 
                      className="rounded border-gray-300" 
                      id="newsletter-optin" 
                    />
                    <label htmlFor="newsletter-optin" className="text-sm font-medium">
                      Newsletter Subscription
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Special Requests & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Special Requests</label>
                    <textarea 
                      name="specialRequests" 
                      value={form.specialRequests} 
                      onChange={handleInput} 
                      className="w-full border rounded-md px-3 py-2 text-sm" 
                      rows={3} 
                      placeholder="Any special requirements or preferences..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <textarea 
                      name="notes" 
                      value={form.notes} 
                      onChange={handleInput} 
                      className="w-full border rounded-md px-3 py-2 text-sm" 
                      rows={3} 
                      placeholder="Additional notes about this collector..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Art Style Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Preferred Styles</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                      {styleOptions.map((style) => (
                        <Badge
                          key={style}
                          variant={form.preferredStyles.includes(style) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleArrayField(
                            'preferredStyles', 
                            style, 
                            form.preferredStyles.includes(style) ? 'remove' : 'add'
                          )}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Art Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Areas of Interest</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                      {interestOptions.map((interest) => (
                        <Badge
                          key={interest}
                          variant={form.interests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleArrayField(
                            'interests', 
                            interest, 
                            form.interests.includes(interest) ? 'remove' : 'add'
                          )}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Preferred Artists & Galleries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Artists</label>
                    <Input 
                      placeholder="Add artist name and press Enter" 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            handleArrayField('preferredArtists', value, 'add');
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.preferredArtists.map((artist, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {artist}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleArrayField('preferredArtists', artist, 'remove')}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Galleries</label>
                    <Input 
                      placeholder="Add gallery name and press Enter" 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            handleArrayField('preferredGalleries', value, 'add');
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.preferredGalleries.map((gallery, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {gallery}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleArrayField('preferredGalleries', gallery, 'remove')}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Email</label>
                    <Input 
                      name="email" 
                      value={form.email} 
                      onChange={handleInput} 
                      placeholder="primary@example.com" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleInput} 
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Contact Method</label>
                    <select 
                      name="preferredContact" 
                      value={form.preferredContact} 
                      onChange={handleInput} 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Text">Text</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instagram</label>
                    <Input 
                      value={form.socialMedia.instagram} 
                      onChange={(e) => handleSocialMedia('instagram', e.target.value)} 
                      placeholder="@username" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Twitter</label>
                    <Input 
                      value={form.socialMedia.twitter} 
                      onChange={(e) => handleSocialMedia('twitter', e.target.value)} 
                      placeholder="@username" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                    <Input 
                      value={form.socialMedia.linkedin} 
                      onChange={(e) => handleSocialMedia('linkedin', e.target.value)} 
                      placeholder="linkedin.com/in/username" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Custom Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.customFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Field label"
                        value={field.label}
                        onChange={(e) => handleCustomField(index, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Field value"
                        value={field.value}
                        onChange={(e) => handleCustomField(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomField(index)}
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomField}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8 gap-4">
          <Button variant="outline" onClick={() => router.push("/collectors")}>
            Cancel
          </Button>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Create Collector
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCollector; 