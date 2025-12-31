import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { useHabitStore } from "@/src/store/habitStore";
import { getDayName, getLast7Days } from "@/src/utils/dateHelpers";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { habits, completions, fetchCompletions } = useHabitStore();

  useEffect(() => {
    fetchCompletions();
  }, []);

  const last7Days = getLast7Days();

  const chartData = last7Days.map((date, index) => {
    const dayCompletions = completions.filter(
      (c) => c.date === date && c.completed
    );
    return {
      day: getDayName(date),
      completions: dayCompletions.length,
    };
  });

  const totalCompletions = completions.filter((c) => c.completed).length;
  const averageDaily =
    last7Days.length > 0
      ? Math.round(
          completions.filter((c) => c.completed && last7Days.includes(c.date))
            .length / last7Days.length
        )
      : 0;

  const maxCompletions = Math.max(...chartData.map((d) => d.completions), 1);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Analytics
        </Text>

        <View style={styles.statsContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 100 }}
            style={styles.statCardWrapper}
          >
            <Card style={styles.statCard}>
              <Ionicons
                name="apps-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {habits.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Habits
              </Text>
            </Card>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 200 }}
            style={styles.statCardWrapper}
          >
            <Card style={styles.statCard}>
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color={theme.colors.success}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {totalCompletions}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Done
              </Text>
            </Card>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 300 }}
            style={styles.statCardWrapper}
          >
            <Card style={styles.statCard}>
              <Ionicons
                name="trending-up-outline"
                size={24}
                color={theme.colors.secondary}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {averageDaily}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Daily Average
              </Text>
            </Card>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 400 }}
        >
          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
                Last 7 Days
              </Text>
              <Ionicons
                name="bar-chart-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.chartContainer}>
              {chartData.map((item, index) => {
                const height = (item.completions / maxCompletions) * 150;
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(height, 10),
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    >
                      {item.completions > 0 && (
                        <Text style={styles.barValue}>{item.completions}</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.barLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {item.day.slice(0, 3)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 600 }}
        >
          <Card style={styles.performanceCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="list-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Habit Performance
              </Text>
            </View>

            {habits.map((habit, index) => {
              const habitCompletions = completions.filter(
                (c) =>
                  c.habitId === habit.id &&
                  c.completed &&
                  last7Days.includes(c.date)
              ).length;
              const percentage =
                last7Days.length > 0
                  ? Math.round((habitCompletions / last7Days.length) * 100)
                  : 0;

              return (
                <MotiView
                  key={habit.id}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", delay: index * 50 }}
                  style={styles.habitRow}
                >
                  <View
                    style={[
                      styles.habitIconContainer,
                      { backgroundColor: theme.colors.primaryAlpha },
                    ]}
                  >
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                  </View>
                  <View style={styles.habitInfo}>
                    <Text
                      style={[styles.habitName, { color: theme.colors.text }]}
                    >
                      {habit.name}
                    </Text>
                    <View
                      style={[
                        styles.progressBar,
                        { backgroundColor: theme.colors.border },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text
                    style={[styles.percentage, { color: theme.colors.primary }]}
                  >
                    {percentage}%
                  </Text>
                </MotiView>
              );
            })}
          </Card>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  chartCard: {
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 180,
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: "center",
    gap: 8,
  },
  bar: {
    width: 36,
    borderRadius: 6,
    minHeight: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 6,
  },
  barValue: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  performanceCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  habitIcon: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    minWidth: 50,
    textAlign: "right",
  },
});
