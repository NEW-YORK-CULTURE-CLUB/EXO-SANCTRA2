// components/top-performing-artworks-table.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Bookmark, Share2, MessageCircle } from "lucide-react";

export function TopPerformingArtworksTable({ artworks }) {
  return (
    <Card className="bg-purple-50/30 dark:bg-purple-950/20 border-purple-100 dark:border-purple-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg lg:text-xl">Top Performing Artworks</CardTitle>
        <CardDescription className="text-sm">
          Most viewed and engaged artworks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 lg:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-purple-100 dark:border-purple-800">
                <TableHead className="font-medium text-foreground">Artwork</TableHead>
                <TableHead className="font-medium text-foreground">Artist</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-foreground">Views</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Bookmark className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-foreground">Saves</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-foreground">Shares</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-foreground">Inquiries</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artworks.map((artwork, index) => (
                <TableRow key={index} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border-purple-100 dark:border-purple-800">
                  <TableCell className="font-medium">{artwork.artwork}</TableCell>
                  <TableCell className="text-muted-foreground">{artwork.artist}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{(artwork.views || 0).toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-pink-600 dark:text-pink-400 font-semibold">{artwork.saves || 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{artwork.shares || 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-red-600 dark:text-red-400 font-semibold">{artwork.inquiries || 0}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}