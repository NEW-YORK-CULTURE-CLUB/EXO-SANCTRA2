// components/top-artists-revenue-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TopArtistsRevenueChart({ artists }) {
  const formatYAxis = (value) => {
    if (value === 0) return "$0";
    return `$${value / 1000}0,000`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Revenue: <span className="font-bold text-foreground">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Top Artists by Revenue</CardTitle>
        <CardDescription className="text-sm">
          Artists generating the most sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={artists}
              margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="artist" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={[0, 400000]}
                ticks={[0, 100000, 200000, 300000, 400000]}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
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