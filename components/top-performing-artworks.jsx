// components/top-performing-artworks.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Bookmark, Share2, MessageCircle } from "lucide-react";

export function TopPerformingArtworks({ artworks }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-800">
        <CardTitle className="text-lg lg:text-xl">Top Performing Artworks</CardTitle>
        <CardDescription className="text-sm">
          Detailed metrics for the most popular artworks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 lg:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Artwork</TableHead>
                <TableHead className="font-medium">Artist</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Views</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Saves</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Share2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Shares</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Inquiries</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artworks.map((artwork, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{artwork.artwork}</TableCell>
                  <TableCell className="text-muted-foreground">{artwork.artist}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{artwork.views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{artwork.saves}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">{artwork.shares}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{artwork.inquiries}</span>
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