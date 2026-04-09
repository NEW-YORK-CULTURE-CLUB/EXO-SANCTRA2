// components/digital-floor-metric-card.jsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Users, Clock } from "lucide-react";

export function DigitalFloorMetricCard({ metric }) {
  const getIcon = (iconName) => {
    const icons = {
      globe: Globe,
      users: Users,
      clock: Clock
    };
    return icons[iconName] || Globe;
  };

  const Icon = getIcon(metric.icon);

  return (
    <Card className="p-4 lg:p-6 hover:shadow-lg transition-all duration-300 bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-800">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <h3 className="text-2xl font-bold">{metric.value}</h3>
          </div>
          <Icon className="h-5 w-5 text-purple-600" />
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