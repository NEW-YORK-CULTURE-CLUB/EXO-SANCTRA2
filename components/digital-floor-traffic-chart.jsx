// components/digital-floor-traffic-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

export function DigitalFloorTrafficChart({ data }) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    views: true,
    uniqueVisitors: true
  });

  const chartData = (data?.labels || []).map((label, index) => ({
    date: label,
    views: (data?.views || [])[index] || 0,
    uniqueVisitors: (data?.uniqueVisitors || [])[index] || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name === 'views' ? 'Views' : 'Unique Visitors'}: 
              <span className="font-bold text-foreground ml-1">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          className={`flex items-center gap-2 text-sm ${selectedMetrics.views ? 'opacity-100' : 'opacity-50'}`}
          onClick={() => setSelectedMetrics(prev => ({ ...prev, views: !prev.views }))}
        >
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          Views
        </button>
        <button
          className={`flex items-center gap-2 text-sm ${selectedMetrics.uniqueVisitors ? 'opacity-100' : 'opacity-50'}`}
          onClick={() => setSelectedMetrics(prev => ({ ...prev, uniqueVisitors: !prev.uniqueVisitors }))}
        >
          <span className="w-3 h-3 rounded-full bg-purple-300"></span>
          Unique Visitors
        </button>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Digital Floor Traffic</CardTitle>
        <CardDescription className="text-sm">
          Views and unique visitors over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={(data?.labels?.length || 0) > 10 ? 3 : 0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 260]}
                ticks={[0, 65, 130, 195, 260]}
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedMetrics.views && (
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  animationDuration={1000}
                />
              )}
              {selectedMetrics.uniqueVisitors && (
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#c084fc"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  animationDuration={1000}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend />
      </CardContent>
    </Card>
  );
}