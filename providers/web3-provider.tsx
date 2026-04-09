'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, optimism } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Create a query client
const queryClient = new QueryClient();

// Get Reown project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

// Get company wallet address if provided (can be used for displaying company wallet or specific features)
const companyWalletAddress = process.env.NEXT_PUBLIC_COMPANY_WALLET_ADDRESS;

// Validate project ID
if (!projectId && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_REOWN_PROJECT_ID is not set. Wallet connection may not work properly.');
}

// Configure wagmi with RainbowKit
// Note: ssr is set to false because Web3 libraries use browser-only APIs like indexedDB
const config = getDefaultConfig({
  appName: 'Exo Sanctra',
  projectId: projectId || 'YOUR_PROJECT_ID', // Fallback for development
  chains: [mainnet, sepolia, polygon, arbitrum, optimism],
  ssr: false, // Disable SSR to prevent indexedDB errors during build
});

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={mainnet}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

