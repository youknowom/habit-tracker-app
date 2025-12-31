import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthStore } from "@/src/store/authStore";
import LoginScreen from "@/src/screens/LoginScreen";
import SignupScreen from "@/src/screens/SignupScreen";
import ProfileSetupScreen from "@/src/screens/ProfileSetupScreen";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

