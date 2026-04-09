// components/top-performing-artists-table.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ShoppingCart, DollarSign } from "lucide-react";

export function TopPerformingArtistsTable({ artists }) {
  return (
    <Card className="bg-yellow-50/30 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-800 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg lg:text-xl">Top Performing Artists</CardTitle>
        <CardDescription className="text-sm">
          Artists with highest sales and engagement
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 lg:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-yellow-100 dark:border-yellow-800">
                <TableHead className="font-medium text-foreground">Artist</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-foreground">Views</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-foreground">Sales</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-foreground">Revenue</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist, index) => (
                <TableRow key={index} className="hover:bg-yellow-50/50 dark:hover:bg-yellow-950/30 border-yellow-100 dark:border-yellow-800">
                  <TableCell className="font-medium">{artist.artist}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{(artist.views || 0).toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{artist.sales || 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">${(artist.revenue || 0).toLocaleString()}</span>
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