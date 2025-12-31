import { useTheme } from "@/src/context/ThemeContext";
import { MotiView } from "moti";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "danger":
        return theme.colors.error;
      case "ghost":
      case "outline":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return theme.colors.textInverse;
      case "ghost":
        return theme.colors.primary;
      case "outline":
        return theme.colors.text;
      default:
        return theme.colors.textInverse;
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
        };
      case "large":
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
        };
      case "medium":
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
        };
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    ...getPadding(),
    ...(fullWidth && { width: "100%" }),
    ...(variant === "outline" && {
      borderWidth: 1.5,
      borderColor: disabled ? theme.colors.border : theme.colors.primary,
    }),
    ...theme.shadows.sm,
  };

  const textStyle: TextStyle = {
    ...theme.typography.button,
    color: getTextColor(),
    ...(size === "small" && theme.typography.buttonSmall),
  };

  return (
    <MotiView
      animate={{ scale: disabled ? 1 : 1 }}
      transition={{ type: "timing", duration: 150 }}
    >
      <TouchableOpacity
        style={[containerStyle, style]}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && (
              <MotiView style={{ marginRight: theme.spacing.xs }}>
                {icon}
              </MotiView>
            )}
            <Text style={textStyle}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </MotiView>
  );
}
