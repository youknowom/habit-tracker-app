import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useHabitStore } from "@/src/store/habitStore";
import { getLast7Days, getDayName } from "@/src/utils/dateHelpers";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
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
      x: index,
      y: dayCompletions.length,
    };
  });

  const totalCompletions = completions.filter((c) => c.completed).length;
  const averageDaily = last7Days.length > 0
    ? Math.round(
        completions.filter((c) => c.completed && last7Days.includes(c.date))
          .length / last7Days.length
      )
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Analytics</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalCompletions}</Text>
            <Text style={styles.statLabel}>Total Completions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{averageDaily}</Text>
            <Text style={styles.statLabel}>Avg Daily</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Last 7 Days</Text>
          <View style={styles.chartWrapper}>
            <CartesianChart
              data={chartData}
              xKey="x"
              yKeys={["y"]}
              axisOptions={{
                formatXLabel: (value) => {
                  const index = Math.round(Number(value));
                  return chartData[index]?.day || "";
                },
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.y}
                  chartBounds={chartBounds}
                  color="#007AFF"
                  roundedCorners={{ topLeft: 4, topRight: 4 }}
                />
              )}
            </CartesianChart>
          </View>
        </View>

        <View style={styles.habitsList}>
          <Text style={styles.sectionTitle}>Habit Performance</Text>
          {habits.map((habit) => {
            const habitCompletions = completions.filter(
              (c) => c.habitId === habit.id && c.completed && last7Days.includes(c.date)
            ).length;
            const percentage = last7Days.length > 0
              ? Math.round((habitCompletions / last7Days.length) * 100)
              : 0;

            return (
              <View key={habit.id} style={styles.habitRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${percentage}%` }]}
                    />
                  </View>
                </View>
                <Text style={styles.percentage}>{percentage}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  chartWrapper: {
    height: 300,
    width: width - 72,
  },
  habitsList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  habitIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 12,
  },
});
