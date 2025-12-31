import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "@/src/store/authStore";

interface SplashScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
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
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
