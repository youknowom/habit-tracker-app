import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Suspense, lazy } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

// Lazy load modal screens only
const AddHabitScreen = lazy(() => import("@/src/screens/AddHabitScreen"));
const HabitDetailScreen = lazy(() => import("@/src/screens/HabitDetailScreen"));
const MotivationalQuotesScreen = lazy(
  () => import("@/src/screens/MotivationalQuotesScreen")
);
const TemplateLibraryScreen = lazy(
  () => import("@/src/screens/TemplateLibraryScreen")
);

// Regular imports for tab screens (always loaded)
import AnalyticsScreen from "@/src/screens/AnalyticsScreen";
import HomeScreen from "@/src/screens/HomeScreen";
import SettingsScreen from "@/src/screens/SettingsScreen";
import StreakScreen from "@/src/screens/StreakScreen";

// Loading fallback component
function LoadingFallback() {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

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
        options={{ title: "Add Habit", presentation: "modal" }}
      >
        {(props) => (
          <Suspense fallback={<LoadingFallback />}>
            <AddHabitScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="HabitDetail" options={{ title: "Habit Details" }}>
        {(props) => (
          <Suspense fallback={<LoadingFallback />}>
            <HabitDetailScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="TemplateLibrary"
        options={{ title: "Habit Templates", presentation: "modal" }}
      >
        {(props) => (
          <Suspense fallback={<LoadingFallback />}>
            <TemplateLibraryScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="MotivationalQuotes"
        options={{ title: "Daily Inspiration", presentation: "modal" }}
      >
        {(props) => (
          <Suspense fallback={<LoadingFallback />}>
            <MotivationalQuotesScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
