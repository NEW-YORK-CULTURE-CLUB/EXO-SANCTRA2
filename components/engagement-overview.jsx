// components/engagement-overview.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function EngagementOverview({ data }) {
  const chartData = [
    { name: "Artwork Views", value: data.artworkViews, color: "#000" },
    { name: "Digital Floor Views", value: data.digitalFloorViews, color: "#222" },
    { name: "QR Scans", value: data.qrScans, color: "#333" }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toLocaleString()} ({((payload[0].value / data.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ viewBox }) => {
    if (!viewBox || typeof viewBox.cx === 'undefined' || typeof viewBox.cy === 'undefined') {
      return null;
    }
    
    const { cx, cy } = viewBox;
    
    // Ensure we have valid coordinates
    if (cx === 0 || cy === 0) {
      return null;
    }
    
    return (
      <g>
        <text 
          x={cx} 
          y={cy} 
          fill="#1f2937" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="18"
          fontWeight="700"
          style={{ pointerEvents: 'none' }}
        >
          {data.total.toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardTitle className="text-lg lg:text-xl">Engagement Overview</CardTitle>
        <CardDescription className="text-sm">Distribution of different types of engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius="75%"
                innerRadius="55%"
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend 
                verticalAlign="bottom" 
                height={30}
                formatter={(value, entry) => (
                  <span className="text-xs">
                    {value}: {entry.value.toLocaleString()}
                  </span>
                )}
              /> */}
            </PieChart>
          </ResponsiveContainer>
          
          {/* Fallback center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {data.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 ">
              Total Engagement
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}