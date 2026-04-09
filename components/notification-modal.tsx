'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Mail, Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to save email notification preference
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      toast({
        title: "Success!",
        description: "You'll be notified when new auctions are announced.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setEmail('');
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-md">
          <DialogHeader className="text-center px-2 sm:px-0">
            <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-green-600 dark:text-green-400">
              You're All Set!
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base leading-relaxed">
              {user 
                ? "We'll notify you when new auctions are announced."
                : `We'll send auction notifications to ${email}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4 px-2 sm:px-0">
            <Button onClick={handleClose} className="w-full sm:w-auto px-6 sm:px-8">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-md">
        <DialogHeader className="text-center px-2 sm:px-0">
          <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Get Notified About New Auctions
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base leading-relaxed">
            {user 
              ? "We'll notify you when new live auctions are announced."
              : "Enter your email to receive notifications about upcoming auctions."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 px-2 sm:px-0">
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 sm:h-10"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:flex-1 h-11 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 sm:h-10"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Setting up...</span>
                  <span className="sm:hidden">Setting up...</span>
                </div>
              ) : (
                'Get Notified'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
