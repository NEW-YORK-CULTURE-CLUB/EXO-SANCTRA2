'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  artworkTitle?: string;
}

export function AgeVerificationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  artworkTitle 
}: AgeVerificationModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    // Store in localStorage that user has confirmed age
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerificationTimestamp', Date.now().toString());
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4 flex flex-col items-center justify-center">
         <Image src="/dark.png" alt="Age Verification" width={100} height={100} className="hidden dark:block" />
         <Image src="/light.png" alt="Age Verification" width={100} height={100} className="block dark:hidden" />
          <CardTitle className="text-xl font-bold text-primary">
            Age Verification Required
          </CardTitle>
          {/* <CardDescription className="text-muted-foreground">
            This artwork contains mature content that requires age verification
          </CardDescription> */}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Artwork Info */}
          {artworkTitle && (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">Item:</p>
              <p className="text-sm font-semibold text-primary">{artworkTitle}</p>
            </div>
          )}

          {/* Warning Message */}
          <div className="flex items-start space-x-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-destructive mb-1">Content Warning</p>
              <p className="text-muted-foreground">
                This artwork may contain content that is not suitable for viewers under 18 years of age.
              </p>
            </div>
          </div>

          {/* Age Confirmation */}
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              By clicking "I am 18 or older", you confirm that you are at least 18 years of age.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>You must be 18+ to view this content</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I am 18 or older
            </Button>
          </div>

          {/* Legal Notice */}
          <div className="text-[10px] text-center text-muted-foreground border-0 py-4">
            <p>
              By proceeding, you acknowledge that you are legally responsible for confirming your age 
              and that you meet the minimum age requirement to view this content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
