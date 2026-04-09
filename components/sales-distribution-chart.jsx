// components/sales-distribution-chart.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function SalesDistributionChart({ data }) {
  const COLORS = ['#1f2937', '#374151', '#6b7280', '#9ca3af'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ${payload[0].value.toLocaleString()} ({payload[0].payload.percentage}%)
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
          ${data.total.toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-800 mb-4">
        <CardTitle className="text-lg lg:text-xl">Sales Distribution</CardTitle>
        <CardDescription className="text-sm">
          Revenue distribution by artwork
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] lg:h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categories}
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
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Fallback center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
              ${data.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Revenue
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}