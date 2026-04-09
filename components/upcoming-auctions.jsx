// components/upcoming-auctions.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { HiMiniArrowUpRight } from "react-icons/hi2";

export function UpcomingAuctions({ auctions }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Upcoming Auctions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Scheduled auctions for the next 30 days
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className=" rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex  justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">{auction.title}</h3>
                </div>
              </div>
                <Badge variant="outline" className="text-xs">
                  {auction.status}
                </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{auction.startDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{auction.endDate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-medium">{auction.items}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Starting Bid</p>
                <p className="font-medium">{auction.startingBid}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2">
          <Link href="/auction-management/new"> 
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Auction
            </Button>
          </Link>
          <Link href="/auction-management">
            <Button variant="ghost" className="flex-1 sm:flex-initial group">
              View All Auctions
              <HiMiniArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}