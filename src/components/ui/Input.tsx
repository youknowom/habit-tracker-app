import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  containerStyle,
  isPassword = false,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputContainerStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  };

  const inputStyle = {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    padding: 0,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            ...theme.typography.label,
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
          }}
        >
          {label}
        </Text>
      )}
      <View style={inputContainerStyle}>
        {icon && <View style={{ marginRight: theme.spacing.sm }}>{icon}</View>}
        <RNTextInput
          style={[inputStyle, style]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            ...theme.typography.caption,
            color: theme.colors.error,
            marginTop: theme.spacing.xxs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
