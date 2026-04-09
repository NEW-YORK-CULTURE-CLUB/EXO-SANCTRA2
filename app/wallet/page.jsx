'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  Copy, 
  Check, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { FaWallet } from 'react-icons/fa';

export default function WalletPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setTimeout(() => setIsConnecting(false), 2000);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="px-4 pt-28 pb-32 overflow-x-hidden max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Wallet
            </h1>
            <p className="text-muted-foreground">
              Manage your digital wallet and connect to the blockchain
            </p>
          </div>

          {/* Wallet Connection Section */}
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-2 border-dashed border-primary/20 bg-muted/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaWallet className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Connect your wallet to start managing your digital assets and interact with the blockchain.
                    </p>
                    
                    <Button 
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* Connected Wallet Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6"
              >
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            Wallet Connected
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                              {formatAddress(address)}
                            </p>
                            <button
                              onClick={copyAddress}
                              className="p-1 hover:bg-green-200 dark:hover:bg-green-900/40 rounded transition-colors"
                              title="Copy address"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                          Connected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectWallet}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Wallet Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Wallet Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Full Address</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm break-all">{address}</p>
                          <button
                            onClick={copyAddress}
                            className="p-1 hover:bg-muted-foreground/10 rounded transition-colors flex-shrink-0"
                            title="Copy address"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => router.push('/wallet/send')}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => router.push('/wallet/receive')}
                      >
                        <ArrowDownRight className="w-4 h-4 mr-2" />
                        Receive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Account ID</span>
                        <span className="text-sm font-medium">
                          {user?.uid ? `${user.uid.slice(0, 8)}...` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Wallet Status</span>
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Network</span>
                        <span className="text-sm font-medium">Ethereum</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

