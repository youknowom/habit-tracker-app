import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "@/src/screens/HomeScreen";
import AddHabitScreen from "@/src/screens/AddHabitScreen";
import HabitDetailScreen from "@/src/screens/HabitDetailScreen";
import AnalyticsScreen from "@/src/screens/AnalyticsScreen";
import StreakScreen from "@/src/screens/StreakScreen";
import SettingsScreen from "@/src/screens/SettingsScreen";

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
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
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
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
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
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

