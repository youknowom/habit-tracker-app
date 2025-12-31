import { useTheme } from "@/src/context/ThemeContext";
import { MotiView } from "moti";
import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "large",
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { theme } = useTheme();

  const content = (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 300 }}
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        {
          backgroundColor: fullScreen ? theme.colors.background : "transparent",
        },
      ]}
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && (
        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
          }}
        >
          {text}
        </Text>
      )}
    </MotiView>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
});
