// Navigation type definitions for the Habit Tracker app

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
  CompositeNavigationProp,
  RouteProp,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

// Root Stack - Contains all screens accessible from anywhere
export type RootStackParamList = {
  MainTabs: undefined;
  AddHabit:
    | {
        template?: {
          name: string;
          icon: string;
          description?: string;
          goalType: "check" | "reps" | "time";
          goalValue?: number;
          suggestedTime?: string;
          repeatDays?: string[];
        };
      }
    | undefined;
  HabitDetail: { habitId: string };
  TemplateLibrary: undefined;
  MotivationalQuotes: undefined;
  EditHabit: { habitId: string };
};

// Auth Stack - Authentication flow screens
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

// Main Tabs - Bottom tab navigation
export type TabParamList = {
  Home: undefined;
  Analytics: undefined;
  Streaks: undefined;
  Settings: undefined;
};

// Navigation Props Types
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Composite navigation type for screens in tabs that need stack navigation
export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Home">,
  StackNavigationProp<RootStackParamList>
>;

export type AnalyticsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Analytics">,
  StackNavigationProp<RootStackParamList>
>;

export type StreaksScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Streaks">,
  StackNavigationProp<RootStackParamList>
>;

export type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Settings">,
  StackNavigationProp<RootStackParamList>
>;

// Route Props Types
export type HabitDetailRouteProp = RouteProp<RootStackParamList, "HabitDetail">;
export type EditHabitRouteProp = RouteProp<RootStackParamList, "EditHabit">;

// Screen Props Types (convenience types)
export type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export type AddHabitScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "AddHabit">;
  route: RouteProp<RootStackParamList, "AddHabit">;
};

export type HabitDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "HabitDetail">;
  route: HabitDetailRouteProp;
};

export type AnalyticsScreenProps = {
  navigation: AnalyticsScreenNavigationProp;
};

export type StreaksScreenProps = {
  navigation: StreaksScreenNavigationProp;
};

export type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
};
