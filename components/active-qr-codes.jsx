// components/active-qr-codes.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, QrCode } from "lucide-react";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import Link from "next/link";

export function ActiveQRCodes({ qrCodes }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <h2 className="text-xl font-semibold">Active QR Codes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Currently active QR codes in the gallery
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrCodes.map((qr) => (
          <div
            key={qr.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <QrCode className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">QR Code: {qr.code}</h3>
                  <Badge 
                    variant={"default"} 
                    className="text-xs"
                  >
                    {qr.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Location: {qr.location}</p>
              </div>
            </div>
            
            <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 text-sm sm:text-right">
              <div>
                <p className="font-semibold">{qr.scans} scans</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last updated: {qr.lastUpdated}</p>
              </div>
            </div>
          </div>
        ))}
        <Link href="/digital-floor">  
        <Button variant="ghost" className="w-full group mt-4">
          Manage Digital Floor
          <HiMiniArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        </Link>
      </CardContent>
    </Card>
  );
}