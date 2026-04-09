"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { X } from "lucide-react"
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { useGallery } from '@/contexts/gallery-context'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/use-confetti'

const interestOptions = [
  'Contemporary', 'Pop Art', 'Impressionism', 'Modern', 'Abstract Expressionism',
  'Photography', 'Digital Art', 'Sculpture', 'Street Art', 'Graffiti',
  'Surrealism', 'Cubism', 'Baroque', 'Renaissance', 'Minimalism', 'Conceptual Art',
  'Post-Impressionism', 'Realism', 'Expressionism', 'Fauvism'
];

export function AddPatronModal({ open, onOpenChange, onPatronAdded }) {
  const { user } = useAuth();
  const { gallery } = useGallery();
  const { triggerSuccessConfetti } = useConfetti();
  const [interests, setInterests] = useState([]);
  const [currentInterest, setCurrentInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    patronType: 'Collector',
    vip: false,
    interests: [],
    notes: '',
    marketingConsent: true
  });

  const addInterest = (interest) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setFormData(prev => ({ ...prev, interests: [...interests, interest] }));
    }
  };

  const addCustomInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()]);
      setFormData(prev => ({ ...prev, interests: [...interests, currentInterest.trim()] }));
      setCurrentInterest("");
    }
  };

  const removeInterest = (interest) => {
    const newInterests = interests.filter(i => i !== interest);
    setInterests(newInterests);
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !gallery) {
      toast.error('Please log in and select a gallery');
      return;
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields (Name and Email)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Check if patron already exists for this gallery
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', formData.email.trim()));
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const existingPatron = userData.patronTo?.find(p => p.galleryId === gallery.id);
        if (existingPatron) {
          toast.error('A patron with this email already exists for this gallery');
          setIsSubmitting(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking for existing patron:', error);
      // Continue with creation if check fails
    }

    try {
      // Create patron document in the users collection
      const patronData = {
        fullname: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '',
        patronType: formData.patronType,
        interests: formData.interests,
        notes: formData.notes.trim() || '',
        marketingPreference: formData.marketingConsent ? 'Opted In' : 'Opted Out',
        vip: formData.vip,
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: 'patron', // Mark this as a patron user
        isActive: true,
        patronTo: [{
          galleryId: gallery.id,
          galleryName: gallery.name,
          galleryEmail: gallery.email,
          joinedAt: new Date(),
          status: 'Active'
        }],
        // Add additional fields that might be expected
        address: {},
        photoURL: '/placeholder-user.jpg',
        // Ensure the user can be identified as a patron in the system
        role: 'patron'
      };

      console.log('Adding patron to database:', patronData);
      const docRef = await addDoc(collection(db, 'users'), patronData);
      console.log('Patron added with ID:', docRef.id);

      // Verify the patron was created successfully
      if (docRef.id) {
        // Trigger confetti celebration
        triggerSuccessConfetti();
        
        toast.success('Patron added successfully!');
      } else {
        throw new Error('Failed to create patron document');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        patronType: 'Collector',
        vip: false,
        interests: [],
        notes: '',
        marketingConsent: true
      });
      setInterests([]);
      setCurrentInterest('');
      
      // Refresh patron list
      if (onPatronAdded) {
        onPatronAdded();
      }
      
      // Close modal
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error adding patron:', error);
      toast.error('Failed to add patron. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Patron</DialogTitle>
          <DialogDescription>
            Add a new patron or collector to your gallery's database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name *
            </Label>
            <Input 
              id="name" 
              className="col-span-3" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email *
            </Label>
            <Input 
              id="email" 
              type="email" 
              className="col-span-3" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="phone" 
              type="tel" 
              className="col-span-3" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patron-type" className="text-right">
              Patron Type *
            </Label>
            <Select value={formData.patronType} onValueChange={(value) => handleInputChange('patronType', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Collector">Collector</SelectItem>
                <SelectItem value="Institution">Institution</SelectItem>
                <SelectItem value="Art Dealer">Art Dealer</SelectItem>
                <SelectItem value="Curator">Curator</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vip-status" className="text-right">
              VIP Status
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
                <Switch 
                  id="vip-status" 
                  checked={formData.vip}
                  onCheckedChange={(checked) => handleInputChange('vip', checked)}
                />
                <Label htmlFor="vip-status">VIP Patron</Label>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="interests" className="text-right pt-2">
              Art Interests
            </Label>
            <div className="col-span-3 space-y-3">
              {/* Selected Interests Display */}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Interest Options */}
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <Button
                    key={interest}
                    variant="outline"
                    size="sm"
                    onClick={() => addInterest(interest)}
                    disabled={interests.includes(interest)}
                    className="text-xs"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              
              {/* Custom Interest Input */}
              <div className="flex gap-2">
                <Input 
                  id="interests" 
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  placeholder="Add custom interest"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                />
                <Button onClick={addCustomInterest} disabled={!currentInterest.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea 
              id="notes" 
              className="col-span-3" 
              placeholder="Add any relevant notes about this patron"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Marketing
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
                <Switch 
                  id="marketing-consent" 
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
                />
                <Label htmlFor="marketing-consent">Patron has consented to receive marketing communications</Label>
            </div>
          </div>
        </div>
        </form>
        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Patron'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 