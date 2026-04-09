"use client";
import Image from "next/image";
import { ArrowRight, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentActivity } from "@/components/recent-activity";
import {
  upcomingAuctions,
  liveAuctions,
  completedAuctions,
  recentActivities,
} from "@/data/auctionManagementData";
import { useRouter } from "next/navigation";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AuctionCard = ({ auction }) => {
  const router = useRouter();
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer duration-300" onClick={() => router.push(`/auction-management/${auction.id}`)}>
      <CardHeader className="p-0">
        <Image
          alt={auction.title}
          className="aspect-[1.5] object-cover rounded-t-lg"
          height="300"
          src={auction.image}
          width="400"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between gap-2 mb-2">
          <Badge 
            variant={
              auction.status === 'Live' ? 'success' : 
              auction.status === 'Upcoming' ? 'default' : 'secondary'
            }
            className="text-xs"
          >
            {auction.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {auction.time}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold">{auction.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {auction.artwork}
        </CardDescription>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Starting Bid</p>
            <p className="font-semibold">{formatCurrency(auction.startingBid)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Current Bid</p>
            <p className="font-semibold">
              {auction.currentBid ? formatCurrency(auction.currentBid) : "No bids yet"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{auction.bids} bids</p>
        <Button variant="ghost" size="sm" className="group" onClick={() => router.push(`/auction-management/${auction.id}`)}>
          View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AuctionManagementPage() {
  const router = useRouter();
  return (
    <div className="flex-1 space-y-4 -mt-5">
      <div className="lg:flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-muted-foreground">Auction </span>
            <span className="text-foreground">Management</span>
          </h2>
          <p className="text-muted-foreground">
            Manage your gallery's art auctions and track bidding activity.
          </p>
        </div>
        <div className="flex items-center lg:pt-0 pt-2 space-x-2">
          <Button onClick={() => router.push('/auction-management/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Auction
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Tabs defaultValue="upcoming">
            <TabsList className="grid grid-cols-3 md:inline-flex mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live Now</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Upcoming Auctions</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {upcomingAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="live">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight">Live Auctions</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {liveAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="past">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight">Completed Auctions</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {completedAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full lg:w-72">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

