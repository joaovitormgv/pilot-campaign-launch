import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface LaunchResult {
  id: string;
  name: string;
  status: "success" | "failed" | "pending";
  error?: string;
}

interface LaunchProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchProgressModal({ isOpen, onClose }: LaunchProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<LaunchResult[]>([
    { id: "1", name: "Summer Campaign - Video Ad", status: "pending" },
    { id: "2", name: "Summer Campaign - Image Ad", status: "pending" },
    { id: "3", name: "Black Friday - Carousel Ad", status: "pending" },
    { id: "4", name: "New Product - Story Ad", status: "pending" },
    { id: "5", name: "Testimonial - Video Ad", status: "pending" },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const simulate = async () => {
      // Reset state when modal opens
      setProgress(0);
      setIsComplete(false);
      setResults(prev => prev.map(r => ({ ...r, status: "pending" as const })));

      // Simulate launch progress
      for (let i = 0; i < results.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        setResults(prev => prev.map((result, index) => {
          if (index === i) {
            // Simulate some failures
            const willFail = Math.random() < 0.2; // 20% chance of failure
            return {
              ...result,
              status: willFail ? "failed" : "success",
              error: willFail ? "Network timeout - please try again" : undefined
            };
          }
          return result;
        }));

        setProgress(((i + 1) / results.length) * 100);
      }

      setIsComplete(true);
    };

    simulate();
  }, [isOpen, results.length]);

  const successCount = results.filter(r => r.status === "success").length;
  const failedCount = results.filter(r => r.status === "failed").length;
  const pendingCount = results.filter(r => r.status === "pending").length;

  const getOverallStatus = () => {
    if (!isComplete) return "launching";
    if (failedCount === 0) return "success";
    if (successCount === 0) return "failed";
    return "partial";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />;
      default:
        return null;
    }
  };

  const getOverallStatusMessage = () => {
    const status = getOverallStatus();
    switch (status) {
      case "launching":
        return {
          title: "Launching Campaign...",
          description: "Please wait while we launch your ads",
          icon: <Loader2 className="w-6 h-6 text-primary animate-spin" />
        };
      case "success":
        return {
          title: "Campaign Launched Successfully!",
          description: "All ads have been launched successfully",
          icon: <CheckCircle className="w-6 h-6 text-success" />
        };
      case "failed":
        return {
          title: "Campaign Launch Failed",
          description: "None of the ads could be launched",
          icon: <XCircle className="w-6 h-6 text-destructive" />
        };
      case "partial":
        return {
          title: "Partial Success",
          description: `${successCount} of ${results.length} ads launched successfully`,
          icon: <AlertCircle className="w-6 h-6 text-warning" />
        };
      default:
        return {
          title: "Unknown Status",
          description: "",
          icon: null
        };
    }
  };

  const statusMessage = getOverallStatusMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {statusMessage.icon}
            <span>{statusMessage.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{statusMessage.description}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status Summary */}
          {isComplete && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-success-light rounded-xl">
                <div className="text-2xl font-bold text-success">{successCount}</div>
                <div className="text-sm text-success">Successful</div>
              </div>
              <div className="text-center p-3 bg-destructive-light rounded-xl">
                <div className="text-2xl font-bold text-destructive">{failedCount}</div>
                <div className="text-sm text-destructive">Failed</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-xl">
                <div className="text-2xl font-bold text-foreground">{results.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          )}

          {/* Individual Results */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-foreground">Launch Details</h4>
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {result.name}
                    </div>
                    {result.error && (
                      <div className="text-xs text-destructive mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  className={
                    result.status === "success"
                      ? "status-success"
                      : result.status === "failed"
                      ? "status-error"
                      : ""
                  }
                  variant={result.status === "pending" ? "outline" : "default"}
                >
                  {result.status === "pending" ? "Launching..." : result.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {pendingCount > 0 && `${pendingCount} ads launching...`}
              {isComplete && failedCount > 0 && (
                <span className="text-destructive">
                  {failedCount} ads failed - check errors above
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {failedCount > 0 && isComplete && (
                <Button variant="outline" size="sm">
                  Retry Failed
                </Button>
              )}
              <Button
                className={isComplete ? "btn-launch" : ""}
                variant={isComplete ? "default" : "outline"}
                onClick={onClose}
                disabled={!isComplete && pendingCount > 0}
              >
                {isComplete ? "Done" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}