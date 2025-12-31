import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useHabitStore } from "@/src/store/habitStore";
import { Habit } from "@/src/types/habit";

export default function StreakScreen() {
  const { habits, fetchHabits, loading } = useHabitStore();

  useEffect(() => {
    fetchHabits();
  }, []);

  const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);

  const renderHabit = ({ item }: { item: Habit }) => {
    const getStreakColor = (streak: number) => {
      if (streak >= 30) return "#ff6b00";
      if (streak >= 7) return "#ff9500";
      return "#ffb340";
    };

    return (
      <View style={styles.habitCard}>
        <View style={styles.habitHeader}>
          <Text style={styles.habitIcon}>{item.icon}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitGoal}>{item.goalType}</Text>
          </View>
          <View style={styles.streakContainer}>
            <Text style={[styles.streakNumber, { color: getStreakColor(item.streak) }]}>
              {item.streak}
            </Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((item.streak / 30) * 100, 100)}%`,
                backgroundColor: getStreakColor(item.streak),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const longestStreak = sortedHabits.length > 0 ? sortedHabits[0].streak : 0;
  const totalStreaks = sortedHabits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Streaks</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalStreaks}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {sortedHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptySubtext}>Start tracking habits to see your streaks!</Text>
        </View>
      ) : (
        <FlatList
          data={sortedHabits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchHabits}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  list: {
    padding: 16,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  habitIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  habitGoal: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  streakContainer: {
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  streakLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

