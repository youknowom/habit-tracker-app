import { useTheme } from "@/src/context/ThemeContext";
import LoginScreen from "@/src/screens/LoginScreen";
import ProfileSetupScreen from "@/src/screens/ProfileSetupScreen";
import SignupScreen from "@/src/screens/SignupScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}
