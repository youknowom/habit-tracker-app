import { Input } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { auth } from "@/src/services/firebase";
import { useAuthStore } from "@/src/store/authStore";
import { isValidEmail, isValidPassword } from "@/src/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const signIn = useAuthStore((state) => state.signIn);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user) {
      const checkProfile = async () => {
        const currentUser = auth.currentUser;
        if (currentUser?.displayName) {
          navigation.replace("MainTabs");
        } else {
          navigation.replace("ProfileSetup");
        }
      };
      checkProfile();
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    setErrors({ email: "", password: "" });
    setErrorMessage("");

    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Check if login was successful by checking current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        if (currentUser.displayName) {
          navigation.replace("MainTabs");
        } else {
          navigation.replace("ProfileSetup");
        }
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={styles.headerSection}
          >
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 200, damping: 12 }}
              style={styles.iconContainer}
            >
              <Ionicons
                name="checkmark-circle"
                size={64}
                color={theme.colors.primary}
              />
            </MotiView>

            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Welcome Back
            </Text>
            <Text
              style={[
                styles.subtitleText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Sign in to continue building your habits
            </Text>
          </MotiView>

          {/* Error Message */}
          {errorMessage ? (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.errorAlpha },
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={20}
                color={theme.colors.error}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errorMessage}
              </Text>
            </MotiView>
          ) : null}

          {/* Login Form */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 300 }}
            style={styles.formSection}
          >
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "" });
                setErrorMessage("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              error={errors.email}
              style={styles.input}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
                setErrorMessage("");
              }}
              isPassword
              autoCapitalize="none"
              editable={!loading}
              error={errors.password}
              style={styles.input}
            />

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInButton,
                {
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                },
                loading && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textInverse} />
              ) : (
                <Text
                  style={[
                    styles.signInButtonText,
                    { color: theme.colors.textInverse },
                  ]}
                >
                  Sign In
                </Text>
              )}
            </Pressable>
          </MotiView>

          {/* Sign Up Link */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 600, delay: 500 }}
            style={styles.signupContainer}
          >
            <Text
              style={[styles.signupText, { color: theme.colors.textSecondary }]}
            >
              Don&apos;t have an account?{" "}
              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text
                  style={[styles.signupLink, { color: theme.colors.primary }]}
                >
                  Sign Up
                </Text>
              </Pressable>
            </Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  formSection: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  signInButton: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  signupText: {
    fontSize: 15,
  },
  signupLink: {
    fontWeight: "600",
  },
});
