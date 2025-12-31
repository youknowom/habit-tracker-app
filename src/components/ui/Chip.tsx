import { useTheme } from "@/src/context/ThemeContext";
import { MotiView } from "moti";
import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: "default" | "primary" | "success";
}

export function Chip({
  label,
  selected = false,
  onPress,
  variant = "default",
}: ChipProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (selected) {
      switch (variant) {
        case "primary":
          return theme.colors.primary;
        case "success":
          return theme.colors.success;
        default:
          return theme.colors.primary;
      }
    }
    return theme.colors.surface;
  };

  const getTextColor = () => {
    return selected ? theme.colors.textInverse : theme.colors.text;
  };

  const containerStyle: ViewStyle = {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: getBackgroundColor(),
    borderWidth: selected ? 0 : 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle: TextStyle = {
    ...theme.typography.labelSmall,
    color: getTextColor(),
  };

  return (
    <MotiView
      animate={{ scale: selected ? 1 : 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    </MotiView>
  );
}
