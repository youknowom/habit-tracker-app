import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface FreezeTokenData {
  habitId: string;
  date: string;
  usedAt: number;
}

export class StreakFreezeService {
  /**
   * Get user's freeze tokens count
   */
  static async getUserFreezeTokens(userId: string): Promise<number> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().freezeTokens || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error getting freeze tokens:", error);
      return 0;
    }
  }

  /**
   * Add freeze tokens to user (for earning/purchasing)
   */
  static async addFreezeTokens(
    userId: string,
    count: number = 1
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        freezeTokens: increment(count),
      });
    } catch (error) {
      console.error("Error adding freeze tokens:", error);
      throw error;
    }
  }

  /**
   * Use a freeze token on a habit for a specific date
   */
  static async useFreezeToken(
    userId: string,
    habitId: string,
    date: string
  ): Promise<boolean> {
    try {
      // Check if user has tokens
      const tokens = await this.getUserFreezeTokens(userId);
      if (tokens <= 0) {
        throw new Error("No freeze tokens available");
      }

      // Check if already used for this habit/date
      const freezeId = `${userId}_${habitId}_${date}`;
      const freezeDoc = await getDoc(doc(db, "freezes", freezeId));
      if (freezeDoc.exists()) {
        throw new Error("Freeze token already used for this date");
      }

      // Create freeze record
      const freezeData: FreezeTokenData = {
        habitId,
        date,
        usedAt: Date.now(),
      };
      await setDoc(doc(db, "freezes", freezeId), {
        userId,
        ...freezeData,
      });

      // Decrement user's tokens
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        freezeTokens: increment(-1),
      });

      return true;
    } catch (error) {
      console.error("Error using freeze token:", error);
      throw error;
    }
  }

  /**
   * Check if a freeze token was used for specific habit/date
   */
  static async isFrozenDay(
    userId: string,
    habitId: string,
    date: string
  ): Promise<boolean> {
    try {
      const freezeId = `${userId}_${habitId}_${date}`;
      const freezeDoc = await getDoc(doc(db, "freezes", freezeId));
      return freezeDoc.exists();
    } catch (error) {
      console.error("Error checking frozen day:", error);
      return false;
    }
  }

  /**
   * Get all frozen days for a habit
   */
  static async getHabitFrozenDays(
    userId: string,
    habitId: string
  ): Promise<string[]> {
    try {
      // This would need a compound query, but for now we'll return empty
      // In production, you'd want to add a Firestore compound index
      return [];
    } catch (error) {
      console.error("Error getting frozen days:", error);
      return [];
    }
  }

  /**
   * Reward user with freeze token for milestone (e.g., 7 day streak)
   */
  static async checkAndRewardMilestone(
    userId: string,
    streak: number
  ): Promise<boolean> {
    // Reward tokens at 7, 14, 30, 60, 90 day streaks
    const milestones = [7, 14, 30, 60, 90, 180, 365];

    if (milestones.includes(streak)) {
      await this.addFreezeTokens(userId, 1);
      return true; // Earned a token
    }

    return false;
  }
}
