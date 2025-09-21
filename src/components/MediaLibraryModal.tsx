import { useState } from "react";
import { X, Search, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock media data
const mockMediaLibrary = [
  { id: 1, name: "summer-promo-video.mp4", type: "video", status: "launched", uploader: "John Doe", thumbnail: "🎥" },
  { id: 2, name: "product-hero-image.jpg", type: "image", status: "not-launched", uploader: "Jane Smith", thumbnail: "🖼️" },
  { id: 3, name: "brand-logo-animation.gif", type: "animation", status: "launched", uploader: "Mike Johnson", thumbnail: "🎬" },
  { id: 4, name: "testimonial-carousel.mp4", type: "video", status: "not-launched", uploader: "Sarah Wilson", thumbnail: "🎥" },
  { id: 5, name: "feature-comparison.png", type: "image", status: "launched", uploader: "John Doe", thumbnail: "🖼️" },
  { id: 6, name: "call-to-action-banner.jpg", type: "image", status: "not-launched", uploader: "Emma Davis", thumbnail: "🖼️" },
  { id: 7, name: "pricing-infographic.svg", type: "image", status: "launched", uploader: "Mike Johnson", thumbnail: "📊" },
  { id: 8, name: "demo-walkthrough.mp4", type: "video", status: "not-launched", uploader: "Sarah Wilson", thumbnail: "🎥" },
];

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMedia: number[];
  onSelectionChange: (selected: number[]) => void;
}

export function MediaLibraryModal({ isOpen, onClose, selectedMedia, onSelectionChange }: MediaLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploaderFilter, setUploaderFilter] = useState("all");

  const filteredMedia = mockMediaLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesUploader = uploaderFilter === "all" || item.uploader === uploaderFilter;
    return matchesSearch && matchesStatus && matchesUploader;
  });

  const uniqueUploaders = [...new Set(mockMediaLibrary.map(item => item.uploader))];

  const toggleSelection = (mediaId: number) => {
    const newSelection = selectedMedia.includes(mediaId)
      ? selectedMedia.filter(id => id !== mediaId)
      : [...selectedMedia, mediaId];
    onSelectionChange(newSelection);
  };

  const getStatusBadge = (status: string) => {
    return status === "launched" ? (
      <Badge className="status-success text-xs">Launched</Badge>
    ) : (
      <Badge variant="outline" className="border-warning text-warning text-xs">Not Launched</Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Media Library</span>
            <div className="text-sm font-normal text-muted-foreground">
              {selectedMedia.length} selected
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="not-launched">Not Launched</SelectItem>
              </SelectContent>
            </Select>

            <Select value={uploaderFilter} onValueChange={setUploaderFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Uploader" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Uploaders</SelectItem>
                {uniqueUploaders.map((uploader) => (
                  <SelectItem key={uploader} value={uploader}>{uploader}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedMedia.includes(item.id)
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-lg">
                    {item.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          By {item.uploader}
                        </p>
                        {getStatusBadge(item.status)}
                      </div>
                      {selectedMedia.includes(item.id) && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-2">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No media files match your filters.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {selectedMedia.length} of {mockMediaLibrary.length} files selected
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="btn-launch" onClick={onClose}>
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}