/**
 * Sync Utilities
 * Handle online/offline detection and data synchronization
 */

import { getSyncQueue, clearSyncQueue, addToSyncQueue } from "./storage";

type SyncCallback = () => void;

let onlineListeners: SyncCallback[] = [];
let offlineListeners: SyncCallback[] = [];

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine;
}

/**
 * Initialize online/offline event listeners
 */
export function initOnlineDetection(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("online", () => {
    console.log("🟢 Back online");
    onlineListeners.forEach((callback) => callback());
  });

  window.addEventListener("offline", () => {
    console.log("🔴 Went offline");
    offlineListeners.forEach((callback) => callback());
  });
}

/**
 * Subscribe to online event
 */
export function onOnline(callback: SyncCallback): () => void {
  onlineListeners.push(callback);
  return () => {
    onlineListeners = onlineListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Subscribe to offline event
 */
export function onOffline(callback: SyncCallback): () => void {
  offlineListeners.push(callback);
  return () => {
    offlineListeners = offlineListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Generate client operation ID for deduplication
 */
export function generateClientOperationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sync pending queue items
 */
export async function syncPendingData(
  syncFunction: (item: any) => Promise<void>
): Promise<{ success: number; failed: number }> {
  const queue = await getSyncQueue();
  let success = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      await syncFunction(item);
      success++;
    } catch (error) {
      console.error("Sync failed for item:", item, error);
      failed++;
      
      // Re-add with incremented retry count if not exceeded
      if (item.retryCount < 3) {
        await addToSyncQueue({
          type: item.type,
          data: item.data,
          timestamp: Date.now(),
          retryCount: item.retryCount + 1,
        });
      }
    }
  }

  if (success > 0) {
    await clearSyncQueue();
  }

  return { success, failed };
}

/**
 * Custom hook for online status
 */
export function useOnlineStatus() {
  if (typeof window === "undefined") {
    return { isOnline: true, isSyncing: false };
  }

  const [online, setOnline] = React.useState(isOnline());
  const [syncing, setSyncing] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline: online, isSyncing: syncing, setSyncing };
}

// For TypeScript compatibility
declare const React: any;
