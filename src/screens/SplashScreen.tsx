import { useTheme } from "@/src/context/ThemeContext";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SplashScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const { theme } = useTheme();
  const { initialized, user, userData } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Navigation will be handled by App.tsx based on auth state
    // This screen just shows loading
  }, [initialized, user, userData]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
