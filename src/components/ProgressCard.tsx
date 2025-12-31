import { useTheme } from "@/src/context/ThemeContext";
import { Habit, HabitCompletion } from "@/src/types/habit";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressCardData {
  habits: Habit[];
  completions: HabitCompletion[];
  totalDays: number;
  completionRate: number;
  bestStreak: number;
}

interface ProgressCardProps {
  data: ProgressCardData;
  userName: string;
}

export const ProgressCard = React.forwardRef<View, ProgressCardProps>(
  ({ data, userName }, ref) => {
    const { theme } = useTheme();

    return (
      <View
        ref={ref as any}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.headerTitle}>Habit Tracker</Text>
          <Text style={styles.headerSubtitle}>Progress Report</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {userName}&apos;s Progress
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="apps" size={32} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {data.habits.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Habits
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="checkmark-circle"
                size={32}
                color={theme.colors.success}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {data.completionRate}%
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Completion
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="flame" size={32} color={theme.colors.warning} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {data.bestStreak}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Best Streak
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: theme.colors.textSecondary }]}
            >
              Keep building great habits!
            </Text>
            <Text
              style={[styles.footerDate, { color: theme.colors.textSecondary }]}
            >
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

ProgressCard.displayName = "ProgressCard";

const styles = StyleSheet.create({
  card: {
    width: 400,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    padding: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
  },
  footer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footerDate: {
    fontSize: 12,
  },
});

export type { ProgressCardData, ProgressCardProps };
