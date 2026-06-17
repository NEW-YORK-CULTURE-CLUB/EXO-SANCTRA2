"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart2,
  Building2,
  Folder,
  Wallet,
  Receipt,
  CreditCard,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  BarChart3,
  Brush,
  Monitor,
  Archive,
  UserCheck,
  Gavel,
  QrCode,
  Wallet2Icon,
  Image as ImageIcon,
  Bitcoin,
  Coins,
  Badge,
  FileText,
  Pen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { hasAdminAccess } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { GrSettingsOption } from "react-icons/gr";
import Image from "next/image";
import { useGallery } from "@/contexts/gallery-context";
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Gallery", href: "/dashboard", icon: Home },
  { name: "Inventory", href: "/inventory", icon: ImageIcon },
  { name: "Artist Profiles", href: "/artist-profiles", icon: Brush },
  { name: "Physical Floor", href: "/digital-floor", icon: QrCode },
  { name: "Record Vault", href: "/record-vault", icon: Wallet2Icon },
  { name: "Patron Management", href: "/patron-management", icon: UserCheck },
  { name: "Auction Management", href: "/auction-management", icon: Gavel },
  { name: "Gallery Analytics", href: "/gallery-analytics", icon: BarChart3 },
  { name: "Gallery Settings", href: "/gallery-settings", icon: GrSettingsOption },
  // { name: "Collectors", href: "/collectors", icon: Users2 },
  // { name: "Web3", href: "/web3", icon: Coins },
  // { name: "Gallery's Request", href: "/gallery-request", icon: FileText },
  // { name: "Artist's Request", href: "/artist-request", icon: Pen },
  // { name: "Admin", href: "/admin", icon: Badge },
]

const bottomNavigation: NavItem[] = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { gallery } = useGallery()
  const { user, userData } = useAuth()

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Check for saved sidebar state
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
      // Dispatch custom event to notify app-layout (only on client side)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sidebar-state-change'));
      }
    }
  }, [isCollapsed, mounted]);

  // Check if user has superadmin role
  const isSuperAdmin = hasAdminAccess(userData?.role)

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    // Show all items except admin-specific ones for non-superadmin users
    if (!isSuperAdmin) {
      return !['Gallery\'s Request', 'Artist\'s Request', 'Admin', 'Web3', 'Collectors'].includes(item.name)
    }
    return true
  })

  // Close sidebar when pathname changes (navigation)
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false)
      }
    }

    // Add event listener only on mobile when sidebar is open
    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileOpen])

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavItem = ({ item, isBottom = false }: { item: NavItem; isBottom?: boolean }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground",
            pathname === item.href
              ? "bg-secondary text-secondary-foreground"
              : "text-primary",
            isCollapsed && "justify-center px-2",
          )}
          onClick={() => {
            // Ensure mobile sidebar closes on navigation (only on client side)
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setIsMobileOpen(false)
            }
          }}
        >
          <item.icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span className="truncate">{item.name}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <>
        {/* Mobile Toggle Button - Fixed position */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 pl-2 flex items-center transition-all duration-200 ease-in-out group"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-foreground group-hover:text-accent-foreground transition-colors" />
          <span className=" ml-2 font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> {gallery?.name || 'Demo'} OS</span>
        </button>
        
        {/* Mobile Overlay - Positioned behind sidebar but above other content */}
        {isMobileOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        
        {/* Sidebar Container - Fixed on all screen sizes */}
        <div
          ref={sidebarRef}
          data-sidebar="sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col lg:border-r transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[72px]" : "w-72",
            // Mobile behavior: slide in/out with smooth animation
            "lg:translate-x-0",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            // Add backdrop blur for modern look
            "bg-background"
          )}
        >
          {/* Header Section - Fixed height, no scroll */}
          <div className="flex-shrink-0">
            <div className={cn("flex h-16 items-center gap-2 px-4", isCollapsed && "justify-center px-2")}>
              {!isCollapsed && (
                <Link href="/dashboard" className="flex items-center font-semibold hover:opacity-80 transition-opacity">
                   {mounted ? (
                     <Image 
                       src={gallery?.darkLogo || "/dark.png"} 
                       alt={`${gallery?.name || 'Gallery'} Logo`} 
                       width={50} 
                       height={50} 
                       className="rounded-lg"
                     />
                   ) : (
                     <div className="w-[50px] h-[50px] bg-muted rounded-lg animate-pulse" />
                   )}
                  <span className="text-xl ml-2 font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> {gallery?.name || 'Demo'} OS</span>
                </Link>
              )}
              {isCollapsed && (
                <Link href="/dashboard" className="flex items-center font-semibold hover:opacity-80 transition-opacity">
                  {mounted ? (
                    <Image 
                      src={gallery?.darkLogo || "/dark.png"} 
                      alt={`${gallery?.name || 'Gallery'} Logo`} 
                      width={50} 
                      height={50} 
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-muted rounded-lg animate-pulse" />
                  )}
                </Link>
              )}
              <div
                className={cn("ml-auto hidden lg:block absolute -right-3.5 top-48 cursor-pointer group", isCollapsed && "ml-0")}
                onClick={handleCollapseToggle}
              >
                <IoIosArrowDropleftCircle 
                  size={30} 
                  className={cn(
                    "transition-all duration-300 ease-in-out hover:scale-110 text-muted-foreground hover:text-foreground", 
                    isCollapsed && "rotate-180"
                  )} 
                />
                <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
              </div>
            </div>
          </div>

          {/* Navigation Content - Scrollable with proper height constraints */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {/* Mobile Logo Link */}
            <Link href="/dashboard" className="flex items-center lg:hidden ml-4 mb-2 hover:opacity-80 transition-opacity">
                  {mounted ? (
                    <Image 
                      src={gallery?.darkLogo || "/dark.png"} 
                      alt={`${gallery?.name || 'Gallery'} Logo`} 
                      width={50} 
                      height={50} 
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-muted rounded-lg animate-pulse" />
                  )}
            </Link>
            
            {/* Navigation Menu */}
            <nav className="space-y-1 px-2 py-4">
              {filteredNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* Bottom Section - Fixed height, no scroll */}
          <div className="flex-shrink-0 p-3 border-t border-border/50 bg-muted/20">
            <div className={cn(
              "flex items-center px-3 py-2 text-xs text-muted-foreground",
              isCollapsed && "justify-center px-1"
            )}>
              {!isCollapsed && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2 font-medium">
                    GA
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">Gallery Admin</div>
                    <div className="text-xs text-muted-foreground truncate">{gallery?.email || 'hello@exosanctra.com'}</div>
                  </div>
                  <Link href="/settings" className="ml-2 hover:opacity-80 transition-opacity">
                  <GrSettingsOption className="h-5 w-5"/>
                  </Link>
                </div>
              )}
              {isCollapsed && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  GA
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </TooltipProvider>
  )
}
