'use client';

import { usePathname } from 'next/navigation';
import { AppLayout } from './app-layout';

interface ConditionalAppLayoutProps {
  children: React.ReactNode;
}

export function ConditionalAppLayout({ children }: ConditionalAppLayoutProps) {
  const pathname = usePathname();
  
  // Don't apply AppLayout to the root page, full-screen experiences, or artwork detail pages
  if (
    pathname === '/' ||
    pathname === '/ar' ||
    pathname.startsWith('/ar/') ||
    pathname === '/vr3d' ||
    pathname.startsWith('/omrak-collection/')
  ) {
    return <>{children}</>;
  }
  
  // Apply AppLayout to all other pages
  return <AppLayout>{children}</AppLayout>;
} 