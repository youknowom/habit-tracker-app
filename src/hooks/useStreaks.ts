import { useMemo } from "react";
import { Habit, HabitCompletion } from "../types/habit";

export function useStreaks(habit: Habit, completions: HabitCompletion[]) {
  const habitCompletions = useMemo(() => {
    return completions
      .filter((c) => c.habitId === habit.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [habit.id, completions]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split("T")[0];

      const hasCompletion = habitCompletions.some((c) => c.date === dateString);

      if (hasCompletion) {
        streak++;
      } else if (i > 0) {
        // If we miss a day after the first day, break the streak
        break;
      }
    }

    return streak;
  }, [habitCompletions]);

  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let currentCount = 0;
    let prevDate: Date | null = null;

    // Sort completions by date
    const sortedCompletions = [...habitCompletions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const completion of sortedCompletions) {
      const currentDate = new Date(completion.date);

      if (prevDate) {
        const dayDiff = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          currentCount++;
        } else {
          maxStreak = Math.max(maxStreak, currentCount);
          currentCount = 1;
        }
      } else {
        currentCount = 1;
      }

      prevDate = currentDate;
    }

    maxStreak = Math.max(maxStreak, currentCount);
    return maxStreak;
  }, [habitCompletions]);

  const totalCompletions = habitCompletions.length;

  const completionDates = useMemo(() => {
    return habitCompletions.map((c) => c.date);
  }, [habitCompletions]);

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionDates,
  };
}
