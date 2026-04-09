// components/average-time-spent-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AverageTimeSpentChart({ data }) {
  const chartData = (data?.labels || []).map((label, index) => ({
    date: label,
    time: (data?.time || [])[index] || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Time: <span className="font-bold text-foreground">{payload[0].value}m 0s</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Average Time Spent</CardTitle>
        <CardDescription className="text-sm">
          Average time visitors spend on the digital floor
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
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
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
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(value) => `${value}m 0s`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="time"
                stroke="#c084fc"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTime)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}