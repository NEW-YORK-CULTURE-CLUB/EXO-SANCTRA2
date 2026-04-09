"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Brush, Star, Shirt, Package, Image } from "lucide-react";
import { useRouter } from "next/navigation";

const itemTypes = [
  {
    id: "artwork",
    title: "Artwork",
    description: "A unique creative work produced by an artist, intended primarily for aesthetic, conceptual, or cultural expression.",
    examples: "paintings, sculptures, photographs, installations",
    icon: Image,
    href: "/inventory/new/artwork"
  },
  {
    id: "collectible",
    title: "Collectible",
    description: "An item acquired and kept for its rarity, desirability, or investment value, often part of a set or series.",
    examples: "trading cards, limited-edition toys, vintage watches",
    icon: Star,
    href: "/inventory/new/collectible"
  },
  {
    id: "object",
    title: "Object",
    description: "A physical item of interest that does not fit neatly into the categories of artwork, collectible, or memorabilia, but still holds value for documentation, display, or trade.",
    examples: "antique tools, vintage machinery, historical artifacts",
    icon: Package,
    href: "/inventory/new/object"
  },
  {
    id: "memorabilia",
    title: "Memorabilia",
    description: "An object kept or collected because of its association with a person, place, event or era of historical or emotional significance.",
    examples: "signed jerseys, concert tickets, championship rings",
    icon: Shirt,
    href: "/inventory/new/memorabilia"
  },
];

const AddItemTypeSelection = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground -mt-5">
      {/* Back Button */}
      <Button variant="outline" className="mb-4" onClick={() => router.push("/inventory")}> 
        <ChevronLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Add New Item</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Select the type of item you'd like to add to your inventory. Each category has specific fields and requirements to properly catalog your items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itemTypes.map((itemType) => {
            const IconComponent = itemType.icon;
            return (
              <Card 
                key={itemType.id}
                className="cursor-pointer transition-all duration-200 shadow-lg hover:scale-[1.02] hover:shadow-xl border-2 border-border hover:border-primary/50"
                onClick={() => router.push(itemType.href)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted border-2 border-border">
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground">{itemType.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {itemType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Examples:</p>
                    <p className="text-sm text-foreground">{itemType.examples}</p>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary"
                    variant="default"
                  >
                    Select {itemType.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Each item type has specific required and optional fields to ensure proper cataloging</p>
              <p>• All items support document uploads for Certificate of Authenticity, Provenance, Insurance & Miscellaneous</p>
              <p>• Required fields are marked with an asterisk (*) and must be completed before saving</p>
              <p>• You can edit item details after creation from the main inventory page</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemTypeSelection; 