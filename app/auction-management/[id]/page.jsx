"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Gavel, CalendarDays } from "lucide-react";
import { upcomingAuctions, liveAuctions, completedAuctions, recentActivities } from "@/data/auctionManagementData";
import { RecentActivity } from "@/components/recent-activity";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// Mock bid and activity data for demo (replace with real data as needed)
const auctionBids = {
  1: [], // Modern Icons (no bids)
  2: [], // Surrealist Visions (no bids)
  3: [ // Abstract Expressions
    { name: "Sophia Reynolds", amount: 35794, time: "2 days ago", status: "Winning" },
    { name: "Alexander Kim", amount: 35041, time: "2 days ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 33956, time: "2 days ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 32933, time: "2 days ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 32148, time: "2 days ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 31374, time: "2 days ago", status: "Outbid" },
  ],
  4: [ // Renaissance Treasures
    { name: "Sophia Reynolds", amount: 59169, time: "7 days ago", status: "Winning" },
    { name: "Olivia Johnson", amount: 57837, time: "7 days ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 56397, time: "7 days ago", status: "Outbid" },
    { name: "Marcus Chen", amount: 55867, time: "7 days ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 55047, time: "7 days ago", status: "Outbid" },
    { name: "Sophia Reynolds", amount: 53922, time: "7 days ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 52897, time: "7 days ago", status: "Outbid" },
    { name: "Isabella Martínez", amount: 52208, time: "7 days ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 51008, time: "7 days ago", status: "Outbid" },
  ],
  5: [ // Contemporary Masterpieces
    { name: "Olivia Johnson", amount: 15974, time: "about 14 hours ago", status: "Winning" },
    { name: "Isabella Martínez", amount: 15313, time: "about 15 hours ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 14021, time: "about 16 hours ago", status: "Outbid" },
    { name: "Isabella Martínez", amount: 12938, time: "about 17 hours ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 12296, time: "about 18 hours ago", status: "Outbid" },
    { name: "Alexander Kim", amount: 11228, time: "about 19 hours ago", status: "Outbid" },
    { name: "Marcus Chen", amount: 9831, time: "about 20 hours ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 8332, time: "about 21 hours ago", status: "Outbid" },
    { name: "Sophia Reynolds", amount: 7792, time: "about 22 hours ago", status: "Outbid" },
    { name: "Isabella Martínez", amount: 7005, time: "about 23 hours ago", status: "Outbid" },
    { name: "Olivia Johnson", amount: 5738, time: "1 day ago", status: "Outbid" },
  ],
};

const auctionDetails = [
  // Merge all auctions for lookup by id
  ...upcomingAuctions,
  ...liveAuctions,
  ...completedAuctions,
  // Add more as needed
];

const auctionMeta = {
  1: { reservePrice: 25000, period: { start: "Jun 26, 2025, 4:08 AM", end: "Jul 2, 2025, 4:08 AM" }, description: "An iconic piece from Andy Warhol's famous Campbell's Soup Cans series, representing a pivotal moment in pop art history." },
  2: { reservePrice: 60000, period: { start: "Jun 26, 2025, 4:08 AM", end: "Jul 2, 2025, 4:08 AM" }, description: "One of Salvador Dalí's most recognizable works, featuring melting clocks in a dreamlike landscape that challenges perceptions of time and reality." },
  3: { reservePrice: 50000, period: { start: "Jun 23, 2025, 4:09 AM", end: "Jul 2, 2025, 4:09 AM" }, description: "A stunning example of Jackson Pollock's revolutionary drip painting technique, embodying the spontaneous energy of abstract expressionism." },
  4: { reservePrice: 75000, period: { start: "Jun 18, 2025, 4:09 AM", end: "Jun 24, 2025, 4:09 AM" }, description: "A remarkable study of human proportions by the Renaissance master Leonardo Da Vinci, showcasing his unparalleled understanding of anatomy and art." },
  5: { reservePrice: 10000, period: { start: "Jun 24, 2025, 4:09 AM", end: "Jun 26, 2025, 4:09 AM" }, description: "A rare opportunity to acquire a vibrant piece by Keith Haring, showcasing his iconic style and bold colors." },
};

const formatCurrency = (amount) => {
  if (amount == null) return "No bids yet";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AuctionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const auctionId = Number(id);
  const auction = auctionDetails.find((a) => a.id === auctionId);
  const meta = auctionMeta[auctionId];
  const bids = auctionBids[auctionId] || [];

  if (!auction || !meta) return <div className="p-8 text-foreground">Auction not found.</div>;

  // Determine status badge color
  const statusVariant = auction.status === "Live" ? "success" : auction.status === "Upcoming" ? "default" : "secondary";

  return (
    <div className="min-h-screen -mt-5 bg-background">
        <div className="flex items-center mb-4">
          <Button variant="outline" className="" onClick={() => router.push('/auction-management')}> 
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Auctions
          </Button>
          <Badge variant={statusVariant} className="text-xs ml-4">{auction.status}</Badge>
        </div>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 max-w-3xl mx-auto">
        <div className="border border-border rounded-lg shadow-sm bg-card p-0 md:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-96 md:flex-shrink-0">
              <div className="relative w-full aspect-square bg-muted/20 rounded-lg overflow-hidden">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={statusVariant} className="text-xs">{auction.status}</Badge>
                {auction.status !== 'Completed' && (
                  <Badge variant="outline" className="text-xs">{auction.time}</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold leading-tight mb-1 text-foreground">{auction.title}</h1>
              <div className="text-muted-foreground text-base mb-4">{auction.artwork}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Current Bid</div>
                  <div className="font-bold text-lg text-foreground">{bids.length > 0 ? formatCurrency(bids[0].amount) : formatCurrency(auction.currentBid)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Starting Bid</div>
                  <div className="font-bold text-lg text-foreground">{formatCurrency(auction.startingBid)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Reserve Price</div>
                  <div className="font-bold text-lg text-foreground">{formatCurrency(meta.reservePrice)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-medium text-base text-foreground">{auction.status === 'Completed' ? 'Ended' : auction.time}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Bidders</div>
                  <div className="font-medium text-base text-foreground">{bids.length > 0 ? new Set(bids.map(b => b.name)).size : auction.bids}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold mb-1 text-foreground">Description</div>
                <div className="text-base text-muted-foreground">{meta.description}</div>
              </div>
              <div className="mb-4">
                <Card className="bg-muted/50 border-border">
                  <CardContent className="flex flex-col md:flex-row items-center justify-between p-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Auction Period</div>
                      <div className="text-base text-foreground">{meta.period.start} - {meta.period.end}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span className="text-muted-foreground text-sm">{bids.length > 0 ? new Set(bids.map(b => b.name)).size : auction.bids}</span>
                      <span className="text-xs text-muted-foreground">bidders</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* Bid History */}
        <div className="mt-8">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="font-semibold text-lg mb-4 text-foreground">Bid History</div>
              {bids.length === 0 ? (
                <div className="text-muted-foreground">No bids yet</div>
              ) : (
                <div className="divide-y divide-border">
                  {bids.map((bid, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-full bg-muted w-8 h-8 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">{bid.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">{bid.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end min-w-[80px]">
                        <div className={`font-semibold text-base ${bid.status === 'Winning' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{formatCurrency(bid.amount)}</div>
                        <div className={`text-xs mt-0.5 ${bid.status === 'Winning' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{bid.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Recent Activity Sidebar */}
      <div className="w-full lg:w-80">
        <Card className="border-border bg-card">
            <div className="space-y-3">
              <RecentActivity activities={recentActivities} />
            </div>
        </Card>
      </div>
    </div>
    </div>
  );
} 