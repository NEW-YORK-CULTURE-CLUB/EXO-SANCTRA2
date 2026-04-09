'use client';

import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/sidebar';
import { TopNav } from '@/components/top-nav';
import { ProtectedRoute } from '@/components/protected-route';

import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { TopNavSkeleton } from '@/components/top-nav-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Bypass authentication - always show as authenticated
  const user = { uid: 'mock-user' }; // Mock user
  const loading = false; // No loading state
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Define all public routes (including dynamic marketplace detail)
  const publicRoutes = [
    '/marketplace',
    '/auctions',
    '/home',
    '/gallery',
    '/about',
    // EXSA public screens
    '/store-of-essence',
    '/soul-activation',
    '/community-rituals',
    '/personal-universe',
    '/news-updates',
    '/about-exsa',
    '/profile',
    '/auth',
    '/artist-approval',
    '/notifications',
    '/services',
    '/contact',
    '/news',
    '/careers',
    '/legal',
    '/help',
    '/vr3d',
    '/ar',
    '/artists',
    '/where-to',
    '/community',
    '/omrak-collection',
    
  ];
  
  // Check if current page is a public route or a dynamic marketplace detail page
  const isPublic =
    publicRoutes.some(route => pathname === route) ||
    pathname.startsWith('/marketplace/') ||
    // EXSA dynamic/public patterns
    pathname.startsWith('/store-of-essence/') ||
    pathname.startsWith('/community-rituals/') ||
    pathname.startsWith('/artist-approval/') ||
    pathname.startsWith('/legal/') ||
    pathname.startsWith('/services/') ||
    pathname.startsWith('/careers/') ||
    pathname.startsWith('/news/') ||
    pathname.startsWith('/profile/');
    pathname.startsWith('/omrak-collection/');

  // Handle authentication transitions to prevent sidebar flash
  useEffect(() => {
    if (!loading && user && pathname === '/auth/login') {
      setIsTransitioning(true);
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        router.push('/home');
      }, 100);
      return () => clearTimeout(timer);
    }
    
    if (pathname !== '/auth/login') {
      setIsTransitioning(false);
    }
  }, [user, loading, pathname, router]);

  // Listen for sidebar state changes from localStorage or other sources
  useEffect(() => {
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        setSidebarCollapsed(JSON.parse(savedState));
      }
    };

    // Initial check
    handleStorageChange();

    // Listen for localStorage changes (only on client side)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('sidebar-state-change', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('sidebar-state-change', handleStorageChange);
      }
    };
  }, []);

  // For public pages, render immediately without any authentication checks
  if (isPublic) {
    return <>{children}</>;
  }

  // If still loading, show loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1">
          <TopNavSkeleton />
          <div className="container mx-auto p-6 max-w-7xl">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // If transitioning during login, show skeleton to prevent flash
  if (isTransitioning) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1">
          <TopNavSkeleton />
          <div className="container mx-auto p-6 max-w-7xl">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't show sidebar/nav
  if (!user) {
    return <>{children}</>;
  }

  // If authenticated, show the full app layout
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex">
        <Sidebar />
        {/* Main content area with dynamic spacing for fixed sidebar */}
        <div 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-72"
          )}
        >
          <TopNav />
          <div className="container mx-auto p-6 max-w-7xl">
            <main className="w-full">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 