// components/top-bidders.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TopBidders({ bidders }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Top Bidders</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Most active auction participants
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bidders.map((bidder) => (
            <div
              key={bidder.id}
              className="flex items-center gap-4 py-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {bidder.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{bidder.name}</p>
                <p className="text-xs text-muted-foreground truncate">{bidder.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{bidder.amount}</p>
                <p className="text-xs text-muted-foreground">{bidder.bids}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}