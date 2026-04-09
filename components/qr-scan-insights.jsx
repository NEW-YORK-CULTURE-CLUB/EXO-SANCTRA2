// components/qr-scan-insights.jsx
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

export function QRScanInsights({ insights }) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Average Daily Scans */}
      <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 transition-all duration-300 group">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:bg-blue-500 dark:group-hover:bg-blue-300 transition-colors"></div>
            <h3 className="font-semibold text-base text-blue-900 dark:text-blue-100">Average Daily Scans</h3>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            {insights.averageDailyScans.value}
          </p>
          <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
            {insights.averageDailyScans.description}
          </p>
        </div>
      </Card>

      {/* Peak Day */}
      <Card className="p-6 bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-100 dark:border-cyan-800/50 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/5 transition-all duration-300 group">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-400 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-300 transition-colors"></div>
            <h3 className="font-semibold text-base text-cyan-900 dark:text-cyan-100">Peak Day</h3>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
            {insights.peakDay.value}
          </p>
          <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70">
            {insights.peakDay.description} {insights.peakDay.date}
          </p>
        </div>
      </Card>

      {/* Growth Rate */}
      <Card className="p-6 bg-purple-50/50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-800/50 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-400/5 transition-all duration-300 group">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 group-hover:bg-purple-500 dark:group-hover:bg-purple-300 transition-colors"></div>
            <h3 className="font-semibold text-base text-purple-900 dark:text-purple-100">Growth Rate</h3>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            {insights.growthRate.value}
          </p>
          <p className="text-sm text-purple-700/70 dark:text-purple-300/70">
            {insights.growthRate.description}
          </p>
        </div>
      </Card>
    </div>
  );
}