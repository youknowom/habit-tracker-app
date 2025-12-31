import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PendingWrite {
  id: string;
  operation: "add" | "update" | "delete" | "toggle";
  collection: "habits" | "completions";
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingWrites: PendingWrite[];
  failedWrites: PendingWrite[];
  setOnlineStatus: (status: boolean) => void;
  setSyncStatus: (status: boolean) => void;
  setLastSyncTime: (time: number) => void;
  addPendingWrite: (
    write: Omit<PendingWrite, "id" | "timestamp" | "retryCount">
  ) => void;
  removePendingWrite: (id: string) => void;
  movePendingToFailed: (id: string) => void;
  clearFailedWrites: () => void;
  retryFailedWrite: (id: string) => void;
  getPendingWriteCount: () => number;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      isSyncing: false,
      lastSyncTime: null,
      pendingWrites: [],
      failedWrites: [],

      setOnlineStatus: (status) => set({ isOnline: status }),

      setSyncStatus: (status) => set({ isSyncing: status }),

      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      addPendingWrite: (write) => {
        const pendingWrite: PendingWrite = {
          ...write,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          retryCount: 0,
        };
        set((state) => ({
          pendingWrites: [...state.pendingWrites, pendingWrite],
        }));
      },

      removePendingWrite: (id) => {
        set((state) => ({
          pendingWrites: state.pendingWrites.filter((w) => w.id !== id),
        }));
      },

      movePendingToFailed: (id) => {
        set((state) => {
          const write = state.pendingWrites.find((w) => w.id === id);
          if (!write) return state;

          return {
            pendingWrites: state.pendingWrites.filter((w) => w.id !== id),
            failedWrites: [
              ...state.failedWrites,
              { ...write, retryCount: write.retryCount + 1 },
            ],
          };
        });
      },

      clearFailedWrites: () => set({ failedWrites: [] }),

      retryFailedWrite: (id) => {
        set((state) => {
          const write = state.failedWrites.find((w) => w.id === id);
          if (!write) return state;

          return {
            failedWrites: state.failedWrites.filter((w) => w.id !== id),
            pendingWrites: [...state.pendingWrites, write],
          };
        });
      },

      getPendingWriteCount: () => {
        const state = get();
        return state.pendingWrites.length + state.failedWrites.length;
      },
    }),
    {
      name: "offline-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pendingWrites: state.pendingWrites,
        failedWrites: state.failedWrites,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

// Network status listener
if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("online", () => {
    useOfflineStore.getState().setOnlineStatus(true);
  });

  window.addEventListener("offline", () => {
    useOfflineStore.getState().setOnlineStatus(false);
  });
}
