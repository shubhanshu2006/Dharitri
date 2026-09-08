/**
 * Offline Storage Utilities
 * IndexedDB wrapper for storing field visits and photos offline
 */

const DB_NAME = "dharitri_field";
const DB_VERSION = 1;

// Store names
export const STORES = {
  FIELD_VISITS: "fieldVisits",
  PHOTOS: "photos",
  SYNC_QUEUE: "syncQueue",
} as const;

interface SyncQueueItem {
  id: string;
  type: "visit" | "photo" | "checklist";
  data: any;
  timestamp: number;
  retryCount: number;
}

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Field Visits store
      if (!db.objectStoreNames.contains(STORES.FIELD_VISITS)) {
        const visitStore = db.createObjectStore(STORES.FIELD_VISITS, {
          keyPath: "id",
        });
        visitStore.createIndex("status", "status", { unique: false });
        visitStore.createIndex("projectId", "projectId", { unique: false });
      }

      // Photos store
      if (!db.objectStoreNames.contains(STORES.PHOTOS)) {
        const photoStore = db.createObjectStore(STORES.PHOTOS, {
          keyPath: "id",
        });
        photoStore.createIndex("visitId", "visitId", { unique: false });
      }

      // Sync Queue store
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}

/**
 * Generic get operation
 */
export async function getItem<T>(
  storeName: string,
  key: string
): Promise<T | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic getAll operation
 */
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic put operation
 */
export async function putItem<T>(storeName: string, item: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic delete operation
 */
export async function deleteItem(storeName: string, key: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save field visit offline
 */
export async function saveFieldVisitOffline(visit: any): Promise<void> {
  await putItem(STORES.FIELD_VISITS, visit);
}

/**
 * Get offline field visit
 */
export async function getOfflineFieldVisit(visitId: string): Promise<any> {
  return getItem(STORES.FIELD_VISITS, visitId);
}

/**
 * Get all offline field visits
 */
export async function getAllOfflineFieldVisits(): Promise<any[]> {
  return getAllItems(STORES.FIELD_VISITS);
}

/**
 * Delete offline field visit
 */
export async function deleteOfflineFieldVisit(visitId: string): Promise<void> {
  await deleteItem(STORES.FIELD_VISITS, visitId);
}

/**
 * Save photo offline
 */
export async function savePhotoOffline(photo: {
  id: string;
  visitId: string;
  blob: Blob;
  metadata: any;
}): Promise<void> {
  await putItem(STORES.PHOTOS, photo);
}

/**
 * Get offline photos for visit
 */
export async function getOfflinePhotos(visitId: string): Promise<any[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.PHOTOS, "readonly");
    const store = transaction.objectStore(STORES.PHOTOS);
    const index = store.index("visitId");
    const request = index.getAll(visitId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, "id">): Promise<void> {
  await putItem(STORES.SYNC_QUEUE, item);
}

/**
 * Get sync queue
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  return getAllItems(STORES.SYNC_QUEUE);
}

/**
 * Clear sync queue
 */
export async function clearSyncQueue(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, "readwrite");
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get offline storage usage
 */
export async function getStorageInfo(): Promise<{
  visits: number;
  photos: number;
  queueItems: number;
}> {
  const visits = await getAllOfflineFieldVisits();
  const photos = await getAllItems(STORES.PHOTOS);
  const queue = await getSyncQueue();

  return {
    visits: visits.length,
    photos: photos.length,
    queueItems: queue.length,
  };
}
