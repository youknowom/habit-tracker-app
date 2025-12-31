import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "albums-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.container}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.primaryAlpha,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: theme.spacing.lg,
        }}
      >
        <Ionicons name={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text
        style={{
          ...theme.typography.h3,
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            textAlign: "center",
            marginBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.xl,
          }}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" />
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
