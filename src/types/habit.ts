export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  goalType: "check" | "reps" | "time";
  goalValue?: number;
  reminderTime?: string;
  repeatDays?: string[];
  streak: number;
  createdAt: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  value?: number; // For reps/time goals
  createdAt: number;
}

