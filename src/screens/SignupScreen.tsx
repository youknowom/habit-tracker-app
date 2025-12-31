import { Button, Input } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuthStore } from "@/src/store/authStore";
import { isValidEmail, isValidPassword } from "@/src/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface SignupScreenProps {
  navigation: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const signUp = useAuthStore((state) => state.signUp);

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({ email: "", password: "", confirmPassword: "" });

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      if (!email.trim())
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
      if (!password.trim())
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      if (!confirmPassword.trim())
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Please confirm password",
        }));
      return;
    }

    if (!isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    if (!isValidPassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      navigation.navigate("ProfileSetup");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        email: error.message || "Could not create account",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Icon */}
          <MotiView
            from={{ scale: 0, rotate: "-180deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            style={styles.iconContainer}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <Ionicons
                name="person-add"
                size={40}
                color={theme.colors.primary}
              />
            </View>
          </MotiView>

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Account
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Sign up to start building better habits
          </Text>

          {/* Form */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 200 }}
          >
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />

            <Button
              title={loading ? "Creating account..." : "Sign Up"}
              onPress={handleSignup}
              loading={loading}
              variant="primary"
              fullWidth
              style={styles.signupButton}
              icon={
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.textInverse}
                />
              }
            />

            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Already have an account?{" "}
              </Text>
              <Text
                style={[styles.linkText, { color: theme.colors.primary }]}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </View>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  signupButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
