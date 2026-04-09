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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const documentTypes = [
  "Certificate of Authenticity",
  "Provenance",
  "Condition Report",
  "Insurance Valuation",
  "Exhibition Documentation",
  "Conservation Report",
  "Appraisal",
  "Exhibition History",
  "Historical Documentation",
  "Other",
];

export function EditDocumentModal({ isOpen, onOpenChange, document, onSave }) {
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    if (document) {
      setDocName(document.name || "");
      setDocType(document.type || "");
      setDescription(document.description || "");
      setTags(document.tags || []);
    }
  }, [document]);

  const handleSaveChanges = () => {
    const updatedDocument = {
      ...document,
      name: docName,
      type: docType,
      description,
      tags,
    };
    onSave(updatedDocument);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Edit document details for &quot;{document.artwork}&quot; by {document.artist}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-name" className="text-right">
              Document Name
            </Label>
            <Input
              id="doc-name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doc-type" className="text-right">
              Document Type
            </Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <div className="col-span-3">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button variant="outline" onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Current File
            </Label>
            <div className="col-span-3 flex items-center justify-between rounded-lg border p-3">
                <div>
                    <p className="text-sm font-medium">{document.fileName || 'Exhibition History'}</p>
                    <p className="text-sm text-muted-foreground">{document.fileSize || '1.7 MB'} - Added on {document.fileDate || '12/06/2022'}</p>
                </div>
                <Button variant="outline">Replace</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 