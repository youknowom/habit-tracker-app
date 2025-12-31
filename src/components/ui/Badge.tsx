import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface BadgeProps {
  label: string | number;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "small" | "medium";
}

export function Badge({
  label,
  variant = "primary",
  size = "medium",
}: BadgeProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return theme.colors.primaryAlpha;
      case "secondary":
        return theme.colors.secondaryAlpha;
      case "success":
        return theme.colors.successAlpha;
      case "warning":
        return theme.colors.warningAlpha;
      case "error":
        return theme.colors.errorAlpha;
      default:
        return theme.colors.primaryAlpha;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "success":
        return theme.colors.success;
      case "warning":
        return theme.colors.warning;
      case "error":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const containerStyle: ViewStyle = {
    paddingVertical: size === "small" ? theme.spacing.xxs : theme.spacing.xs,
    paddingHorizontal: size === "small" ? theme.spacing.xs : theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: getBackgroundColor(),
    alignSelf: "flex-start",
  };

  const textStyle: TextStyle = {
    ...(size === "small"
      ? theme.typography.captionSmall
      : theme.typography.caption),
    color: getTextColor(),
    fontWeight: "600",
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}
