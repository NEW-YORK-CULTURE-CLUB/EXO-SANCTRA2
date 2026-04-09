'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignaturePad } from '@/components/signature-pad';
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Handshake, 
  Shield, 
  Users, 
  DollarSign,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Star,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryData {
  darkLogo?: string;
  lightLogo?: string;
  galleryId: string;
  name: string;
  createdAt: any;
}

interface UserData {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  gallery?: { [key: string]: GalleryData };
  createdAt?: any;
}

interface AgreementOption {
  id: string;
  title: string;
  description: string;
  commissionRate: number;
  features: string[];
  pdfUrl: string;
  recommended?: boolean;
  type: 'standard' | 'premium' | 'exclusive' | 'custom';
}

interface ArtistApprovalData {
  id: string;
  artistName: string;
  artistEmail: string;
  galleryName: string;
  galleryId: string;
  galleryLogo?: string;
  galleryDarkLogo?: string;
  invitationDate: Date;
  status: 'pending' | 'approved' | 'declined';
  signature?: string;
  signedDate?: Date;
  selectedAgreement?: string;
}

// Function to get the most recent gallery data
const getMostRecentGallery = (galleryData: { [key: string]: GalleryData }): GalleryData | null => {
  if (!galleryData || Object.keys(galleryData).length === 0) {
    return null;
  }

  // Convert to array and sort by createdAt (most recent first)
  const galleries = Object.entries(galleryData).map(([id, data]) => ({
    id,
    ...data
  }));

  // Sort by createdAt timestamp (most recent first)
  galleries.sort((a, b) => {
    const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return bTime.getTime() - aTime.getTime();
  });

  return galleries[0] || null;
};

// Function to fetch user data by ID
const fetchUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      } as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Agreement options based on the provided PDFs
const agreementOptions: AgreementOption[] = [
  {
    id: 'standard-50-50',
    title: 'Standard Consignment Agreement',
    description: 'Traditional 50/50 split with comprehensive gallery support',
    commissionRate: 50,
    features: [
      '50% commission split',
      'Exhibition opportunities',
      'Marketing support',
      'Insurance coverage',
      'Digital and physical display',
      'NFT minting support'
    ],
    pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/exhibit-iq.firebasestorage.app/o/agreement%20files%2FExhibitIQ%20Consignment%20Agreement%20(50.50).pdf?alt=media&token=721a2cba-5457-436f-9fce-56ce90982025',
    type: 'standard'
  },
  {
    id: 'premium-60-40',
    title: 'Premium Artist Agreement',
    description: 'Favorable 60/40 split for established artists',
    commissionRate: 60,
    features: [
      '60% commission split',
      'Priority exhibition placement',
      'Enhanced marketing campaigns',
      'Full insurance coverage',
      'Transportation included',
      'Dedicated curator support'
    ],
    pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/exhibit-iq.firebasestorage.app/o/agreement%20files%2FExhibitIQ%20Consignment%20Agreement%20(50.50)%20(2).pdf?alt=media&token=bc44275a-affa-4082-8bfb-b6db6f01200d',
    recommended: true,
    type: 'premium'
  },
  {
    id: 'exclusive-70-30',
    title: 'Exclusive Partnership Agreement',
    description: 'Exclusive gallery representation with maximum artist benefits',
    commissionRate: 70,
    features: [
      '70% commission split',
      'Exclusive gallery representation',
      'Solo exhibition opportunities',
      'International marketing',
      'Art fair participation',
      'Private collector network access'
    ],
    pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/exhibit-iq.firebasestorage.app/o/agreement%20files%2FExhibitIQ%20Consignment%20Agreement%20(50.50)%20(1).pdf?alt=media&token=0da2d20d-c000-45a3-8298-606ef4aa03ba',
    type: 'exclusive'
  },
  {
    id: 'custom-icp',
    title: 'Custom ICP Agreement',
    description: 'Tailored agreement based on Ideal Customer Profile analysis',
    commissionRate: 55,
    features: [
      'Custom commission structure',
      'Personalized marketing strategy',
      'Target audience analysis',
      'Data-driven pricing',
      'Performance tracking',
      'Flexible terms'
    ],
    pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/exhibit-iq.firebasestorage.app/o/agreement%20files%2FExhibit%20IQ%20-%20Ideal%20Customer%20Profile%20(ICP).pdf?alt=media&token=25c687fc-1e13-4605-b603-bc19131e66fe',
    type: 'custom'
  }
];



export default function ArtistApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, resolvedTheme } = useTheme();
  
  const [approvalData, setApprovalData] = useState<ArtistApprovalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    privacyPolicy: false,
    marketingConsent: false,
    dataProcessing: false
  });

  useEffect(() => {
    const loadArtistData = async () => {
      if (!params.id) return;
      
      setLoading(true);
      
      try {
        // Fetch user data by ID
        const userData = await fetchUserData(params.id as string);
        
        if (!userData) {
          toast({
            title: "Artist Not Found",
            description: "The requested artist could not be found.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Get the most recent gallery data
        const mostRecentGallery = getMostRecentGallery(userData.gallery || {});
        
        if (!mostRecentGallery) {
          toast({
            title: "No Gallery Data",
            description: "No gallery information found for this artist.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Create approval data from user and gallery data
        const approvalData: ArtistApprovalData = {
          id: userData.id,
          artistName: userData.name || userData.displayName || 'Unknown Artist',
          artistEmail: userData.email,
          galleryName: mostRecentGallery.name,
          galleryId: mostRecentGallery.galleryId,
          galleryLogo: mostRecentGallery.lightLogo,
          galleryDarkLogo: mostRecentGallery.darkLogo,
          invitationDate: new Date(),
          status: 'pending'
        };

        setApprovalData(approvalData);
      } catch (error) {
        console.error('Error loading artist data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load artist information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArtistData();
  }, [params.id, toast]);

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSignatureChange = (signatureData: string | null) => {
    setSignature(signatureData);
  };

  const handleAgreementSelection = (agreementId: string) => {
    setSelectedAgreement(agreementId);
  };

  const openPdf = (url: string) => {
    window.open(url, '_blank');
  };

  const allAgreementsAccepted = Object.values(agreements).every(Boolean);

  const handleSubmit = async (approved: boolean) => {
    if (!approvalData || !allAgreementsAccepted) {
      toast({
        title: "Required Fields Missing",
        description: "Please accept all agreements and provide your signature.",
        variant: "destructive",
      });
      return;
    }

    if (approved && !signature) {
      toast({
        title: "Signature Required",
        description: "Please provide your digital signature to approve.",
        variant: "destructive",
      });
      return;
    }

    if (approved && !selectedAgreement) {
      toast({
        title: "Agreement Selection Required",
        description: "Please select an agreement type to continue.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Update the user document with approval data
      const userRef = doc(db, 'users', approvalData.id);
      const updateData: any = {
        approvalStatus: approved ? 'approved' : 'declined',
        approvalDate: new Date(),
        selectedAgreement: approved ? selectedAgreement : null,
        agreementsAccepted: agreements,
      };

      if (approved && signature) {
        updateData.signature = signature;
        updateData.signedDate = new Date();
      }

      await updateDoc(userRef, updateData);

      // Update local state
      setApprovalData(prev => prev ? {
        ...prev,
        status: approved ? 'approved' : 'declined',
        signature: approved ? (signature || undefined) : undefined,
        signedDate: approved ? new Date() : undefined,
        selectedAgreement: approved ? (selectedAgreement || undefined) : undefined
      } : null);

      toast({
        title: approved ? "Approval Successful!" : "Response Recorded",
        description: approved 
          ? "You have successfully joined the gallery. Welcome!" 
          : "Your response has been recorded.",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/home');
      }, 2000);

    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: "Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!approvalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">Approval not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Artist Agreement</h1>
              </div>
            </div>
            {/* <Badge variant={approvalData.status === 'pending' ? 'secondary' : 'default'}>
              {approvalData.status === 'pending' ? 'Pending Response' : approvalData.status}
            </Badge> */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Gallery Invitation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Gallery Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  {/* Light logo for light theme */}
                  <Image
                    src={approvalData.galleryLogo || '/placeholder-logo.png'}
                    alt={`${approvalData.galleryName} (Light)`}
                    fill
                    className={`object-contain transition-opacity duration-200 ${
                      resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  {/* Dark logo for dark theme */}
                  <Image
                    src={approvalData.galleryDarkLogo || approvalData.galleryLogo || '/placeholder-logo.png'}
                    alt={`${approvalData.galleryName} (Dark)`}
                    fill
                    className={`object-contain transition-opacity duration-200 ${
                      resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{approvalData.galleryName}</h2>
                  <p className="text-muted-foreground">
                    Invited you to join their artist network
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Artist Name</Label>
                  <p className="text-sm">{approvalData.artistName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{approvalData.artistEmail}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Invitation Date</Label>
                  <p className="text-sm">
                    {approvalData.invitationDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agreement Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Your Agreement Type
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the agreement that best fits your needs. Review each option carefully before making your selection.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {agreementOptions.map((agreement) => (
                  <Card 
                    key={agreement.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedAgreement === agreement.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-muted-foreground/20'
                    }`}
                    onClick={() => handleAgreementSelection(agreement.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{agreement.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPdf(agreement.pdfUrl);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View PDF
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{agreement.description}</p>
                    </CardHeader>
                                         <CardContent className="pt-0">
                       <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">Commission Rate:</span>
                           <Badge variant="secondary" className="text-lg font-bold">
                             {agreement.commissionRate}%
                           </Badge>
                         </div>
                         
                         <Separator />
                         
                         <div className="space-y-2">
                           <Label className="text-sm font-medium">Included Features:</Label>
                           <ul className="space-y-1">
                             {agreement.features.map((feature, index) => (
                               <li key={index} className="flex items-center gap-2 text-sm">
                                 <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                 <span>{feature}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         
                         {agreement.recommended && (
                           <div className="flex justify-end pt-2">
                             <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                               <Star className="w-3 h-3 mr-1" />
                               Recommended
                             </Badge>
                           </div>
                         )}
                       </div>
                     </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedAgreement && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have selected the <strong>{agreementOptions.find(a => a.id === selectedAgreement)?.title}</strong>. 
                    Please review the PDF document and ensure you understand all terms before proceeding.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Agreements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Required Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="termsAccepted"
                    checked={agreements.termsAccepted}
                    onCheckedChange={(checked) => handleAgreementChange('termsAccepted', checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="termsAccepted" className="text-sm font-medium">
                      I accept the selected agreement terms and conditions
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I have read and agree to the commission structure, payment terms, and gallery services outlined in the selected agreement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacyPolicy"
                    checked={agreements.privacyPolicy}
                    onCheckedChange={(checked) => handleAgreementChange('privacyPolicy', checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="privacyPolicy" className="text-sm font-medium">
                      I accept the privacy policy
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I understand how my personal information will be collected, used, and protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="marketingConsent"
                    checked={agreements.marketingConsent}
                    onCheckedChange={(checked) => handleAgreementChange('marketingConsent', checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="marketingConsent" className="text-sm font-medium">
                      I consent to marketing communications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I agree to receive updates about exhibitions, sales, and gallery events.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="dataProcessing"
                    checked={agreements.dataProcessing}
                    onCheckedChange={(checked) => handleAgreementChange('dataProcessing', checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="dataProcessing" className="text-sm font-medium">
                      I consent to data processing
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I agree to the processing of my personal data for gallery operations and services.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center w-full">
                <div className="w-full max-w-md mx-auto">
                  <SignaturePad
                    onSignatureChange={handleSignatureChange}
                    width={400}
                    height={200}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all terms carefully before responding. Your signature indicates your agreement to all terms and conditions.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={!allAgreementsAccepted || !signature || !selectedAgreement || submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="w-full"
                  size="lg"
                >
                  Decline Invitation
                </Button>
              </div>

              {(!allAgreementsAccepted || !selectedAgreement) && (
                <p className="text-xs text-muted-foreground text-center">
                  Please select an agreement type and accept all agreements to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
