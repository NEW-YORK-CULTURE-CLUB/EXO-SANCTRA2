'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload, Heart, Star, Crown, Sparkles, User, Mail, Phone, Building } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PatronSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryData: {
    id: string;
    name: string;
    email: string;
    darkLogo?: string;
    lightLogo?: string;
  };
  artworkTitle?: string;
}

interface PatronFormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  interests: string[];
  marketing: string;
  avatar: string;
  notes: string;
}

const interestOptions = [
  'Contemporary', 'Pop Art', 'Impressionism', 'Modern', 'Abstract Expressionism',
  'Photography', 'Digital Art', 'Sculpture', 'Street Art', 'Graffiti',
  'Surrealism', 'Cubism', 'Baroque', 'Renaissance', 'Minimalism', 'Conceptual Art',
  'Post-Impressionism', 'Realism', 'Expressionism', 'Fauvism'
];

const patronTypes = ['Collector', 'Institution', 'Consultant', 'Curator', 'Art Dealer'];

export function PatronSignupModal({ isOpen, onClose, galleryData, artworkTitle }: PatronSignupModalProps) {
  const { user, userData } = useAuth();
  const [step, setStep] = useState<'initial' | 'form' | 'success'>('initial');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PatronFormData>({
    name: userData?.fullname || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    type: 'Collector',
    interests: [],
    marketing: 'Opted In',
    avatar: userData?.photoURL || '',
    notes: ''
  });
  const [newInterest, setNewInterest] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setFormData({
        name: userData?.fullname || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        type: userData?.patronType || 'Collector',
        interests: userData?.interests || [],
        marketing: userData?.marketingPreference || 'Opted In',
        avatar: userData?.photoURL || '',
        notes: userData?.notes || ''
      });
      setAvatarFile(null);
      setAvatarPreview('');
    }
  }, [isOpen, userData]);

  const handleInterestAdd = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleInterestRemove = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleCustomInterestAdd = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = () => {
    // Create confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    });
  };

  const handleBecomePatron = async () => {
    if (!user || !userData) {
      toast.error('Please log in to become a patron');
      return;
    }

    setLoading(true);
    try {
      // Update user document with user profile data and gallery relationship
      const userRef = doc(db, 'users', user.uid);
      
      // Prepare user profile updates (only if missing or different)
      const userProfileUpdates: any = {};
      if (!userData.fullname && formData.name) {
        userProfileUpdates.fullname = formData.name;
      }
      if (!userData.phone && formData.phone) {
        userProfileUpdates.phone = formData.phone;
      }
      if (!userData.photoURL && (avatarPreview || formData.avatar)) {
        userProfileUpdates.photoURL = avatarPreview || formData.avatar;
      }
      if (!userData.interests || userData.interests.length === 0) {
        userProfileUpdates.interests = formData.interests;
      }
      if (!userData.marketingPreference) {
        userProfileUpdates.marketingPreference = formData.marketing;
      }
      if (!userData.notes) {
        userProfileUpdates.notes = formData.notes;
      }
      if (!userData.patronType) {
        userProfileUpdates.patronType = formData.type;
      }

      // Prepare gallery relationship data (only gallery-specific info)
      const patronToUpdate = {
        galleryId: galleryData.id,
        galleryName: galleryData.name,
        galleryEmail: galleryData.email,
        joinedAt: new Date(),
        status: 'Active'
      };

      // Combine all updates
      const updateData = {
        ...userProfileUpdates,
        patronTo: arrayUnion(patronToUpdate)
      };

      console.log('Updating user document with:', updateData);
      await updateDoc(userRef, updateData);
      console.log('User document updated successfully');

      // Trigger confetti
      triggerConfetti();
      
      setStep('success');
      toast.success(`Welcome! You're now a patron of ${galleryData.name}`);
      
    } catch (error) {
      console.error('Error becoming patron:', error);
      toast.error('Failed to become patron. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('initial');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background scrollbar-hide !duration-0 data-[state=open]:animate-none data-[state=closed]:animate-none !rounded-[30px] sm:!rounded-[30px]">
        {step === 'initial' && (
          <>
            <DialogHeader className="px-6 py-6 relative">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground pr-8">
                <Crown className="w-6 h-6 text-yellow-500" />
                Become a Patron
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                {artworkTitle 
                  ? `You've been exploring "${artworkTitle}" for a while. Would you like to become a patron of ${galleryData.name}?`
                  : `Would you like to become a patron of ${galleryData.name}?`
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="px-6 py-4">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  {galleryData.darkLogo || galleryData.lightLogo ? (
                    <img 
                      src={galleryData.darkLogo || galleryData.lightLogo} 
                      alt={`${galleryData.name} logo`}
                      className="w-14 h-14 object-contain"
                    />
                  ) : (
                    <Heart className="w-10 h-10 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{galleryData.name}</h3>
                  <p className="text-muted-foreground mt-2">Join as a patron to get exclusive access</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-foreground">Exclusive previews</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-foreground">Private viewings</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-foreground">Special events</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-foreground">VIP treatment</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 px-6 py-6">
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Maybe Later
              </Button>
              <Button onClick={() => setStep('form')} className="text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl">
                <Crown className="w-4 h-4 mr-2" />
                Become a Patron
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader className="px-6 py-6 relative">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground pr-8">
                <Crown className="w-6 h-6" />
                Complete Your Patron Profile
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                {userData?.fullname && userData?.phone && userData?.interests && userData?.interests.length > 0 
                  ? "Update your interests to help " + galleryData.name + " serve you better"
                  : "Help " + galleryData.name + " get to know you better"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 px-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Basic Information</h3>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarPreview || formData.avatar} />
                      <AvatarFallback>{formData.name.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="rounded-xl"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {!userData?.fullname && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4" />
                          Full Name: *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded-xl"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-medium flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4" />
                        Email: *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        placeholder="Enter your email"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {!userData?.phone && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2 text-foreground">
                        <Phone className="w-4 h-4" />
                        Phone:
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded-xl"
                      />
                    </div>
                  )}
                  
                  {!userData?.patronType && (
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-base font-medium text-foreground">
                        Patron Type: *
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-background border-input text-foreground focus:border-ring focus:ring-ring rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {patronTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>


              {/* Interests */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Art Interests</h3>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map(interest => (
                      <Badge key={interest} variant="secondary" className="flex items-center gap-1 rounded-xl">
                        {interest}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => handleInterestRemove(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map(interest => (
                      <Button
                        key={interest}
                        variant="outline"
                        size="sm"
                        onClick={() => handleInterestAdd(interest)}
                        disabled={formData.interests.includes(interest)}
                        className="text-xs rounded-xl"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add custom interest"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCustomInterestAdd();
                        }
                      }}
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded-xl"
                    />
                    <Button onClick={handleCustomInterestAdd} disabled={!newInterest.trim()} className="rounded-xl">
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Communication Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketing === 'Opted In'}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, marketing: checked ? 'Opted In' : 'Opted Out' }))
                      }
                      className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="marketing" className="text-foreground">
                      I would like to receive updates and invitations from {galleryData.name}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Notes - Only show if no notes exist */}
              {!userData?.notes && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Additional Notes</h3>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Tell the gallery about your collecting interests, preferences, or any special requests..."
                    rows={3}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring rounded-xl"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 px-6 py-6">
              <Button variant="outline" onClick={() => setStep('initial')} className="rounded-xl">
                Back
              </Button>
              <Button 
                onClick={handleBecomePatron} 
                disabled={loading || (!formData.name && !userData?.fullname) || !formData.email}
                className="text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl"
              >
                {loading ? 'Processing...' : 'Complete Signup'}
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader className="px-6 py-6 relative">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-center justify-center text-foreground">
                <Crown className="w-6 h-6 text-yellow-500" />
                Welcome to the Family!
              </DialogTitle>
            </DialogHeader>
            
            <div className="px-6 py-4 text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-2xl">
                <Crown className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
                <p className="text-muted-foreground mt-2">
                  You're now a patron of <strong>{galleryData.name}</strong>
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">What's next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive exclusive previews of new artworks</li>
                  <li>• Invitations to private gallery events</li>
                  <li>• Priority access to limited edition pieces</li>
                  <li>• Personal consultation with gallery experts</li>
                </ul>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <Button onClick={handleClose} className="w-full rounded-xl">
                Continue Exploring
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
