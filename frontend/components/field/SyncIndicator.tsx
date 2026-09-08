"use client";

import { useState, useEffect } from "react";
import { Badge, Button, Alert } from "@/components/ui";
import { Wifi, WifiOff, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { isOnline, syncPendingData } from "@/lib/offline/sync";
import { getStorageInfo } from "@/lib/offline/storage";
import { cn } from "@/lib/utils";

interface SyncIndicatorProps {
  onSyncComplete?: () => void;
  className?: string;
}

export function SyncIndicator({ onSyncComplete, className }: SyncIndicatorProps) {
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  // Update online status
  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load pending count
  useEffect(() => {
    loadPendingCount();
  }, []);

  const loadPendingCount = async () => {
    const info = await getStorageInfo();
    setPendingCount(info.queueItems);
  };

  const handleSync = async () => {
    if (!online || syncing) return;

    setSyncing(true);
    setLastSyncResult(null);

    try {
      // Placeholder sync function - implement actual sync logic
      const result = await syncPendingData(async (item) => {
        // Sync each item to backend
        console.log("Syncing item:", item);
        // await api.post(...) based on item.type
      });

      setLastSyncResult(result);
      await loadPendingCount();
      onSyncComplete?.();
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Online/Offline Status Badge */}
      <div className="flex items-center justify-between">
        <Badge
          className={cn(
            "text-base px-4 py-2",
            online
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {online ? (
            <>
              <Wifi className="h-5 w-5 mr-2" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 mr-2" />
              Offline
            </>
          )}
        </Badge>

        {pendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-700 text-base px-4 py-2">
            <Clock className="h-5 w-5 mr-2" />
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {/* Sync Button - Large Touch Target */}
      {online && pendingCount > 0 && (
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          style={{ minHeight: "56px" }}
        >
          {syncing ? (
            <>
              <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
              Syncing {pendingCount} items...
            </>
          ) : (
            <>
              <RefreshCw className="h-6 w-6 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      )}

      {/* Sync Result */}
      {lastSyncResult && (
        <Alert
          variant={lastSyncResult.failed === 0 ? "success" : "warning"}
          className="text-sm"
        >
          <CheckCircle className="h-4 w-4" />
          <div>
            <p className="font-medium">Sync Complete</p>
            <p className="text-xs">
              {lastSyncResult.success} synced
              {lastSyncResult.failed > 0 && `, ${lastSyncResult.failed} failed`}
            </p>
          </div>
        </Alert>
      )}

      {/* Offline Mode Info */}
      {!online && (
        <Alert variant="info" className="text-sm">
          <WifiOff className="h-4 w-4" />
          <div>
            <p className="font-medium">Offline Mode</p>
            <p className="text-xs">
              Changes will sync automatically when online
            </p>
          </div>
        </Alert>
      )}
    </div>
  );
}
