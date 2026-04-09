// components/qr-scan-breakdown.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function QRScanBreakdown({ data }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardTitle className="text-lg lg:text-xl">QR Scan Breakdown</CardTitle>
        <CardDescription className="text-sm">QR scan metrics for different time periods</CardDescription>
      </CardHeader>
      <CardContent className="mt-10">
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.period}</p>
                <p className="text-xl lg:text-2xl font-bold">{item.value}</p>
              </div>
              <Progress 
                value={item.progress} 
                className="h-2"
                indicatorClassName="bg-green-500"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}