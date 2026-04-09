'use client';

import { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    interests: [] as string[],
    agreeToTerms: false
  });

  const interestOptions = [
    'Gallery Management',
    'Artist Tools',
    'Collector Resources',
    'Auction Updates',
    'Market Insights',
    'Technology News',
    'Industry Events',
    'New Features'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Validation Error",
        description: "Please agree to our terms and privacy policy.",
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
      // Send newsletter signup to API
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowSuccess(true);
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        });
      } else {
        throw new Error('Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setFormData({
      email: '',
      firstName: '',
      interests: [],
      agreeToTerms: false
    });
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Welcome to ExhibitIQ!</DialogTitle>
            <DialogDescription className="text-center">
              You've successfully subscribed to our newsletter.
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Thank you for subscribing!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              You'll receive our latest updates, industry insights, and exclusive content directly in your inbox.
            </p>
            <Button onClick={handleClose} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join Our Newsletter</DialogTitle>
          <DialogDescription>
            Stay updated with the latest art industry insights, platform updates, and exclusive content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name (Optional)
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              What interests you most? (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-xs text-muted-foreground">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="agreeToTerms" className="text-xs text-muted-foreground leading-relaxed">
                I agree to receive marketing communications from ExhibitIQ and have read the{' '}
                <a href="/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/legal/terms-of-service" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>.
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </div>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
