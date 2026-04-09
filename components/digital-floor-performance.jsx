// components/digital-floor-performance.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, TrendingUp, Clock, MessageSquare } from "lucide-react";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import Link from "next/link";

export function DigitalFloorPerformance({ performance }) {
  const metrics = [
    {
      title: "Total Views",
      value: performance.totalViews.value,
      change: performance.totalViews.change,
      changeText: performance.totalViews.changeText,
      icon: Eye
    },
    {
      title: "Conversion Rate",
      value: performance.conversionRate.value,
      change: performance.conversionRate.change,
      changeText: performance.conversionRate.changeText,
      icon: TrendingUp
    },
    {
      title: "Avg. Time on Page",
      value: performance.avgTimeOnPage.value,
      change: performance.avgTimeOnPage.change,
      changeText: performance.avgTimeOnPage.changeText,
      icon: Clock
    },
    {
      title: "Information Requests",
      value: performance.informationRequests.value,
      change: performance.informationRequests.change,
      changeText: performance.informationRequests.changeText,
      icon: MessageSquare
    }
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Digital Floor Performance</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Key metrics for your online gallery presence
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.change.startsWith("+");
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <p className="text-xs text-muted-foreground">
                    <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </span>
                    <span className="ml-1">{metric.changeText}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
       
        <Link href="/gallery-analytics">
            <Button variant="ghost" className="group">
            View Detailed Analytics
              <HiMiniArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
      </CardContent>
    </Card>
  );
}