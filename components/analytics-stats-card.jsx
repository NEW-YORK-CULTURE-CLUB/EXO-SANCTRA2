// components/analytics-stats-card.jsx
import { Card } from "@/components/ui/card";
import { ScanLine, Eye, Globe, DollarSign, QrCode } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AnalyticsStatsCard({ stat }) {
  const getIcon = (iconName) => {
    const icons = {
      scan: QrCode,
      eye: Eye,
      globe: Globe,
      dollar: DollarSign
    };
    return icons[iconName] || Eye;
  };

  const getColorClass = (color) => {
    const colors = {
      blue: "bg-blue-500",
      cyan: "bg-cyan-500",
      purple: "bg-purple-500",
      green: "bg-green-500"
    };
    return colors[color] || "bg-gray-500";
  };

  const getBorderColorClass = (color) => {
    const colors = {
      blue: "border-l-blue-500",
      cyan: "border-l-cyan-500",
      purple: "border-l-purple-500",
      green: "border-l-green-500"
    };
    return colors[color] || "border-l-gray-500";
  };

  const Icon = getIcon(stat.icon);

  return (
    <Card className={`p-4 lg:p-6 border-l-4 ${getBorderColorClass(stat.color)} hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs lg:text-sm text-muted-foreground">{stat.title}</p>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">{stat.subtitle}</p>
          </div>
              <Icon className="h-4 w-4 lg:h-5 lg:w-5  text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <Progress 
            value={stat.progress} 
            className="h-2"
            indicatorClassName={getColorClass(stat.color)}
          />
        </div>
      </div>
    </Card>
  );
}