import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { useAuthStore } from "@/src/store/authStore";
import AppNavigator from "@/src/navigation/AppNavigator";
import AuthNavigator from "@/src/navigation/AuthNavigator";
import SplashScreen from "@/src/screens/SplashScreen";
import { requestNotificationPermissions } from "@/src/services/notifications";

export default function App() {
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
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        {user && userData ? (
          <AppNavigator />
        ) : (
          <AuthNavigator />
        )}
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

