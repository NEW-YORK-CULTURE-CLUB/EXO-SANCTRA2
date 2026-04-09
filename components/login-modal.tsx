'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic - use simple email/password login
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        const userData = {
          email,
          userType: ['user'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const usersRef = collection(db, 'users');
        await addDoc(usersRef, userData);

        toast({
          title: "Success",
          description: "Account created successfully! You are now logged in.",
        });
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = error.message || (isLogin ? "Failed to log in" : "Failed to create account");
      
      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Get display name from email (name before @)
  const getDisplayName = (email: string) => {
    if (!email) return '';
    const parts = email.split('@');
    return parts[0] || email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto bg-white/10 backdrop-blur-2xl text-white shadow-2xl rounded-2xl">
        <DialogHeader className="flex flex-col items-center space-y-4 pb-6">
          <div className="flex items-center justify-center mb-4">
            <Image 
              src="/sign.png" 
              alt="Exo Sanctra" 
              width={80} 
              height={80}
              className="rounded-full"
            />
          </div>
          <DialogTitle className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Sign up to get started with Exo Sanctra'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/90">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/20"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 h-12 text-base font-semibold transition-all duration-200"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>

          {/* Switch Mode */}
          <div className="text-center pt-4">
            <p className="text-sm text-white/80">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={switchMode}
                className="text-white font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

