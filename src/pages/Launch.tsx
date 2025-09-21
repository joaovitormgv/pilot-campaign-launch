import { useState } from "react";
import { Play, Upload, Filter, ChevronDown, Search, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MediaLibraryModal } from "@/components/MediaLibraryModal";
import { LaunchProgressModal } from "@/components/LaunchProgressModal";

// Mock data for demonstration
const adSetsData = [
  { id: 1, name: "Summer Campaign 2024", status: "active", budget: 500, accountId: "BR123" },
  { id: 2, name: "Black Friday Promo", status: "draft", budget: 1000, accountId: "BR456" },
  { id: 3, name: "New Product Launch", status: "active", budget: 750, accountId: "BR789" },
  { id: 4, name: "Holiday Special", status: "active", budget: 600, accountId: "BR101" },
  { id: 5, name: "Spring Collection", status: "draft", budget: 800, accountId: "BR202" },
];

const adSetupTemplates = [
  { 
    id: 1, 
    name: "Gocase Brasil Promo", 
    primaryText: "PROMO 07/07! 7 Estampas selecionadas: só hoje 7 cases saem por 5249",
    headline: "Gocase Brasil",
    description: "Promo 07/07",
    callToAction: "Shop Now",
    webLink: "https://www.gocase.com.br/",
    utmParams: "utm_source=facebook&utm_...",
    displayLink: "gocase.com.br/gocapinhas"
  },
  { 
    id: 2, 
    name: "Summer Sale Template", 
    primaryText: "Summer Sale! Get 50% off on all cases",
    headline: "Summer Collection",
    description: "Limited time offer",
    callToAction: "Buy Now",
    webLink: "https://www.example.com/summer",
    utmParams: "utm_source=facebook&utm_campaign=summer",
    displayLink: "example.com/summer"
  },
];

// Mock media thumbnails
const mediaItems = [
  { id: 1, name: "Case 1", thumbnail: "/api/placeholder/80/80", type: "image" },
  { id: 2, name: "Case 2", thumbnail: "/api/placeholder/80/80", type: "image" },
  { id: 3, name: "Video Ad", thumbnail: "/api/placeholder/80/80", type: "video" },
];

export default function Launch() {
  const [selectedAdSets, setSelectedAdSets] = useState<number[]>([]);
  const [selectedAdSetup, setSelectedAdSetup] = useState<number | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [adSetSearch, setAdSetSearch] = useState("");
  const [showAdSetDropdown, setShowAdSetDropdown] = useState(false);
  const [showAdSetupDropdown, setShowAdSetupDropdown] = useState(false);
  const [filteredAdSets, setFilteredAdSets] = useState(adSetsData);

  const handleLaunch = () => {
    if (selectedAdSets.length && selectedAdSetup && selectedMedia.length) {
      setShowProgressModal(true);
    }
  };

  const handleAdSetSearch = (value: string) => {
    setAdSetSearch(value);
    const filtered = adSetsData.filter(adSet => 
      adSet.name.toLowerCase().includes(value.toLowerCase()) ||
      adSet.id.toString().includes(value) ||
      adSet.accountId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAdSets(filtered);
    setShowAdSetDropdown(true);
  };

  const handleAdSetRefresh = () => {
    // Mock refresh functionality - in real app would fetch from API
    setFilteredAdSets([...adSetsData]);
  };

  const canLaunch = selectedAdSets.length > 0 && selectedAdSetup !== null && selectedMedia.length > 0;

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
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Ad Sets</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdSetRefresh}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Ad Set Refresh</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Ad Set name or ID"
                    value={adSetSearch}
                    onChange={(e) => handleAdSetSearch(e.target.value)}
                    onFocus={() => setShowAdSetDropdown(true)}
                    className="pl-10"
                  />
                </div>
                
                {showAdSetDropdown && adSetSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredAdSets.map((adSet) => (
                      <div
                        key={adSet.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => {
                          setSelectedAdSets((prev) =>
                            prev.includes(adSet.id)
                              ? prev.filter((id) => id !== adSet.id)
                              : [...prev, adSet.id]
                          );
                          setShowAdSetDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{adSet.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ID: {adSet.id} • Budget: ${adSet.budget} • {adSet.accountId}
                            </p>
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
                  </div>
                )}
              </div>

              {selectedAdSets.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Selected Ad Sets:</h4>
                  {selectedAdSets.map((id) => {
                    const adSet = adSetsData.find(a => a.id === id);
                    return adSet ? (
                      <div key={id} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-foreground">{adSet.name}</h5>
                            <p className="text-sm text-muted-foreground">Budget: ${adSet.budget}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAdSets(prev => prev.filter(adSetId => adSetId !== id))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad Setup Selection */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Ad Setup</span>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdSetupDropdown(!showAdSetupDropdown)}
                    className="flex items-center space-x-2"
                  >
                    <span>Load Ad Copy</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdSetupDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showAdSetupDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 w-64">
                      {adSetupTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => {
                            setSelectedAdSetup(template.id);
                            setShowAdSetupDropdown(false);
                          }}
                        >
                          <h4 className="font-medium text-foreground">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Primary text, headline, description and more
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">Ad Setup Parameters</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Save Ad Copy</Button>
                  <Button variant="outline" size="sm">Defaults</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Primary Text</label>
                  <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                    {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.primaryText : "Select a template to load ad copy"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Headline</label>
                  <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                    {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.headline : "Select a template to load ad copy"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                    {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.description : "Select a template to load ad copy"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Call to Action</label>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                      {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.callToAction : "Select a template"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Web Link</label>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                      {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.webLink : "Select a template"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">UTM Parameters</label>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                      {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.utmParams : "Select a template"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Display Link</label>
                    <p className="text-sm text-muted-foreground bg-background p-2 rounded border mt-1">
                      {selectedAdSetup ? adSetupTemplates.find(t => t.id === selectedAdSetup)?.displayLink : "Select a template"}
                    </p>
                  </div>
                </div>
              </div>
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
              {selectedMedia.length === 0 ? (
                <div
                  className="min-h-[300px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 group"
                  onClick={() => setShowMediaModal(true)}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">No media assets selected</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to browse your media library
                      </p>
                      <Button className="mt-3" onClick={() => setShowMediaModal(true)}>
                        Load Media
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    className="p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setShowMediaModal(true)}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {selectedMedia.slice(0, 6).map((id) => {
                        const media = mediaItems.find(m => m.id === id);
                        return media ? (
                          <div key={id} className="relative group">
                            <img 
                              src={media.thumbnail} 
                              alt={media.name}
                              className="w-full h-20 object-cover rounded-lg border border-border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-medium">{media.name}</span>
                            </div>
                          </div>
                        ) : null;
                      })}
                      {selectedMedia.length > 6 && (
                        <div className="w-full h-20 bg-muted rounded-lg border border-border flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            +{selectedMedia.length - 6} more
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedMedia.length} files selected
                      </p>
                      <Button variant="outline" size="sm">
                        Load Media
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
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