import { useState } from "react";
import { Search, Filter, Upload, MoreHorizontal, Trash2, Edit3, Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock media data
const mockMedia = [
  { id: 1, name: "summer-promo-video.mp4", type: "video", status: "launched", uploader: "John Doe", size: "12.5 MB", date: "2024-01-15" },
  { id: 2, name: "product-hero-image.jpg", type: "image", status: "not-launched", uploader: "Jane Smith", size: "2.1 MB", date: "2024-01-14" },
  { id: 3, name: "brand-logo-animation.gif", type: "animation", status: "launched", uploader: "Mike Johnson", size: "5.8 MB", date: "2024-01-13" },
  { id: 4, name: "testimonial-carousel.mp4", type: "video", status: "not-launched", uploader: "Sarah Wilson", size: "18.3 MB", date: "2024-01-12" },
  { id: 5, name: "feature-comparison.png", type: "image", status: "launched", uploader: "John Doe", size: "1.9 MB", date: "2024-01-11" },
  { id: 6, name: "call-to-action-banner.jpg", type: "image", status: "not-launched", uploader: "Emma Davis", size: "3.2 MB", date: "2024-01-10" },
];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploaderFilter, setUploaderFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const filteredMedia = mockMedia.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesUploader = uploaderFilter === "all" || item.uploader === uploaderFilter;
    return matchesSearch && matchesStatus && matchesUploader;
  });

  const uniqueUploaders = [...new Set(mockMedia.map(item => item.uploader))];

  const getStatusBadge = (status: string) => {
    return status === "launched" ? (
      <Badge className="status-success">Launched</Badge>
    ) : (
      <Badge variant="outline" className="border-warning text-warning">Not Launched</Badge>
    );
  };

  const getMediaIcon = (type: string) => {
    const iconClass = "w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center";
    switch (type) {
      case "video":
        return <div className={`${iconClass} bg-primary/10 text-primary`}>🎥</div>;
      case "image":
        return <div className={`${iconClass} bg-success/10 text-success`}>🖼️</div>;
      case "animation":
        return <div className={`${iconClass} bg-warning/10 text-warning`}>🎬</div>;
      default:
        return <div className={`${iconClass} bg-muted text-muted-foreground`}>📄</div>;
    }
  };

  return (
    <div className="container-app">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Media Library</h1>
            <p className="text-muted-foreground">
              Manage your campaign assets and media files
            </p>
          </div>
          <Button className="btn-launch mt-4 md:mt-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="launched">Launched</SelectItem>
              <SelectItem value="not-launched">Not Launched</SelectItem>
            </SelectContent>
          </Select>

          <Select value={uploaderFilter} onValueChange={setUploaderFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by uploader" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Uploaders</SelectItem>
              {uniqueUploaders.map((uploader) => (
                <SelectItem key={uploader} value={uploader}>{uploader}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  Launch Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid-media">
        {filteredMedia.map((item) => (
          <Card key={item.id} className="card-interactive group">
            <CardContent className="p-6">
              <div className="relative">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 w-4 h-4 rounded border-border"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(prev => [...prev, item.id]);
                    } else {
                      setSelectedItems(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                />

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Media Preview */}
                <div className="text-center mb-4">
                  {getMediaIcon(item.type)}
                  <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </div>

                {/* Status and Details */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Uploaded by {item.uploader}</div>
                    <div>{item.date}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No media found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all" || uploaderFilter !== "all"
              ? "Try adjusting your filters or search query"
              : "Upload your first media file to get started"}
          </p>
          <Button className="btn-launch">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      )}
    </div>
  );
}