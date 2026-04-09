// components/artwork-views-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ArtworkViewsChart({ data }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data.labels.map((label, index) => ({
    date: label,
    views: data.data[index]
  }));

  // Use dynamic colors based on theme
  const gridColor = mounted && theme === 'dark' ? '#374151' : '#f0f0f0';
  const textColor = mounted && theme === 'dark' ? '#d1d5db' : '#374151';
  const strokeColor = mounted && theme === 'dark' ? '#22d3ee' : '#06b6d4';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            views: <span className="font-bold text-foreground">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Artwork Views Over Time</CardTitle>
        <CardDescription className="text-sm">
          Daily view counts from {data.labels[0]} to {data.labels[data.labels.length - 1]}
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
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: textColor }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={4}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: textColor }}
                domain={[0, 600]}
                ticks={[0, 150, 300, 450, 600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}