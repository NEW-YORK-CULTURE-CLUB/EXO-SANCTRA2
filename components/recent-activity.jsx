// components/recent-activity.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, CalendarDays, Gavel } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { HiMiniArrowUpRight } from "react-icons/hi2";

const activityIcons = {
  bid: <DollarSign className="h-4 w-4 text-blue-500" />,
  auction_start: <CalendarDays className="h-4 w-4 text-green-500" />,
  reserve_met: <Gavel className="h-4 w-4 text-muted-foreground" />,
  default: <Gavel className="h-4 w-4 text-muted-foreground" />,
};

export function RecentActivity({ activities }) {
  return (
    <Card className="border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Latest events from auctions and gallery operations
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 last:pb-0"
              >
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
                  {activityIcons[activity.type] || activityIcons.default}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center pt-1">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
             <Link href="/auction-management">
               <Button variant="ghost" className="w-full group mt-4" size="sm">
                 View All Activity
                 <HiMiniArrowUpRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
               </Button>
             </Link>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}