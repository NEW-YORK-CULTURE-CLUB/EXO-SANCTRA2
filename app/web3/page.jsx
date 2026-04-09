"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Wallet, Plus, Upload, TrendingUp, Users, Layers, Star, ChevronRight } from "lucide-react";

// Placeholder blockchain logos
const blockchains = [
  { name: "Ethereum", logo: "/vault/ethereum.png" },
  { name: "Solana", logo: "/vault/solana.webp" },
  { name: "Polygon", logo: "/vault/polygon.webp" },
  { name: "BNB Chain", logo: "/vault/bnb.webp" },
  { name: "Avalanche", logo: "/vault/Avalanche.png" },
];

// Placeholder NFTs
const nfts = [
  { id: 1, name: "MonaLisa", image: "/vault/MonaLisa.jpg", chain: "Polygon" },
  { id: 2, name: "Guernica", image: "/vault/Guernica.jpg", chain: "Ethereum" },
  { id: 3, name: "The Persistence of Memory", image: "/vault/the-persistence-of-memory-1931.jpg", chain: "Polygon" },
  { id: 4, name: "The Starry Night", image: "/vault/The-Starry-Night.jpg", chain: "BNB Chain" },
  { id: 5, name: "The Head", image: "/vault/head-of-a-woman.jpg", chain: "BNB Chain" },
];

export default function Web3Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(nfts[0]);
  const [tab, setTab] = useState("overview");

  // Simulate wallet connect
  const handleConnectWallet = () => setWalletConnected(true);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Web3 background art */}
      {/* <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/20 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-pink-900/20" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-gradient-to-r from-blue-400/10 via-fuchsia-400/10 to-yellow-400/10 rounded-full blur-2xl" />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto">

<div className="flex flex-col items-center justify-center">
  <h2 className="text-sm">In Partnership With MRKD.Art</h2>
  <img src={"/vault/MRKD.png"} alt={"MRKD"} className="w-20 mb-4" />
</div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mx-auto mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blockchains">Blockchain</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="auth">Auth Token</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  <span className="text-muted-foreground">Welcome </span>
                  <span className="text-foreground">to </span>
                  <span className="text-fuchsia-600 dark:text-fuchsia-400">Web3</span>
                  <span className="text-muted-foreground"> </span>
                  <span className="text-foreground">Gallery</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">Explore, mint, and manage NFTs across all major blockchains. Connect your wallet and dive into the decentralized art world!</p>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleConnectWallet} disabled={walletConnected}>
                    <Wallet className="h-4 w-4 mr-2" />
                    {walletConnected ? "Wallet Connected" : "Connect Wallet"}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/web3/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Mint NFT
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import NFT
                  </Button>
                </div>

                
              </div>
              {/* Animated NFT Carousel */}
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="rounded-xl shadow-lg bg-card p-4 flex flex-col items-center">
                  <div className="mb-2 text-xs text-muted-foreground">Featured NFT</div>
                  <div className="relative w-60 h-60 mb-2">
                    <img src={"/vault/MonaLisa.jpg"} alt={selectedNFT.name} className="rounded-lg object-cover w-full h-full" />
                    <Badge className="absolute top-2 left-2 bg-white/80 text-black dark:text-white dark:bg-black/80 text-xs flex items-center gap-1">
                      <img src={blockchains.find(b=>b.name===selectedNFT.chain)?.logo} alt={selectedNFT.chain} className="h-4 w-4" />
                      {selectedNFT.chain}
                    </Badge>
                  </div>
                  <div className="font-semibold text-lg text-center">{selectedNFT.name}</div>
                  <Button size="sm" variant="ghost" className="mt-2" asChild>
                    <Link href={`/web3/${selectedNFT.id}`}>View Details <ChevronRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </div>

            

            {/* Blockchain Logos Row */}
            <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
              {blockchains.map((b) => (
                <div key={b.name} className="flex flex-col items-center">
                  <div className="bg-white dark:bg-zinc-900 rounded-full shadow p-2 mb-1 border border-zinc-200 dark:border-zinc-700">
                    <img src={b.logo} alt={b.name} className="h-8 w-8" />
                  </div>
                  <span className="text-xs text-muted-foreground">{b.name}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Layers className="h-5 w-5 text-fuchsia-500" />
                  <CardTitle className="text-base">NFTs Owned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Wallets Connected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-base">Chains Supported</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">Floor Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Ξ 0.42</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Explore NFTs</h2>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/web3/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Mint New NFT
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {nfts.map((nft) => (
                  <Card key={nft.id} className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedNFT(nft)}>
                    <CardContent className="p-2 flex flex-col items-center">
                      <div className="relative w-28 h-28 mb-2">
                        <img src={nft.image} alt={nft.name} className="rounded-lg object-cover w-full h-full border-2 border-zinc-200 dark:border-zinc-700" />
                        <Badge className="absolute top-2 left-2 bg-white/80 text-black dark:text-white dark:bg-black/80 text-xs flex items-center gap-1">
                          <img src={blockchains.find(b=>b.name===nft.chain)?.logo} alt={nft.chain} className="h-4 w-4" />
                          {nft.chain}
                        </Badge>
                      </div>
                      <div className="font-medium text-center text-sm mb-1">{nft.name}</div>
                      <Button size="xs" variant="ghost" asChild>
                        <Link href={`/web3/${nft.id}`}>View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending NFTs (fun extra section) */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Trending NFTs</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {nfts.slice(0,3).map((nft) => (
                  <Card key={nft.id} className="min-w-[220px] hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 flex flex-col items-center">
                      <img src={nft.image} alt={nft.name} className="rounded-lg w-24 h-24 object-cover mb-2 border-2" />
                      <div className="font-medium text-center text-sm mb-1">{nft.name}</div>
                      <Badge className=" text-white">Trending</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Blockchain Used Tab */}
          <TabsContent value="blockchains">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
             
              
              <h2 className="text-2xl font-bold mb-4">Blockchain Network Used</h2>
              <div className="flex flex-wrap gap-6 items-center justify-center">
                {blockchains.map((b) => (
                  <div key={b.name} className="flex flex-col items-center">
                    <div className="bg-white dark:bg-zinc-900 rounded-full shadow p-3 mb-2 border border-zinc-200 dark:border-zinc-700">
                      <img src={b.logo} alt={b.name} className="h-12 w-12" />
                    </div>
                    <span className="text-base font-semibold text-muted-foreground">{b.name}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-xl mt-40 font-bold">In Partnership With MRKD.Art</h2>
              <div className="lg:flex grid items-center justify-center">
                <img src={"/vault/MRKD.png"} alt={"MRKD"} className="w-40" />
                <img src={"/vault/names.png"} alt={"MRKD"} className="w-40 mb-4" />
              </div>

            </div>
          </TabsContent>

          {/* Auth Tokenization Tab */}
          <TabsContent value="auth">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-2xl font-bold mb-4">Auth Tokenization</h2>
              <p className="text-muted-foreground max-w-xl text-center mb-4">This section will allow you to manage authentication tokens for wallet connections, NFT minting, and secure blockchain interactions. (Coming soon!)</p>
              <Button variant="outline" disabled>Manage Auth Tokens</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}