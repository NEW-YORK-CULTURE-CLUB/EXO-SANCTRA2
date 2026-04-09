// components/sales-metric-card.jsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CheckSquare, TrendingUp, Calendar } from "lucide-react";

export function SalesMetricCard({ metric }) {
  const getIcon = (iconName) => {
    const icons = {
      dollar: DollarSign,
      check: CheckSquare,
      trending: TrendingUp,
      calendar: Calendar
    };
    return icons[iconName] || DollarSign;
  };

  const Icon = getIcon(metric.icon);

  return (
    <Card className={`p-4 lg:p-6 ${metric.bgColor} ${metric.borderColor} border hover:shadow-lg transition-all duration-300 bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-800`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{metric.title}</p>
            <h3 className="text-2xl font-bold">{metric.value}</h3>
            {metric.subtitle && (
              <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
            )}
          </div>
          <Icon className="h-5 w-5 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={metric.progress} 
            className="h-2"
            indicatorClassName="bg-green-500"
          />
          {metric.comparison && (
            <p className="text-xs text-muted-foreground text-right">{metric.comparison}</p>
          )}
        </div>
      </div>
    </Card>
  );
}