// API Response Types

export interface FirebaseError {
  code: string;
  message: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: FirebaseError;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingChanges: number;
  isOnline: boolean;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

export interface QuoteApiResponse {
  id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}
