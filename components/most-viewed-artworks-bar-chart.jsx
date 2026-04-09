// components/most-viewed-artworks-bar-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MostViewedArtworksBarChart({ artworks }) {
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
      <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Most Viewed Artworks</CardTitle>
        <CardDescription className="text-sm">
          Top artworks by view count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={artworks}
              margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={[0, 1600]}
                ticks={[0, 400, 800, 1200, 1600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="views" 
                fill="hsl(var(--primary))"
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