"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  FileText, 
  UserPlus, 
  QrCode, 
  Gavel, 
  BarChart3 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: FileText,
      label: "Add New Item",
      onClick: () => console.log("Add New Item"),
      link: "/inventory/new"
    },
    {
      icon: UserPlus,
      label: "Add New Artist",
      onClick: () => console.log("Add New Artist"),
      link: "/artist-profiles/new"
    },
    {
      icon: QrCode,
      label: "Generate QR Code",
      onClick: () => console.log("Generate QR Code"),
      link: "/digital-floor/new"
    },
    {
      icon: Gavel,
      label: "Create Auction",
      onClick: () => console.log("Create Auction"),
      link: "/auction-management/new"
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      onClick: () => console.log("View Analytics"),
      link: "/gallery-analytics"
    }
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </CardHeader>
      <CardContent>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} href={action.link} className="block mb-2 last:mb-0">
              <Button
                variant="outline" 
                className="w-full justify-start h-auto py-3 px-3 hover:bg-muted/50"
                onClick={action.onClick}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="text-sm font-normal">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}