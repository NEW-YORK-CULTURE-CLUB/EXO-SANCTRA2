"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Share2, Printer, Download, Eye, EyeOff } from "lucide-react";

export function ViewDocumentModal({ isOpen, onOpenChange, document }) {
  const [isPublic, setIsPublic] = useState(false);

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{document.name || "Exhibition History"}</DialogTitle>
          <DialogDescription>
            Document for &quot;{document.artwork}&quot; by {document.artist}.
            <br />
            History Added: {document.fileDate || "12/06/2022"} Size: {document.fileSize || "1.7 MB"}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Document preview placeholder</p>
            </div>
        </div>
        <DialogFooter className="justify-between sm:justify-between">
          <div>
            <Button variant="outline" onClick={() => setIsPublic(!isPublic)}>
              {isPublic ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {isPublic ? "Set Private" : "Set Public"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 