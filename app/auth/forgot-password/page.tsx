'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Section - Reset Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md space-y-4">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center text-xs text-primary hover:text-primary/90 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              Reset Password
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>
                  Password reset email sent! Please check your inbox and follow the instructions.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
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
                  disabled={success}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium rounded-lg transition-colors"
              disabled={loading || success}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/90 font-medium">
                Sign in
              </Link>
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
              Forgot Your Password?
            </h2>
            <p className="text-sm text-muted-foreground">
              Don't worry! We'll help you get back into your account.
            </p>
          </div>

          {/* Logo */}
          <div className="relative">
            <div className="w-48 h-48 mx-auto relative">
              {/* Outer ring with braided rope effect */}
              <Image src="/light.png" alt="Gallery Operating System" width={1000} height={1000} className="dark:hidden" />
              <Image src="/dark.png" alt="Gallery Operating System" width={1000} height={1000} className="hidden dark:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 