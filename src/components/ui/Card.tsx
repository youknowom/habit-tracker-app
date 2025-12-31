import { useTheme } from "@/src/context/ThemeContext";
import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: "none" | "sm" | "md" | "lg";
  padding?: number;
  pressable?: boolean;
}

export function Card({
  children,
  style,
  elevation = "sm",
  padding,
  pressable = false,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: padding ?? theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...(elevation !== "none" && theme.shadows[elevation]),
  };

  if (pressable) {
    return (
      <TouchableOpacity
        style={[containerStyle, style]}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}
