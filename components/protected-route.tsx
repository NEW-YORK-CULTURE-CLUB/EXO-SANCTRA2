'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

import { TopNavSkeleton } from '@/components/top-nav-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { hasAdminAccess } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Bypass all authentication - always allow access
  return <>{children}</>;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  // Bypass all authentication - always allow admin access
  return <>{children}</>;
} 