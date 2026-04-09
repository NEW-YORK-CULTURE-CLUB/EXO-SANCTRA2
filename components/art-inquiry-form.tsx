'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { X, Send } from 'lucide-react';

interface ArtInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  artworkTitle?: string;
}

export function ArtInquiryForm({ isOpen, onClose, artworkTitle }: ArtInquiryFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiringAboutSpecific: 'no',
    artworkTitle: '',
    interestNature: '',
    otherInterest: '',
    whatDrewYou: '',
    scheduleConsultation: 'no',
    preferredDateTime: '',
    responseMethod: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Full Name and Email Address).",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate interest nature is selected
    if (!formData.interestNature) {
      toast({
        title: "Missing Information",
        description: "Please select the nature of your interest.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      const result = await response.json();
      console.log('Inquiry sent successfully:', result);
      
      // Show success message
      toast({
        title: "Inquiry Sent Successfully!",
        description: "Thank you! Your inquiry has been sent successfully. We will get back to you soon.",
      });
      
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error Sending Inquiry",
        description: "Sorry, there was an error sending your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiringAboutSpecific: 'no',
        artworkTitle: '',
        interestNature: '',
        otherInterest: '',
        whatDrewYou: '',
        scheduleConsultation: 'no',
        preferredDateTime: '',
        responseMethod: 'email'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Art Inquiry Form</DialogTitle>
          <DialogDescription>
            Please fill out this form to inquire about artwork or artist information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium">
              1. Full Name: *
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* 2. Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              2. Email Address: *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
            />
          </div>

          {/* 3. Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium">
              3. Phone Number (optional):
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {/* 4. Specific Artwork Inquiry */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              4. Are you inquiring about a specific artwork?
            </Label>
            <RadioGroup
              value={formData.inquiringAboutSpecific}
              onValueChange={(value) => handleInputChange('inquiringAboutSpecific', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="specific-yes" />
                <Label htmlFor="specific-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="specific-no" />
                <Label htmlFor="specific-no">No</Label>
              </div>
            </RadioGroup>
            
            {formData.inquiringAboutSpecific === 'yes' && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="artworkTitle" className="text-sm">
                  If yes, please provide the title or description of the work:
                </Label>
                <Input
                  id="artworkTitle"
                  type="text"
                  value={formData.artworkTitle}
                  onChange={(e) => handleInputChange('artworkTitle', e.target.value)}
                  placeholder={artworkTitle || "Enter artwork title or description"}
                />
              </div>
            )}
          </div>

          {/* 5. Nature of Interest */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              5. What is the nature of your interest?
            </Label>
            <RadioGroup
              value={formData.interestNature}
              onValueChange={(value) => handleInputChange('interestNature', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purchase" id="purchase" />
                <Label htmlFor="purchase">Purchase inquiry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="artist" id="artist" />
                <Label htmlFor="artist">Artist information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exhibition" id="exhibition" />
                <Label htmlFor="exhibition">Exhibition details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="viewing" id="viewing" />
                <Label htmlFor="viewing">Private viewing request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            
            {formData.interestNature === 'other' && (
              <div className="space-y-2 ml-6">
                <Input
                  type="text"
                  value={formData.otherInterest}
                  onChange={(e) => handleInputChange('otherInterest', e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </div>

          {/* 6. What drew you */}
          <div className="space-y-2">
            <Label htmlFor="whatDrewYou" className="text-base font-medium">
              6. What drew you to this artwork or artist? (optional)
            </Label>
            <Textarea
              id="whatDrewYou"
              value={formData.whatDrewYou}
              onChange={(e) => handleInputChange('whatDrewYou', e.target.value)}
              placeholder="Tell us what interests you about this artwork or artist"
              rows={3}
            />
          </div>

          {/* 7. Schedule Consultation */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              7. Would you like to schedule a private consultation or virtual walkthrough?
            </Label>
            <RadioGroup
              value={formData.scheduleConsultation}
              onValueChange={(value) => handleInputChange('scheduleConsultation', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="consultation-yes" />
                <Label htmlFor="consultation-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="consultation-no" />
                <Label htmlFor="consultation-no">No</Label>
              </div>
            </RadioGroup>
            
            {formData.scheduleConsultation === 'yes' && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="preferredDateTime" className="text-sm">
                  If yes, preferred date/time:
                </Label>
                <Input
                  id="preferredDateTime"
                  type="text"
                  value={formData.preferredDateTime}
                  onChange={(e) => handleInputChange('preferredDateTime', e.target.value)}
                  placeholder="e.g., Monday, March 15th at 2 PM"
                />
              </div>
            )}
          </div>

          {/* 8. Response Method */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              8. Preferred response method:
            </Label>
            <RadioGroup
              value={formData.responseMethod}
              onValueChange={(value) => handleInputChange('responseMethod', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-response" />
                <Label htmlFor="email-response">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone-response" />
                <Label htmlFor="phone-response">Phone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="either" id="either-response" />
                <Label htmlFor="either-response">Either</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ExhibitIQ respects your privacy. Your information will only be used to facilitate this inquiry.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 