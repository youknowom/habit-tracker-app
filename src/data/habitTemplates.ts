import { HabitTemplate, TemplateLibrary } from "../types/template";

const templates: HabitTemplate[] = [
  // Health & Wellness
  {
    id: "drink-water",
    name: "Drink Water",
    icon: "💧",
    description: "Stay hydrated throughout the day",
    category: "health",
    goalType: "reps",
    goalValue: 8,
    suggestedTime: "08:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Keep a water bottle with you",
      "Set hourly reminders",
      "Drink a glass when you wake up",
    ],
    benefits: [
      "Improved energy levels",
      "Better skin health",
      "Enhanced cognitive function",
    ],
    difficulty: "easy",
    popularityRank: 1,
  },
  {
    id: "sleep-8-hours",
    name: "Sleep 8 Hours",
    icon: "😴",
    description: "Get quality sleep every night",
    category: "health",
    goalType: "time",
    goalValue: 480,
    suggestedTime: "22:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Set consistent bedtime",
      "Avoid screens 1 hour before",
      "Keep room cool and dark",
    ],
    benefits: [
      "Better mood and focus",
      "Stronger immune system",
      "Improved memory",
    ],
    difficulty: "medium",
    popularityRank: 2,
  },
  {
    id: "take-vitamins",
    name: "Take Vitamins",
    icon: "💊",
    description: "Daily vitamin supplement routine",
    category: "health",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "08:30",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: ["Take with food", "Store in visible location", "Set morning alarm"],
    benefits: [
      "Fill nutritional gaps",
      "Boost immunity",
      "Support overall health",
    ],
    difficulty: "easy",
    popularityRank: 8,
  },

  // Fitness
  {
    id: "morning-workout",
    name: "Morning Workout",
    icon: "💪",
    description: "Start your day with exercise",
    category: "fitness",
    goalType: "time",
    goalValue: 30,
    suggestedTime: "06:30",
    repeatDays: [1, 2, 3, 4, 5],
    tips: [
      "Prepare workout clothes night before",
      "Start with 10 minutes if new",
      "Mix cardio and strength training",
    ],
    benefits: ["Increased energy all day", "Better mood", "Improved fitness"],
    difficulty: "medium",
    popularityRank: 3,
  },
  {
    id: "daily-steps",
    name: "10,000 Steps",
    icon: "👟",
    description: "Walk 10,000 steps daily",
    category: "fitness",
    goalType: "reps",
    goalValue: 10000,
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Take walking breaks",
      "Park farther away",
      "Walk during phone calls",
    ],
    benefits: ["Cardiovascular health", "Weight management", "Reduced stress"],
    difficulty: "medium",
    popularityRank: 4,
  },
  {
    id: "stretch",
    name: "Stretching",
    icon: "🧘",
    description: "Daily stretching routine",
    category: "fitness",
    goalType: "time",
    goalValue: 15,
    suggestedTime: "07:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Focus on major muscle groups",
      "Hold each stretch 30 seconds",
      "Breathe deeply",
    ],
    benefits: ["Improved flexibility", "Reduced injury risk", "Better posture"],
    difficulty: "easy",
    popularityRank: 7,
  },

  // Mindfulness
  {
    id: "meditation",
    name: "Meditation",
    icon: "🧘‍♀️",
    description: "Daily mindfulness practice",
    category: "mindfulness",
    goalType: "time",
    goalValue: 10,
    suggestedTime: "07:30",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Start with 5 minutes",
      "Use guided meditation apps",
      "Create a quiet space",
    ],
    benefits: [
      "Reduced stress and anxiety",
      "Better emotional regulation",
      "Improved focus",
    ],
    difficulty: "medium",
    popularityRank: 5,
  },
  {
    id: "gratitude-journal",
    name: "Gratitude Journal",
    icon: "📝",
    description: "Write 3 things you're grateful for",
    category: "mindfulness",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "21:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Keep journal by bedside",
      "Be specific in entries",
      "Include why you're grateful",
    ],
    benefits: ["Increased happiness", "Better sleep", "Improved relationships"],
    difficulty: "easy",
    popularityRank: 6,
  },
  {
    id: "no-phone-morning",
    name: "No Phone Morning",
    icon: "📵",
    description: "First hour phone-free",
    category: "mindfulness",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "06:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Charge phone outside bedroom",
      "Use analog alarm clock",
      "Plan morning routine",
    ],
    benefits: ["Reduced anxiety", "Better focus", "Mindful morning start"],
    difficulty: "hard",
    popularityRank: 12,
  },

  // Productivity
  {
    id: "read-daily",
    name: "Read 30 Minutes",
    icon: "📚",
    description: "Daily reading habit",
    category: "productivity",
    goalType: "time",
    goalValue: 30,
    suggestedTime: "20:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: ["Always carry a book", "Set reading goals", "Join book club"],
    benefits: ["Expanded knowledge", "Improved vocabulary", "Better focus"],
    difficulty: "medium",
    popularityRank: 9,
  },
  {
    id: "plan-tomorrow",
    name: "Plan Tomorrow",
    icon: "📅",
    description: "Review and plan next day",
    category: "productivity",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "21:30",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Use time blocking",
      "Prioritize top 3 tasks",
      "Review today's wins",
    ],
    benefits: [
      "Reduced morning stress",
      "Better time management",
      "Increased productivity",
    ],
    difficulty: "easy",
    popularityRank: 10,
  },
  {
    id: "learn-language",
    name: "Language Learning",
    icon: "🗣️",
    description: "Practice new language",
    category: "learning",
    goalType: "time",
    goalValue: 15,
    suggestedTime: "19:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: [
      "Use language apps",
      "Practice speaking daily",
      "Watch content in target language",
    ],
    benefits: [
      "Cognitive benefits",
      "Cultural understanding",
      "Career opportunities",
    ],
    difficulty: "medium",
    popularityRank: 11,
  },

  // Social & Relationships
  {
    id: "call-family",
    name: "Call Family",
    icon: "📞",
    description: "Stay connected with loved ones",
    category: "social",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "18:00",
    repeatDays: [0, 6],
    tips: [
      "Schedule specific times",
      "Video calls when possible",
      "Share meaningful updates",
    ],
    benefits: [
      "Stronger relationships",
      "Emotional support",
      "Reduced loneliness",
    ],
    difficulty: "easy",
    popularityRank: 13,
  },

  // Finance
  {
    id: "track-spending",
    name: "Track Expenses",
    icon: "💰",
    description: "Log daily expenses",
    category: "finance",
    goalType: "check",
    goalValue: 1,
    suggestedTime: "22:00",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: ["Use budgeting app", "Keep receipts", "Review weekly totals"],
    benefits: [
      "Better financial awareness",
      "Reduced overspending",
      "Improved savings",
    ],
    difficulty: "easy",
    popularityRank: 14,
  },

  // Creativity
  {
    id: "creative-time",
    name: "Creative Practice",
    icon: "🎨",
    description: "Daily creative activity",
    category: "creativity",
    goalType: "time",
    goalValue: 30,
    suggestedTime: "19:30",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    tips: ["Set up dedicated space", "Experiment freely", "Share your work"],
    benefits: ["Self-expression", "Stress relief", "Skill development"],
    difficulty: "medium",
    popularityRank: 15,
  },
];

export const templateLibrary: TemplateLibrary = {
  categories: {
    health: {
      title: "Health & Wellness",
      icon: "heart",
      color: "#FF3B30",
      templates: templates.filter((t) => t.category === "health"),
    },
    fitness: {
      title: "Fitness",
      icon: "barbell",
      color: "#FF9500",
      templates: templates.filter((t) => t.category === "fitness"),
    },
    mindfulness: {
      title: "Mindfulness",
      icon: "flower",
      color: "#AF52DE",
      templates: templates.filter((t) => t.category === "mindfulness"),
    },
    productivity: {
      title: "Productivity",
      icon: "briefcase",
      color: "#007AFF",
      templates: templates.filter((t) => t.category === "productivity"),
    },
    learning: {
      title: "Learning",
      icon: "book",
      color: "#5856D6",
      templates: templates.filter((t) => t.category === "learning"),
    },
    social: {
      title: "Social",
      icon: "people",
      color: "#FF2D55",
      templates: templates.filter((t) => t.category === "social"),
    },
    finance: {
      title: "Finance",
      icon: "cash",
      color: "#34C759",
      templates: templates.filter((t) => t.category === "finance"),
    },
    creativity: {
      title: "Creativity",
      icon: "color-palette",
      color: "#FF6482",
      templates: templates.filter((t) => t.category === "creativity"),
    },
  },
};

export const getTemplateById = (id: string): HabitTemplate | undefined => {
  return templates.find((t) => t.id === id);
};

export const getPopularTemplates = (limit: number = 6): HabitTemplate[] => {
  return templates
    .sort((a, b) => a.popularityRank - b.popularityRank)
    .slice(0, limit);
};

export const searchTemplates = (query: string): HabitTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tips.some((tip) => tip.toLowerCase().includes(lowerQuery))
  );
};
