"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const artworkOptions = [
  { label: "Vibrant Horizon by Keith Haring", value: "vibrant-horizon" },
  { label: "Campbell's Soup Can by Andy Warhol", value: "campbells-soup" },
  { label: "Study of Proportions by Leonardo Da Vinci", value: "study-proportions" },
  { label: "Convergence by Jackson Pollock", value: "convergence" },
  { label: "The Persistence of Memory by Salvador Dalí", value: "persistence-memory" },
  { label: "Starry Night by Vincent van Gogh", value: "starry-night" },
  { label: "Girl with a Pearl Earring by Johannes Vermeer", value: "girl-pearl-earring" },
];

export default function CreateAuctionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artwork, setArtwork] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // For preview
  const selectedArtwork = artworkOptions.find(opt => opt.value === artwork);

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/auction-management")}> <ChevronLeft className="w-4 h-4 mr-2" /> Back to Auctions </Button>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-1 -mt-3">Create New Auction</h2>
          <p className="text-muted-foreground text-base">Set up a new auction for your gallery's artwork.</p>
        </div>

        {/* Auction Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Auction Details</CardTitle>
            <CardDescription>Enter the basic information about your auction.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 w-full gap-6">
              <div className="space-y-4">
                <div>
                  <div className="mb-1 font-medium">Auction Title</div>
                  <Input placeholder="Summer Masterpieces" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                  <div className="mb-1 font-medium">Select Artwork</div>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={artwork}
                    onChange={e => setArtwork(e.target.value)}
                  >
                    <option value="">Select an artwork</option>
                    {artworkOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 font-medium">Starting Bid ($)</div>
                    <Input type="number" placeholder="5000" value={startingBid} onChange={e => setStartingBid(e.target.value)} />
                  </div>
                  <div>
                    <div className="mb-1 font-medium">Reserve Price ($)</div>
                    <Input type="number" placeholder="10000" value={reservePrice} onChange={e => setReservePrice(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 font-medium">Start Date</div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="pr-10"
                      />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 font-medium">End Date</div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="pr-10"
                      />
                      <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium">Description</div>
                  <textarea
                    className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    placeholder="Provide a detailed description of the auction..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center justify-center min-h-[260px] bg-muted rounded-md mb-6">
                {artwork ? (
                  <span className="text-base text-muted-foreground">{selectedArtwork?.label}</span>
                ) : (
                  <span className="text-muted-foreground">Select an artwork to preview</span>
                )}
              </div>
              <div className="border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-lg">{title || "Auction Title"}</div>
                  <div className="text-muted-foreground text-sm mt-1">
                    {description ? description : "Auction description will appear here..."}
                  </div>
                </div>
                <div className="flex gap-8 mt-4 md:mt-0">
                  <div>
                    <div className="text-muted-foreground text-xs">Starting Bid</div>
                    <div className="font-semibold">${startingBid || 0}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Reserve Price</div>
                    <div className="font-semibold">${reservePrice || 0}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/auction-management")}>Cancel</Button>
          <Button variant="default">Create Auction</Button>
        </div>
      </div>
    </div>
  );
} 