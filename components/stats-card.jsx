// components/stats-card.jsx
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Eye, Users, QrCode } from "lucide-react";

export function StatsCard({ title, value, change, changeText, trend }) {
  const isPositive = trend === "up";
  
  // Icon mapping based on title
  const getIcon = (title) => {
    switch(title) {
      case "Total Revenue":
        return DollarSign;
      case "QR Scans":
        return QrCode;
      case "Digital Floor Views":
        return Eye;
      case "Daily Visitors":
        return Users;
      default:
        return TrendingUp;
    }
  };
  
  const Icon = getIcon(title);

  return (
    <Card className="hover:shadow-sm transition-shadow duration-200 border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-2">
            <p className="text-sm">{title}</p>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
              <p className="text-xs text-muted-foreground">
                <span className={`${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {change}
                </span>
                <span className="ml-1">{changeText}</span>
              </p>
            </div>
          </div>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}