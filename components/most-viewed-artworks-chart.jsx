// components/most-viewed-artworks-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MostViewedArtworksChart({ artworks }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use dynamic colors based on theme
  const gridColor = mounted && theme === 'dark' ? '#374151' : '#f0f0f0';
  const textColor = mounted && theme === 'dark' ? '#d1d5db' : '#374151';
  const barColor = mounted && theme === 'dark' ? '#6b7280' : '#1f2937';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Views: <span className="font-bold text-foreground">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-800">
        <CardTitle className="text-lg lg:text-xl">Most Viewed Artworks</CardTitle>
        <CardDescription className="text-sm">
          Comparison of views across different artworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={artworks}
              margin={{ top: 20, right: 10, left: -10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 12, fill: textColor }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: textColor }}
                domain={[0, 2800]}
                ticks={[0, 650, 1300, 1950, 2600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="views" 
                fill={barColor}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}