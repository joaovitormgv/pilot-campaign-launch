import { useState } from "react";
import { Play, Upload, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaLibraryModal } from "@/components/MediaLibraryModal";
import { LaunchProgressModal } from "@/components/LaunchProgressModal";

// Mock data for demonstration
const adSets = [
  { id: 1, name: "Summer Campaign 2024", status: "active", budget: 500 },
  { id: 2, name: "Black Friday Promo", status: "draft", budget: 1000 },
  { id: 3, name: "New Product Launch", status: "active", budget: 750 },
];

const copyTemplates = [
  { id: 1, name: "Engaging Headlines", category: "Headlines", variants: 12 },
  { id: 2, name: "Call to Action Pack", category: "CTA", variants: 8 },
  { id: 3, name: "Product Benefits", category: "Features", variants: 15 },
];

export default function Launch() {
  const [selectedAdSets, setSelectedAdSets] = useState<number[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const handleLaunch = () => {
    if (selectedAdSets.length && selectedTemplates.length && selectedMedia.length) {
      setShowProgressModal(true);
    }
  };

  const canLaunch = selectedAdSets.length > 0 && selectedTemplates.length > 0 && selectedMedia.length > 0;

  return (
    <div className="container-app">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Launch Campaign</h1>
        <p className="text-muted-foreground">
          Select your ad sets, copy templates, and media to launch your campaign.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Control Panel */}
        <div className="space-y-6">
          {/* Ad Sets Selection */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Ad Sets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {adSets.map((adSet) => (
                <div
                  key={adSet.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedAdSets.includes(adSet.id)
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedAdSets((prev) =>
                      prev.includes(adSet.id)
                        ? prev.filter((id) => id !== adSet.id)
                        : [...prev, adSet.id]
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{adSet.name}</h3>
                      <p className="text-sm text-muted-foreground">Budget: ${adSet.budget}</p>
                    </div>
                    <Badge
                      variant={adSet.status === "active" ? "default" : "secondary"}
                      className={adSet.status === "active" ? "status-success" : ""}
                    >
                      {adSet.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Copy Templates Selection */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Copy Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {copyTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedTemplates.includes(template.id)
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedTemplates((prev) =>
                      prev.includes(template.id)
                        ? prev.filter((id) => id !== template.id)
                        : [...prev, template.id]
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.variants} variants • {template.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Launch Button */}
          <div className="pt-4">
            <Button
              className="btn-launch w-full h-14 text-lg"
              disabled={!canLaunch}
              onClick={handleLaunch}
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Launch Campaign
            </Button>
            {!canLaunch && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Select ad sets, templates, and media to launch
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Media Selection */}
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Media Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[300px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 group"
                onClick={() => setShowMediaModal(true)}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {selectedMedia.length > 0 ? `${selectedMedia.length} files selected` : "Select Media"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click to browse your media library
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedMedia.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Selected Files</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMediaModal(true)}
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMedia.slice(0, 5).map((id) => (
                      <Badge key={id} variant="secondary" className="px-3 py-1">
                        Media {id}
                      </Badge>
                    ))}
                    {selectedMedia.length > 5 && (
                      <Badge variant="outline" className="px-3 py-1">
                        +{selectedMedia.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showMediaModal && (
        <MediaLibraryModal
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          selectedMedia={selectedMedia}
          onSelectionChange={setSelectedMedia}
        />
      )}

      {showProgressModal && (
        <LaunchProgressModal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </div>
  );
}