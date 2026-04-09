"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Edit, QrCode, Trash, Plus, Upload, Wallet, Send, DollarSign, Flame, Copy, Eye, Share2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// Mock NFT data - in real app this would come from blockchain/API
const nftData = {
  id: 1,
  name: "MonaLisa",
  artist: "Leonardo da Vinci",
  description: "A unique digital artwork from the MonaLisa collection, showcasing innovative blockchain art.",
  image: "/vault/MonaLisa.jpg",
  chain: "Polygon",
  tokenId: "0x1234...5678",
  contractAddress: "0xabcd...efgh",
  owner: "0x1234...5678",
  mintDate: "2024-01-15",
  price: "0.5 ETH",
  floorPrice: "0.3 ETH",
  rarity: "Legendary",
  attributes: [
    { trait: "Background", value: "Cosmic" },
    { trait: "Eyes", value: "Laser" },
    { trait: "Mouth", value: "Smile" },
    { trait: "Accessory", value: "Crown" }
  ],
  transactionHistory: [
    { type: "Minted", from: "0x0000...0000", to: "0x1234...5678", date: "2024-01-15", price: "0.1 ETH" },
    { type: "Sold", from: "0x1234...5678", to: "0xabcd...efgh", date: "2024-02-20", price: "0.3 ETH" },
    { type: "Transferred", from: "0xabcd...efgh", to: "0x1234...5678", date: "2024-03-10", price: "0 ETH" }
  ]
};

// Blockchain logos
const blockchains = {
  "Ethereum": "/vault/ethereum.png",
  "Solana": "/vault/solana.webp",
  "Polygon": "/vault/polygon.webp",
  "BNB Chain": "/vault/bnb.webp",
  "Avalanche": "/vault/avalanche.png"
};

const NFTDetails = () => {
  const [tab, setTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* MRKD.Art Partnership Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-sm text-muted-foreground">In Partnership With MRKD.Art</h2>
        <img src="/vault/MRKD.png" alt="MRKD" className="w-16 mb-4" />
      </div>

      {/* Back Button and Actions */}
      <div className="flex gap-2 justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/web3")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Web3
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 mr-1" />
            QR Code
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* NFT Image and Blockchain Info */}
        <div className="flex flex-col items-center w-full lg:w-[500px]">
          <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden mb-4">
            <img 
              src={nftData.image} 
              alt={nftData.name} 
              className="object-cover w-full h-full"
            />
            <Badge className="absolute top-4 left-4 bg-white/90 text-black dark:bg-black/90 dark:text-white text-xs flex items-center gap-1">
              <img src={blockchains[nftData.chain]} alt={nftData.chain} className="h-4 w-4" />
              {nftData.chain}
            </Badge>
            <Badge className="absolute top-4 right-4 bg-fuchsia-500 text-white">
              {nftData.rarity}
            </Badge>
          </div>
          
          {/* Blockchain Details */}
          <Card className="w-full mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Token ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{nftData.tokenId}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(nftData.tokenId)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contract:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{nftData.contractAddress}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(nftData.contractAddress)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Owner:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{nftData.owner}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(nftData.owner)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFT Details and Actions */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{nftData.name}</h2>
              <div className="text-lg text-muted-foreground mb-2">{nftData.artist}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Minted: {nftData.mintDate}</span>
                <span>•</span>
                <span>Floor: {nftData.floorPrice}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-fuchsia-600">{nftData.price}</div>
              <div className="text-sm text-muted-foreground">Current Price</div>
            </div>
          </div>

          {/* Web3 Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
            <Button className="bg-green-600 hover:bg-green-700 text-xs text-white">
              <Send className="w-4 h-4 mr-0" />
              Transfer
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs text-white">
              <DollarSign className="w-4 h-4 mr-0" />
              Sell
            </Button>
            <Button variant="outline">
              <Wallet className="w-4 h-4 mr-0" />
              View on Explorer
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 text-xs">
              <Flame className="w-4 h-4 mr-0" />
              Burn
            </Button>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{nftData.description}</p>
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {nftData.attributes.map((attr, index) => (
                  <div key={index} className="text-center p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground">{attr.trait}</div>
                    <div className="font-semibold">{attr.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">NFT Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collection:</span>
                        <span>NFSHE Collection</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standard:</span>
                        <span>ERC-721</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blockchain:</span>
                        <span>{nftData.chain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rarity:</span>
                        <Badge className="bg-fuchsia-500 text-white">{nftData.rarity}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Market Data</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Floor Price:</span>
                        <span>{nftData.floorPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Volume:</span>
                        <span>2.1 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owners:</span>
                        <span>1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listed:</span>
                        <span>45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Transaction History</h3>
                <div className="space-y-4">
                  {nftData.transactionHistory.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          tx.type === 'Minted' ? 'bg-green-500' : 
                          tx.type === 'Sold' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-muted-foreground">{tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.price}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.from} → {tx.to}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Raw Metadata</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "name": "${nftData.name}",
  "description": "${nftData.description}",
  "image": "${nftData.image}",
  "attributes": ${JSON.stringify(nftData.attributes, null, 2)},
  "external_url": "https://mrkd.art/nft/${nftData.tokenId}",
  "animation_url": "${nftData.image}"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NFTDetails; 