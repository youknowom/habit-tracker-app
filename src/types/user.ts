export interface AppUser {
  uid: string;
  name: string;
  photoUrl?: string;
  createdAt: number;
  freezeTokens?: number; // Streak freeze tokens available
}
