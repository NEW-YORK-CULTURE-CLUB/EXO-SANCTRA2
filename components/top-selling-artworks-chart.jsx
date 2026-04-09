// components/top-selling-artworks-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TopSellingArtworksChart({ artworks }) {
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
      <CardHeader className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Top Selling Artworks</CardTitle>
        <CardDescription className="text-sm">
          Revenue by artwork
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={artworks}
              margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 300000]}
                ticks={[0, 100000, 200000, 300000]}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="#1f2937"
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