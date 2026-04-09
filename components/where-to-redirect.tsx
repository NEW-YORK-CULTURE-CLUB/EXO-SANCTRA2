'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context'; // Disabled - using mock data

interface WhereToRedirectProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const WhereToRedirect = ({ redirectPath = '/dashboard', children }: WhereToRedirectProps) => {
  // const { user, loading } = useAuth(); // Disabled - using mock data
  const user = { uid: 'mock-user' }; // Mock user - always authenticated
  const loading = false; // No loading needed
  const router = useRouter();

  useEffect(() => {
    // Always redirect immediately since we're always "authenticated"
    router.push(redirectPath);
  }, [router, redirectPath]);

  // No loading or auth checks needed with mock data
  return <>{children}</>;
};

export default WhereToRedirect;
