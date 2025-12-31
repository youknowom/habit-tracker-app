import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { PendingWrite, useOfflineStore } from "../store/offlineStore";

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;

  private constructor() {
    this.startPeriodicSync();
  }

  static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  startPeriodicSync(intervalMs: number = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncPendingWrites();
    }, intervalMs);
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncPendingWrites(): Promise<void> {
    const offlineStore = useOfflineStore.getState();

    if (!offlineStore.isOnline || this.isSyncing) {
      return;
    }

    const { pendingWrites } = offlineStore;

    if (pendingWrites.length === 0) {
      return;
    }

    this.isSyncing = true;
    offlineStore.setSyncStatus(true);

    const results = await Promise.allSettled(
      pendingWrites.map((write) => this.processWrite(write))
    );

    results.forEach((result, index) => {
      const write = pendingWrites[index];

      if (result.status === "fulfilled") {
        offlineStore.removePendingWrite(write.id);
      } else {
        if (write.retryCount < 3) {
          // Move to failed for retry
          offlineStore.movePendingToFailed(write.id);
        } else {
          // Too many retries, discard
          offlineStore.removePendingWrite(write.id);
          console.error(
            `Discarding write after ${write.retryCount} retries:`,
            write
          );
        }
      }
    });

    offlineStore.setLastSyncTime(Date.now());
    offlineStore.setSyncStatus(false);
    this.isSyncing = false;
  }

  private async processWrite(write: PendingWrite): Promise<void> {
    const { operation, collection: collectionName, data } = write;

    try {
      switch (operation) {
        case "add":
          await addDoc(collection(db, collectionName), data);
          break;

        case "update":
          if (!data.id) throw new Error("Update requires document ID");
          const updateRef = doc(db, collectionName, data.id);
          const { id: _updateId, ...updateData } = data;
          await updateDoc(updateRef, updateData);
          break;

        case "delete":
          if (!data.id) throw new Error("Delete requires document ID");
          await deleteDoc(doc(db, collectionName, data.id));
          break;

        case "toggle":
          if (!data.id) throw new Error("Toggle requires document ID");
          const toggleRef = doc(db, collectionName, data.id);
          await updateDoc(toggleRef, { completed: data.completed });
          break;

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      console.error(`Error processing write operation ${operation}:`, error);
      throw error;
    }
  }

  async forceSyncNow(): Promise<void> {
    return this.syncPendingWrites();
  }
}

// Initialize the service
export const offlineSyncService = OfflineSyncService.getInstance();
