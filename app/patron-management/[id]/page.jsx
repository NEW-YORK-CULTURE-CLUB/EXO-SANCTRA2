"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { patrons as data } from '@/data/patronManagementData';
import { AddPatronModal } from '@/components/add-patron-modal';
import { SharedArtworkModal } from '@/components/shared-artwork-modal';
import { AssignArtworkModal } from '@/components/assign-artwork-modal';
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  CaretSortIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  HeartIcon,
  ImageIcon,
  EyeOpenIcon,
  LockOpen1Icon,
  PlusIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  MoreHorizontal, 
  ChevronDown,
  Copy,
  Eye,
  Edit,
  Trash,
  ArrowUpDown,
  Filter,
  Menu,
  MailIcon,
  LockIcon,
  User2Icon,
  ChevronLeft,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// import { useAuth } from '@/contexts/auth-context'; // Disabled - using mock data
// import { useGallery } from '@/contexts/gallery-context'; // Disabled - using mock data
// import { doc, getDoc } from 'firebase/firestore'; // Disabled - using mock data
// import { db } from '@/lib/firebase'; // Disabled - using mock data
import { toast } from 'sonner';
// import { ArtworkInteractionService } from '@/lib/artwork-interaction-service'; // Disabled - using mock data


function SendEmailModal({ open, onOpenChange, selectedPatrons, galleryName = 'ExhibitIQ Gallery' }) {
    if (!selectedPatrons || selectedPatrons.length === 0) return null;
    
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [template, setTemplate] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [includeOptedOut, setIncludeOptedOut] = useState(false);
    
    const recipients = selectedPatrons.map(p => p.email).join(', ');
    const recipientNames = selectedPatrons.map(p => p.name).join(', ');
    const hasOptedOut = selectedPatrons.some(p => p.marketing === 'Opted Out');
    
    // Filter recipients based on marketing consent
    const finalRecipients = includeOptedOut 
        ? recipients 
        : selectedPatrons
            .filter(p => p.marketing === 'Opted In')
            .map(p => p.email)
            .join(', ');

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error('Please fill in both subject and message');
            return;
        }

        if (!finalRecipients) {
            toast.error('No valid recipients found');
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch('/api/patron-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    message,
                    recipients: finalRecipients,
                    galleryName,
                    template: template || 'Custom Message'
                }),
            });

            const { handleEmailApiResponse } = await import('@/lib/email-client');
            const emailResult = await handleEmailApiResponse(response);
            if (!emailResult.ok) {
                toast.error('Email not configured', {
                    description: emailResult.message,
                });
                return;
            }

            if (response.ok) {
                toast.success(`Email sent successfully to ${finalRecipients.split(',').length} patron(s)`);
                onOpenChange(false);
                // Reset form
                setSubject('');
                setMessage('');
                setTemplate('');
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleTemplateChange = (value) => {
        setTemplate(value);
        // Auto-fill subject and message based on template
        switch (value) {
            case 'new-artwork':
                setSubject('New Artwork Arrival - Exclusive Preview');
                setMessage(`Dear Valued Patron,

We're excited to share that we have new artwork arriving at our gallery that we believe will interest you.

This exclusive preview is available to our valued patrons before the public announcement.

We look forward to seeing you soon.

Best regards,
${galleryName} Team`);
                break;
            case 'exhibition-invite':
                setSubject('You\'re Invited - New Exhibition Opening');
                setMessage(`Dear Valued Patron,

You're cordially invited to the opening of our new exhibition.

Date: [Exhibition Date]
Time: [Opening Time]
Location: [Gallery Address]

This is an exclusive invitation for our valued patrons.

We look forward to celebrating with you.

Best regards,
${galleryName} Team`);
                break;
            case 'newsletter':
                setSubject('Gallery Newsletter - Latest Updates');
                setMessage(`Dear Valued Patron,

Here are the latest updates from our gallery:

• New acquisitions
• Upcoming exhibitions
• Artist spotlights
• Special events

Thank you for your continued support.

Best regards,
${galleryName} Team`);
                break;
            case 'event-invite':
                setSubject('Special Event Invitation');
                setMessage(`Dear Valued Patron,

We're hosting a special event and would love for you to join us.

Date: [Event Date]
Time: [Event Time]
Location: [Event Location]

This exclusive invitation is for our valued patrons.

We hope to see you there.

Best regards,
${galleryName} Team`);
                break;
            default:
                // Custom message - don't auto-fill
                break;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Send Bulk Email</DialogTitle>
                    <DialogDescription>Send an email to {selectedPatrons.length} selected patron(s)</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label>Recipients</Label>
                        <p className="text-sm text-muted-foreground">{recipientNames}</p>
                        <p className="text-xs text-muted-foreground">Emails: {recipients}</p>
                    </div>
                    <div>
                        <Label htmlFor="template">Email Template</Label>
                        <Select value={template} onValueChange={handleTemplateChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new-artwork">New Artwork Arrival</SelectItem>
                                <SelectItem value="exhibition-invite">Exhibition Invitation</SelectItem>
                                <SelectItem value="newsletter">Gallery Newsletter</SelectItem>
                                <SelectItem value="event-invite">Event Invitation</SelectItem>
                                <SelectItem value="custom">Custom Message</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                            id="subject" 
                            placeholder="Email Subject" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                            id="message" 
                            rows={6} 
                            placeholder="Type your message here."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    {hasOptedOut && (
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertTitle>Marketing Consent Warning</AlertTitle>
                            <AlertDescription>
                                Some selected patrons have opted out of marketing communications.
                                <div className="flex items-center mt-2">
                                    <Checkbox 
                                        id="include-opted-out" 
                                        checked={includeOptedOut}
                                        onCheckedChange={setIncludeOptedOut}
                                    />
                                    <Label htmlFor="include-opted-out" className="ml-2 text-xs">
                                        Include patrons who have opted out (not recommended)
                                    </Label>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        onOpenChange(false);
                        toast.info('Email composition cancelled');
                    }} disabled={isSending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isSending}>
                        {isSending ? 'Sending...' : `Send to ${finalRecipients.split(',').length} Patron(s)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function PatronProfilePage() {
  const params = useParams();
  const router = useRouter();
  // const { user, userData } = useAuth(); // Disabled - using mock data
  // const { gallery } = useGallery(); // Disabled - using mock data
  const user = { uid: 'mock-user' }; // Mock user
  const userData = { fullname: 'Demo User', email: 'demo@exhibitiq.com' }; // Mock user data
  const gallery = { id: 'demo-gallery', name: 'Demo Gallery', email: 'demo@exhibitiq.com' }; // Mock gallery
  const { id } = params;
  const [patron, setPatron] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoGallery, setIsDemoGallery] = useState(true);

  // Load demo patron data immediately
  useEffect(() => {
    const loadPatronData = async () => {
      console.log('Loading demo patron data for ID:', id);
      setIsLoading(true);
      setIsDemoGallery(true);
      
      try {
        // Find patron in demo data by ID
        const demoPatron = data.find((p) => p.id === id);
        if (demoPatron) {
          console.log('Found demo patron:', demoPatron);
          setPatron(demoPatron);
        } else {
          console.log('Patron not found in demo data. Available patrons:', data.map(p => ({ id: p.id, name: p.name })));
          setPatron(null);
        }
      } catch (error) {
        console.error('Error loading patron data:', error);
        setPatron(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatronData();
  }, [id]);

  const [isAssignArtworkModalOpen, setIsAssignArtworkModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isEditNotesOpen, setIsEditNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [marketingConsent, setMarketingConsent] = useState('');
  const [isSharedArtworkModalOpen, setIsSharedArtworkModalOpen] = useState(false);
  const [realAssignedArtworks, setRealAssignedArtworks] = useState([]);
  const [realSharedArtworks, setRealSharedArtworks] = useState([]);
  const [realAlbums, setRealAlbums] = useState([]);
  const [realActivityFeed, setRealActivityFeed] = useState([]);
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(false);

  // Update notes and marketing consent when patron data loads
  useEffect(() => {
    if (patron) {
      setNotes(patron.notes || 'Interested in Andy Warhol pieces.\nPrefers private viewings on weekends.');
      setMarketingConsent(patron.marketing || 'Opted In');
    }
  }, [patron]);

  // Load mock interaction data when patron loads
  useEffect(() => {
    const loadInteractionData = async () => {
      if (!patron) return;
      
      setIsLoadingInteractions(true);
      try {
        // Mock interaction data based on patron
        const mockAssignedArtworks = [
          {
            itemId: 'artwork-1',
            itemTitle: "Campbell's Soup Cans",
            itemArtist: 'Andy Warhol',
            itemImageUrl: '/vault/artwork-1.png',
            status: 'Assigned',
            createdAt: { toDate: () => new Date('2023-06-15') }
          },
          {
            itemId: 'artwork-2',
            itemTitle: 'Marilyn Diptych',
            itemArtist: 'Andy Warhol',
            itemImageUrl: '/vault/artwork-2.png',
            status: 'Assigned',
            createdAt: { toDate: () => new Date('2023-05-20') }
          }
        ];

        const mockSharedArtworks = [
          {
            itemId: 'artwork-3',
            itemTitle: 'The Starry Night',
            itemArtist: 'Vincent van Gogh',
            itemImageUrl: '/vault/artwork-3.png',
            isLiked: true,
            shareMethod: 'Gallery Share',
            createdAt: { toDate: () => new Date('2023-06-10') }
          },
          {
            itemId: 'artwork-4',
            itemTitle: 'Guernica',
            itemArtist: 'Pablo Picasso',
            itemImageUrl: '/vault/artwork-4.png',
            isLiked: true,
            shareMethod: 'Social Media',
            createdAt: { toDate: () => new Date('2023-06-05') }
          }
        ];

        const mockAlbums = [
          {
            name: 'Favorites',
            itemCount: 12,
            coverImageUrl: '/vault/artwork-1.png',
            isPublic: true,
            createdAt: { toDate: () => new Date('2023-05-15') }
          },
          {
            name: 'Wishlist',
            itemCount: 5,
            coverImageUrl: '/vault/artwork-2.png',
            isPublic: false,
            createdAt: { toDate: () => new Date('2023-06-01') }
          }
        ];

        const mockActivityFeed = [
          {
            type: 'favorite',
            itemTitle: "Campbell's Soup Cans",
            itemArtist: 'Andy Warhol',
            createdAt: { toDate: () => new Date('2023-06-15') }
          },
          {
            type: 'assigned',
            itemTitle: 'Marilyn Diptych',
            itemArtist: 'Andy Warhol',
            createdAt: { toDate: () => new Date('2023-05-20') }
          },
          {
            type: 'shared',
            itemTitle: 'The Starry Night',
            itemArtist: 'Vincent van Gogh',
            createdAt: { toDate: () => new Date('2023-06-10') }
          }
        ];
        
        setRealAssignedArtworks(mockAssignedArtworks);
        setRealSharedArtworks(mockSharedArtworks);
        setRealAlbums(mockAlbums);
        setRealActivityFeed(mockActivityFeed);
      } catch (error) {
        console.error('Error loading interaction data:', error);
        toast.error('Failed to load patron interaction data');
      } finally {
        setIsLoadingInteractions(false);
      }
    };

    loadInteractionData();
  }, [patron]);

  // Activity feed data with color and icon info
  const activityFeed = [
    { type: 'visit', text: 'Gallery visit - Viewed Pop Art collection', date: '2023-06-15', icon: <User2Icon className="text-blue-500" /> },
    { type: 'share', text: "Shared 'The Starry Night' by Vincent van Gogh", date: '2023-06-10', icon: <HeartIcon className="text-pink-500" /> },
    { type: 'purchase', text: "Purchased 'Marilyn Diptych' by Andy Warhol", date: '2023-05-20', amount: 75000, icon: <LockIcon className="text-green-500" /> },
    { type: 'invite', text: 'Sent exhibition invitation', date: '2023-05-10', icon: <MailIcon className="text-purple-500" /> },
    { type: 'visit', text: 'Gallery visit - Private viewing', date: '2023-04-05', icon: <User2Icon className="text-blue-500" /> },
    { type: 'purchase', text: "Purchased 'Campbell's Soup Cans' by Andy Warhol", date: '2023-03-15', amount: 50000, icon: <LockIcon className="text-green-500" /> },
  ];
  const assignedArtworks = [
    { title: "Campbell's Soup Cans", artist: 'Andy Warhol' },
    { title: 'Marilyn Diptych', artist: 'Andy Warhol' },
  ];
  const sharedArtworks = [
    { title: 'The Starry Night', artist: 'Vincent van Gogh', date: '2023-06-10', imageUrl: '/placeholder.svg', liked: true },
    { title: 'Guernica', artist: 'Pablo Picasso', date: '2023-06-05', imageUrl: '/placeholder.svg', liked: true },
  ];
  const albums = [
    { name: 'Favorites', count: 12, date: '2023-05-15' },
    { name: 'Wishlist', count: 5, date: '2023-06-01' },
  ];
  const [activeTab, setActiveTab] = useState('activity');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background -mt-5">
        {/* Back Button Skeleton */}
        <div className="flex gap-2 justify-between mb-4">
          <div className="h-10 bg-muted/20 rounded w-48"></div>
          <div className="flex justify-end gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted/20 rounded w-24"></div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 -mt-5 w-full max-w-7xl mx-auto">
          {/* Sidebar Skeleton */}
          <div className="w-full md:w-96 flex-shrink-0 bg-background rounded-xl border p-6 flex flex-col gap-6">
            {/* VIP and Active badges skeleton */}
            <div className="absolute right-6 top-6 flex gap-2">
              <div className="h-6 bg-muted/20 rounded-full w-12"></div>
              <div className="h-6 bg-muted/20 rounded-full w-16"></div>
            </div>
            
            {/* Avatar and name skeleton */}
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="w-20 h-20 bg-muted/20 rounded-full mb-2"></div>
              <div className="h-6 bg-muted/20 rounded w-32"></div>
              <div className="h-4 bg-muted/20 rounded w-20"></div>
            </div>
            
            {/* Contact info skeleton */}
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted/20 rounded"></div>
                  <div className="h-4 bg-muted/20 rounded w-32"></div>
                </div>
              ))}
            </div>
            
            {/* Interests skeleton */}
            <div>
              <div className="h-4 bg-muted/20 rounded w-16 mb-2"></div>
              <div className="flex flex-wrap gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 bg-muted/20 rounded w-16"></div>
                ))}
              </div>
            </div>
            
            {/* Marketing consent skeleton */}
            <div>
              <div className="h-4 bg-muted/20 rounded w-24 mb-2"></div>
              <div className="flex justify-between items-center gap-2">
                <div className="h-5 bg-muted/20 rounded w-16"></div>
                <div className="h-4 bg-muted/20 rounded w-12"></div>
              </div>
            </div>
            
            {/* Purchase history skeleton */}
            <div className="bg-muted rounded-lg p-4 flex flex-col gap-2">
              <div className="h-4 bg-muted/20 rounded w-24"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-muted/20 rounded w-20"></div>
                  <div className="h-3 bg-muted/20 rounded w-16"></div>
                </div>
              ))}
            </div>
            
            {/* Notes skeleton */}
            <div className="bg-muted rounded-lg p-4 flex flex-col gap-2">
              <div className="h-4 bg-muted/20 rounded w-12"></div>
              <div className="h-3 bg-muted/20 rounded w-full"></div>
              <div className="h-3 bg-muted/20 rounded w-3/4"></div>
              <div className="h-6 bg-muted/20 rounded w-20 mt-2"></div>
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex-1 w-full">
            {/* Tabs skeleton */}
            <div className="mb-4 grid grid-cols-4 w-full max-w-xl">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-muted/20 rounded"></div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="bg-background rounded-lg border p-6">
              <div className="h-6 bg-muted/20 rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted/20 rounded w-64 mb-4"></div>
              
              {/* Activity feed skeleton */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted/20 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-muted/20 rounded w-48 mb-1"></div>
                      <div className="h-3 bg-muted/20 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted/20 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patron) {
    return (
      <div className="min-h-screen bg-background -mt-5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Patron Not Found</h1>
          <p className="text-muted-foreground mb-6">The patron you are looking for does not exist or you don't have access to view their profile.</p>
          <Button onClick={() => {
            router.push("/patron-management");
            toast.info('Returning to patron management');
          }}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Patron Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <div className="flex gap-2 justify-between mb-4">
        <Button variant="outline" className="mb-6" onClick={() => {
          router.push("/patron-management");
          toast.info('Returning to patron management');
        }}> <ChevronLeft className="w-4 h-4 mr-2" /> Back to Patron Management </Button>
          <div className="flex justify-end gap-2 mb-4">
          <Button variant="default" size="sm" onClick={() => {
            setIsAssignArtworkModalOpen(true);
            toast.info('Opening artwork assignment modal');
          }}>
            <LockClosedIcon className="mr-2 h-4 w-4" /> Assign Artwork
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            setIsSendEmailModalOpen(true);
            toast.info('Opening email composition modal');
          }}>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" /> Send Email
          </Button>
          <Button variant="secondary" size="sm" onClick={() => {
            toast.info('Edit profile functionality coming soon');
          }}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </div>
    <div className="flex flex-col md:flex-row gap-6 -mt-5 w-full max-w-7xl mx-auto ">
      {/* Sidebar */}
    
      <div className="w-full md:w-96 flex-shrink-0 bg-background rounded-xl border p-6 flex flex-col gap-6 relative">
        {/* VIP and Active badges in top right */}
        <div className="absolute right-6 top-6 flex gap-2">
           <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">VIP</Badge>
          <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-green-500 text-white">Active</Badge>
        </div>
        <div className="flex flex-col items-center gap-2 mt-6">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarImage src={patron.avatar} alt={patron.name} className="object-cover" />
            <AvatarFallback>{patron.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xl font-bold leading-tight">{patron.name}</span>
          <div className="text-sm text-muted-foreground">{patron.type}</div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2"><EnvelopeClosedIcon />{patron.email}</div>
          <div className="flex items-center gap-2"><span>📞</span>{patron.phone || 'Not provided'}</div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            {patron.address && Object.keys(patron.address).length > 0 ? (
              <div>
                {patron.address.street && <div>{patron.address.street}</div>}
                {(patron.address.city || patron.address.state || patron.address.zipCode) && (
                  <div>
                    {patron.address.city && patron.address.city}
                    {patron.address.city && patron.address.state && ', '}
                    {patron.address.state && patron.address.state}
                    {patron.address.zipCode && ` ${patron.address.zipCode}`}
                  </div>
                )}
                {patron.address.country && <div>{patron.address.country}</div>}
              </div>
            ) : (
              <div>Address not provided</div>
            )}
          </div>
        </div>
        <div>
          <div className="font-medium text-xs mb-1">Interests</div>
          <div className="flex flex-wrap gap-1">
            {patron.interests.map((i) => <Badge key={i} variant="secondary">{i}</Badge>)}
          </div>
        </div>
        <div>
          <div className="font-medium text-xs mb-1">Marketing Consent</div>
          <div className="flex justify-between items-center gap-2">
            <Badge variant={marketingConsent === 'Opted In' ? 'success' : 'destructive'}>
              {marketingConsent}
            </Badge>
            {marketingConsent === 'Opted In' ? (
              <button
                className="text-xs flex items-center gap-1 text-muted-foreground"
                onClick={() => {
                  setMarketingConsent('Opted Out');
                  toast.success('Patron opted out of marketing communications');
                }}
              >
                <LockClosedIcon className="w-4 h-4 mr-1" /> Opt Out
              </button>
            ) : (
              <button
                className="text-xs flex items-center gap-1 text-muted-foreground"
                onClick={() => {
                  setMarketingConsent('Opted In');
                  toast.success('Patron opted in to marketing communications');
                }}
              >
                <LockOpen1Icon className="w-4 h-4 mr-1" /> Opt In
              </button>
            )}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 flex flex-col gap-2">
          <div className="font-semibold text-sm">Purchase History</div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between"><span>Total Spent</span><span className="font-bold">$125,000.00</span></div>
            <div className="flex justify-between"><span>Last Purchase</span><span>20/05/2023</span></div>
            <div className="flex justify-between"><span>Last Activity</span><span>15/06/2023</span></div>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 flex flex-col gap-2">
          <div className="font-semibold text-sm">Notes</div>
          <div className="text-xs whitespace-pre-line">{notes}</div>
          <Button variant="outline" size="sm" className="mt-2 w-fit" onClick={() => {
            setIsEditNotesOpen(true);
            toast.info('Opening notes editor');
          }}>Edit Notes</Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Top right buttons with icons */}
      
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            <TabsTrigger value="assigned" className="text-xs">Assigned Artwork ({realAssignedArtworks.length})</TabsTrigger>
            <TabsTrigger value="shared" className="text-xs">Shared Artwork ({realSharedArtworks.length})</TabsTrigger>
            <TabsTrigger value="albums" className="text-xs">Albums ({realAlbums.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <div className="bg-background rounded-lg border p-6">
              <div className="font-semibold text-lg mb-2">Activity Feed</div>
              <div className="text-xs text-muted-foreground mb-4">Recent activity and interactions with {patron.name}</div>
              <div className="flex flex-col gap-4">
                {isLoadingInteractions ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-muted-foreground">Loading activity...</div>
                  </div>
                ) : realActivityFeed.length > 0 ? (
                  realActivityFeed.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-muted p-2 flex items-center justify-center">
                          {item.type === 'favorite' && <HeartIcon className="text-red-500" />}
                          {item.type === 'wishlist' && <PlusIcon className="text-blue-500" />}
                          {item.type === 'shared' && <HeartIcon className="text-pink-500" />}
                          {item.type === 'assigned' && <LockIcon className="text-green-500" />}
                        </span>
                        <div>
                          <div className="font-medium text-sm">
                            {item.type === 'favorite' && `Favorited "${item.itemTitle}"`}
                            {item.type === 'wishlist' && `Added "${item.itemTitle}" to wishlist`}
                            {item.type === 'shared' && `Shared "${item.itemTitle}"`}
                            {item.type === 'assigned' && `Assigned "${item.itemTitle}"`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.itemArtist && `by ${item.itemArtist}`}
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted rounded px-3 py-1 text-xs font-medium text-muted-foreground min-w-[90px] text-center">
                        {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString('en-GB') : 'Recently'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="text-sm text-muted-foreground">No recent activity</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="assigned">
            <div className="bg-background rounded-lg border p-6">
              <div className="font-semibold text-lg mb-2">Assigned Private Artwork</div>
              <div className="text-xs text-muted-foreground mb-4">Artwork exclusively assigned to {patron.name} for private viewing</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingInteractions ? (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">Loading assigned artwork...</div>
                  </div>
                ) : realAssignedArtworks.length > 0 ? (
                  realAssignedArtworks.map((art, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 flex flex-col items-center gap-2 border relative">
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center bg-muted-foreground/10">
                        <Image 
                          src={art.itemImageUrl || "/placeholder.svg"} 
                          alt="Artwork placeholder" 
                          width={128} 
                          height={128} 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                      <div className="font-semibold">{art.itemTitle}</div>
                      <div className="text-xs text-muted-foreground">{art.itemArtist}</div>
                      <div className="text-xs text-muted-foreground">Status: {art.status}</div>
                      <Button onClick={() => {
                        router.push(`/marketplace/${art.itemId}`);
                        toast.info('Opening artwork details');
                      }} variant="outline" size="sm" className="mt-2">View Details</Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">No assigned artwork</div>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => {
                setIsAssignArtworkModalOpen(true);
                toast.info('Opening artwork assignment modal');
              }}><PlusIcon className="mr-2" />Assign More Artwork</Button>
            </div>
          </TabsContent>
          <TabsContent value="shared">
            <div className="bg-background rounded-lg border p-6">
              <div className="font-semibold text-lg mb-2">Shared Artwork</div>
              <div className="text-xs text-muted-foreground mb-4">Artwork that {patron.name} has shared or liked from your gallery</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingInteractions ? (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">Loading shared artwork...</div>
                  </div>
                ) : realSharedArtworks.length > 0 ? (
                  realSharedArtworks.map((art, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 flex flex-col items-center gap-2 border relative">
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center bg-muted-foreground/10">
                        <Image 
                          src={art.itemImageUrl || "/placeholder.svg"} 
                          alt="Artwork placeholder" 
                          width={128} 
                          height={128} 
                          className="object-cover w-full h-full" 
                        />
                        {art.isLiked && (
                          <Badge className="absolute top-2 right-2 flex items-center gap-1">
                            <HeartIcon className="w-3 h-3" />Liked
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold">{art.itemTitle}</div>
                      <div className="text-xs text-muted-foreground">{art.itemArtist}</div>
                      <div className="text-xs text-muted-foreground">
                        Shared via {art.shareMethod} on {art.createdAt?.toDate ? new Date(art.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">No shared artwork</div>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => {
                setIsSharedArtworkModalOpen(true);
                toast.info('Opening shared artwork modal');
              }}>View All Shared Artwork</Button>
            </div>
          </TabsContent>
          <TabsContent value="albums">
            <div className="bg-background rounded-lg border p-6">
              <div className="font-semibold text-lg mb-2">Albums</div>
              <div className="text-xs text-muted-foreground mb-4">Collections of artwork curated by {patron.name}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingInteractions ? (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">Loading albums...</div>
                  </div>
                ) : realAlbums.length > 0 ? (
                  realAlbums.map((album, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 flex flex-col items-center gap-2 border relative">
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center bg-muted-foreground/10">
                        <Image 
                          src={album.coverImageUrl || "/placeholder.svg"} 
                          alt="Album placeholder" 
                          width={128} 
                          height={128} 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                      <div className="font-semibold">{album.name}</div>
                      <div className="text-xs text-muted-foreground">{album.itemCount} artwork(s)</div>
                      <div className="text-xs text-muted-foreground">
                        {album.createdAt?.toDate ? new Date(album.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                      </div>
                      {album.isPublic && (
                        <Badge variant="secondary" className="text-xs">Public</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4">
                    <div className="text-sm text-muted-foreground">No albums created</div>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => {
                toast.info('View all albums functionality coming soon');
              }}>View All Albums</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Modals */}
      <AssignArtworkModal 
        open={isAssignArtworkModalOpen} 
        onOpenChange={setIsAssignArtworkModalOpen} 
        patronName={patron.name}
        patronId={patron.id}
        patronEmail={patron.email}
      />
      <SendEmailModal 
        open={isSendEmailModalOpen} 
        onOpenChange={setIsSendEmailModalOpen} 
        selectedPatrons={[patron]} 
        galleryName={gallery?.name || 'ExhibitIQ Gallery'}
      />
      <Dialog open={isEditNotesOpen} onOpenChange={setIsEditNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
          </DialogHeader>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditNotesOpen(false);
              toast.info('Notes editing cancelled');
            }}>Cancel</Button>
            <Button onClick={() => {
              setIsEditNotesOpen(false);
              toast.success('Notes saved successfully');
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SharedArtworkModal open={isSharedArtworkModalOpen} onOpenChange={setIsSharedArtworkModalOpen} patronName={patron.name} sharedArtworks={sharedArtworks} />
    </div>
    </div>
  );
}

