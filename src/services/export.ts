import { Habit, HabitCompletion } from "@/src/types/habit";
import * as FileSystem from "expo-file-system";
import React from "react";
import { Share, View } from "react-native";
// @ts-ignore - react-native-view-shot types
// eslint-disable-next-line import/no-unresolved
import { captureRef } from "react-native-view-shot";

export type {
  ProgressCardData,
  ProgressCardProps,
} from "@/src/components/ProgressCard";

interface ProgressCardData {
  habits: Habit[];
  completions: HabitCompletion[];
  totalDays: number;
  completionRate: number;
  bestStreak: number;
}

export class ExportService {
  static async generateProgressCard(
    cardRef: React.RefObject<View>,
    data: ProgressCardData
  ): Promise<string> {
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 0.9,
      });
      return uri;
    } catch (error) {
      console.error("Error generating progress card:", error);
      throw error;
    }
  }

  static async shareProgressCard(
    imageUri: string,
    message: string
  ): Promise<void> {
    try {
      await Share.share({
        message,
        url: imageUri,
      });
    } catch (error) {
      console.error("Error sharing progress card:", error);
      throw error;
    }
  }

  static async exportDataAsJSON(
    habits: Habit[],
    completions: HabitCompletion[]
  ): Promise<string> {
    const data = {
      exportDate: new Date().toISOString(),
      habits,
      completions,
      totalHabits: habits.length,
      totalCompletions: completions.filter((c) => c.completed).length,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `habit-tracker-export-${Date.now()}.json`;
    const fileUri = `${(FileSystem as any).documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    return fileUri;
  }

  static async exportCompletionsAsCSV(
    habits: Habit[],
    completions: HabitCompletion[]
  ): Promise<string> {
    const habitMap = new Map(habits.map((h) => [h.id, h.name]));

    let csv = "Date,Habit,Completed,Created At\n";
    completions.forEach((c) => {
      const habitName = habitMap.get(c.habitId) || "Unknown";
      csv += `${c.date},"${habitName}",${c.completed},${new Date(
        c.createdAt
      ).toISOString()}\n`;
    });

    const fileName = `habit-tracker-completions-${Date.now()}.csv`;
    const fileUri = `${(FileSystem as any).documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csv);
    return fileUri;
  }

  static async shareFile(fileUri: string, title: string): Promise<void> {
    try {
      await Share.share({
        title,
        url: fileUri,
      });
    } catch (error) {
      console.error("Error sharing file:", error);
      throw error;
    }
  }

  static generateWeeklySummary(
    totalHabits: number,
    completions: number,
    completionRate: number,
    bestStreak: number
  ): string {
    const emoji1 = String.fromCodePoint(0x1f3af);
    const emoji2 = String.fromCodePoint(0x2705);
    const emoji3 = String.fromCodePoint(0x1f4ca);
    const emoji4 = String.fromCodePoint(0x1f525);

    return (
      `${emoji1} My Weekly Habit Progress\n\n` +
      `${emoji2} Completed ${completions} out of ${
        totalHabits * 7
      } possible habits\n` +
      `${emoji3} ${completionRate}% completion rate\n` +
      `${emoji4} Best streak: ${bestStreak} days\n\n` +
      `Track your habits with Habit Tracker!`
    );
  }
}
