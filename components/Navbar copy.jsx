'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Search, User, Menu, X, HelpCircle, LogOut, Settings, ChevronDown, Palette } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Image from "next/image";
import { useTheme } from "next-themes"
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { FaWallet } from 'react-icons/fa'
import { useTranslation } from '@/lib/i18n'
import LanguageSwitcher from './language-switcher'

// Generate initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '';
  
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Company dropdown component
const CompanyDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  const companySections = [
    {
      title: t('about'),
      description: t('aboutDescription'),
      image: '/vault/COMPANY/ABOUT.png',
      // image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center',
      path: '/about'
    },
    {
      title: t('contact'),
      description: t('contactDescription'),
      // image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center',
      image: '/vault/COMPANY/CONTACT.png',
      path: '/contact'
    },
    {
      title: t('news'),
      description: t('newsDescription'),
      // image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=400&h=300&fit=crop&crop=center',
      image: '/vault/COMPANY/NEWS.png',
      path: '/news'
    },
    {
      title: 'Careers',
      description: t('careersDescription'),
      // image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop&crop=center',
      image: '/vault/COMPANY/CAREERS.png',
      path: '/careers'
    },
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button 
        variant="ghost" 
        className="text-sm font-medium transition-colors px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent"
      >
        {t('company')}
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-[1000px] p-12 bg-background backdrop-blur-md border-0 border-border rounded-2xl shadow-xl z-50 animate-dropdown"
        >
          <div className="grid grid-cols-4 gap-4">
            {companySections.map((section, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-section"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(section.path)}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-xs text-gray-200 opacity-90">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// OS dropdown component
const OSDropdown = ({ isLoggedIn = false }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  const osSections = [
    {
      title: 'ExhibitIQ - OS',
      description: t('galleryOSDescription'),
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop&crop=center',
      path: isLoggedIn ? '/dashboard' : '/auth/login'
    },
    {
      title: 'ArtistIQ - OS',
      description: t('artistOSDescription'),
      image: 'https://images.unsplash.com/photo-1588786849373-642245e7bd15?w=400&h=300&fit=crop&crop=center',
      path: isLoggedIn ? '/dashboard' : '/auth/login'
    },
    {
      title: 'CollectorIQ - OS',
      description: t('collectorOSDescription'),
      image: 'https://images.unsplash.com/photo-1580687580441-96dbadf8f3c8?w=400&h=300&fit=crop&crop=center',
      path: isLoggedIn ? '/dashboard' : '/auth/login'
    },
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button 
        className="text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        {isLoggedIn ? t('visitOperatingSystem') : t('getOperatingSystem')}
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-[0%] transform -translate-x-1/2 mt-0 w-[800px] p-8 bg-background backdrop-blur-md border-0 border-border rounded-2xl shadow-xl z-50 animate-dropdown md:block hidden"
        >
          <div className="grid grid-cols-3 gap-4">
            {osSections.map((section, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-section"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(section.path)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-xs text-gray-200 opacity-90">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mobile dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-[80%] transform -translate-x-1/2 mt-0 w-[calc(100vw-1rem)] max-w-sm p-4 bg-background backdrop-blur-md border-0 border-border rounded-2xl shadow-xl z-50 animate-dropdown md:hidden block"
        >
          <div className="space-y-3">
            {osSections.map((section, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-section bg-gradient-to-r from-primary/5 to-primary/10 p-4 border border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(section.path)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-14 h-14 overflow-hidden rounded-lg flex-shrink-0 border-2 border-white/20">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground leading-tight">{section.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false)
  const router = useRouter()
  const { user, userData, logout } = useAuth()
  const { theme } = useTheme()
  const { toast } = useToast()
  const { t } = useTranslation()
    const [hovered, setHovered] = useState(false);

  const [mounted, setMounted] = useState(false);

  // 🆕 Add scroll listener to turn off hover state
  useEffect(() => {
    const handleScroll = () => {
      setHovered(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  const navItems = [
    // { path: '/home', label: t('home') },
    { path: '/marketplace', label: t('marketplace') },
    { path: '/services', label: t('ourServices') },
    { path: '/auctions', label: t('auctions') },
    { path: '/gallery', label: t('gallery') },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsCompanyDropdownOpen(false)
  }

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
  }

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
    {/* { hovered ? */}
    <>
      <motion.header 
        className="backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-md sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/home" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <img src="/light.png" alt="ExhibitIQ" className="w-16 dark:hidden" />
              <img src="/dark.png" alt="ExhibitIQ" className="w-16 hidden dark:block" />
              {/* <span className="text-xl lg:block hidden font-bold text-foreground tracking-wider hover:text-primary transition-colors">ExhibitIQ's</span> */}
              {/* <span className="text-xl lg:block hidden font-bold text-foreground tracking-wider hover:text-primary transition-colors">GALLERY</span> */}
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
  
              {navItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <div className="flex items-center gap-2">

                     {/* Add search icon beside marketplace */}
                     {item.path === '/marketplace' && (
                      <Search 
                        className="h-5 w-5 cursor-pointer -mr-2 transition-colors text-muted-foreground" 
                        title={t('search')}
                      />
                    )}
                    <Link
                      href={item.path}
                      className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                        pathname === item.path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                   
                  </div>
                  
                  {/* Insert Company dropdown after Our Services */}
                  {item.path === '/services' && <CompanyDropdown />}
                </React.Fragment>
              ))}
              
               {user ? (
                <OSDropdown isLoggedIn={true} />
              ) : (
                <OSDropdown isLoggedIn={false} />
              )}
            </nav>
            
            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">

            {/* <Link href="/marketplace" className="cursor-pointer hidden lg:block transition-transform hover:scale-105">
            <Search 
                  className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" 
                  title={t('search')}
                />
              </Link> */}

              {user && userData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer transition-transform hover:scale-105">
                      {userData.photoURL ? (
                        <Image 
                          src={userData.photoURL} 
                          alt={userData.artistName || userData.galleryName || userData.firstName || user.displayName || t('profile')} 
                          width={20} 
                          height={20}
                          className="rounded-full hover:border-2 border-muted hover:border-primary transition-colors"
                        />
                      ) : (
                        <div className="w-[30px] h-[30px] rounded-full border-2 border-muted hover:border-primary transition-colors bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                          {getInitials(userData.fullname || userData.artistName || userData.galleryName || userData.firstName + ' ' + userData.lastName || user.displayName || t('profile').charAt(0))}
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
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userData.fullname || userData.artistName || userData.galleryName || userData.firstName + ' ' + userData.lastName || user.displayName || t('profile')}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/dashboard')}>
                    <Palette
                  className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" 
                  title={t('operatingSystem')}
                />
                      <span>{t('operatingSystem')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/profile')}>
                      <Image 
                        src={userData.photoURL} 
                        alt={userData.artistName || userData.galleryName || userData.firstName || user.displayName || t('profile')} 
                        width={20} 
                        height={20}
                        className="rounded-full hover:border-2 border-muted hover:border-primary transition-colors"
                      />
                      <span>{t('profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/wallet')}>
                    <FaWallet 
                  className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" 
                  title={t('wallet')}
                />
                      <span>{t('wallet')}</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className='cursor-pointer' onClick={() => window.open('mailto:admin@exhibitiq.art', '_blank')}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>{t('helpSupport')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={async () => {
                        try {
                          await logout();
                          router.push('/auth/login');
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
                null
              )}
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              <ThemeToggle />

              {/* <div className="lg:hidden" /> */}
              
                {isMobileMenuOpen ? (
                  <X 
                  onClick={toggleMobileMenu}
                  className="h-5 w-5 cursor-pointer lg:hidden" />
                ) : (
                  <Menu 
                  onClick={toggleMobileMenu}
                  className="h-5 w-5 cursor-pointer lg:hidden" />
                )}
              
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
              <div className={`fixed top-0 left-0 h-full w-64 backdrop-blur-md bg-white/70 dark:bg-black/50 border-0 border-neutral-200/50 dark:border-neutral-800/50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <Link href="/home" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <img src="/light.png" alt="ExhibitIQ" className="w-16 dark:hidden" />
              <img src="/dark.png" alt="ExhibitIQ" className="w-16 hidden dark:block" />
              {/* <span className="text-lg font-bold text-foreground">GALLERY</span> */}
            </Link>
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeMobileMenu}
              className="hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </Button> */}
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-3 mt-2">
            <div className="space-y-2">
              {/* Operating System dropdown - moved to top */}
              {user ? (
                <OSDropdown isLoggedIn={true} />
              ) : (
                <OSDropdown isLoggedIn={false} />
              )}
              
              {/* Navigation Items */}
              
              {navItems.map((item) => (
                <div key={item.path} className="flex items-center gap-2">
                  {/* Add search icon beside marketplace in mobile */}
                  {item.path === '/marketplace' && (
                    <Search 
                      className="h-5 w-5 cursor-pointer transition-colors text-muted-foreground" 
                      title={t('search')}
                    />
                  )}
                  <Link
                    href={item.path}
                    className={`block px-0 py-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === item.path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              
              {/* Company dropdown in mobile sidebar */}
              <div className="space-y-2 pt-2 pb-5">
                <button
                  onClick={toggleCompanyDropdown}
                  className="flex items-center justify-between w-full px-0 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{t('company')}</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCompanyDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isCompanyDropdownOpen && (
                  <div className="pl-0 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/about"
                      className="block px-0 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {t('aboutUs')}
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-0 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {t('contactUs')}
                    </Link>
                    <Link
                      href="/careers"
                      className="block px-0 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {t('careers')}
                    </Link>
                    <Link
                      href="/news"
                      className="block px-0 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {t('news')}
                    </Link>
                  </div>
                )}
              </div>
              

            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{t('theme')}</span>
              <ThemeToggle />
            </div>
            
            {/* Logout Button */}
            {user && (
              <Button 
                variant="outline"
                onClick={async () => {
                  try {
                    await logout();
                    router.push('/auth/login');
                    toast.success(t('loggedOutSuccessfully'));
                    closeMobileMenu();
                  } catch (error) {
                    toast.error(t('failedToLogout'));
                  }
                }}
                className="w-full bg-transparent text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </Button>
            )}
          </div>
        </div>
      </div>
      </>

      
      {/* :
       <div 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ border: '1px solid transparent' }}
        className="flex items-center animated-border border-white/20 bg-[rgba(52,52,52,0.3)] z-50 lg:mt-24 mt-20 cursor-pointer fixed text-white justify-self-center text-center justify-between lg:p-10 p-8 rounded-full backdrop-blur-lg">
        <Link href="/">
        <Image src="/dark.png" alt="ExhibitIQ"  width={100} height={100} className="lg:w-20 w-16" />

        </Link>
      </div>
    } */}

    </>
  )
}

export default Navbar 