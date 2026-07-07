'use client';

import { useState } from 'react';
import { X, Calendar, Send, Building, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { handleEmailApiResponse } from '@/lib/email-client';

interface DemoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoFormModal({ isOpen, onClose }: DemoFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organizationName: '',
    role: '',
    helpAreas: [] as string[],
    otherHelp: '',
    additionalInfo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      helpAreas: checked 
        ? [...prev.helpAreas, value]
        : prev.helpAreas.filter(area => area !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name and Email).",
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
    
    setIsSubmitting(true);
    
    try {
      // Send demo request to API
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const emailResult = await handleEmailApiResponse(response);
      if (!emailResult.ok) {
        toast({
          title: 'Email not configured',
          description: emailResult.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (response.ok) {
        toast({
          title: "Demo Request Sent!",
          description: "We'll be in touch soon to schedule your personalized demo.",
        });
        
        // Reset form and close modal
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          organizationName: '',
          role: '',
          helpAreas: [],
          otherHelp: '',
          additionalInfo: ''
        });
        onClose();
      } else {
        throw new Error('Failed to send demo request');
      }
    } catch (error) {
      console.error('Error sending demo request:', error);
      toast({
        title: "Error",
        description: "Failed to send demo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background scrollbar-hide !duration-0 data-[state=open]:animate-none data-[state=closed]:animate-none !rounded-[30px] sm:!rounded-[30px]">
        <DialogHeader className="px-6 py-6 relative">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground pr-8">
            <Calendar className="w-6 h-6" />
            ExhibitIQ Demo Request
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Tell us about your gallery and what you'd like to learn about ExhibitIQ. We'll schedule a personalized demo just for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2 text-foreground">
              <User className="w-4 h-4" />
              Name: *
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4" />
              Email: *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4" />
              Phone (optional):
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Gallery/Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-base font-medium flex items-center gap-2 text-foreground">
              <Building className="w-4 h-4" />
              Gallery or Organization Name:
            </Label>
            <Input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Enter your gallery or organization name"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-base font-medium text-foreground">
              Your Role:
            </Label>
            <Input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              placeholder="e.g., Gallery Owner, Director, Manager"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Help Areas */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">
              What do you want help with? *
            </Label>
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inventory"
                  checked={formData.helpAreas.includes('inventory')}
                  onCheckedChange={(checked) => handleCheckboxChange('inventory', checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="inventory" className="text-foreground">Managing artwork inventory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="provenance"
                  checked={formData.helpAreas.includes('provenance')}
                  onCheckedChange={(checked) => handleCheckboxChange('provenance', checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="provenance" className="text-foreground">Tracking provenance & COAs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selling"
                  checked={formData.helpAreas.includes('selling')}
                  onCheckedChange={(checked) => handleCheckboxChange('selling', checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="selling" className="text-foreground">Selling online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collectors"
                  checked={formData.helpAreas.includes('collectors')}
                  onCheckedChange={(checked) => handleCheckboxChange('collectors', checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="collectors" className="text-foreground">Engaging collectors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={formData.helpAreas.includes('other')}
                  onCheckedChange={(checked) => handleCheckboxChange('other', checked as boolean)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="other" className="text-foreground">Other</Label>
              </div>
            </div>
            
            {formData.helpAreas.includes('other') && (
              <div className="space-y-2 ml-6 mt-3">
                <Input
                  type="text"
                  value={formData.otherHelp}
                  onChange={(e) => handleInputChange('otherHelp', e.target.value)}
                  placeholder="Please specify what you need help with"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                />
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-base font-medium text-foreground">
              Anything else we should know?
            </Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Tell us about your current challenges, specific needs, or any questions you have"
              rows={3}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              ExhibitIQ respects your privacy. Your information will only be used to schedule and personalize your demo experience.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request Demo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
