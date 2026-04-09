'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Web3Provider with SSR disabled to prevent indexedDB errors during build
const Web3Provider = dynamic(
  () => import("@/providers/web3-provider").then((mod) => ({ default: mod.Web3Provider })),
  { ssr: false }
);

interface Web3ProviderWrapperProps {
  children: ReactNode;
}

export function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  return <Web3Provider>{children}</Web3Provider>;
}

