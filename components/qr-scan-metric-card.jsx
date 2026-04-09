// components/qr-scan-metric-card.jsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode } from "lucide-react";

export function QRScanMetricCard({ metric }) {
  return (
    <Card className="p-4 lg:p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 group">
      {/* <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
        <div className="flex gap-1">
          <QrCode className="h-4 w-4 text-blue-500" />
        </div>
      </div> */}
      
      <div className="space-y-4 ">
        <div className="flex items-center justify-between">
        <div >
          <p className="text-sm font-medium text-muted-foreground mb-2">{metric.period}</p>
          <h3 className="text-2xl font-bold">{metric.value}</h3>
        </div>
          <QrCode className="h-8 w-8 text-blue-500" />

        </div>
        
        <div className="space-y-2">
          <Progress 
            value={metric.progress} 
            className="h-2"
            indicatorClassName="bg-green-500"
          />
          <p className="text-xs text-muted-foreground text-right">{metric.comparison}</p>
        </div>
      </div>
    </Card>
  );
}