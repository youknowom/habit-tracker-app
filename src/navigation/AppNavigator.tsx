import { useTheme } from "@/src/context/ThemeContext";
import AddHabitScreen from "@/src/screens/AddHabitScreen";
import AnalyticsScreen from "@/src/screens/AnalyticsScreen";
import HabitDetailScreen from "@/src/screens/HabitDetailScreen";
import HomeScreen from "@/src/screens/HomeScreen";
import MotivationalQuotesScreen from "@/src/screens/MotivationalQuotesScreen";
import SettingsScreen from "@/src/screens/SettingsScreen";
import StreakScreen from "@/src/screens/StreakScreen";
import TemplateLibraryScreen from "@/src/screens/TemplateLibraryScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

export type MainTabParamList = {
  Home: undefined;
  Analytics: undefined;
  Streaks: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
  TemplateLibrary: undefined;
  MotivationalQuotes: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Streaks") {
            iconName = focused ? "flame" : "flame-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Streaks" component={StreakScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={{ title: "Add Habit", presentation: "modal" }}
      />
      <Stack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: "Habit Details" }}
      />
      <Stack.Screen
        name="TemplateLibrary"
        component={TemplateLibraryScreen}
        options={{ title: "Habit Templates", presentation: "modal" }}
      />
      <Stack.Screen
        name="MotivationalQuotes"
        component={MotivationalQuotesScreen}
        options={{ title: "Daily Inspiration", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
