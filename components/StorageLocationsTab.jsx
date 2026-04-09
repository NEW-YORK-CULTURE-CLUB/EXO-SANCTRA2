"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Plus,
  ArrowUpDown,
  Edit,
  Trash,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// This will be moved to a separate data file later
const initialStorageLocations = [
  {
    id: "sl-01",
    name: "Main Gallery",
    description: "Primary exhibition space",
    capacity: 50,
    items: 12,
    security: "High",
    climateControl: "Active",
  },
  {
    id: "sl-02",
    name: "Vault A",
    description: "Secure storage for high-value items",
    capacity: 100,
    items: 45,
    security: "Maximum",
    climateControl: "Active",
  },
  {
    id: "sl-03",
    name: "Vault B",
    description: "Secondary secure storage",
    capacity: 75,
    items: 30,
    security: "Maximum",
    climateControl: "Active",
  },
  {
    id: "sl-04",
    name: "Exhibition Hall",
    description: "Temporary exhibition space",
    capacity: 30,
    items: 15,
    security: "High",
    climateControl: "Active",
  },
  {
    id: "sl-05",
    name: "Storage Room A",
    description: "General storage area",
    capacity: 200,
    items: 120,
    security: "Medium",
    climateControl: "Inactive",
  },
  {
    id: "sl-06",
    name: "Conservation Lab",
    description: "Artwork restoration and conservation",
    capacity: 20,
    items: 5,
    security: "High",
    climateControl: "Active",
  },
]

const SecurityBadge = ({ level }) => {
  const levelStyles = {
    Maximum: "bg-red-500 text-white hover:bg-red-600",
    High: "bg-black",
    Medium: "bg-gray-500",
    Low: "bg-gray-300 text-black"
  }
  return <Badge className={levelStyles[level]}>{level}</Badge>
}

const ClimateBadge = ({ status }) => {
  const statusStyles = {
    Active: "bg-green-500 text-white hover:bg-green-600",
    Inactive: "bg-gray-300 text-black",
  }
  return <Badge className={statusStyles[status]}>{status}</Badge>
}

function AddLocationModal({ open, onOpenChange, onAddLocation }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [capacity, setCapacity] = useState("")
  const [securityLevel, setSecurityLevel] = useState("Low")
  const [climateControl, setClimateControl] = useState(false)

  const resetForm = () => {
    setName("");
    setDescription("");
    setCapacity("");
    setSecurityLevel("Low");
    setClimateControl(false);
  };

  const handleSubmit = () => {
    if (!name || !capacity) {
      alert("Please fill in Name and Capacity fields.");
      return;
    }
    
    const newLocation = {
      id: `sl-${Date.now()}`,
      name,
      description,
      capacity: parseInt(capacity, 10),
      items: 0,
      security: securityLevel,
      climateControl: climateControl ? "Active" : "Inactive",
    };
    onAddLocation(newLocation);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Storage Location</DialogTitle>
          <DialogDescription>
            Create a new storage location for your artwork inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="security-level" className="text-right">
              Security Level
            </Label>
            <Select onValueChange={setSecurityLevel} defaultValue={securityLevel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a security level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Maximum">Maximum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="climate-control" className="text-right">
              Climate Control
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox id="climate-control" checked={climateControl} onCheckedChange={setClimateControl} />
              <label htmlFor="climate-control" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Temperature and humidity controlled
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StorageLocationsTab() {
  const [storageLocations, setStorageLocations] = useState(initialStorageLocations)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleAddLocation = (newLocation) => {
    setStorageLocations([...storageLocations, newLocation]);
  };

  const sortedLocations = [...storageLocations].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Pagination logic
  const totalPages = Math.ceil(sortedLocations.length / itemsPerPage);
  const paginatedLocations = sortedLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Storage Locations</h2>
        <AddLocationModal 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
          onAddLocation={handleAddLocation} 
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Climate Control</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.description}</TableCell>
                <TableCell>{location.capacity}</TableCell>
                <TableCell>{location.items}</TableCell>
                <TableCell>
                  <SecurityBadge level={location.security} />
                </TableCell>
                <TableCell>
                  <ClimateBadge status={location.climateControl} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Items</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {location.items > 0 ? (
                        <DropdownMenuItem disabled>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Cannot Delete (Has Items)</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousPage} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 