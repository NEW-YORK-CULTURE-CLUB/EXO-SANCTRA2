'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { X, Sparkles, ArrowRight, Calendar, Send, Building, User, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function DemoPopup() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organizationName: '',
    role: '',
    helpAreas: [] as string[],
    otherHelp: '',
    preferredTime: '',
    additionalInfo: ''
  });

  useEffect(() => {
    // Only show popup for non-logged-in users
    if (loading || user) return;

    const timer = setInterval(() => {
      setTimeOnSite(prev => {
        const newTime = prev + 1;
        // Show popup after 30 seconds
        if (newTime === 10) {
          setShowPopup(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, loading]);

  const handleClose = () => {
    setShowPopup(false);
    setShowForm(false);
  };

  const handleScheduleDemo = () => {
    setShowForm(true);
  };

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
    
    // Validate at least one help area is selected
    if (formData.helpAreas.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one area where you need help.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create email content
      const emailSubject = `New ExhibitIQ Demo Request - ${formData.fullName}`;
      
      const emailBody = `
Dear ExhibitIQ Team,

A new demo request has been submitted through the website.

**Contact Information:**
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Organization: ${formData.organizationName || 'Not provided'}
- Role: ${formData.role || 'Not provided'}

**Demo Requirements:**
- Primary Interest: ${formData.helpAreas.length > 0 ? formData.helpAreas.join(', ') : 'Not specified'}
${formData.helpAreas.includes('other') && formData.otherHelp ? `- Other Details: ${formData.otherHelp}` : ''}
- Preferred Demo Time: ${formData.preferredTime || 'Not specified'}

**Additional Information:**
${formData.additionalInfo || 'No additional information provided'}

---
This request was submitted from the ExhibitIQ website demo form.
Please respond within 24 hours to schedule the demo.

Best regards,
ExhibitIQ System
      `.trim();

      // Create mailto link with multiple recipients
      const recipients = [
        'admin@exhibitiq.art',
        'Lily@parallelworlds.us', 
        'okuakpabio0@gmail.com',
        'Brian@parallelworlds.us'
      ].join(',');

      const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      // Show success message
      toast({
        title: "Demo Request Sent Successfully!",
        description: "Your email client has opened with the demo request details. Please send the email to complete your request.",
      });
      
      // Reset form and close
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organizationName: '',
        role: '',
        helpAreas: [],
        otherHelp: '',
        preferredTime: '',
        additionalInfo: ''
      });
      
      handleClose();
      
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast({
        title: "Error Sending Request",
        description: "Sorry, there was an error sending your demo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Initial Demo Popup */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <Card className="relative max-w-md w-full mx-4 bg-white/95 backdrop-blur-xl rounded-[50px] shadow-[50px] animate-in zoom-in-95 duration-300 border-0">
          <CardContent className="p-0">
            {/* Header with close button */}
            <div className="flex items-center justify-end p-6 pb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main content */}
            <div className="px-12 pb-6">
              {/* Hero section */}
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  <span className="">Galleries Grow With ExhibitIQ</span>
                </h1>

                <p className="text-sm text-gray-600">
                  We would love to show you how ExhibitIQ empowers galleries to sell more.
                </p>
              </div>

              {/* CTA section */}
              <div className="text-center space-y-4 mb-10">
                <Button
                  onClick={handleScheduleDemo}
                  size="lg"
                  className="w-full bg-black hover:bg-black/80 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule A Live Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Request Form Dialog */}
      <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white scrollbar-hide">
          <DialogHeader className="pb-6 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
              className="absolute right-0 top-0 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 pr-8">
              <Calendar className="w-6 h-6" />
              ExhibitIQ Demo Request
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Tell us about your gallery and what you'd like to learn about ExhibitIQ. We'll schedule a personalized demo just for you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 px-1">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2 text-gray-900">
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
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium flex items-center gap-2 text-gray-900">
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
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2 text-gray-900">
                <Phone className="w-4 h-4" />
                Phone (optional):
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Gallery/Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-base font-medium flex items-center gap-2 text-gray-900">
                <Building className="w-4 h-4" />
                Gallery or Organization Name:
              </Label>
              <Input
                id="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Enter your gallery or organization name"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base font-medium text-gray-900">
                Your Role:
              </Label>
              <Input
                id="role"
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Gallery Owner, Director, Manager"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Help Areas */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">
                What do you want help with? *
              </Label>
              <div className="space-y-3 pl-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inventory"
                    checked={formData.helpAreas.includes('inventory')}
                    onCheckedChange={(checked) => handleCheckboxChange('inventory', checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label htmlFor="inventory" className="text-gray-900">Managing artwork inventory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="provenance"
                    checked={formData.helpAreas.includes('provenance')}
                    onCheckedChange={(checked) => handleCheckboxChange('provenance', checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label htmlFor="provenance" className="text-gray-900">Tracking provenance & COAs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selling"
                    checked={formData.helpAreas.includes('selling')}
                    onCheckedChange={(checked) => handleCheckboxChange('selling', checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label htmlFor="selling" className="text-gray-900">Selling online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectors"
                    checked={formData.helpAreas.includes('collectors')}
                    onCheckedChange={(checked) => handleCheckboxChange('collectors', checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label htmlFor="collectors" className="text-gray-900">Engaging collectors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other"
                    checked={formData.helpAreas.includes('other')}
                    onCheckedChange={(checked) => handleCheckboxChange('other', checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label htmlFor="other" className="text-gray-900">Other</Label>
                </div>
              </div>
              
              {formData.helpAreas.includes('other') && (
                <div className="space-y-2 ml-6 mt-3">
                  <Input
                    type="text"
                    value={formData.otherHelp}
                    onChange={(e) => handleInputChange('otherHelp', e.target.value)}
                    placeholder="Please specify what you need help with"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              )}
            </div>

            {/* Preferred Demo Time */}
            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-base font-medium flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4" />
                Preferred demo time:
              </Label>
              <Input
                id="preferredTime"
                type="text"
                value={formData.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                placeholder="e.g., Weekday mornings, Afternoons, Evenings"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-base font-medium text-gray-900">
                Anything else we should know?
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Tell us about your current challenges, specific needs, or any questions you have"
                rows={3}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                ExhibitIQ respects your privacy. Your information will only be used to schedule and personalize your demo experience.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
                className="bg-black hover:bg-black/80 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-black/80 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
    </>
  );
} 