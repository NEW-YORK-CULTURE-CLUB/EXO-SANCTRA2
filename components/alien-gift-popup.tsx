'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface AlienGiftPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const gifts = [
  { type: 'coloring page', image: '/vault/Start + Homepage/you got a coloring page.png', title: 'You got a coloring page' },
  { type: 'prediction from the future', image: '/vault/Start + Homepage/you got a free prediction from the future.png', title: 'You got a free prediction from the future' },
  { type: 'video from space', image: '/vault/Start + Homepage/you got a free video from space.PNG', title: 'You got a free video from space' },
  { type: 'alien meditation', image: '/vault/Start + Homepage/you got a free alien meditation.png', title: 'You got a free alien meditation' },
  { type: 'alien ritual', image: '/vault/Start + Homepage/you got a free alien ritual.png', title: 'You got a free alien ritual' },
];

export default function AlienGiftPopup({ isOpen, onClose }: AlienGiftPopupProps) {
  const [step, setStep] = useState<'earth' | 'alien' | 'gift' | 'claim'>('earth');
  const [selectedGift, setSelectedGift] = useState<typeof gifts[0] | null>(null);
  const [alienGlow, setAlienGlow] = useState(false);
  const [showMist, setShowMist] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  // RainbowKit wallet connection hooks
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setStep('earth');
      setSelectedGift(null);
      setAlienGlow(false);
      setShowMist(false);
      setEmail('');
      setImageError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedGift) {
      setImageError(false);
    }
  }, [selectedGift]);

  // Send gift claim email notification
  const sendGiftClaimEmail = async (claimData: {
    giftType: string;
    giftTitle: string;
    claimMethod: 'email' | 'wallet';
    email?: string | null;
    walletAddress?: string | null;
    userId?: string | null;
  }) => {
    try {
      const response = await fetch('/api/gift-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }
      console.log('Gift claim email sent successfully');
    } catch (error) {
      console.error('Error sending gift claim email:', error);
      // Don't throw error - email failure shouldn't block the claim
    }
  };

  // Save email claim to Firebase
  const saveEmailClaimToFirebase = async (emailAddress: string, giftType: string) => {
    try {
      const claimsRef = collection(db, 'alien_gift_claims');
      
      // Check if this email already claimed this gift
      const q = query(
        claimsRef,
        where('email', '==', emailAddress.toLowerCase()),
        where('giftType', '==', giftType)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new claim document
        const claimData = {
          email: emailAddress.toLowerCase(),
          giftType: giftType,
          giftTitle: selectedGift?.title || '',
          claimMethod: 'email',
          walletAddress: null,
          userId: user?.uid || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(claimsRef, claimData);
        console.log('Email claim saved to Firebase:', emailAddress);
        
        // Send email notification
        await sendGiftClaimEmail({
          giftType: giftType,
          giftTitle: selectedGift?.title || '',
          claimMethod: 'email',
          email: emailAddress.toLowerCase(),
          walletAddress: null,
          userId: user?.uid || null,
        });
        
        return true;
      } else {
        console.log('Email already claimed this gift');
        return false;
      }
    } catch (error) {
      console.error('Error saving email claim to Firebase:', error);
      throw error;
    }
  };

  // Save wallet claim to Firebase
  const saveWalletClaimToFirebase = async (walletAddress: string, giftType: string) => {
    try {
      const claimsRef = collection(db, 'alien_gift_claims');
      
      // Check if this wallet already claimed this gift
      const q = query(
        claimsRef,
        where('walletAddress', '==', walletAddress.toLowerCase()),
        where('giftType', '==', giftType)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new claim document
        const claimData = {
          walletAddress: walletAddress.toLowerCase(),
          giftType: giftType,
          giftTitle: selectedGift?.title || '',
          claimMethod: 'wallet',
          email: null,
          userId: user?.uid || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(claimsRef, claimData);
        console.log('Wallet claim saved to Firebase:', walletAddress);
        
        // Send email notification
        await sendGiftClaimEmail({
          giftType: giftType,
          giftTitle: selectedGift?.title || '',
          claimMethod: 'wallet',
          email: null,
          walletAddress: walletAddress.toLowerCase(),
          userId: user?.uid || null,
        });
        
        return true;
      } else {
        console.log('Wallet already claimed this gift');
        return false;
      }
    } catch (error) {
      console.error('Error saving wallet claim to Firebase:', error);
      throw error;
    }
  };

  // Handle wallet connection and claim
  useEffect(() => {
    if (isConnected && address && selectedGift && isConnectingWallet) {
      // Wallet was just connected, save the claim
      const handleWalletClaim = async () => {
        try {
          setIsSubmitting(true);
          await saveWalletClaimToFirebase(address, selectedGift.type);
          setIsConnectingWallet(false);
          setStep('claim');
          toast.success('Gift claimed successfully!');
        } catch (error) {
          console.error('Error claiming gift with wallet:', error);
          toast.error('Failed to claim gift. Please try again.');
          setIsConnectingWallet(false);
        } finally {
          setIsSubmitting(false);
        }
      };
      
      handleWalletClaim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, selectedGift?.type, isConnectingWallet]);

  const handleAlienClick = () => {
    setAlienGlow(true);
    setTimeout(() => {
      setShowMist(true);
      setTimeout(() => {
        // Randomly select a gift
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        setSelectedGift(randomGift);
        setStep('gift');
      }, 1000);
    }, 300);
  };

  const handleEmailClaim = async () => {
    if (!email || !selectedGift) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveEmailClaimToFirebase(email, selectedGift.type);
      setStep('claim');
      toast.success('Gift claimed successfully! Check your email.');
    } catch (error) {
      console.error('Error claiming gift:', error);
      toast.error('Failed to claim gift. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletConnect = async () => {
    if (!selectedGift) return;
    
    try {
      if (isConnected && address) {
        // Already connected, save claim immediately
        setIsConnectingWallet(false);
        setIsSubmitting(true);
        await saveWalletClaimToFirebase(address, selectedGift.type);
        setStep('claim');
        toast.success('Gift claimed successfully!');
        setIsSubmitting(false);
      } else if (openConnectModal) {
        // Open wallet connection modal
        setIsConnectingWallet(true);
        openConnectModal();
        // The useEffect hook will handle saving the claim once wallet is connected
      } else {
        toast.error('Wallet connection is not available. Please check your configuration.');
        setIsConnectingWallet(false);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      setIsConnectingWallet(false);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Popup Content */}
        <motion.div
          className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-6 lg:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Earth View */}
          {step === 'earth' && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h2
                className="text-2xl lg:text-3xl font-bold text-white mt-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Tap to send an alien home
              </motion.h2>
              
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                {/* Earth Image */}
                <motion.div
                  className="relative w-full h-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Image
                    src="/vault/sp.gif"
                    alt="Earth"
                    fill
                    className="object-contain"
                  />
                </motion.div>

                {/* Alien on Earth */}
                <motion.div
                  className="absolute bottom-[15%] left-[60px] cursor-pointer"
                  onClick={handleAlienClick}
                  onMouseEnter={() => setAlienGlow(true)}
                  onMouseLeave={() => !showMist && setAlienGlow(false)}
                  animate={{
                    scale: alienGlow ? 1.1 : 1,
                    filter: alienGlow ? 'brightness(1.3) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' : 'brightness(1)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/vault/alien tap.png"
                    alt="Alien"
                    width={200}
                    height={200}
                    className="transition-all duration-300"
                  />
                </motion.div>

                {/* Magical Mist Effect */}
                <AnimatePresence>
                  {showMist && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white/40 rounded-full backdrop-blur-sm"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -100],
                            x: [0, (Math.random() - 0.5) * 100],
                            opacity: [1, 0],
                            scale: [1, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: Math.random() * 0.5,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Gift Reveal */}
          {step === 'gift' && selectedGift && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.h2
                className="text-2xl lg:text-3xl font-bold text-white"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                You got a free {selectedGift.type}!
              </motion.h2>

              <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-white/30 backdrop-blur-sm">
                <Image
                  src={imageError ? '/vault/Elements for Web Decoration/Star, Small, Dresden Trim - Silver Pair.jpg' : selectedGift.image}
                  alt={selectedGift.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={imageError}
                />
              </div>

              <p className="text-white/80 text-lg">
                {selectedGift.title}
              </p>

              <div className="space-y-4 pt-4">
                <p className="text-white/70 text-sm">
                  Enter your email or connect your wallet to claim your gift
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                    />
                  </div>
                  <Button
                    onClick={handleEmailClaim}
                    disabled={!email || isSubmitting}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full px-6 py-3 disabled:opacity-50 transition-all duration-200"
                  >
                    {isSubmitting ? 'Claiming...' : 'Claim Gift'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/70">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleWalletConnect}
                  disabled={isConnectingWallet || isSubmitting}
                  className="w-full border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full py-3 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isConnectingWallet || isSubmitting ? 'Connecting...' : isConnected ? 'Claim with Wallet' : 'Connect Crypto Wallet'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Success/Claimed */}
          {step === 'claim' && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                ✨
              </motion.div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Gift Claimed!
              </h2>
              <p className="text-white/80">
                Check your email for your free {selectedGift?.type}. Your gift is on its way!
              </p>
              <Button
                onClick={onClose}
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full px-8 py-3 transition-all duration-200"
              >
                Continue Exploring
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

