import { useMemo } from "react";
import { useHabitStore } from "../store/habitStore";
import { getDateDaysAgo, getTodayDate } from "../utils/dateHelpers";

export function useHabits() {
  const {
    habits,
    completions,
    loading,
    fetchHabits,
    fetchCompletions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
  } = useHabitStore();

  const todayCompletions = useMemo(() => {
    const today = getTodayDate();
    return completions.filter((c) => c.date === today && c.completed);
  }, [completions]);

  const completionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.round((todayCompletions.length / habits.length) * 100);
  }, [habits.length, todayCompletions.length]);

  const isAllCompleted = useMemo(() => {
    return habits.length > 0 && todayCompletions.length === habits.length;
  }, [habits.length, todayCompletions.length]);

  const getHabitCompletion = (habitId: string, date?: string) => {
    const targetDate = date || getTodayDate();
    return completions.find(
      (c) => c.habitId === habitId && c.date === targetDate
    );
  };

  const isHabitCompleted = (habitId: string, date?: string) => {
    return !!getHabitCompletion(habitId, date);
  };

  const getWeeklyData = () => {
    const weekData: { date: string; completions: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = getDateDaysAgo(i);
      const dayCompletions = completions.filter((c) => c.date === date).length;
      weekData.push({
        date,
        completions: dayCompletions,
        total: habits.length,
      });
    }
    return weekData;
  };

  return {
    habits,
    completions,
    todayCompletions,
    completionRate,
    isAllCompleted,
    loading,
    fetchHabits,
    fetchCompletions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getHabitCompletion,
    isHabitCompleted,
    getWeeklyData,
  };
}
