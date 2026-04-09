"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Upload, Plus, Trash, Wallet, Zap, Image as ImageIcon, Tag, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

// Blockchain options with logos
const blockchainOptions = [
  { name: "Ethereum", logo: "/vault/ethereum.png", gas: "High", speed: "Medium" },
  { name: "Polygon", logo: "/vault/polygon.webp", gas: "Low", speed: "Fast" },
  { name: "Solana", logo: "/vault/solana.webp", gas: "Very Low", speed: "Very Fast" },
  { name: "BNB Chain", logo: "/vault/bnb.webp", gas: "Low", speed: "Fast" },
  { name: "Avalanche", logo: "/vault/avalanche.png", gas: "Low", speed: "Fast" }
];

const NFTMinting = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState(blockchainOptions[1]); // Default to Polygon
  const [form, setForm] = useState({
    name: "",
    description: "",
    externalUrl: "",
    collection: "",
    attributes: []
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newAttribute, setNewAttribute] = useState({ trait: "", value: "" });
  const router = useRouter();

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUploadedImage(files[0]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addAttribute = () => {
    if (newAttribute.trait && newAttribute.value) {
      setForm(prev => ({
        ...prev,
        attributes: [...prev.attributes, { ...newAttribute }]
      }));
      setNewAttribute({ trait: "", value: "" });
    }
  };

  const removeAttribute = (index) => {
    setForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleMint = () => {
    // Here you would integrate with actual blockchain minting
    console.log("Minting NFT on", selectedBlockchain.name, form);
    // Navigate to the minted NFT
    router.push("/web3/1");
  };

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* MRKD.Art Partnership Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-sm text-muted-foreground">In Partnership With MRKD.Art</h2>
        <img src="/vault/MRKD.png" alt="MRKD" className="w-16 mb-4" />
      </div>

      {/* Back Button */}
      <Button variant="outline" className="mb-6" onClick={() => router.push("/web3")}>
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Web3
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-3xl font-bold mb-2">Mint New NFT</div>
        <p className="text-muted-foreground mb-8">Create and mint your digital artwork on the blockchain</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Upload Area */}
          <div className="flex-1 lg:max-w-md">
            <Card className="bg-card border border-dashed border-border rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  NFT Image
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {uploadedImage ? (
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-4">
                    <img 
                      src={URL.createObjectURL(uploadedImage)} 
                      alt="Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-lg border-dashed border-muted-foreground/25 flex flex-col items-center justify-center mb-4">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <span className="font-semibold text-center text-lg mb-2">Upload NFT Image</span>
                    <span className="text-xs text-muted-foreground text-center">Drag and drop your image here, or click to browse</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleInput} 
                  className="hidden" 
                  id="nft-image-upload" 
                />
                <Button variant="outline" className="w-full" asChild>
                  <label htmlFor="nft-image-upload">
                    {uploadedImage ? "Change Image" : "Browse Files"}
                  </label>
                </Button>
                
                <div className="text-xs text-muted-foreground mt-4 text-left w-full">
                  <div className="font-medium mb-2">Image Requirements</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>High resolution images (minimum 1200x1200px)</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Accepted formats: JPG, PNG, GIF, WebP</li>
                    <li>Square aspect ratio recommended</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>NFT Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input 
                      name="name"
                      placeholder="Enter NFT name" 
                      value={form.name}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection</label>
                    <Input 
                      name="collection"
                      placeholder="Enter collection name" 
                      value={form.collection}
                      onChange={handleInput}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    name="description"
                    className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                    placeholder="Describe your NFT..."
                    value={form.description}
                    onChange={handleInput}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">External URL</label>
                  <Input 
                    name="externalUrl"
                    placeholder="https://your-website.com/nft" 
                    value={form.externalUrl}
                    onChange={handleInput}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Selection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Choose Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {blockchainOptions.map((blockchain) => (
                    <div
                      key={blockchain.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedBlockchain.name === blockchain.name
                          ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/20'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setSelectedBlockchain(blockchain)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img src={blockchain.logo} alt={blockchain.name} className="w-8 h-8" />
                        <span className="font-medium">{blockchain.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Gas: {blockchain.gas}</div>
                        <div>Speed: {blockchain.speed}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Attributes (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add new attribute */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Trait (e.g., Background)"
                      value={newAttribute.trait}
                      onChange={(e) => setNewAttribute(prev => ({ ...prev, trait: e.target.value }))}
                    />
                    <Input
                      placeholder="Value (e.g., Cosmic)"
                      value={newAttribute.value}
                      onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                    />
                    <Button size="sm" onClick={addAttribute}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Display attributes */}
                  {form.attributes.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {form.attributes.map((attr, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground">{attr.trait}</div>
                            <div className="font-medium">{attr.value}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttribute(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mint Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4" />
            <span>Estimated gas fee: {selectedBlockchain.gas === "Low" ? "~$2-5" : selectedBlockchain.gas === "High" ? "~$20-50" : "~$5-15"}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/web3")}>
              Cancel
            </Button>
            <Button 
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
              onClick={handleMint}
              disabled={!form.name || !uploadedImage}
            >
              <Zap className="w-4 h-4 mr-2" />
              Mint NFT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMinting; 