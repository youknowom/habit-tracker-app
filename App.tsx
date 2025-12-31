import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { ThemeProvider } from "@/src/context/ThemeContext";
import AppNavigator from "@/src/navigation/AppNavigator";
import AuthNavigator from "@/src/navigation/AuthNavigator";
import SplashScreen from "@/src/screens/SplashScreen";
import { requestNotificationPermissions } from "@/src/services/notifications";
import { useAuthStore } from "@/src/store/authStore";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
  const { user, userData, initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  if (!initialized) {
    return <SplashScreen navigation={{ replace: () => {} }} />;
  }

  return (
    <NavigationContainer>
      <ErrorBoundary>
        {user && userData ? <AppNavigator /> : <AuthNavigator />}
      </ErrorBoundary>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
