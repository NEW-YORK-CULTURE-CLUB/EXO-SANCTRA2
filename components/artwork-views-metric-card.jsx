// components/artwork-views-metric-card.jsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";

export function ArtworkViewsMetricCard({ metric }) {
  return (
    <Card className="p-4 lg:p-6 bg-cyan-50/50 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-800 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</p>
            <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
          </div>
          <Eye className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={metric.progress} 
            className="h-2"
            indicatorClassName="bg-cyan-600 dark:bg-cyan-400"
          />
          <p className="text-xs text-muted-foreground text-right">{metric.comparison}</p>
        </div>
      </div>
    </Card>
  );
}