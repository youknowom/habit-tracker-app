// Habit Template Types

export type TemplateCategory =
  | "health"
  | "fitness"
  | "mindfulness"
  | "productivity"
  | "learning"
  | "social"
  | "finance"
  | "creativity";

export interface HabitTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: TemplateCategory;
  goalType: "check" | "reps" | "time";
  goalValue: number;
  suggestedTime?: string;
  repeatDays: number[];
  tips: string[];
  benefits: string[];
  difficulty: "easy" | "medium" | "hard";
  popularityRank: number;
}

export interface TemplateLibrary {
  categories: {
    [key in TemplateCategory]: {
      title: string;
      icon: string;
      color: string;
      templates: HabitTemplate[];
    };
  };
}
