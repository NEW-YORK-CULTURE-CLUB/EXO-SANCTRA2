'use client';

import React, { useEffect, useState } from 'react'
import { BiShoppingBag } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMail, HiMenu, HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi';
import { MdCall } from 'react-icons/md';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CgClose } from 'react-icons/cg';
import Image from 'next/image';
import { LiaOpencart } from "react-icons/lia";
import { useAuth } from '@/contexts/auth-context'
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from '@/lib/i18n'
import LanguageSwitcher from './language-switcher'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FaWallet } from "react-icons/fa"
import { HelpCircle, LogOut, Palette } from "lucide-react"
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LoginModal from './login-modal'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Generate initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '';
  
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Generate wallet initials from address
const getWalletInitials = (address) => {
  if (!address) return '';
  // Take first 2 characters of the address
  return address.slice(2, 4).toUpperCase();
};

// Get display name from email (name before @)
const getEmailDisplayName = (email) => {
  if (!email) return '';
  const parts = email.split('@');
  return parts[0] || email;
};

// Get initials from email
const getEmailInitials = (email) => {
  const displayName = getEmailDisplayName(email);
  if (!displayName) return '';
  return displayName.charAt(0).toUpperCase();
};

// Format wallet address for display
const formatWalletAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Responsive Menu Component
const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, userData, logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: '/about-exsa', label: 'About EXSA' },
    { path: '/store-of-essence', label: 'Essence Hall' },
    { path: '/soul-activation', label: 'Soul Activation' },
    { path: '/community-rituals', label: 'Community Rituals' },
    { path: '/personal-universe', label: 'My Universe' },
    // { path: '/news-updates', label: 'News & Updates' },
  ];

  const companyItems = [
    { path: '/contact', label: t('contact') },
  ];

  return (
    <div className={`fixed top-0 left-0 h-full w-64 backdrop-blur-md bg-black/50 border-0 border-neutral-800/50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
      showMenu ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <Link href="/home" className="flex items-center gap-2" onClick={() => setShowMenu(false)}>
            <img src="/sign.png" alt="Exo Sanctra" className="w-16" />
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-3 mt-2">
          <div className="space-y-2">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="block px-0 py-3 rounded-lg text-base font-medium transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setShowMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Company Items */}
            <div className="space-y-2 pt-2 pb-5">
              {companyItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-0 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800">
          {/* Logout Button */}
          {user && (
            <button 
              onClick={async () => {
                try {
                  await logout();
                  toast({
                    title: "Success",
                    description: t('loggedOutSuccessfully'),
                  });
                  setShowMenu(false);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: t('failedToLogout'),
                    variant: "destructive",
                  });
                }
              }}
              className="w-full bg-transparent text-xs border-red-800 text-red-400 hover:bg-red-950/20 hover:border-red-700 px-4 py-2 rounded-lg border"
            >
              {t('logout')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function Navbar() {
  const router = useRouter();
  const { user, userData, logout } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const connectModal = useConnectModal();
  const openConnectModal = connectModal?.openConnectModal;
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Add scroll listener to turn off hover state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setHovered(false);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { path: '/about-exsa', label: 'About EXSA' },
    { path: '/store-of-essence', label: 'Essence Hall' },
    { path: '/soul-activation', label: 'Soul Activation' },
    { path: '/community-rituals', label: 'Community Rituals' },
    { path: '/personal-universe', label: 'My Universe' },
    // { path: '/news-updates', label: 'News & Updates' },
  ];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      setShowDisconnectDialog(false);
      toast({
        title: "Success",
        description: 'Wallet disconnected successfully',
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Error",
        description: 'Failed to disconnect wallet',
        variant: "destructive",
      });
    }
  };

  const handleWalletConnect = async () => {
    try {
      if (openConnectModal) {
        openConnectModal();
        // Wait a bit for the wallet to connect, then save to Firebase
        setTimeout(async () => {
          if (address) {
            await saveWalletToFirebase(address);
          }
        }, 2000);
      } else {
        console.warn('Wallet connection is not available. Please check your Web3 configuration.');
        toast({
          title: "Error",
          description: 'Wallet connection is not available. Please check your configuration.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error",
        description: 'Failed to connect wallet.',
        variant: "destructive",
      });
    }
  };

  const saveWalletToFirebase = async (walletAddress) => {
    try {
      // Check if wallet already exists
      const walletsRef = collection(db, 'wallets');
      const q = query(walletsRef, where('address', '==', walletAddress.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new wallet document
        const walletData = {
          address: walletAddress.toLowerCase(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId: user?.uid || null,
          email: user?.email || null,
        };

        await addDoc(walletsRef, walletData);
        console.log('Wallet saved to Firebase:', walletAddress);
      } else {
        console.log('Wallet already exists in Firebase');
      }
    } catch (error) {
      console.error('Error saving wallet to Firebase:', error);
    }
  };

  // Save wallet when connected
  useEffect(() => {
    if (isConnected && address) {
      saveWalletToFirebase(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  return (
    <>
      <style>
        {`
          @keyframes borderTravel {
            0% { 
              border-top-color: white;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            25% { 
              border-top-color: transparent;
              border-right-color: white;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            50% { 
              border-top-color: transparent;
              border-right-color: transparent;
              border-bottom-color: white;
              border-left-color: transparent;
            }
            75% { 
              border-top-color: transparent;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: white;
            }
            100% { 
              border-top-color: white;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
          }
          
          .animated-border {
            animation: borderTravel 6s linear infinite;
          }
          
          .animated-border-slow {
            animation: borderTravel 8s linear infinite;
          }
          
          .animated-border-slower {
            animation: borderTravel 10s linear infinite;
          }
        `}
      </style>

      {hovered ? (
        <>
          <div className="z-50 flex justify-center items-center">
            <nav 
                        // style={{ border: '1px solid transparent' }}
            className="lg:w-[95%] w-[95%] mx-auto mt-28 cursor-pointer lg:h-20 z-50 fixed justify-self-center text-center my-3 flex justify-between items-center lg:p-5 p-2 lg:px-10 bg-[rgba(52,52,52,0.3)] shadow-md backdrop-blur-lg  animated-border border-white/20 rounded-full">
              <Link 
                href='/'  
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }}  
                className="text-2xl font-bold flex items-center cursor-pointer text-green-900"
              >
                <Image className="w-14 ml-2 lg:hidden rounded-full" src="/sign.png" alt="Exo Sanctra" width={100} height={100} />
                <Image className="w-16 hidden rounded-full lg:inline" src="/sign.png" alt="Exo Sanctra" width={100} height={100} />
              </Link>
              
              
              <ul className="hidden md:flex space-x-10 text-white">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="text-sm inline-block">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <a href="mailto:admin@exosanctra.art">
                  <HiMail className="text-2xl cursor-pointer" />
                </a>
                <a href="tel:+1 (702) 764-7232">
                  <MdCall className="text-2xl cursor-pointer" />
                </a>
              </ul>
              
              <div className="space-x-2 align-middle flex justify-evenly items-center">
                {/* <Link href="/marketplace" className="mr-2">
                  <LiaOpencart
                    className="h-6 w-6"
                    color="#fff"
                  />
                </Link>
                
                <div className="px-2">
                  {theme === "dark" ? (
                    <BiSolidSun onClick={toggleTheme} className="text-2xl text-white cursor-pointer" />
                  ) : (
                    <BiSolidMoon onClick={toggleTheme} className="text-2xl text-white cursor-pointer" />
                  )}
                </div> */}

                {user ? (
                  <>
                      {user && userData ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer transition-transform hover:scale-105">
                              {userData.photoURL ? (
                                <Image 
                                  src={userData.photoURL} 
                                  alt={userData.artistName || userData.galleryName || userData.firstName || user.displayName || t('profile')} 
                                  width={30} 
                                  height={30}
                                  className="rounded-full hover:border-2 border-muted hover:border-primary transition-colors"
                                />
                              ) : (
                                <div className="w-[30px] h-[30px] rounded-full border-2 border-muted hover:border-primary transition-colors bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                                  {getInitials(userData.fullname || userData.artistName || userData.galleryName || (userData.firstName && userData.lastName ? userData.firstName + ' ' + userData.lastName : '') || user.displayName || getEmailDisplayName(user.email) || t('profile'))}
                                </div>
                              )}
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="w-56 border-0 p-4 sm:translate-x-0 translate-x-1/3"
                            sideOffset={8}
                            alignOffset={0}
                            side="bottom"
                          >
                            <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/personal-universe')}>
                              <div className="w-[30px] h-[30px] rounded-full border-2 border-white/30 hover:border-white/50 transition-colors bg-white/20 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
                                {getEmailInitials(user.email)}
                              </div>
                              {/* <Image src="/vault/Elements for Web Decoration/Earth.png" alt="Earth" width={200} height={200} className="opacity-90" /> */}
                              <span>My Universe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => window.open('mailto:freakisslin@gmail.com', '_blank')}>
                              <HelpCircle className="mr-2 h-4 w-4" />
                              <span>{t('helpSupport')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={async () => {
                                try {
                                  await logout();
                                  toast({
                                    title: "Success",
                                    description: t('loggedOutSuccessfully'),
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: t('failedToLogout'),
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>{t('logout')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {/* Show user initials if logged in but no userData */}
                          {user && user.email ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="w-[30px] h-[30px] rounded-full border-2 border-white/30 hover:border-white/50 transition-colors bg-white/20 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
                                  {getEmailInitials(user.email)}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-56 border-0 p-4 sm:translate-x-0 translate-x-1/3"
                                sideOffset={8}
                                alignOffset={0}
                                side="bottom"
                              >
                                <DropdownMenuLabel>
                                  <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                      {getEmailDisplayName(user.email)}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/personal-universe')}>
                                  <div className="w-[30px] h-[30px] rounded-full border-2 border-white/30 hover:border-white/50 transition-colors bg-white/20 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
                                    {getEmailInitials(user.email)}
                                  </div>
                                  {/* <Image src="/vault/Elements for Web Decoration/Earth.png" alt="Earth" width={200} height={200} className="opacity-90" /> */}
                                  <span>My Universe</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => window.open('mailto:freakisslin@gmail.com', '_blank')}>
                                  <HelpCircle className="mr-2 h-4 w-4" />
                                  <span>{t('helpSupport')}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={async () => {
                                    try {
                                      await logout();
                                      // router.push('/auth/login');
                                      toast.success(t('loggedOutSuccessfully'));
                                    } catch (error) {
                                      toast.error(t('failedToLogout'));
                                    }
                                  }}
                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                >
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <span>{t('logout')}</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <button 
                              onClick={() => setShowLoginModal(true)}
                              className="lg:px-6 py-2 px-4 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black text-sm shadow-md"
                            >
                              {t('login')}
                            </button>
                          )}
                          {mounted && (
                            isConnected && address ? (
                              <button
                                onClick={() => setShowDisconnectDialog(true)}
                                className="flex items-center gap-2 lg:px-4 py-2 px-3 rounded-full border border-green-500/50 bg-green-500/10 text-white text-sm hover:bg-green-500/20 transition-all duration-200 cursor-pointer"
                              >
                                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-xs font-semibold">
                                  {getWalletInitials(address)}
                                </div>
                                <span className="hidden sm:inline">{formatWalletAddress(address)}</span>
                                <span className="sm:hidden">{getWalletInitials(address)}</span>
                              </button>
                            ) : (
                              <button 
                                onClick={handleWalletConnect}
                                disabled={!openConnectModal}
                                className="lg:px-6 py-2 px-4 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Connect Wallet
                              </button>
                            )
                          )}
                        </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    {/* Show user initials if logged in */}
                    {user && user.email ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="w-[30px] h-[30px] rounded-full border-2 border-white/30 hover:border-white/50 transition-colors bg-white/20 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
                            {getEmailInitials(user.email)}
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-56 border-0 p-4 sm:translate-x-0 translate-x-1/3"
                          sideOffset={8}
                          alignOffset={0}
                          side="bottom"
                        >
                          <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {getEmailDisplayName(user.email)}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/personal-universe')}>
                          <div className="w-[30px] h-[30px] rounded-full border-2 border-white/30 hover:border-white/50 transition-colors bg-white/20 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
                            {getEmailInitials(user.email)}
                          </div>
                            {/* <Image src="/vault/Elements for Web Decoration/Earth.png" alt="Earth" width={200} height={200} className="opacity-90" /> */}
                            <span>My Universe</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className='cursor-pointer' onClick={() => window.open('mailto:freakisslin@gmail.com', '_blank')}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>{t('helpSupport')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={async () => {
                              try {
                                await logout();
                                // router.push('/auth/login');
                                toast.success(t('loggedOutSuccessfully'));
                              } catch (error) {
                                toast.error(t('failedToLogout'));
                              }
                            }}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t('logout')}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="lg:px-6 py-2 px-4 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black text-sm shadow-md"
                      >
                        Login
                      </button>
                    )}
                    {mounted && (
                      isConnected && address ? (
                        <button
                          onClick={() => setShowDisconnectDialog(true)}
                          className="flex items-center gap-2 lg:px-4 py-2 px-3 rounded-full border border-green-500/50 bg-green-500/10 text-white text-sm hover:bg-green-500/20 transition-all duration-200 cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-xs font-semibold">
                            {getWalletInitials(address)}
                          </div>
                          <span className="hidden sm:inline">{formatWalletAddress(address)}</span>
                          <span className="sm:hidden">{getWalletInitials(address)}</span>
                        </button>
                      ) : (
                        <button 
                          onClick={handleWalletConnect}
                          disabled={!openConnectModal}
                          className="lg:px-6 py-2 px-4 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Connect Wallet
                        </button>
                      )
                    )}
                  </div>
                )}

                <div className="pr-2 lg:hidden"> 
                  {showMenu ? (
                    <CgClose
                      onClick={toggleMenu}
                      className="font-bold cursor-pointer rounded-full p-1 transition-all"
                      size={40}
                      color="white"
                    />
                  ) : (
                    <HiMenu
                      onClick={toggleMenu}
                      className="cursor-pointer transition-all"
                      size={25}
                      color="white"
                    />
                  )}
                </div>
              </div>
            </nav>
          </div>
          <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
        </>
      ) : (
        <div className="z-50 flex justify-center items-center">
          <div 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex items-center animated-border border-white/20 bg-[rgba(52,52,52,0.3)] lg:h-24 h-24 z-50 mt-28 cursor-pointer fixed text-white justify-self-center text-center justify-between p-4 rounded-full backdrop-blur-lg"
            style={{ border: '1px solid transparent' }}
          >
            <Link href="/">
              <Image className="w-16 lg:hidden" src="/sign.png" alt="Exo Sanctra" width={100} height={100} />
              <Image className="w-16 hidden lg:inline" src="/sign.png" alt="Exo Sanctra" width={100} height={100} />
            </Link>
          </div>
        </div>
      )}
        <div className="z-50 flex justify-center items-center">
          <Link
            href="/ar"
            className="flex items-center justify-center animated-border border-white/20 bg-[rgba(255,255,255,0.7)] lg:h-24 h-20 lg:w-24 w-20 z-50 bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer fixed text-white rounded-full backdrop-blur-lg lg:p-4 p-2"
            style={{ border: '1px solid transparent' }}
            title="Experience art in AR"
          >
            <Image className="w-14 lg:hidden" src="/vault/ar.png" alt="AR Experience" width={100} height={100} />
            <Image className="lg:w-16 w-14 hidden lg:inline" src="/vault/ar.png" alt="AR Experience" width={100} height={100} />
          </Link>
        </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Disconnect Wallet Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent className="sm:max-w-4xl rounded-2xl bg-white/10 backdrop-blur-2xl text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">Disconnect Wallet</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to disconnect your wallet? You'll need to connect again to use wallet features.
            </DialogDescription>
          </DialogHeader>
          {address && (
            <div className="py-4">
              <p className="text-sm text-white/80 mb-2">Connected Wallet:</p>
              <p className="text-sm font-mono bg-white/10 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20">{address}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisconnectDialog(false)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 mt-3 lg:mt-0"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/30"
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Navbar 