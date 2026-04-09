'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useGallery } from '@/contexts/gallery-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Building2, Palette, Search, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Gallery {
  name: string;
  galleryId: string;
  darkLogo?: string;
  lightLogo?: string;
  role?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'gallery' | 'artist'>('gallery');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGallerySelector, setShowGallerySelector] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [tempCredentials, setTempCredentials] = useState<{ email: string; password: string } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { login, completeLogin } = useAuth();
  const { setGalleryId } = useGallery();
  const router = useRouter();

  // Filter galleries based on search query
  const filteredGalleries = galleries.filter(gallery =>
    gallery.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting login process...', { email, loginType });
      const { userData, galleries, requiresGallerySelection } = await login(email, password, loginType);
      
      console.log('Login result:', { userData, galleries, requiresGallerySelection });
      
      // If user has multiple galleries and is logging in as gallery, show gallery selector
      if (requiresGallerySelection) {
        console.log('Showing gallery selector...');
        setGalleries(galleries);
        setTempCredentials({ email, password });
        setShowGallerySelector(true);
        setLoading(false);
        return;
      }
      
      // If validation passes and no gallery selection needed, user is already authenticated
      console.log('No gallery selection needed, redirecting...');
      router.push('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySelection = async (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setShowGallerySelector(false);
    
    // Store the selected gallery in localStorage for later use (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGallery', JSON.stringify(gallery));
    }
    
    // Set the gallery ID in the gallery context
    setGalleryId(gallery.galleryId);
    
    // Complete the login process
    if (tempCredentials) {
      try {
        await completeLogin(tempCredentials.email, tempCredentials.password);
        setTempCredentials(null);
        router.push('/home');
        toast.success("Login successful")
      } catch (error: any) {
        setError(error.message || 'Failed to complete login. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Top Navigation - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/home')}
          className="text-xs font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Visit Home
        </Button>
        <ThemeToggle />
      </div>

      {!showGallerySelector ? (
        <>
      {/* Left Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md space-y-4">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-foreground">
              Login
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Fill in your login details to proceed
            </p>
          </div>

          {/* Login Type Selector */}
          {/* <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              type="button"
                  onClick={() => setLoginType('gallery')}
                  className={`flex-1 py-2 px-4 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                    loginType === 'gallery'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
                  <Building2 className="h-3 w-3" />
              Gallery
            </button>
            <button
              type="button"
                  onClick={() => setLoginType('artist')}
                  className={`flex-1 py-2 px-4 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                    loginType === 'artist'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
                  <Palette className="h-3 w-3" />
              Artist
            </button>
          </div> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-0">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-0">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ) : (
                'Continue'
              )}
            </Button>

            {/* Demo Login Details */}
            <div className="bg-muted/50 rounded-lg p-4 border border-dashed border-muted-foreground/30">
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Demo Login</p>
                <div className="space-y-1 text-xs">
                  <p className="text-foreground">
                    <span className="font-medium">Email:</span> demo@exhibitiq.art
                  </p>
                  <p className="text-foreground">
                    <span className="font-medium">Password:</span> 123456
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('demo@exhibitiq.art');
                    setPassword('123456');
                  }}
                  className="text-xs text-primary hover:text-primary/90 font-medium underline"
                >
                  Fill Demo Credentials
                </button>
              </div>
            </div>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{' '}
              <a href="/auth/register" className="text-primary hover:text-primary/90 font-medium">
                Register
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              <a href="/auth/forgot-password" className="text-primary hover:text-primary/90">
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Welcome Message and Logo */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 lg:px-16 xl:px-24">
        <div className="text-center space-y-8">
          {/* Welcome Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Welcome to{' '}
              <span className="text-primary">The Gallery Operating System</span>
            </h2>
            {/* <p className="text-sm text-muted-foreground">
              Wishing you a great time ahead as Gallery Operator!
            </p> */}
          </div>

          {/* Logo */}
          <div className="relative">
            <div className="w-48 h-48 mx-auto relative">
              <Image src="/light.png" alt="Gallery Operating System" width={1000} height={1000} className="dark:hidden" />
              <Image src="/dark.png" alt="Gallery Operating System" width={1000} height={1000} className="hidden dark:block" />
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        <>
          {/* Gallery Selection View */}
          <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24">
            <div className="w-full max-w-2xl space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  Select a Gallery
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please select which gallery you'd like to access:
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Input
                  placeholder="Search galleries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {/* Gallery List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredGalleries.map((gallery) => (
                  <Card 
                    key={gallery.galleryId} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/50"
                    onClick={() => handleGallerySelection(gallery)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Gallery Logo */}
                        <div className="flex-shrink-0">
                          {gallery.darkLogo || gallery.lightLogo ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                              <Image 
                                src={gallery.lightLogo || ''} 
                                alt={gallery.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full dark:hidden"
                              />
                              <Image 
                                src={gallery.darkLogo || ''} 
                                alt={gallery.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full hidden dark:block"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border">
                              <Building2 className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        {/* Gallery Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {gallery.name}
                          </h3>
                          {gallery.role && (
                            <p className="text-sm text-muted-foreground">
                              {gallery.role}
                            </p>
                          )}
                        </div>
                        
                        {/* Selection Indicator */}
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredGalleries.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No galleries found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {/* Back Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGallerySelector(false);
                    setError('');
                    setTempCredentials(null);
                    setSearchQuery('');
                  }}
                  className="mt-4"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Gallery Selection Info */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-8 lg:px-16 xl:px-24">
            <div className="text-center space-y-8">
              {/* Welcome Message */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  Choose Your Gallery
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the gallery you want to access and manage.
                </p>
              </div>

              {/* Logo */}
              <div className="relative">
                <div className="w-48 h-48 mx-auto relative">
                  <Image src="/light.png" alt="Gallery Operating System" width={1000} height={1000} className="dark:hidden" />
                  <Image src="/dark.png" alt="Gallery Operating System" width={1000} height={1000} className="hidden dark:block" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 